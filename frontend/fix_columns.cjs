const fs = require('fs');
const file = "/home/meareg/Desktop/side-projects/careerguide/frontend/SUPABASE_MIGRATION_COMPLETE.sql";
let sql = fs.readFileSync(file, 'utf8');

// Insert after table creations to ensure columns exist!
const alters = `
alter table roadmaps add column if not exists user_id uuid references auth.users(id);
alter table course_enrollments add column if not exists user_id uuid references auth.users(id);
alter table assessment_results add column if not exists user_id uuid references auth.users(id);
alter table posts add column if not exists user_id uuid references auth.users(id);
alter table comments add column if not exists user_id uuid references auth.users(id);
`;

sql = sql.replace('-- Enable RLS on all tables', alters + '\n-- Enable RLS on all tables');
fs.writeFileSync(file, sql);
