import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, department, cgpa, company } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create role-specific data
    if (role === 'student') {
      if (!department || !cgpa) {
        return NextResponse.json(
          { error: 'Department and CGPA are required for students' },
          { status: 400 }
        );
      }

      await prisma.student.create({
        data: {
          userId: user.id,
          department,
          cgpa: parseFloat(cgpa),
          status: 'approved', // Set to approved by default for new registrations
        },
      });
    } else if (role === 'company') {
      if (!company) {
        return NextResponse.json(
          { error: 'Company name is required for companies' },
          { status: 400 }
        );
      }

      await prisma.company.create({
        data: {
          userId: user.id,
          companyName: company,
          allowedDepartments: '[]', // Default empty array
        },
      });
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}