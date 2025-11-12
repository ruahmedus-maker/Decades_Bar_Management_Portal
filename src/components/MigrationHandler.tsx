'use client';

import { useState, useEffect } from 'react';
import { MigrationService } from '@/lib/supabase-migration';

export default function MigrationHandler() {
  const [migrationStatus, setMigrationStatus] = useState<'checking' | 'needed' | 'completed' | 'error'>('checking');

  useEffect(() => {
    const runMigration = async () => {
      try {
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

  if (migrationStatus === 'checking') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(45, 212, 191, 0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 10000
      }}>
        🔄 Checking data migration...
      </div>
    );
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