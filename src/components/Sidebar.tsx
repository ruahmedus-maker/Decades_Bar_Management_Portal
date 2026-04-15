'use client';

import { useApp } from '@/contexts/AppContext';
import { NAV_ITEMS } from '@/lib/constants';
import { ENABLE_TESTS } from '@/lib/test-utils';
import { goldTextStyle, brandFont, navLinkTextStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit } from '@/lib/brand-styles';

// Create a type for the valid section IDs for better type safety
type SectionId = typeof NAV_ITEMS[number]['id'];

// Admin-only sections that should be hidden from regular users
const ADMIN_SECTIONS: SectionId[] = ['admin-panel', 'employee-counselings', 'performance-report'];

// Gold/Bronze color scheme
const SIDEBAR_COLOR = '#FFFFFF'; // Clean White
const SIDEBAR_COLOR_RGB = '255, 255, 255';


export default function Sidebar() {
  const { activeSection, setActiveSection, trackVisit, isAdmin, isSidebarOpen, setIsSidebarOpen } = useApp();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    trackVisit(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Filter navigation items based on user role and feature flags
  const filteredNavItems = NAV_ITEMS.filter(item => {
    // Hide tests if disabled
    if (item.id === 'tests' && !ENABLE_TESTS) return false;

    // Hide admin sections for non-admins
    if (item.group === 'Admin' && !isAdmin) {
      return false;
    }

    return true;
  });

  // Group items by their group property
  const groups = ['Home', 'Service & Menu', 'Operations & Culture', 'Admin'];
  const groupedItems = groups.reduce((acc, group) => {
    const items = filteredNavItems.filter(item => item.group === group);
    if (items.length > 0) acc[group] = items;
    return acc;
  }, {} as Record<string, typeof filteredNavItems>);

  const sidebarStyle = {
    position: 'fixed' as const,
    left: isSidebarOpen ? '20px' : '-300px', // Toggle for mobile
    top: '120px',
    height: 'calc(100vh - 140px)',
    width: '280px',
    zIndex: 1000,
    overflowY: 'auto' as const,
    padding: '25px 20px',
    background: '#121212', // Pure professional neutral
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    borderRadius: '20px',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'left',
    transform: 'translateZ(0)'
  };

  const groupHeaderStyle = {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    marginTop: '25px',
    marginBottom: '12px',
    paddingLeft: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '8px'
  };

  const navLinkStyle = {
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'transparent',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px'
  };

  const navLinkActiveStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF'
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      <div className="sidebar" style={sidebarStyle}>
        <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ ...goldTextStyle, fontSize: '1.4rem', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center' }}>
            Menu
          </h1>
        </div>

        <nav>
          {groups.map(groupName => {
            const items = groupedItems[groupName];
            if (!items) return null;

            return (
              <div key={groupName} style={{ marginBottom: '10px' }}>
                <div style={groupHeaderStyle}>{groupName}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          onClick={() => handleSectionChange(item.id)}
                          style={{
                            ...navLinkStyle,
                            ...(isActive ? navLinkActiveStyle : {}),
                            color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            }
                          }}
                        >
                          <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>
                            {item.icon}
                          </span>
                          <span style={{ ...navLinkTextStyle, fontSize: '0.8rem', letterSpacing: '1px' }}>
                            {item.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}