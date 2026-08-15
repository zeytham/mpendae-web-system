-- Kabla: "role" ilikuwa String huru -> typo (mfano 'Admin' badala ya 'admin')
-- ingeweza kupita kimya na kuvunja ukaguzi wa authorize() kimya kimya, kwa
-- sababu 'Admin' !== 'admin' na role isingelingana na chochote allowed.
-- Sasa: "role" ni enum -- Postgres/Prisma itakataa value yoyote isiyo
-- 'admin' au 'superadmin' kabla haijafika hata kwenye application code.

-- 1) Safisha data zilizopo kwanza (endapo kuna row yenye value isiyotarajiwa)
--    ili conversion isishindwe.
UPDATE "User" SET "role" = 'admin' WHERE "role" NOT IN ('admin', 'superadmin');

-- 2) Unda enum type
CREATE TYPE "UserRole" AS ENUM ('admin', 'superadmin');

-- 3) Badilisha column kutoka TEXT kwenda UserRole
ALTER TABLE "User"
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "UserRole" USING ("role"::"UserRole"),
  ALTER COLUMN "role" SET DEFAULT 'admin';
