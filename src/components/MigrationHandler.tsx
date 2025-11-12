'use client';

import { useState, useEffect } from 'react';

export default function MigrationHandler() {
  const [migrationStatus, setMigrationStatus] = useState<'checking' | 'needed' | 'completed' | 'error' | 'skipped'>('checking');

  useEffect(() => {
    const runMigration = async () => {
      // Only run in browser environment, not during build
      if (typeof window === 'undefined') {
        setMigrationStatus('skipped');
        return;
      }

      try {
        // Dynamically import the migration service to avoid build issues
        const { MigrationService } = await import('@/lib/supabase-migration');
        
        const status = await MigrationService.checkMigrationStatus();
        
        if (!status.usersMigrated || !status.ticketsMigrated) {
          setMigrationStatus('needed');
          
          // Auto-migrate in background
          if (!status.usersMigrated) {
            await MigrationService.migrateUsers();
          }
          
          if (!status.ticketsMigrated) {
            await MigrationService.migrateMaintenanceTickets();
          }
          
          setMigrationStatus('completed');
        } else {
          setMigrationStatus('completed');
        }
      } catch (error) {
        console.error('Migration failed:', error);
        setMigrationStatus('error');
      }
    };

    runMigration();
  }, []);

  if (migrationStatus === 'checking' || migrationStatus === 'skipped') {
    return null; // Don't show anything during build
  }

  if (migrationStatus === 'needed') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(234, 179, 8, 0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 10000
      }}>
        🚀 Migrating to cloud database...
      </div>
    );
  }

  if (migrationStatus === 'error') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 10000
      }}>
        ⚠️ Using local storage (cloud sync failed)
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(34, 197, 94, 0.9)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 10000
    }}>
      ✅ Cloud database active
    </div>
  );

  
}