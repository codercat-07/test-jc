import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Default SiteSettings
  await prisma.siteSettings.upsert({
    where: { key: 'menu_config' },
    update: {},
    create: {
      key: 'menu_config',
      category: 'menu',
      value: [
        { label: 'Lectures', path: '/lecture', isVisible: true },
        { label: 'MCQ', path: '/mcq', isVisible: true },
        { label: 'Exam Hall', path: '/exam', isVisible: true },
        { label: 'Job Notices', path: '/job-notices', isVisible: true },
        { label: 'Current Affairs', path: '/current-affairs', isVisible: true },
        { label: 'Written Exam', path: '/written-exam', isVisible: true },
        { label: 'Data Vault', path: '/data-vault', isVisible: true },
        { label: 'Blog', path: '/blog', isVisible: true },
      ],
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'site_design' },
    update: {},
    create: {
      key: 'site_design',
      category: 'design',
      value: { logo: null, favicon: null, siteName: 'BD-LMS', primaryColor: '#2563EB' },
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'exam_sections' },
    update: {},
    create: {
      key: 'exam_sections',
      category: 'exam',
      value: [{ id: 'general', name: 'General', nameBn: 'সাধারণ' }],
    },
  });

  // 2. Sample Organization
  await prisma.organization.upsert({
    where: { slug: 'bpsc' },
    update: {},
    create: {
      name: 'Bangladesh Public Service Commission',
      nameBn: 'বাংলাদেশ সরকারি কর্ম কমিশন',
      slug: 'bpsc',
    },
  });

  // 3. Sample Subjects
  const subjects = [
    { name: 'Bangla', nameBn: 'বাংলা', slug: 'bangla', topics: ['Grammar', 'Literature'] },
    { name: 'English', nameBn: 'ইংরেজি', slug: 'english', topics: ['Grammar', 'Vocabulary'] },
    { name: 'General Knowledge', nameBn: 'সাধারণ জ্ঞান', slug: 'gk', topics: ['Bangladesh', 'World'] },
    { name: 'Math', nameBn: 'গণিত', slug: 'math', topics: ['Arithmetic', 'Algebra'] },
  ];

  for (const subject of subjects) {
    const s = await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: { name: subject.name, nameBn: subject.nameBn, slug: subject.slug, order: 1 },
    });

    for (const topic of subject.topics) {
      const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
      await prisma.topic.upsert({
        where: { subjectId_slug: { subjectId: s.id, slug: topicSlug } },
        update: {},
        create: {
          name: topic,
          nameBn: topic,
          slug: topicSlug,
          subjectId: s.id,
          order: 1,
        },
      });
    }
  }

  // 4. Admin User (placeholder, replace Clerk ID later)
  await prisma.user.upsert({
    where: { clerkId: 'REPLACE_ME' },
    update: {},
    create: {
      clerkId: 'REPLACE_ME',
      email: 'admin@example.com',
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
