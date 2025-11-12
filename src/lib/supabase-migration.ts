import { supabase } from './supabase';
import { storage } from './storage';
import { SpecialEvent, Task, User } from '@/types';

export class MigrationService {
  // Migrate users from localStorage to Supabase
  static async migrateUsers(): Promise<{ success: boolean; count: number }> {
    try {
      const localUsers = storage.getUsers();
      const users = Object.values(localUsers);
      
      if (users.length === 0) {
        return { success: true, count: 0 };
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(users.map((user: User) => ({
          email: user.email,
          name: user.name,
          position: user.position,
          status: user.status,
          progress: user.progress,
          acknowledged: user.acknowledged,
          acknowledgement_date: user.acknowledgementDate,
          registered_date: user.registeredDate,
          last_active: user.lastActive,
          login_count: user.loginCount,
          password_hash: user.passwordHash,
          visited_sections: user.visitedSections || [],
          test_results: user.testResults || {},
          section_visits: user.sectionVisits || {}
        })));

      if (error) {
        console.error('Error migrating users:', error);
        return { success: false, count: 0 };
      }

      console.log(`Successfully migrated ${users.length} users to Supabase`);
      return { success: true, count: users.length };
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, count: 0 };
    }
  }

  // Migrate maintenance tickets
  static async migrateMaintenanceTickets(): Promise<{ success: boolean; count: number }> {
    try {
      const localTickets = storage.getMaintenanceTickets();
      
      if (localTickets.length === 0) {
        return { success: true, count: 0 };
      }

      const { data, error } = await supabase
        .from('maintenance_tickets')
        .upsert(localTickets.map(ticket => ({
          id: ticket.id,
          floor: ticket.floor,
          location: ticket.location,
          title: ticket.title,
          description: ticket.description,
          reported_by: ticket.reportedBy,
          reported_by_email: ticket.reportedByEmail,
          status: ticket.status,
          priority: ticket.priority,
          assigned_to: ticket.assignedTo,
          notes: ticket.notes,
          created_at: ticket.createdAt,
          updated_at: ticket.updatedAt
        })));

      if (error) {
        console.error('Error migrating tickets:', error);
        return { success: false, count: 0 };
      }

      console.log(`Successfully migrated ${localTickets.length} maintenance tickets to Supabase`);
      return { success: true, count: localTickets.length };
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, count: 0 };
    }
  }

  // Check if we've already migrated
  static async checkMigrationStatus(): Promise<{ usersMigrated: boolean; ticketsMigrated: boolean }> {
    try {
      const { data: users } = await supabase
        .from('users')
        .select('email')
        .limit(1);

      const { data: tickets } = await supabase
        .from('maintenance_tickets')
        .select('id')
        .limit(1);

      return {
        usersMigrated: !!users && users.length > 0,
        ticketsMigrated: !!tickets && tickets.length > 0
      };
    } catch (error) {
      return { usersMigrated: false, ticketsMigrated: false };
    }
  }

  // Add special events migration
  static async migrateSpecialEvents(): Promise<{ success: boolean; count: number }> {
    try {
      // Import the localStorage version dynamically to avoid circular dependencies
      const { specialEventsStorage } = await import('./specialEvents');
      const localEvents = specialEventsStorage.getEvents();
      
      if (Object.keys(localEvents).length === 0) {
        return { success: true, count: 0 };
      }

      let migratedCount = 0;

      // Migrate events
      for (const [eventId, event] of Object.entries(localEvents)) {
        const { error: eventError } = await supabase
          .from('special_events')
          .upsert({
            id: eventId,
            name: event.name,
            date: event.date,
            theme: event.theme,
            drink_specials: event.drinkSpecials,
            notes: event.notes,
            created_by: event.createdBy,
            status: event.status,
            created_at: event.createdAt
          });

        if (eventError) {
          console.error(`Error migrating event ${eventId}:`, eventError);
          continue;
        }

        // Migrate tasks for this event
        if (event.tasks && event.tasks.length > 0) {
          for (const task of event.tasks) {
            const { error: taskError } = await supabase
              .from('tasks')
              .upsert({
                id: task.id,
                title: task.title,
                description: task.description,
                assigned_to: task.assignedTo,
                due_date: task.dueDate,
                completed: task.completed,
                completed_at: task.completedAt,
                event_id: eventId,
                priority: task.priority,
                created_at: task.createdAt
              });

            if (taskError) {
              console.error(`Error migrating task ${task.id}:`, taskError);
            }
          }
        }

        migratedCount++;
      }

      console.log(`Successfully migrated ${migratedCount} special events to Supabase`);
      return { success: true, count: migratedCount };
    } catch (error) {
      console.error('Error migrating special events:', error);
      return { success: false, count: 0 };
    }
  }

  // Add progress data migration
  static async migrateProgressData(): Promise<{ success: boolean; count: number }> {
    try {
      const users = storage.getUsers();
      let migratedCount = 0;

      for (const [email, user] of Object.entries(users)) {
        if (user.sectionVisits && Object.keys(user.sectionVisits).length > 0) {
          for (const [sectionId, visit] of Object.entries(user.sectionVisits)) {
            const { error } = await supabase
              .from('section_visits')
              .upsert({
                user_email: email,
                section_id: sectionId,
                first_visit: visit.firstVisit,
                last_visit: visit.lastVisit,
                total_time: visit.totalTime,
                completed: visit.completed,
                quiz_passed: visit.quizPassed || false
              });

            if (error) {
              console.error(`Error migrating section visit for ${email}:`, error);
            }
          }
          migratedCount++;
        }
      }

      console.log(`Successfully migrated progress data for ${migratedCount} users to Supabase`);
      return { success: true, count: migratedCount };
    } catch (error) {
      console.error('Error migrating progress data:', error);
      return { success: false, count: 0 };
    }
  }
}