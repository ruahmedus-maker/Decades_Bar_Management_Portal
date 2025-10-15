import { useEffect } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import


export default function ResourcesSection() {

  const { currentUser } = useApp(); // Add this if not present

  // Add this useEffect to track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'section-id');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="resources">
      <div className="section-header">
        <h3>Additional Resources</h3>
      </div>
      <p>Resources section content will be implemented here.</p>
      <ProgressSection />
    </div>
  );
}