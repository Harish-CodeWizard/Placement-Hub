import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (user.role === 'admin') {
      const students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              createdAt: true,
            },
          },
          applications: {
            include: {
              job: {
                select: {
                  title: true,
                  company: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return NextResponse.json(students);
    } else if (user.role === 'company') {
      // Companies can only see approved students for eligibility checking
      const students = await prisma.student.findMany({
        where: { status: 'approved' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });
      return NextResponse.json(students);
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, department, cgpa, passingYear, resume } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Find the student
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check permissions: admin can update any student, student can only update their own profile
    if (user.role === 'student' && student.userId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'student' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: any = {};
    if (status !== undefined && user.role === 'admin') updateData.status = status;
    if (department !== undefined && user.role === 'student') updateData.department = department;
    if (cgpa !== undefined && user.role === 'student') updateData.cgpa = parseFloat(cgpa);
    if (passingYear !== undefined && user.role === 'student') updateData.passingYear = parseInt(passingYear);
    if (resume !== undefined && user.role === 'student') updateData.resume = resume;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}