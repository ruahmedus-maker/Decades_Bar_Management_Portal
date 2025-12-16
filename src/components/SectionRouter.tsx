'use client';

import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import WelcomeSection from '@/components/sections/WelcomeSection';
import TrainingSection from '@/components/sections/TrainingSection';
import TestsSection from '@/components/sections/TestsSection';
import ProceduresSection from '@/components/sections/ProceduresSection';
import AlohaPosSection from '@/components/sections/AlohaPosSection';
import CocktailsSection from '@/components/sections/CocktailsSection';
import DrinksSpecialsSection from '@/components/sections/DrinksSpecialsSection';
import GlasswareGuideSection from '@/components/sections/GlasswareGuideSection';
import UniformGuideSection from '@/components/sections/UniformGuideSection';
import BarCleaningsSection from '@/components/sections/BarCleaningsSection';
import SocialMediaSection from '@/components/sections/SocialMediaSection';
import SpecialEventsSection from '@/components/sections/SpecialEventsSection';
import CompsVoidsSection from '@/components/sections/CompsVoidsSection';
import PoliciesSection from '@/components/sections/PoliciesSection';
import AdminPanelSection from '@/components/sections/AdminPanelSection';
import FAQSection from '@/components/sections/FAQSection';
import ResourcesSection from '@/components/sections/ResourcesSection';
import EmployeeCounselingsSection from '@/components/sections/EmployeeCounselingsSection';
import KeyPerformanceIndicatorsSection from '@/components/sections/KeyPerformanceIndicatorsSection';
import MaintenanceSection from './sections/MaintenanceSection';

export default function SectionRouter() {
  const { activeSection, trackVisit, currentUser } = useApp();

  // Track section visits automatically
  useEffect(() => {
    if (currentUser && activeSection) {
      // Only track training sections, not admin sections
      const excludedSections = [
        'admin-panel',
        'employee-counselings',
        'performance-report',
        'special-events',
        'maintenance',
        'tests'  // Tests track their own progress
      ];

      if (!excludedSections.includes(activeSection)) {
        console.log(`📊 Tracking visit to: ${activeSection}`);
        trackVisit(activeSection);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser]); // trackVisit is memoized, don't include it

  const renderSection = () => {
    switch (activeSection) {
      case 'welcome':
        return <WelcomeSection />;
      case 'training':
        return <TrainingSection />;
      case 'tests':
        return <TestsSection />;
      case 'procedures':
        return <ProceduresSection />;
      case 'aloha-pos':
        return <AlohaPosSection />;
      case 'cocktails':
        return <CocktailsSection />;
      case 'drinks-specials':
        return <DrinksSpecialsSection />;
      case 'glassware-guide':
        return <GlasswareGuideSection />;
      case 'uniform-guide':
        return <UniformGuideSection />;
      case 'bar-cleanings':
        return <BarCleaningsSection />;
      case 'social-media':
        return <SocialMediaSection />;
      case 'special-events':
        return <SpecialEventsSection />;
      case 'comps-voids':
        return <CompsVoidsSection />;
      case 'policies':
        return <PoliciesSection />;
      case 'admin-panel':
        return <AdminPanelSection />;
      case 'faq':
        return <FAQSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'employee-counselings':
        return <EmployeeCounselingsSection />;
      case 'performance-report':
        return <KeyPerformanceIndicatorsSection />;
      case 'maintenance':
        return <MaintenanceSection />;
      default:
        return <WelcomeSection />;
    }
  };

  return <>{renderSection()}</>;
}