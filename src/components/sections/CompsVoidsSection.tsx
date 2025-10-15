import { useEffect } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import

export default function CompsVoidsSection() {

  const { currentUser } = useApp(); // Add this if not present

  // Add this useEffect to track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'section-id');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="comps-voids">
      <div className="section-header">
        <h3>Comps & Voids Procedures</h3>
        <span className="badge">Financial</span>
      </div>
      <p>Comps and voids section content will be implemented here.</p>
       <ProgressSection />
    </div>
  );
}