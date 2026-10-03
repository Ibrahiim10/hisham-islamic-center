/**
 * Development/demo seed only. Do not run in production.
 */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { ensureDevelopmentAdmin, resolveBootstrapAdminCredentials } from '../services/bootstrapAdmin.service.js';
import {
  AttendanceModel,
  ClassModel,
  FeeStructureModel,
  IslamicContentModel,
  NotificationModel,
  PaymentModel,
  QuranLearningRecordModel,
  StudentModel,
  UserModel,
} from '../models/index.js';
import {
  AttendanceStatus,
  Gender,
  IslamicContentType,
  NotificationChannel,
  NotificationStatus,
  PaymentMethod,
  StudentStatus,
  UserRole,
} from '../types/enums.js';

const DEV_SEED_MARKER = 'hisham-dev-seed-v1';

async function clearDevelopmentData(): Promise<void> {
  await Promise.all([
    QuranLearningRecordModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    AttendanceModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    StudentModel.deleteMany({}),
    FeeStructureModel.deleteMany({}),
    ClassModel.deleteMany({}),
    IslamicContentModel.deleteMany({}),
    UserModel.deleteMany({ role: UserRole.ADMIN }),
  ]);
}

function assertDevelopmentEnvironment(): void {
  if (env.NODE_ENV === 'production') {
    console.error('Refusing to run seed script in production.');
    process.exit(1);
  }
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

async function seed(): Promise<void> {
  assertDevelopmentEnvironment();

  const bootstrap = resolveBootstrapAdminCredentials();
  const adminEmail = bootstrap.email;

  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    console.warn(
      'DEVELOPMENT ONLY: Using fallback SEED_ADMIN_* credentials. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env — never use these defaults in production.',
    );
  }

  if (env.SEED_CLEAR) {
    console.log('SEED_CLEAR=true — removing existing development seed collections…');
    await clearDevelopmentData();
  }

  const adminBootstrap = await ensureDevelopmentAdmin({
    email: bootstrap.email,
    password: bootstrap.password,
    fullName: bootstrap.fullName,
    resetPasswordIfExists: bootstrap.resetPasswordIfExists || env.SEED_CLEAR === true,
  });

  if (adminBootstrap.skippedExisting) {
    console.warn(
      `Admin ${adminEmail} already exists; password hash unchanged. Run: SEED_ADMIN_RESET_PASSWORD=true npm run bootstrap:admin -w backend`,
    );
  }

  const adminUser = await UserModel.findOne({ email: adminEmail });
  if (!adminUser) {
    throw new Error(`Failed to load admin user ${adminEmail} after bootstrap`);
  }

  const classDefinitions = [
    { name: 'Tahfidh', amount: 8000 },
    { name: 'Farbar', amount: 6000 },
    { name: 'Women Section', amount: 3000 },
  ] as const;

  const classes = await Promise.all(
    classDefinitions.map(async (definition) => {
      const existing = await ClassModel.findOne({ name: definition.name });
      if (existing) return existing;
      return ClassModel.create({
        name: definition.name,
        description: `${definition.name} — development demo section`,
        isActive: true,
      });
    }),
  );

  await Promise.all(
    classes.map(async (classDoc, index) => {
      const amount = classDefinitions[index]?.amount ?? 0;
      const existingFee = await FeeStructureModel.findOne({
        classId: classDoc._id,
        isActive: true,
      });
      if (existingFee) return existingFee;
      return FeeStructureModel.create({
        classId: classDoc._id,
        amount,
        currency: 'KES',
        effectiveFrom: new Date('2024-01-01T00:00:00.000Z'),
        isActive: true,
      });
    }),
  );

  const tahfidhClass = classes[0]!;
  const farbarClass = classes[1]!;
  const womenClass = classes[2]!;

  const studentSeeds = [
    {
      fullName: 'Ahmed Hassan (Demo)',
      dateOfBirth: new Date('2012-03-14'),
      gender: Gender.MALE,
      parentPhone: '+254700000001',
      address: 'Demo Estate, Nairobi',
      classId: tahfidhClass._id,
      studentType: 'hifz',
      admissionDate: new Date('2023-01-10'),
    },
    {
      fullName: 'Fatima Ali (Demo)',
      dateOfBirth: new Date('2011-08-02'),
      gender: Gender.FEMALE,
      parentPhone: '+254700000002',
      address: 'Demo Avenue, Nairobi',
      classId: farbarClass._id,
      studentType: 'regular',
      admissionDate: new Date('2022-09-01'),
    },
    {
      fullName: 'Maryam Yusuf (Demo)',
      dateOfBirth: new Date('2010-11-21'),
      gender: Gender.FEMALE,
      parentPhone: '+254700000003',
      address: 'Demo Road, Nairobi',
      classId: womenClass._id,
      studentType: 'regular',
      admissionDate: new Date('2023-06-15'),
    },
  ] as const;

  const students = await Promise.all(
    studentSeeds.map(async (seedStudent) => {
      const existing = await StudentModel.findOne({
        fullName: seedStudent.fullName,
        parentPhone: seedStudent.parentPhone,
      });
      if (existing) return existing;
      return StudentModel.create({
        ...seedStudent,
        status: StudentStatus.ACTIVE,
      });
    }),
  );

  const ahmed = students[0]!;
  const fatima = students[1]!;

  const septemberPaid = await PaymentModel.findOne({
    studentId: ahmed._id,
    month: 9,
    year: 2025,
    mpesaReference: 'DEVSEED001',
  });
  if (!septemberPaid) {
    await PaymentModel.create({
      studentId: ahmed._id,
      month: 9,
      year: 2025,
      amount: 8000,
      paymentMethod: PaymentMethod.MPESA,
      paymentDate: new Date('2025-09-05T10:30:00.000Z'),
      mpesaReference: 'DEVSEED001',
      recordedBy: adminUser._id,
      notes: DEV_SEED_MARKER,
    });
  }

  const partialPayment = await PaymentModel.findOne({
    studentId: fatima._id,
    month: 10,
    year: 2025,
    mpesaReference: 'DEVSEED002',
  });
  if (!partialPayment) {
    await PaymentModel.create({
      studentId: fatima._id,
      month: 10,
      year: 2025,
      amount: 3000,
      paymentMethod: PaymentMethod.MPESA,
      paymentDate: new Date('2025-10-02T14:00:00.000Z'),
      mpesaReference: 'DEVSEED002',
      recordedBy: adminUser._id,
      notes: `${DEV_SEED_MARKER} partial payment`,
    });
  }

  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(today));
  yesterday.setDate(yesterday.getDate() - 1);

  for (const [student, date, status] of [
    [ahmed, today, AttendanceStatus.PRESENT],
    [ahmed, yesterday, AttendanceStatus.ABSENT],
    [fatima, today, AttendanceStatus.PRESENT],
  ] as const) {
    await AttendanceModel.updateOne(
      { studentId: student._id, date },
      {
        $setOnInsert: {
          studentId: student._id,
          date,
          status,
          recordedBy: adminUser._id,
        },
      },
      { upsert: true },
    );
  }

  await QuranLearningRecordModel.updateOne(
    { studentId: ahmed._id },
    {
      $set: {
        currentJuz: 5,
        currentSurah: 'An-Nisa',
        memorizationProgress: 'Juz 5 revision in progress',
        revisionMurajaah: 'Juz 1–4 weekly rotation',
        dailyLesson: 'Tajweed rules — Madd',
        adminNotes: DEV_SEED_MARKER,
        lastUpdatedBy: adminUser._id,
      },
    },
    { upsert: true },
  );

  const quranVerse = await IslamicContentModel.findOne({
    type: IslamicContentType.QURAN,
    surah: 'Al-Ikhlas',
    ayah: 1,
  });
  if (!quranVerse) {
    await IslamicContentModel.create({
      type: IslamicContentType.QURAN,
      title: "Qur'an Verse",
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: 'Say, "He is Allah, [who is] One."',
      source: "Qur'an 112:1 (Surah Al-Ikhlas)",
      surah: 'Al-Ikhlas',
      ayah: 1,
      isActive: true,
    });
  }

  const hadith = await IslamicContentModel.findOne({
    type: IslamicContentType.HADITH,
    source: 'Sahih al-Bukhari 1',
  });
  if (!hadith) {
    await IslamicContentModel.create({
      type: IslamicContentType.HADITH,
      title: 'Words of the Prophet ﷺ',
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
      translation:
        'Actions are judged by intentions, and every person will get what they intended.',
      source: 'Sahih al-Bukhari 1; Sahih Muslim 1907',
      isActive: true,
    });
  }

  const dedupeKey = `${DEV_SEED_MARKER}:fee-reminder:ahmed:2025-10`;
  const existingNotification = await NotificationModel.findOne({ dedupeKey });
  if (!existingNotification) {
    await NotificationModel.create({
      studentId: ahmed._id,
      parentPhone: ahmed.parentPhone,
      message: 'Demo: Your October fee is unpaid.',
      channel: NotificationChannel.SMS,
      status: NotificationStatus.SENT,
      sentAt: new Date(),
      providerMessageId: 'mock-sms-dev-001',
      dedupeKey,
    });
  }

  console.log('Development seed completed successfully.');
  console.log(`Admin login (development only): ${adminEmail}`);
  console.log('Password: value of SEED_ADMIN_PASSWORD in your local backend/.env (not printed here).');
  console.log('Classes, fee structures, demo students, attendance, payments, and Islamic content are ready.');
  console.log(`Seed marker: ${DEV_SEED_MARKER}`);
}

connectDatabase()
  .then(() => seed())
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
