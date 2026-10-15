import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status, adminNote, followUpNote, followUpImage } = await request.json();

    const aspirationData: any = { status };
    if (adminNote !== undefined) aspirationData.adminNote = adminNote;
    if (followUpNote !== undefined) aspirationData.followUpNote = followUpNote;
    if (followUpImage !== undefined) aspirationData.followUpImage = followUpImage;

    const updatedAspiration = await prisma.aspiration.update({
      where: { id },
      data: aspirationData,
    });

    return NextResponse.json({ message: 'Status aspirasi berhasil diperbarui', data: updatedAspiration });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui aspirasi', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const aspiration = await prisma.aspiration.findUnique({
      where: { id },
      include: {
        student: {
          select: { name: true, nisnOrEmail: true },
        },
      },
    });

    if (!aspiration) {
      return NextResponse.json({ message: 'Aspirasi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(aspiration);
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil aspirasi', error: error.message }, { status: 500 });
  }
}
