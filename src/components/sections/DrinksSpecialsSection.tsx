import { useEffect } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import


export default function DrinksSpecialsSection() {

   const { currentUser } = useApp(); // Add this if not present

  // Add this useEffect to track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'section-id');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="drinks-specials">
      <div className="section-header">
        <h3>Drink Specials & Promotions</h3>
        <span className="badge">Current</span>
      </div>

      {/* Weekly Specials */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>🎯 Weekly Specials</h4>
        </div>
        <div className="card-body">
          <div className="cocktail-grid">
            {/* Thursday */}
            <div className="cocktail-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
              <h5 style={{color: 'white'}}>Thursday Night</h5>
              <div className="ingredients" style={{background: 'rgba(255,255,255,0.1)'}}>
                <strong>Specials:</strong>
                <ul>
                  <li>$5 Miller lites</li>
                  <li>$6 Green Tea Shots</li>
                  <li>$10 Margaritas</li>
                </ul>
              </div>
              <div className="instructions" style={{background: 'rgba(255,255,255,0.1)'}}>
                <strong>Hours:</strong>
                <p>Unitl Midnight</p>
                <strong>Note:</strong>
                <p>Drink Tickets are for Rail Drinks Only</p>
              </div>
            </div>
            </div>
         </div>   
      </div>
      <ProgressSection />
    </div>
  );
}