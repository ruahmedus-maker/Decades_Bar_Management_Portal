// lib/supabase-maintenance.ts
import { supabase } from './supabase';
import { MaintenanceTicket } from '@/types';

interface MaintenanceTicketRow {
  id: string;
  floor: string;
  location: string;
  title: string;
  description: string | null;
  reported_by: string;
  reported_by_email: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateTicketInput {
  floor: MaintenanceTicket['floor'];
  location: string;
  title: string;
  description: string;
  reportedBy: string;
  reportedByEmail: string;
  priority: MaintenanceTicket['priority'];
}

export const supabaseMaintenance = {
  // Get all maintenance tickets
  getTickets: async (): Promise<MaintenanceTicket[]> => {
    try {
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tickets: MaintenanceTicket[] = (data || []).map((ticket: MaintenanceTicketRow) => ({
        id: ticket.id,
        floor: ticket.floor as MaintenanceTicket['floor'],
        location: ticket.location,
        title: ticket.title,
        description: ticket.description || '',
        reported_by: ticket.reported_by,
        reported_by_email: ticket.reported_by_email,
        status: ticket.status as MaintenanceTicket['status'],
        priority: ticket.priority as MaintenanceTicket['priority'],
        assigned_to: ticket.assigned_to || undefined,
        notes: ticket.notes || undefined,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));

      return tickets;
    } catch (error) {
      console.error('Error fetching maintenance tickets:', error);
      return [];
    }
  },

  // Create a new maintenance ticket
  createTicket: async (ticket: CreateTicketInput): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .insert({
          floor: ticket.floor,
          location: ticket.location,
          title: ticket.title,
          description: ticket.description,
          reported_by: ticket.reportedBy,
          reported_by_email: ticket.reportedByEmail,
          priority: ticket.priority,
          status: 'open'
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from ticket creation');
      
      return data.id;
    } catch (error) {
      console.error('Error creating maintenance ticket:', error);
      throw error;
    }
  },

  // Update a maintenance ticket
  updateTicket: async (id: string, updates: Partial<MaintenanceTicket>): Promise<void> => {
    try {
      const updateData: any = {
        status: updates.status,
        priority: updates.priority,
        assigned_to: updates.assigned_to,
        notes: updates.notes,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('maintenance_tickets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating maintenance ticket:', error);
      throw error;
    }
  },

  // Delete a maintenance ticket
  deleteTicket: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('maintenance_tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting maintenance ticket:', error);
      throw error;
    }
  },

  // Real-time subscription for maintenance tickets
  subscribeToTickets: (callback: (tickets: MaintenanceTicket[]) => void) => {
    const subscription = supabase
      .channel('maintenance-tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_tickets'
        },
        async () => {
          const tickets = await supabaseMaintenance.getTickets();
          callback(tickets);
        }
      )
      .subscribe();

    return subscription;
  }
};