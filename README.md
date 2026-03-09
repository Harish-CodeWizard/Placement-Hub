# 🎓 PlacementHub - Placement Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-blue)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-green)](https://sqlite.org/)

> A comprehensive placement management system that connects students, companies, and placement officers in a seamless recruitment ecosystem. 🚀

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [📖 Usage](#-usage)
- [🗄️ Database Schema](#️-database-schema)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 👨‍🎓 For Students
- 📝 **Easy Application**: Apply to multiple job opportunities with one click
- 📊 **Track Progress**: Monitor application status through an 8-step timeline
- 🔍 **Smart Filtering**: Find jobs based on CGPA, department, and preferences
- 📄 **Resume Upload**: Upload and manage your resume
- 📈 **Real-time Updates**: Get instant notifications on application status changes

### 🏢 For Companies
- 💼 **Job Posting**: Create detailed job listings with eligibility criteria
- 👥 **Candidate Review**: Review applications and update statuses
- 📊 **Analytics**: Track application metrics and placement statistics
- 🎯 **Targeted Recruitment**: Set CGPA requirements and department preferences
- 📋 **Bulk Management**: Handle multiple applications efficiently

### 👨‍💼 For Admins (Placement Officers)
- 🏛️ **System Oversight**: Manage the entire placement ecosystem
- ✅ **Approval System**: Approve companies and students
- 📊 **Comprehensive Dashboard**: View system-wide statistics
- 👥 **User Management**: Oversee all users and their activities
- 📈 **Placement Tracking**: Monitor overall placement success rates

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Modern UI components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **JWT Authentication** - Secure token-based auth

### Database
- **SQLite** - Lightweight database (development)
- **Prisma Migrate** - Database schema management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Fast package manager

## 🚀 Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/placementhub.git
   cd placementhub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 🔐 Authentication
- **Students**: Apply for jobs and track applications
- **Companies**: Post jobs and review candidates
- **Admins**: Manage the entire system

### 🎯 Demo Credentials

#### 👨‍🎓 Students
- `rahul@example.com` (CS, 8.5 CGPA)
- `priya.singh@email.com` (IT, 8.2 CGPA)
- `amit.patel@email.com` (CS, 7.8 CGPA)

#### 🏢 Companies
- `hr@techcorp.com` (TechCorp Solutions)
- `recruitment@infosys.com` (Infosys)
- `talent@wipro.com` (Wipro)

#### 👨‍💼 Admins
- `admin@placement.com`
- `placement@college.edu`

**Password for all accounts**: `demo123`

## 🗄️ Database Schema

### Tables Overview

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| **User** | Core user accounts | 1:1 with Student or Company |
| **Student** | Student profiles and details | 1:N with Applications |
| **Company** | Company profiles and settings | 1:N with Jobs |
| **Job** | Job postings with requirements | 1:N with Applications |
| **Application** | Job applications with status | Links Students to Jobs |

### 📋 User Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key | CUID, Unique |
| `name` | String | Full name | Required |
| `email` | String | Email address | Unique, Required |
| `password` | String | Hashed password | Required |
| `role` | String | User role (admin/student/company) | Required |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

### 👨‍🎓 Student Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key | CUID, Unique |
| `userId` | String | Foreign key to User | Unique, Required |
| `department` | String | Academic department | Required |
| `cgpa` | Float | Grade point average | Required |
| `passingYear` | Int | Graduation year | Default: 2024 |
| `resume` | String | Resume file path | Optional |
| `status` | String | Approval status | Default: "pending" |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

### 🏢 Company Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key | CUID, Unique |
| `userId` | String | Foreign key to User | Unique, Required |
| `companyName` | String | Company name | Required |
| `requiredCGPA` | Float | Minimum CGPA requirement | Optional |
| `allowedDepartments` | String | Eligible departments (JSON) | Required |
| `year` | Int | Target batch year | Optional |
| `ctc` | Float | Cost to company | Optional |
| `status` | String | Approval status | Default: "pending" |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

### 💼 Job Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key | CUID, Unique |
| `companyId` | String | Foreign key to Company | Required |
| `title` | String | Job position title | Required |
| `description` | String | Job description | Required |
| `requiredCGPA` | Float | Minimum CGPA required | Required |
| `allowedDepartments` | String | Eligible departments (JSON) | Required |
| `year` | Int | Target batch year | Required |
| `ctc` | Float | Cost to company (LPA) | Required |
| `positions` | Int | Number of openings | Required |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

### 📝 Application Table
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key | CUID, Unique |
| `studentId` | String | Foreign key to Student | Required |
| `jobId` | String | Foreign key to Job | Required |
| `status` | String | Application status | Default: "Applied" |
| `appliedAt` | DateTime | Application timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

### 🔗 Relationships
- **User ↔ Student**: One-to-One (userId foreign key)
- **User ↔ Company**: One-to-One (userId foreign key)
- **Company → Job**: One-to-Many (companyId foreign key)
- **Student → Application**: One-to-Many (studentId foreign key)
- **Job → Application**: One-to-Many (jobId foreign key)
- **Student ↔ Job**: Many-to-Many (via Application table)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for educational institutions and companies worldwide.

**PlacementHub** - Bridging the gap between talent and opportunity! 🌟</content>
<file>README.md