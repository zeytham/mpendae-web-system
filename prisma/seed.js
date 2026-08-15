const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user.
  // KUMBUKA: kabla hapa password ilikuwa imeandikwa moja kwa moja kwenye code
  // ('mpendae2024') -> mtu yeyote mwenye access ya repo (au GitHub public)
  // angeweza kuingia kama admin. Sasa tunazalisha password ya nasibu kila
  // wakati akaunti hii inaundwa mara ya kwanza, na kuionyesha MARA MOJA tu
  // hapa console. Kwa admin wa kudumu (superadmin), tumia
  // `node scripts/seed-admin.js` badala yake -- hiyo ni njia salama zaidi.
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@mpendaeschool.ac.tz' } });
  const generatedPassword = crypto.randomBytes(9).toString('base64url'); // ~12 herufi, nasibu
  const hashedPassword = await bcrypt.hash(generatedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mpendaeschool.ac.tz' },
    update: {},
    create: {
      email: 'admin@mpendaeschool.ac.tz',
      password: hashedPassword,
      name: 'Admin Mkuu',
      role: 'admin',
    },
  });
  if (!existingAdmin) {
    console.log('✅ Admin user created:', admin.email);
    console.log(`🔑 Password ya muda (badilisha mara moja baada ya kuingia): ${generatedPassword}`);
  } else {
    console.log('ℹ️  Admin user tayari yupo, password haijabadilishwa:', admin.email);
  }

  // Create school settings
  await prisma.schoolSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      schoolName: 'Mpendae Secondary School',
      motto: 'Elimu ni Ufunguo wa Maisha',
      address: 'Mpendae, Zanzibar, Tanzania',
      phone: '+255 777 000 000',
      email: 'info@mpendaeschool.ac.tz',
      founded: '1990',
      principal: 'Mwalimu Juma Ali Hassan',
      about: 'Mpendae Secondary School ni shule inayojivunia mfumo bora wa elimu katika Zanzibar. Tangu kuanzishwa kwake mwaka 1990, shule yetu imekuwa ikitoa elimu bora kwa wanafunzi kutoka Zanzibar na Tanzania Bara. Tunaamini katika nguvu ya elimu kubadilisha maisha na jamii.',
      facebook: 'https://facebook.com/mpendaeschool',
      whatsapp: '+255777000000',
    },
  });
  console.log('✅ School settings created');

  // Create sample teachers
  const teachers = [
    { staffId: 'TCH-001', firstName: 'Amina', lastName: 'Hassan', gender: 'FEMALE', email: 'amina@mpendae.ac.tz', phone: '+255711000001', department: 'Sayansi', subjects: ['Biology', 'Chemistry'], qualification: 'BSc Education - UDSM' },
    { staffId: 'TCH-002', firstName: 'Omar', lastName: 'Salim', gender: 'MALE', email: 'omar@mpendae.ac.tz', phone: '+255711000002', department: 'Hisabati', subjects: ['Mathematics', 'Physics'], qualification: 'BSc Mathematics - SUA' },
    { staffId: 'TCH-003', firstName: 'Fatuma', lastName: 'Ali', gender: 'FEMALE', email: 'fatuma@mpendae.ac.tz', phone: '+255711000003', department: 'Lugha', subjects: ['Kiswahili', 'English'], qualification: 'BA Education - SUZA' },
    { staffId: 'TCH-004', firstName: 'Khalid', lastName: 'Mohammed', gender: 'MALE', email: 'khalid@mpendae.ac.tz', phone: '+255711000004', department: 'Biashara', subjects: ['Commerce', 'Book Keeping'], qualification: 'BCom - SUZA' },
    { staffId: 'TCH-005', firstName: 'Zulfa', lastName: 'Hamad', gender: 'FEMALE', email: 'zulfa@mpendae.ac.tz', phone: '+255711000005', department: 'Sanaa na Michezo', subjects: ['Fine Art', 'PE'], qualification: 'BA Fine Art - TaSUBa' },
  ];

  for (const teacher of teachers) {
    await prisma.teacher.upsert({
      where: { staffId: teacher.staffId },
      update: {},
      create: teacher,
    });
  }
  console.log('✅ Teachers created');

  // Create sample students
  const forms = ['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4'];
  const studentSeed = [];
  for (let i = 1; i <= 20; i++) {
    studentSeed.push({
      regNumber: `MPS/2024/${String(i).padStart(4, '0')}`,
      firstName: ['Ali', 'Fatuma', 'Omar', 'Zeinab', 'Hassan'][i % 5],
      lastName: ['Mohammed', 'Hassan', 'Salim', 'Ali', 'Hamad'][i % 5],
      gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
      dateOfBirth: new Date(2008 + (i % 3), i % 12, (i % 28) + 1),
      form: forms[i % 4],
      stream: 'A',
      parentName: `Mzazi wa Mwanafunzi ${i}`,
      parentPhone: `+25577100${String(i).padStart(4, '0')}`,
      parentEmail: `parent${i}@email.com`,
      address: `Mtaa wa ${i}, Zanzibar`,
    });
  }

  for (const student of studentSeed) {
    await prisma.student.upsert({
      where: { regNumber: student.regNumber },
      update: {},
      create: student,
    });
  }
  console.log('✅ Sample students created');

  // Create sample news
  const newsItems = [
    { title: 'Matokeo ya NECTA 2024 — Mpendae Inashinda!', category: 'Matokeo', author: 'Ofisi ya Mkurugenzi', content: 'Kwa furaha na shangwe, tunajulisha kwamba wanafunzi wetu wa Form IV wamefanya vizuri sana katika mitihani ya NECTA 2024. Asilimia 98% ya wanafunzi wetu walipita mitihani yao, hii ni mafanikio makubwa sana kwa shule yetu.' },
    { title: 'Uandikishaji wa Wanafunzi Wapya 2025 Unaanza', category: 'Matangazo', author: 'Ofisi ya Usajili', content: 'Tunajulisha wazazi na walezi wote kwamba uandikishaji wa wanafunzi wapya wa Form I kwa mwaka wa masomo 2025 unaanza rasmi. Maombi yanakubaliwa kuanzia Januari 2025 hadi Machi 2025.' },
    { title: 'Shule Yetu Inaongezwa Maabara Mpya ya Sayansi', category: 'Maendeleo', author: 'Bodi ya Shule', content: 'Kwa msaada wa serikali ya Zanzibar na wafadhili wetu, Mpendae Secondary School inaongezwa maabara mpya ya kisasa ya sayansi. Maabara hii itaboresha ufundishaji wa Biology, Chemistry na Physics.' },
  ];

  for (const item of newsItems) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.news.upsert({
      where: { slug },
      update: {},
      create: { ...item, slug, status: 'PUBLISHED', publishedAt: new Date() },
    });
  }
  console.log('✅ Sample news created');

  // Create sample events
  const now = new Date();
  await prisma.event.createMany({
    data: [
      { title: 'Sikukuu ya Shule — Miaka 35', description: 'Tunaadhimisha miaka 35 ya shule yetu kwa sherehe kubwa. Karibuni wote — wanafunzi, wazazi, walimu na wahitimu.', location: 'Uwanja Mkuu wa Shule', startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), category: 'Sherehe', status: 'UPCOMING' },
      { title: 'Mtihani wa Mwisho wa Muhula', description: 'Mtihani wa mwisho wa muhula wa kwanza kwa wanafunzi wote wa Form I hadi Form VI.', location: 'Madarasa yote', startDate: new Date(now.getFullYear(), now.getMonth() + 2, 1), endDate: new Date(now.getFullYear(), now.getMonth() + 2, 14), category: 'Mitihani', status: 'UPCOMING' },
      { title: 'Siku ya Michezo 2025', description: 'Mashindano ya michezo kati ya madarasa yote. Fútbol, Netball, Mbio na michezo mingine.', location: 'Uwanja wa Michezo', startDate: new Date(now.getFullYear(), now.getMonth() + 3, 10), category: 'Michezo', status: 'UPCOMING' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Sample events created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@mpendaeschool.ac.tz');
  console.log('🔑 Password: angalia ujumbe hapo juu (inaonyeshwa mara moja tu wakati akaunti inaundwa mara ya kwanza)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
