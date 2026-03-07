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
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        applications: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user || user.role !== 'company') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, requiredCGPA, allowedDepartments, year, ctc, positions } = await request.json();

    // Find company
    const company = await prisma.company.findUnique({
      where: { userId: user.userId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title,
        description,
        requiredCGPA: parseFloat(requiredCGPA),
        allowedDepartments: JSON.stringify(allowedDepartments),
        year: parseInt(year),
        ctc: parseFloat(ctc),
        positions: parseInt(positions),
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
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
    const { id, title, description, requiredCGPA, allowedDepartments, year, ctc, positions } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns this job (for companies) or is admin
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (user.role === 'company' && job.company.userId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'company' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (requiredCGPA !== undefined) updateData.requiredCGPA = parseFloat(requiredCGPA);
    if (allowedDepartments !== undefined) updateData.allowedDepartments = JSON.stringify(allowedDepartments);
    if (year !== undefined) updateData.year = parseInt(year);
    if (ctc !== undefined) updateData.ctc = parseFloat(ctc);
    if (positions !== undefined) updateData.positions = parseInt(positions);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}