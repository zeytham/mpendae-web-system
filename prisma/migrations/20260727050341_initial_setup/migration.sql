-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Form" AS ENUM ('FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'PAST');

-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'IMAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "regNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "form" "Form" NOT NULL,
    "stream" TEXT,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT,
    "address" TEXT,
    "photo" TEXT,
    "photoPubId" TEXT,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "subjects" TEXT[],
    "qualification" TEXT NOT NULL,
    "photo" TEXT,
    "photoPubId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "coverPubId" TEXT,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "primarySchool" TEXT NOT NULL,
    "kcpeScore" DOUBLE PRECISION NOT NULL,
    "combination" TEXT,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "AdmissionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "referenceNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "form" "Form" NOT NULL,
    "stream" TEXT,
    "term" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSettings" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL DEFAULT 'Mpendae Secondary School',
    "motto" TEXT NOT NULL DEFAULT 'Elimu ni Ufunguo wa Maisha',
    "address" TEXT NOT NULL DEFAULT 'Mpendae, Zanzibar, Tanzania',
    "phone" TEXT NOT NULL DEFAULT '+255 777 000 000',
    "email" TEXT NOT NULL DEFAULT 'info@mpendaesecondary.ac.tz',
    "website" TEXT,
    "logoUrl" TEXT,
    "logoPubId" TEXT,
    "about" TEXT,
    "founded" TEXT NOT NULL DEFAULT '1990',
    "principal" TEXT NOT NULL DEFAULT 'Mwalimu Mkuu',
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "whatsapp" TEXT,

    CONSTRAINT "SchoolSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_regNumber_key" ON "Student"("regNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_staffId_key" ON "Teacher"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_referenceNo_key" ON "Admission"("referenceNo");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
