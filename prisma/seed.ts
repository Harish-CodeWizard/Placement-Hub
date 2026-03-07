import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create multiple admin users
  const admins = [
    {
      name: 'Dr. Priya Sharma',
      email: 'admin@placement.com',
      role: 'admin',
    },
    {
      name: 'Prof. Rajesh Kumar',
      email: 'placement@college.edu',
      role: 'admin',
    },
    {
      name: 'Ms. Anita Desai',
      email: 'coordinator@placement.edu',
      role: 'admin',
    },
  ];

  for (const adminData of admins) {
    const admin = await prisma.user.upsert({
      where: { email: adminData.email },
      update: {},
      create: {
        ...adminData,
        password: hashedPassword,
      },
    });
    console.log('Admin created:', admin.name);
  }

  // Create multiple student users with profiles
  const students = [
    {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      department: 'Computer Science',
      cgpa: 8.5,
      passingYear: 2024,
      status: 'approved',
    },
    {
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      department: 'Information Technology',
      cgpa: 8.2,
      passingYear: 2024,
      status: 'approved',
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      department: 'Computer Science',
      cgpa: 7.8,
      passingYear: 2024,
      status: 'approved',
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      department: 'Electronics',
      cgpa: 8.7,
      passingYear: 2024,
      status: 'approved',
    },
    {
      name: 'Vikram Joshi',
      email: 'vikram.joshi@email.com',
      department: 'Mechanical Engineering',
      cgpa: 7.5,
      passingYear: 2024,
      status: 'pending',
    },
    {
      name: 'Kavita Nair',
      email: 'kavita.nair@email.com',
      department: 'Computer Science',
      cgpa: 8.0,
      passingYear: 2025,
      status: 'approved',
    },
    {
      name: 'Rohit Sharma',
      email: 'rohit.sharma@email.com',
      department: 'Information Technology',
      cgpa: 7.9,
      passingYear: 2024,
      status: 'approved',
    },
    {
      name: 'Meera Iyer',
      email: 'meera.iyer@email.com',
      department: 'Computer Science',
      cgpa: 8.3,
      passingYear: 2024,
      status: 'approved',
    },
  ];

  const createdStudents = [];
  for (const studentData of students) {
    const student = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        role: 'student',
      },
    });

    const studentProfile = await prisma.student.upsert({
      where: { userId: student.id },
      update: {},
      create: {
        userId: student.id,
        department: studentData.department,
        cgpa: studentData.cgpa,
        passingYear: studentData.passingYear,
        status: studentData.status,
      },
    });

    createdStudents.push({ user: student, profile: studentProfile });
    console.log('Student created:', student.name);
  }

  // Create multiple company users with profiles
  const companies = [
    {
      name: 'HR Manager',
      email: 'hr@techcorp.com',
      companyName: 'TechCorp Solutions',
      requiredCGPA: 7.0,
      allowedDepartments: '["Computer Science","Information Technology","Electronics"]',
      year: 2024,
      ctc: 8.5,
      status: 'approved',
    },
    {
      name: 'Recruitment Lead',
      email: 'recruitment@infosys.com',
      companyName: 'Infosys Technologies',
      requiredCGPA: 7.5,
      allowedDepartments: '["Computer Science","Information Technology","Electronics","Mechanical Engineering"]',
      year: 2024,
      ctc: 12.0,
      status: 'approved',
    },
    {
      name: 'Talent Acquisition',
      email: 'talent@wipro.com',
      companyName: 'Wipro Limited',
      requiredCGPA: 7.0,
      allowedDepartments: '["Computer Science","Information Technology","Electronics"]',
      year: 2024,
      ctc: 10.5,
      status: 'approved',
    },
    {
      name: 'HR Specialist',
      email: 'hr@tcs.com',
      companyName: 'Tata Consultancy Services',
      requiredCGPA: 8.0,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 15.0,
      status: 'approved',
    },
    {
      name: 'Recruiter',
      email: 'jobs@accenture.com',
      companyName: 'Accenture Solutions',
      requiredCGPA: 7.5,
      allowedDepartments: '["Computer Science","Information Technology","Electronics","Mechanical Engineering"]',
      year: 2024,
      ctc: 11.0,
      status: 'pending',
    },
    {
      name: 'HR Executive',
      email: 'hr@capgemini.com',
      companyName: 'Capgemini India',
      requiredCGPA: 7.2,
      allowedDepartments: '["Computer Science","Information Technology","Electronics"]',
      year: 2024,
      ctc: 9.5,
      status: 'approved',
    },
  ];

  const createdCompanies = [];
  for (const companyData of companies) {
    const company = await prisma.user.upsert({
      where: { email: companyData.email },
      update: {},
      create: {
        name: companyData.name,
        email: companyData.email,
        password: hashedPassword,
        role: 'company',
      },
    });

    const companyProfile = await prisma.company.upsert({
      where: { userId: company.id },
      update: {},
      create: {
        userId: company.id,
        companyName: companyData.companyName,
        requiredCGPA: companyData.requiredCGPA,
        allowedDepartments: companyData.allowedDepartments,
        year: companyData.year,
        ctc: companyData.ctc,
        status: companyData.status,
      },
    });

    createdCompanies.push({ user: company, profile: companyProfile });
    console.log('Company created:', companyData.companyName);
  }

  // Create jobs for companies
  const jobs = [
    {
      companyId: createdCompanies[0].profile.id, // TechCorp
      title: 'Software Engineer',
      description: 'Develop and maintain web applications using modern technologies. Work with React, Node.js, and cloud services.',
      requiredCGPA: 7.0,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 8.5,
      positions: 5,
    },
    {
      companyId: createdCompanies[0].profile.id, // TechCorp
      title: 'Frontend Developer',
      description: 'Create responsive user interfaces using React and modern CSS frameworks. Experience with TypeScript preferred.',
      requiredCGPA: 7.0,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 7.8,
      positions: 3,
    },
    {
      companyId: createdCompanies[1].profile.id, // Infosys
      title: 'System Engineer',
      description: 'Design and implement complex software systems. Work on enterprise-level applications and databases.',
      requiredCGPA: 7.5,
      allowedDepartments: '["Computer Science","Information Technology","Electronics"]',
      year: 2024,
      ctc: 12.0,
      positions: 8,
    },
    {
      companyId: createdCompanies[1].profile.id, // Infosys
      title: 'Data Analyst',
      description: 'Analyze business data and create insightful reports. Experience with SQL, Python, and data visualization tools.',
      requiredCGPA: 7.5,
      allowedDepartments: '["Computer Science","Information Technology","Electronics","Mechanical Engineering"]',
      year: 2024,
      ctc: 10.5,
      positions: 4,
    },
    {
      companyId: createdCompanies[2].profile.id, // Wipro
      title: 'Full Stack Developer',
      description: 'Develop end-to-end web applications using MERN stack. Knowledge of DevOps practices is a plus.',
      requiredCGPA: 7.0,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 10.5,
      positions: 6,
    },
    {
      companyId: createdCompanies[3].profile.id, // TCS
      title: 'Senior Software Engineer',
      description: 'Lead development teams and architect scalable solutions. 2+ years experience required.',
      requiredCGPA: 8.0,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 15.0,
      positions: 3,
    },
    {
      companyId: createdCompanies[4].profile.id, // Accenture
      title: 'Business Analyst',
      description: 'Bridge the gap between business and technology. Strong analytical and communication skills required.',
      requiredCGPA: 7.5,
      allowedDepartments: '["Computer Science","Information Technology","Electronics","Mechanical Engineering"]',
      year: 2024,
      ctc: 11.0,
      positions: 4,
    },
    {
      companyId: createdCompanies[5].profile.id, // Capgemini
      title: 'Java Developer',
      description: 'Develop enterprise applications using Java, Spring Boot, and microservices architecture.',
      requiredCGPA: 7.2,
      allowedDepartments: '["Computer Science","Information Technology"]',
      year: 2024,
      ctc: 9.5,
      positions: 5,
    },
  ];

  const createdJobs = [];
  for (const jobData of jobs) {
    const job = await prisma.job.create({
      data: jobData,
    });
    createdJobs.push(job);
    console.log('Job created:', job.title, 'at', createdCompanies.find(c => c.profile.id === jobData.companyId)?.profile.companyName);
  }

  // Create applications from students to jobs
  const applications = [
    // Rahul Kumar (CS, 8.5 CGPA) applying to multiple jobs
    { studentId: createdStudents[0].profile.id, jobId: createdJobs[0].id, status: 'Shortlisted' },
    { studentId: createdStudents[0].profile.id, jobId: createdJobs[2].id, status: 'Applied' },
    { studentId: createdStudents[0].profile.id, jobId: createdJobs[4].id, status: 'Interviewed' },

    // Priya Singh (IT, 8.2 CGPA)
    { studentId: createdStudents[1].profile.id, jobId: createdJobs[0].id, status: 'Selected' },
    { studentId: createdStudents[1].profile.id, jobId: createdJobs[1].id, status: 'Applied' },

    // Amit Patel (CS, 7.8 CGPA)
    { studentId: createdStudents[2].profile.id, jobId: createdJobs[0].id, status: 'Applied' },
    { studentId: createdStudents[2].profile.id, jobId: createdJobs[4].id, status: 'Shortlisted' },

    // Sneha Reddy (Electronics, 8.7 CGPA)
    { studentId: createdStudents[3].profile.id, jobId: createdJobs[2].id, status: 'Applied' },
    { studentId: createdStudents[3].profile.id, jobId: createdJobs[6].id, status: 'Interviewed' },

    // Kavita Nair (CS, 8.0 CGPA)
    { studentId: createdStudents[5].profile.id, jobId: createdJobs[3].id, status: 'Applied' },
    { studentId: createdStudents[5].profile.id, jobId: createdJobs[5].id, status: 'Rejected' },

    // Rohit Sharma (IT, 7.9 CGPA)
    { studentId: createdStudents[6].profile.id, jobId: createdJobs[1].id, status: 'Applied' },
    { studentId: createdStudents[6].profile.id, jobId: createdJobs[7].id, status: 'Shortlisted' },

    // Meera Iyer (CS, 8.3 CGPA)
    { studentId: createdStudents[7].profile.id, jobId: createdJobs[0].id, status: 'Applied' },
    { studentId: createdStudents[7].profile.id, jobId: createdJobs[4].id, status: 'Applied' },
  ];

  for (const appData of applications) {
    try {
      const application = await prisma.application.create({
        data: appData,
      });
      console.log('Application created for job:', createdJobs.find(j => j.id === appData.jobId)?.title);
    } catch (error) {
      // Skip if application already exists (unique constraint)
      console.log('Application already exists, skipping...');
    }
  }

  console.log('\n=== SEEDING COMPLETED ===');
  console.log(`Created ${admins.length} admins, ${students.length} students, ${companies.length} companies`);
  console.log(`Created ${jobs.length} jobs and ${applications.length} applications`);
  console.log('\nDemo login credentials:');
  console.log('Password for all users: demo123');
  console.log('\nAdmins:');
  admins.forEach(admin => console.log(`- ${admin.email}`));
  console.log('\nStudents:');
  students.forEach(student => console.log(`- ${student.email} (${student.department}, ${student.cgpa} CGPA)`));
  console.log('\nCompanies:');
  companies.forEach(company => console.log(`- ${company.email} (${company.companyName})`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });