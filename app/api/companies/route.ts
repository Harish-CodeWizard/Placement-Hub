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
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const companies = await prisma.company.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            positions: true,
            applications: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, companyName, requiredCGPA, allowedDepartments, year, ctc } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (requiredCGPA !== undefined) updateData.requiredCGPA = parseFloat(requiredCGPA);
    if (allowedDepartments !== undefined) updateData.allowedDepartments = JSON.stringify(allowedDepartments);
    if (year !== undefined) updateData.year = parseInt(year);
    if (ctc !== undefined) updateData.ctc = parseFloat(ctc);

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { companyName, requiredCGPA, allowedDepartments, year, ctc } = await request.json();

    // Find the company for this user
    const company = await prisma.company.findUnique({
      where: { userId: user.userId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Only companies can update their own profile
    if (user.role !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: any = {};
    if (companyName !== undefined) updateData.companyName = companyName;
    if (requiredCGPA !== undefined) updateData.requiredCGPA = parseFloat(requiredCGPA);
    if (allowedDepartments !== undefined) updateData.allowedDepartments = JSON.stringify(allowedDepartments);
    if (year !== undefined) updateData.year = parseInt(year);
    if (ctc !== undefined) updateData.ctc = parseFloat(ctc);

    const updatedCompany = await prisma.company.update({
      where: { userId: user.userId },
      data: updateData,
      include: { user: true },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      name,
      email,
      password,
      companyName,
      industry,
      description,
      requiredCGPA,
      allowedDepartments,
      ctc,
      positions,
    } = await request.json();

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Name, email, password, and company name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and company
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'company',
      },
    });

    const newCompany = await prisma.company.create({
      data: {
        userId: newUser.id,
        companyName,
        requiredCGPA: requiredCGPA ? parseFloat(requiredCGPA) : null,
        allowedDepartments: allowedDepartments ? JSON.stringify(allowedDepartments) : '[]',
        ctc: ctc ? parseFloat(ctc) : null,
        status: 'approved', // Admin-created companies are auto-approved
      },
    });

    return NextResponse.json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      company: newCompany,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}