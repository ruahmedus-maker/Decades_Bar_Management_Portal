# DECADES BAR TRAINING PORTAL - CHAT MEMORY
*Last Updated: 12/02/2025, 03:42 PM

## PROJECT OVERVIEW
A collaborative team management app for 15-20 bar staff (Trainee → Bartender → Manager). 
- **For Staff**: Training materials, rules, policies, events, maintenance info
- **For Management**: Progress tracking, KPIs, event publishing, maintenance tickets, disciplinary records
- **Collaborative**: Ensures all team members access the same information

## TECH STACK
**Core:**
- Next.js 15.5.4 (App Router)
- React 19.2.0
- TypeScript 5.9.3
- Supabase (Auth + PostgreSQL)

**UI/Styling:**
- TailwindCSS 3.4.18
- Custom CSS Modules
- PWA Support

**Deployment:**
- Vercel (with deployment cache issues)

## CURRENT STATE
✅ **WORKING RELIABLY:**
- Login/Auth with Supabase (3 test users)
- Maintenance Tickets system
- Task Management
- Special Events creation
- Employee Counseling records
- Drinks recipe search
- Basic navigation

🔄 **IN PROGRESS:**
- Migration from localStorage → Supabase (partial complete)
- Progress tracking system (database ready, logic needs debugging)
- Test section content creation

❌ **BROKEN/NEEDS FIX:**
1. **Progress System**: UI renders but progress not being logged
2. **Test Section**: Renders when enabled but needs content structure
3. **Deployment Loading Screen**: Cache/thread issue after deployments
4. **Progress UI**: Not showing for Bartender/Trainee (filtering issue?)

## RECENT CHANGES (Migration Phase)
### COMPLETED MIGRATIONS:
- ✅ Tasks → Supabase `tasks` table
- ✅ Maintenance Tickets → Supabase `maintenance_tickets` table  
- ✅ Login/Auth → Supabase `auth.users` + custom `users` table
- ✅ Employee Counseling → Supabase `counseling_records` table

### IN-PROGRESS MIGRATIONS:
- 🔄 Progress Tracking → `user_progress` table (exists, needs logic)
- 🔄 Test Results → Not yet implemented

### RECENT FIXES:

### 12/02/2025, 03:42 PM

- This is a test to see if the system is working
- 2024-01-01: Initial memory file created
- Removed Quick Setup button from LoginBarrier
- Fixed unused imports in ProgressSection.tsx
- Confirmed `user_progress` table schema is correct

## FILE ARCHITECTURE