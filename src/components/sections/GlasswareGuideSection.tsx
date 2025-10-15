import { useEffect } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import

export default function GlasswareGuideSection() {

   const { currentUser } = useApp(); // Add this if not present

  // Add this useEffect to track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'section-id');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="glassware-guide">
      <div className="section-header">
        <h3>Glassware Guide</h3>
      </div>

      <div className="glassware-grid">
        {/* Large Branded Glass */}
        <div className="glass-card">
          <div className="glass-header">
            <h3>Decades Large Branded Glass</h3>
          </div>
          <div className="glass-content">
            <p className="glass-use"><strong>Primary Use:</strong> High-volume cocktails and mixed drinks</p>
            <div className="glass-includes">
              <strong>Includes:</strong>
              <ul>
                <li>Water, Juice, and Soda</li>
                <li>Any Long Island Iced Tea variations</li>
                <li>Any cocktail with Red Bull</li>
                <li>Bombs for Red Bull</li>
                <li>Decades Signature/Seasonal feature cocktails</li>
                <li>Any &quot;double&quot; cocktail</li>
              </ul>
            </div>
            <p className="glass-note"><strong>Note:</strong> May be used as a double shooter upon specific customer request</p>
          </div>
        </div>

        {/* Frosted Glass */}
        <div className="glass-card">
          <div className="glass-header">
            <h3>Decades Frosted Glass</h3>
          </div>
          <div className="glass-content">
            <p className="glass-use"><strong>Primary Use:</strong> Spirit-forward drinks served without large-volume mixers</p>
            <div className="glass-includes">
              <strong>Includes:</strong>
              <ul>
                <li>Single or double &quot;neat&quot; pours of any liquor</li>
                <li>Single-pour cocktails (e.g., Vodka & Soda, Rum & Coke)</li>
                <li>Single or double pours of liquor &quot;on the rocks&quot;</li>
                <li>Any request for a Neat/Straight Up shot (e.g., Bourbon Neat, Scotch Straight Up)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shot Glass */}
        <div className="glass-card">
          <div className="glass-header">
            <h3>Decades Shot Glass</h3>
          </div>
          <div className="glass-content">
            <p className="glass-use"><strong>Primary Use:</strong> All shot servings</p>
            <div className="glass-includes">
              <strong>Includes:</strong>
              <ul>
                <li>Shots of liquor</li>
                <li>All shooters</li>
              </ul>
            </div>
            <p className="glass-note"><strong>Standard:</strong> All shots are to be poured <strong>below the rim</strong></p>
          </div>
        </div>
      </div>

      {/* Thursday Policy */}
      <div className="policy-notice" id="thursday-policy">
        <div className="policy-header">
          <h3>⚠️ Important Thursday Policy</h3>
        </div>
        <div className="policy-content">
          <p><strong>Security & Underage Drinking Protocol:</strong></p>
          <p>On Thursdays, to assist security in detecting underage drinking, <strong>all cocktails that are normally served in the Large Branded Glass must be served in the Frosted Glass instead.</strong></p>
          <p>This includes:</p>
          <ul>
            <li>Long Island Iced Teas</li>
            <li>Cocktails with Red Bull</li>
            <li>Double cocktails</li>
          </ul>
          <p>Please adhere to this policy for the entire Thursday night operation.</p>
        </div>
      </div>
      <ProgressSection />
    </div>
  );
}