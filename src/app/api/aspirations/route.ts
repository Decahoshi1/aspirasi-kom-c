import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const target = url.searchParams.get('target');
    const studentId = url.searchParams.get('studentId');

    const where: any = {};
    if (target) where.target = target;
    if (studentId) where.studentId = studentId;

    const aspirations = await prisma.aspiration.findMany({
      where,
      include: {
        student: {
          select: { name: true, nisnOrEmail: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(aspirations);
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data aspirasi', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, content, imageUrl, target } = await request.json();

    // Jika studentId tidak dikirim di body, kita gunakan siswa default dari database (untuk kemudahan demo)
    let finalStudentId = studentId;
    if (!finalStudentId) {
      const defaultSiswa = await prisma.user.findFirst({ where: { role: 'SISWA' } });
      if (!defaultSiswa) {
        return NextResponse.json({ message: 'Tidak ada akun siswa ditemukan' }, { status: 400 });
      }
      finalStudentId = defaultSiswa.id;
    }

    if (!content || !target) {
      return NextResponse.json({ message: 'Isi aspirasi dan tujuan wajib diisi' }, { status: 400 });
    }

    const newAspiration = await prisma.aspiration.create({
      data: {
        studentId: finalStudentId,
        content,
        imageUrl: imageUrl || null,
        target,
        status: 'MENUNGGU_KURASI',
      },
    });

    return NextResponse.json({ message: 'Aspirasi berhasil dikirim', data: newAspiration }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengirim aspirasi', error: error.message }, { status: 500 });
  }
}
