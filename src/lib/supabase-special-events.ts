import { supabase } from './supabase';
import { SpecialEvent, Task } from '@/types';

// Define types for database rows
interface SpecialEventRow {
  id: string;
  name: string;
  date: string;
  theme: string | null;
  drink_specials: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  status: string;
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  event_id: string;
  priority: string;
}

// Create proper input types that match your database schema
interface SpecialEventInput {
  name: string;
  date: string;
  theme: string;
  drinkSpecials: string;
  notes: string;
  createdBy: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
}

interface TaskInput {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const supabaseSpecialEvents = {
  // Special Events methods
  getEvents: async (): Promise<Record<string, SpecialEvent>> => {
    try {
      const { data: events, error } = await supabase
        .from('special_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const eventsMap: Record<string, SpecialEvent> = {};
      const eventsData = events as SpecialEventRow[] | null;
      
      if (eventsData) {
        eventsData.forEach((event: SpecialEventRow) => {
          eventsMap[event.id] = {
            id: event.id,
            name: event.name,
            date: event.date,
            theme: event.theme || '',
            drinkSpecials: event.drink_specials || '',
            notes: event.notes || '',
            tasks: [], // We'll load tasks separately
            createdAt: event.created_at,
            createdBy: event.created_by,
            status: event.status as 'planned' | 'in-progress' | 'completed' | 'cancelled'
          };
        });

        // Load tasks for each event
        if (eventsData.length > 0) {
          const eventIds = eventsData.map((event: SpecialEventRow) => event.id);
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .in('event_id', eventIds);

          if (!tasksError && tasks) {
            const tasksData = tasks as TaskRow[];
            tasksData.forEach((task: TaskRow) => {
              const eventTask: Task = {
                id: task.id,
                title: task.title,
                description: task.description || '',
                assignedTo: task.assigned_to,
                dueDate: task.due_date || '',
                completed: task.completed,
                completedAt: task.completed_at || '',
                createdAt: task.created_at,
                eventId: task.event_id,
                priority: task.priority as 'low' | 'medium' | 'high'
              };

              if (eventsMap[task.event_id]) {
                if (!eventsMap[task.event_id].tasks) {
                  eventsMap[task.event_id].tasks = [];
                }
                eventsMap[task.event_id].tasks!.push(eventTask);
              }
            });
          }
        }
      }

      return eventsMap;
    } catch (error) {
      console.error('Error fetching events from Supabase:', error);
      return {};
    }
  },

  createEvent: async (event: SpecialEventInput): Promise<string> => {
    try {
      const id = `event-${Date.now()}`;
      
      const { error } = await supabase
        .from('special_events')
        .insert({
          id,
          name: event.name,
          date: event.date,
          theme: event.theme,
          drink_specials: event.drinkSpecials,
          notes: event.notes,
          created_by: event.createdBy,
          status: event.status
        });

      if (error) throw error;
      return id;
    } catch (error) {
      console.error('Error creating event in Supabase:', error);
      throw error;
    }
  },

  updateEvent: async (id: string, updates: Partial<SpecialEventInput>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('special_events')
        .update({
          name: updates.name,
          date: updates.date,
          theme: updates.theme,
          drink_specials: updates.drinkSpecials,
          notes: updates.notes,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating event in Supabase:', error);
      throw error;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('special_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event from Supabase:', error);
      throw error;
    }
  },

  // Task methods
  addTaskToEvent: async (eventId: string, task: TaskInput): Promise<string> => {
    try {
      const taskId = `task-${Date.now()}`;
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: taskId,
          title: task.title,
          description: task.description,
          assigned_to: task.assignedTo,
          due_date: task.dueDate,
          completed: task.completed,
          completed_at: null,
          event_id: eventId,
          priority: task.priority
        });

      if (error) throw error;
      return taskId;
    } catch (error) {
      console.error('Error adding task in Supabase:', error);
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          assigned_to: updates.assignedTo,
          due_date: updates.dueDate,
          completed: updates.completed,
          completed_at: updates.completedAt,
          priority: updates.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task in Supabase:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task from Supabase:', error);
      throw error;
    }
  },

  // Real-time subscriptions
  subscribeToEvents: (callback: (events: Record<string, SpecialEvent>) => void) => {
    const subscription = supabase
      .channel('special-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'special_events'
        },
        async () => {
          // Refresh events when anything changes
          const events = await supabaseSpecialEvents.getEvents();
          callback(events);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        async () => {
          // Refresh events when tasks change too
          const events = await supabaseSpecialEvents.getEvents();
          callback(events);
        }
      )
      .subscribe();

    return subscription;
  }
};