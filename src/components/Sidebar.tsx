'use client';

import { useApp } from '@/contexts/AppContext';
import { NAV_ITEMS } from '@/lib/constants';
import { ENABLE_TESTS } from '@/lib/test-utils';

// Create a type for the valid section IDs for better type safety
type SectionId = typeof NAV_ITEMS[number]['id'];

// Admin-only sections that should be hidden from regular users
const ADMIN_SECTIONS: SectionId[] = ['admin-panel', 'employee-counselings', 'performance-report'];

// Tropical Teal/Blue color scheme
const SIDEBAR_COLOR = '#2DD4BF'; // Tropical teal
const SIDEBAR_COLOR_RGB = '45, 212, 191';


export default function Sidebar() {
  const { activeSection, setActiveSection, trackVisit, isAdmin } = useApp();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    trackVisit(sectionId);
  };

  // Filter navigation items based on user role and feature flags
  const filteredNavItems = NAV_ITEMS.filter(item => {
    // Hide tests if disabled
    if (item.id === 'tests' && !ENABLE_TESTS) return false;

    // Hide admin sections for non-admins using the predefined array
    if (ADMIN_SECTIONS.includes(item.id as SectionId) && !isAdmin) {
      return false;
    }

    return true;
  });

  // Sidebar positioned to be exactly level with main content
  const sidebarStyle = {
    position: 'fixed' as const,
    left: '20px',
    top: '120px', // Match the main content's top position
    height: 'calc(100vh - 140px)', // Account for header and bottom margin
    width: '260px',
    zIndex: 100,
    overflowY: 'auto' as const,
    padding: '25px 20px',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(45, 212, 191, 0.1)
    `,
    borderRadius: '20px',
    transition: 'none', // Removed - caused scroll crashes
  };

  const sidebarHoverStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.4),
      0 12px 40px rgba(45, 212, 191, 0.15)
    `,
    transform: 'translateY(-2px)',
  };

  const logoStyle = {
    textAlign: 'center' as const,
    marginBottom: '30px',
    padding: '20px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const logoTitleStyle = {
    color: '#ffffff',
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '5px',
  };

  const logoSubtitleStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
  };

  const navLinksStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const navLinkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '14px 16px',
    borderRadius: '12px',
    transition: 'none', // Removed - caused scroll crashes
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: 500,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
  };

  const navLinkHoverStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(8px) translateY(-2px)',
    color: SIDEBAR_COLOR,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    borderColor: `rgba(${SIDEBAR_COLOR_RGB}, 0.3)`,
  };

  const navLinkActiveStyle = {
    background: `rgba(${SIDEBAR_COLOR_RGB}, 0.2)`,
    border: `1px solid rgba(${SIDEBAR_COLOR_RGB}, 0.4)`,
    borderLeft: `4px solid ${SIDEBAR_COLOR}`,
    transform: 'translateX(5px)',
    boxShadow: `0 8px 20px rgba(${SIDEBAR_COLOR_RGB}, 0.2)`,
  };

  const iconStyle = {
    marginRight: '10px',
    width: '20px',
    textAlign: 'center' as const,
  };

  return (
    <div
      className="sidebar"
      style={sidebarStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, sidebarHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, sidebarStyle);
      }}
    >
      <div style={logoStyle}>
        <h1 style={logoTitleStyle}>Main Menu</h1>
        <p style={logoSubtitleStyle}>Training Modules</p>
      </div>
      <ul style={navLinksStyle}>
        {filteredNavItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <li
              key={item.id}
              style={{
                listStyle: 'none',
              }}
            >
              <a
                style={{
                  ...navLinkStyle,
                  ...(isActive ? navLinkActiveStyle : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    Object.assign(e.currentTarget.style, navLinkHoverStyle);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    Object.assign(e.currentTarget.style, {
                      ...navLinkStyle,
                      ...(isActive ? navLinkActiveStyle : {}),
                    });
                  }
                }}
                onClick={() => handleSectionChange(item.id)}
              >
                <span style={iconStyle}>
                  {item.icon}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}