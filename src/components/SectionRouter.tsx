'use client';

import { useApp } from '@/contexts/AppContext';
import WelcomeSection from '@/components/sections/WelcomeSection';
import TrainingSection from '@/components/sections/TrainingSection';
import TestsSection from '@/components/sections/TestsSection';
import ProceduresSection from '@/components/sections/ProceduresSection';
import AlohaPosSection from '@/components/sections/AlohaPosSection';
import VideosSection from '@/components/sections/VideosSection';
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
import ScheduleReportSection from '@/components/sections/ScheduleReportSection';
import MaintenanceSection from './sections/MaintenanceSection';

export default function SectionRouter() {
  const { activeSection } = useApp();

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
      case 'videos':
        return <VideosSection />;
      case 'cocktails':
        return <CocktailsSection />;
      case 'drink-specials':
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
      case 'schedule-report':
        return <ScheduleReportSection />;
        case 'maintenance':
        return <MaintenanceSection />;
      default:
        return <WelcomeSection />;
    }
  };

  return <>{renderSection()}</>;
}