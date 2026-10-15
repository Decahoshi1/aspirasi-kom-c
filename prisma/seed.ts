import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.aspiration.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Siswa
  await prisma.user.create({
    data: {
      nisnOrEmail: '0081234567',
      password: hashedPassword,
      name: 'Ahmad Siswa',
      role: 'SISWA',
    },
  });

  // 2. Admin Komisi C
  await prisma.user.create({
    data: {
      nisnOrEmail: 'admincomc',
      password: hashedPassword,
      name: 'Admin Komisi C MPS',
      role: 'ADMIN_KOMISI_C',
    },
  });

  // 3. Guru / Waka
  await prisma.user.create({
    data: {
      nisnOrEmail: 'sarpras@manic.sch.id',
      password: hashedPassword,
      name: 'Ust. Sarpras, M.Pd.',
      role: 'GURU_WAKA',
      targetWaka: 'SARPRAS',
    },
  });

  await prisma.user.create({
    data: {
      nisnOrEmail: 'keasramaan@manic.sch.id',
      password: hashedPassword,
      name: 'Ust. Keasramaan, M.Pd.',
      role: 'GURU_WAKA',
      targetWaka: 'KEASRAMAAN',
    },
  });

  await prisma.user.create({
    data: {
      nisnOrEmail: 'akademik@manic.sch.id',
      password: hashedPassword,
      name: 'Ust. Akademik, M.Pd.',
      role: 'GURU_WAKA',
      targetWaka: 'AKADEMIK',
    },
  });

  await prisma.user.create({
    data: {
      nisnOrEmail: 'humas@manic.sch.id',
      password: hashedPassword,
      name: 'Ust. Humas, M.Pd.',
      role: 'GURU_WAKA',
      targetWaka: 'HUMAS',
    },
  });

  await prisma.user.create({
    data: {
      nisnOrEmail: 'koperasi@manic.sch.id',
      password: hashedPassword,
      name: 'Pengelola Koperasi la Tahzan',
      role: 'GURU_WAKA',
      targetWaka: 'KOPERASI_LA_TAHZAN',
    },
  });

  console.log('Seed data berhasil dimasukkan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
