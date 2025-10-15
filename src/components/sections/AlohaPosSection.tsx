import { useEffect } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import

export default function AlohaPosSection() {

   const { currentUser } = useApp(); // Add this if not present

  // Add this useEffect to track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'section-id');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="aloha-pos">
      <div className="section-header">
        <h3>Aloha POS System Guide</h3>
        <span className="badge">Operations</span>
      </div>
      <p>Aloha POS section content will be implemented here.</p>
       <ProgressSection />
    </div>
  );
}