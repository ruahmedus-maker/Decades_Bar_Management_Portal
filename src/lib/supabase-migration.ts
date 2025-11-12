import { supabase } from './supabase';
import { storage } from './storage';

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
        .upsert(users.map(user => ({
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
}