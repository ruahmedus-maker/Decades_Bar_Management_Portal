'use client';

import { useApp } from '@/contexts/AppContext';
import { NAV_ITEMS, ENABLE_TESTS } from '@/lib/constants';

// Create a type for the valid section IDs for better type safety
type SectionId = typeof NAV_ITEMS[number]['id'];

// Admin-only sections that should be hidden from regular users
const ADMIN_SECTIONS: SectionId[] = ['admin-panel', 'employee-counselings', 'schedule-report'];

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

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Main Menu</h1>
        <p>Training & Procedures</p>
      </div>
      <ul className="nav-links">
        {filteredNavItems.map((item) => (
          <li
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => handleSectionChange(item.id)}
          >
            <a>
              <span className="icon" style={{ marginRight: '10px', width: '20px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}