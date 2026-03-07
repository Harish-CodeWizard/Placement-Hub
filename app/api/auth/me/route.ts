import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role === 'student') {
      const student = await prisma.student.findUnique({
        where: { userId: decoded.userId },
        include: { user: true },
      });
      return NextResponse.json(student);
    } else if (decoded.role === 'company') {
      const company = await prisma.company.findUnique({
        where: { userId: decoded.userId },
        include: { user: true },
      });
      return NextResponse.json(company);
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      return NextResponse.json({ user });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}