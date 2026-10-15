import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { nisnOrEmail, password } = await request.json();

    if (!nisnOrEmail || !password) {
      return NextResponse.json({ message: 'NISN/Email dan Password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { nisnOrEmail },
    });

    if (!user) {
      return NextResponse.json({ message: 'Akun tidak ditemukan' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login berhasil',
      userId: user.id,
      name: user.name,
      role: user.role,
      targetWaka: user.targetWaka,
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan server', error: error.message }, { status: 500 });
  }
}
