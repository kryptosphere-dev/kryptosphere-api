-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('main', 'chapter');

-- CreateEnum
CREATE TYPE "PartnerCategory" AS ENUM ('sponsor', 'media', 'community', 'institutional');

-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('platinum', 'gold', 'silver', 'bronze');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('draft', 'published', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "PublicationCategory" AS ENUM ('kryptopaper', 'article', 'rapport', 'etude');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "cityId" TEXT,
    "countryId" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "logoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "littleDescriptionFr" TEXT NOT NULL,
    "littleDescriptionEn" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "schoolId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "heroImageId" TEXT,
    "logoId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "establishedDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "galleryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "type" "BoardType" NOT NULL,
    "year" INTEGER NOT NULL,
    "chapterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pole" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionFr" TEXT[],
    "descriptionEn" TEXT[],
    "boardId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberRole" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociationMember" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "pictureId" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "schoolId" TEXT,
    "userId" TEXT,
    "cotisationPaid" BOOLEAN NOT NULL DEFAULT false,
    "cotisationStartDate" TIMESTAMP(3),
    "cotisationEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssociationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMandate" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "poleId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberMandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "PublicationCategory" NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "dateLabelFr" TEXT,
    "dateLabelEn" TEXT,
    "readTimeFr" TEXT,
    "readTimeEn" TEXT,
    "publishedAt" TIMESTAMP(3),
    "coverImageId" TEXT,
    "downloadUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "achievementsFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "achievementsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociationSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyFr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,

    CONSTRAINT "AssociationSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "iconName" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "subtitleFr" TEXT,
    "subtitleEn" TEXT,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "dateLabelFr" TEXT,
    "dateLabelEn" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'draft',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "cityId" TEXT,
    "venue" TEXT,
    "chapterId" TEXT,
    "coverImageId" TEXT,
    "lumaUrl" TEXT,
    "lumaEventId" TEXT,
    "internalRoute" TEXT,
    "galleryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pictureId" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "roleFr" TEXT,
    "roleEn" TEXT,
    "companyFr" TEXT,
    "companyEn" TEXT,
    "bioFr" TEXT,
    "bioEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSpeaker" (
    "eventId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,
    "topic" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventSpeaker_pkey" PRIMARY KEY ("eventId","speakerId")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "logoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSponsorship" (
    "eventId" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "tier" "SponsorTier" NOT NULL,
    "amount" DECIMAL(12,2),
    "currency" CHAR(3),
    "notes" TEXT,

    CONSTRAINT "EventSponsorship_pkey" PRIMARY KEY ("eventId","sponsorId")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "logoId" TEXT,
    "category" "PartnerCategory" NOT NULL,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPartnership" (
    "eventId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,

    CONSTRAINT "EventPartnership_pkey" PRIMARY KEY ("eventId","partnerId")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "galleryId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("galleryId","imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authUserId_key" ON "User"("authUserId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_countryId_idx" ON "City"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_cityId_idx" ON "School"("cityId");

-- CreateIndex
CREATE INDEX "School_countryId_idx" ON "School"("countryId");

-- CreateIndex
CREATE INDEX "School_logoId_idx" ON "School"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_galleryId_key" ON "Chapter"("galleryId");

-- CreateIndex
CREATE INDEX "Chapter_schoolId_idx" ON "Chapter"("schoolId");

-- CreateIndex
CREATE INDEX "Chapter_cityId_idx" ON "Chapter"("cityId");

-- CreateIndex
CREATE INDEX "Chapter_isActive_idx" ON "Chapter"("isActive");

-- CreateIndex
CREATE INDEX "Chapter_heroImageId_idx" ON "Chapter"("heroImageId");

-- CreateIndex
CREATE INDEX "Chapter_logoId_idx" ON "Chapter"("logoId");

-- CreateIndex
CREATE INDEX "Board_chapterId_idx" ON "Board"("chapterId");

-- CreateIndex
CREATE INDEX "Board_year_idx" ON "Board"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Board_type_year_chapterId_key" ON "Board"("type", "year", "chapterId");

-- CreateIndex
CREATE INDEX "Pole_boardId_idx" ON "Pole"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "Pole_boardId_slug_key" ON "Pole"("boardId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "MemberRole_slug_key" ON "MemberRole"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationMember_email_key" ON "AssociationMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationMember_userId_key" ON "AssociationMember"("userId");

-- CreateIndex
CREATE INDEX "AssociationMember_schoolId_idx" ON "AssociationMember"("schoolId");

-- CreateIndex
CREATE INDEX "AssociationMember_pictureId_idx" ON "AssociationMember"("pictureId");

-- CreateIndex
CREATE INDEX "AssociationMember_lastName_firstName_idx" ON "AssociationMember"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "AssociationMember_cotisationPaid_idx" ON "AssociationMember"("cotisationPaid");

-- CreateIndex
CREATE INDEX "MemberMandate_boardId_idx" ON "MemberMandate"("boardId");

-- CreateIndex
CREATE INDEX "MemberMandate_poleId_idx" ON "MemberMandate"("poleId");

-- CreateIndex
CREATE INDEX "MemberMandate_roleId_idx" ON "MemberMandate"("roleId");

-- CreateIndex
CREATE INDEX "MemberMandate_endDate_idx" ON "MemberMandate"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "MemberMandate_memberId_roleId_boardId_key" ON "MemberMandate"("memberId", "roleId", "boardId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");

-- CreateIndex
CREATE INDEX "Publication_category_idx" ON "Publication"("category");

-- CreateIndex
CREATE INDEX "Publication_publishedAt_idx" ON "Publication"("publishedAt");

-- CreateIndex
CREATE INDEX "Publication_coverImageId_idx" ON "Publication"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineEntry_year_key" ON "TimelineEntry"("year");

-- CreateIndex
CREATE UNIQUE INDEX "AssociationSection_key_key" ON "AssociationSection"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_key_key" ON "Stat"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_lumaEventId_key" ON "Event"("lumaEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_galleryId_key" ON "Event"("galleryId");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_chapterId_idx" ON "Event"("chapterId");

-- CreateIndex
CREATE INDEX "Event_cityId_idx" ON "Event"("cityId");

-- CreateIndex
CREATE INDEX "Event_coverImageId_idx" ON "Event"("coverImageId");

-- CreateIndex
CREATE INDEX "Speaker_lastName_firstName_idx" ON "Speaker"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Speaker_pictureId_idx" ON "Speaker"("pictureId");

-- CreateIndex
CREATE INDEX "EventSpeaker_speakerId_idx" ON "EventSpeaker"("speakerId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_name_key" ON "Sponsor"("name");

-- CreateIndex
CREATE INDEX "Sponsor_logoId_idx" ON "Sponsor"("logoId");

-- CreateIndex
CREATE INDEX "EventSponsorship_sponsorId_idx" ON "EventSponsorship"("sponsorId");

-- CreateIndex
CREATE INDEX "EventSponsorship_tier_idx" ON "EventSponsorship"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "Partner"("name");

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "Partner"("category");

-- CreateIndex
CREATE INDEX "Partner_logoId_idx" ON "Partner"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_key_key" ON "Image"("key");

-- CreateIndex
CREATE INDEX "GalleryImage_imageId_idx" ON "GalleryImage"("imageId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pole" ADD CONSTRAINT "Pole_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMember" ADD CONSTRAINT "AssociationMember_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMember" ADD CONSTRAINT "AssociationMember_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationMember" ADD CONSTRAINT "AssociationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMandate" ADD CONSTRAINT "MemberMandate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "AssociationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMandate" ADD CONSTRAINT "MemberMandate_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MemberRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMandate" ADD CONSTRAINT "MemberMandate_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMandate" ADD CONSTRAINT "MemberMandate_poleId_fkey" FOREIGN KEY ("poleId") REFERENCES "Pole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeaker" ADD CONSTRAINT "EventSpeaker_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeaker" ADD CONSTRAINT "EventSpeaker_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsorship" ADD CONSTRAINT "EventSponsorship_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsorship" ADD CONSTRAINT "EventSponsorship_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPartnership" ADD CONSTRAINT "EventPartnership_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPartnership" ADD CONSTRAINT "EventPartnership_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
