-- =====================================================
-- CLEANUP DUPLICATE ROWS IN SUPABASE
-- Run this in Supabase -> SQL Editor -> New Query -> Run
-- =====================================================

-- 1. Remove duplicate projects (keep original IDs 1, 2, 5, 6, 8, 12, 13)
DELETE FROM projects WHERE id IN (19, 20, 21, 22, 23, 24);

-- 2. Remove duplicate skills (keep unique skill names, delete re-seeded batch)
DELETE FROM skills WHERE id >= 75;

-- 3. Remove duplicate internships (keep custom edits with IDs 1, 2, 3)
DELETE FROM internships WHERE id IN (6, 7);

-- 4. Remove duplicate education (keep original IDs 1, 4)
DELETE FROM education WHERE id IN (5, 6);

-- 5. Remove duplicate certificates (keep original IDs 1, 2, 3, 4)
DELETE FROM certificates WHERE id IN (8, 9, 10);

-- 6. Remove duplicate statistics (keep original IDs 1, 2, 3, 4, 10)
DELETE FROM statistics WHERE id IN (11, 12, 13, 14, 15);

-- 7. Remove duplicate profile (keep customized ID 1 with phone number)
DELETE FROM profile WHERE id = 2;
