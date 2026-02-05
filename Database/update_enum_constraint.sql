-- =========================================
-- Update Opportunity Type Check Constraint
-- =========================================

-- 1. Drop the existing constraint
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_type_check;

-- 2. Add the new constraint with all supported types
ALTER TABLE opportunities 
ADD CONSTRAINT opportunities_type_check 
CHECK (type IN ('INTERNSHIP', 'INDUSTRIAL_TRAINING', 'PLACEMENT', 'FULL_TIME', 'PART_TIME', 'TRAINING'));
