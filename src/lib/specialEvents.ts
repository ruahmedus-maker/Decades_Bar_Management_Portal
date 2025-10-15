import { SpecialEvent, Task } from '@/types';
import { storage } from './storage';

export const specialEventsStorage = {
  // Special Events methods
  getEvents: (): Record<string, SpecialEvent> => {
    const events = localStorage.getItem('specialEvents');
    return events ? JSON.parse(events) : {};
  },

  saveEvents: (events: Record<string, SpecialEvent>): void => {
    localStorage.setItem('specialEvents', JSON.stringify(events));
  },

  createEvent: (event: Omit<SpecialEvent, 'id' | 'createdAt'>): string => {
    const events = specialEventsStorage.getEvents();
    const id = `event-${Date.now()}`;
    
    const newEvent: SpecialEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString()
    };

    events[id] = newEvent;
    specialEventsStorage.saveEvents(events);
    return id;
  },

  updateEvent: (id: string, updates: Partial<SpecialEvent>): void => {
    const events = specialEventsStorage.getEvents();
    if (events[id]) {
      events[id] = { ...events[id], ...updates };
      specialEventsStorage.saveEvents(events);
    }
  },

  deleteEvent: (id: string): void => {
    const events = specialEventsStorage.getEvents();
    delete events[id];
    specialEventsStorage.saveEvents(events);
  },

  // Task methods
  addTaskToEvent: (eventId: string, task: Omit<Task, 'id' | 'createdAt' | 'eventId'>): string => {
    const events = specialEventsStorage.getEvents();
    const event = events[eventId];
    
    if (event) {
      const taskId = `task-${Date.now()}`;
      const newTask: Task = {
        ...task,
        id: taskId,
        eventId,
        createdAt: new Date().toISOString()
      };

      event.tasks.push(newTask);
      specialEventsStorage.saveEvents(events);
      return taskId;
    }
    return '';
  },

  updateTask: (eventId: string, taskId: string, updates: Partial<Task>): void => {
    const events = specialEventsStorage.getEvents();
    const event = events[eventId];
    
    if (event) {
      const taskIndex = event.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        event.tasks[taskIndex] = { ...event.tasks[taskIndex], ...updates };
        specialEventsStorage.saveEvents(events);
      }
    }
  },

  deleteTask: (eventId: string, taskId: string): void => {
    const events = specialEventsStorage.getEvents();
    const event = events[eventId];
    
    if (event) {
      event.tasks = event.tasks.filter(task => task.id !== taskId);
      specialEventsStorage.saveEvents(events);
    }
  },

  // Get all tasks across all events
  getAllTasks: (): Task[] => {
    const events = specialEventsStorage.getEvents();
    return Object.values(events).flatMap(event => event.tasks);
  },

  // Get tasks for a specific user
  getUserTasks: (userEmail: string): Task[] => {
    const allTasks = specialEventsStorage.getAllTasks();
    return allTasks.filter(task => task.assignedTo === userEmail);
  }
};