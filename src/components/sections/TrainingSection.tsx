import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

export default function TrainingMaterials() {
  const { currentUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'training');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="training">
      <div className="section-header">
        <h3>Training Materials</h3>
        <span className="badge">Updated</span>
      </div>
      
      <div className="card" style={{marginBottom: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div className="card-header">
          <h4 style={{color: 'white'}}>🎯 Getting Started - Your Training Roadmap</h4>
        </div>
        <div className="card-body">
          <p style={{color: 'white', fontSize: '1.1rem', marginBottom: '20px'}}>
            Welcome to Decades! Follow this structured learning path to master your role as a bartender in our high-volume night club environment.
          </p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px'}}>
              <h5 style={{color: 'white'}}>📚 Phase 1: Foundation Knowledge</h5>
              <ul style={{color: 'white'}}>
                <li>Review this Training Section</li>
                <li>Study Drink Recipes & Glassware Guide</li>
                <li>Learn Bar Cleaning Procedures</li>
                <li>Understand POS System Basics</li>
              </ul>
            </div>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px'}}>
              <h5 style={{color: 'white'}}>🛠️ Phase 2: Practical Training</h5>
              <ul style={{color: 'white'}}>
                <li>Shadow experienced bartenders</li>
                <li>Practice pouring techniques</li>
                <li>Learn floor-specific workflows</li>
                <li>Master closing procedures</li>
              </ul>
            </div>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px'}}>
              <h5 style={{color: 'white'}}>🎓 Phase 3: Mastery & Independence</h5>
              <ul style={{color: 'white'}}>
                <li>Solo shifts with support</li>
                <li>Speed and efficiency training</li>
                <li>Customer service excellence</li>
                <li>Final proficiency assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Decades Standards */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>⚡ Decades Bar Standards</h4>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px'}}>
            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
              <h5>Pouring Standards</h5>
              <ul>
                <li><strong>Standard Cocktail Pour:</strong> 1.5oz</li>
                <li><strong>Straight Shot Pour:</strong> ~1.25oz (just below shot glass rim)</li>
                <li><strong>Premium Pour:</strong> 2oz (for top-shelf spirits)</li>
                <li><strong>Wine Pour:</strong> 6oz (5oz for sparkling)</li>
              </ul>
            </div>
            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
              <h5>Speed Expectations</h5>
              <ul>
                <li><strong>Simple Cocktails:</strong> 30-45 seconds</li>
                <li><strong>Complex Cocktails:</strong> 60-90 seconds</li>
                <li><strong>Beer/Shot Orders:</strong> 15-20 seconds</li>
                <li><strong>Rush Hour Goal:</strong> 2-3 customers/minute</li>
              </ul>
            </div>
            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
              <h5>Quality Standards</h5>
              <ul>
                <li>All drinks measured (no free pouring)</li>
                <li>Garnishes fresh and consistent</li>
                <li>Glassware spotless and chilled when required</li>
                <li>Station organized and clean at all times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Training Schedule */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>📅 Training Schedule & Floor Assignments</h4>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px'}}>
            <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '8px'}}>
              <h5 style={{color: 'white', marginBottom: '15px'}}>Friday Training</h5>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px'}}>2000&apos;s Floor</div>
              <ul style={{color: 'white'}}>
                <li>Focus on mainstream cocktails</li>
                <li>High-volume service training</li>
                <li>Group ordering techniques</li>
                <li>Time management skills</li>
              </ul>
            </div>

            <div style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '20px', borderRadius: '8px'}}>
              <h5 style={{color: 'white', marginBottom: '15px'}}>Saturday Training</h5>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px'}}>Hip Hop & Rooftop</div>
              <ul style={{color: 'white'}}>
                <li>Premium service techniques</li>
                <li>Bottle service protocols</li>
                <li>VIP customer handling</li>
                <li>Upselling strategies</li>
              </ul>
            </div>
          </div>

          <div style={{background: '#fff3cd', padding: '15px', borderRadius: '5px'}}>
            <h5 style={{color: '#856404', marginBottom: '10px'}}>🎯 First Shift Focus: Watch & Learn</h5>
            <p style={{color: '#856404', marginBottom: '10px'}}>
              <strong>Your primary goal during the first shift is OBSERVATION.</strong> Pay close attention to how experienced bartenders:
            </p>
            <ul style={{color: '#856404'}}>
              <li>Handle multiple drink orders simultaneously</li>
              <li>Manage customer interactions during peak hours</li>
              <li>Maintain organization in their workspace</li>
              <li>Use the POS system efficiently</li>
              <li>Communicate with barbacks and other staff</li>
              <li>Handle difficult situations or customers</li>
            </ul>
            <p style={{color: '#856404', marginTop: '10px', fontStyle: 'italic'}}>
              Take mental notes and ask thoughtful questions during slower moments.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>🧪 Bartending Fundamentals</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Start with basic techniques before moving to complex cocktails</p>
            <div style={{background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>Practice Sequence:</h5>
              <ol>
                <li>Master pouring accuracy with water bottles</li>
                <li>Learn Decades signature drink recipes</li>
                <li>Practice multi-drink order workflow</li>
                <li>Speed building under supervision</li>
              </ol>
            </div>
            <ul className="training-list">
              <li><strong>Pouring Techniques:</strong> Always use jiggers - 1.5oz standard pour, 1.25oz for straight shots</li>
              <li><strong>Mixing Methods:</strong> Shake until tin frosts, stir for 30 seconds for spirit-forward drinks</li>
              <li><strong>Glassware Knowledge:</strong> Refer to Glassware Guide section for proper glass selection</li>
              <li><strong>Garnishing:</strong> Citrus wheels cut fresh daily, herbs inspected for freshness</li>
              <li><strong>Product Knowledge:</strong> Focus on top 20 most used spirits first</li>
              <li><strong>Speed & Efficiency:</strong> "Two-hand" working - always be doing two things at once</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>💻 POS System Training</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Complete Aloha POS training videos before first shift</p>
            <div style={{background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>Essential Skills to Master:</h5>
              <ul>
                <li>Opening and closing checks quickly</li>
                <li>Splitting payments between card/cash</li>
                <li>Applying employee discounts correctly</li>
                <li>Reprinting receipts when needed</li>
              </ul>
            </div>
            <ul className="training-list">
              <li><strong>Order Entry Workflow:</strong> Table numbers required for all orders</li>
              <li><strong>Payment Processing:</strong> Verify ID for all credit card transactions</li>
              <li><strong>Split Billing Procedures:</strong> Max 4 splits per check - manager approval required beyond</li>
              <li><strong>Daily Closing Reports:</strong> Cash must be within $2 variance</li>
              <li><strong>Tab Management:</strong> Auto-gratuity added to tabs over 8 people</li>
              <li><strong>Menu Navigation:</strong> Use quick keys for speed during rushes</li>
            </ul>
            <p style={{marginTop: '15px', fontStyle: 'italic'}}>
              <strong>Visit Aloha POS Section</strong> for video tutorials on all system functions
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>😊 Customer Service Excellence</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Observe experienced bartenders during different crowd moods</p>
            <div style={{background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>Decades Service Standards:</h5>
              <ul>
                <li>Greet every customer within 10 seconds</li>
                <li>Make eye contact and smile genuinely</li>
                <li>Use customer's name if known</li>
                <li>Always thank customers by name from credit card</li>
              </ul>
            </div>
            <ul className="training-list">
              <li><strong>Greeting Protocols:</strong> "Welcome to Decades! What can I get for you tonight?"</li>
              <li><strong>Menu Knowledge:</strong> Know 3 most popular drinks on each floor</li>
              <li><strong>Handling Difficult Situations:</strong> Stay calm, get manager for escalated issues</li>
              <li><strong>Upselling Techniques:</strong> "Would you like to make that a double?" or "Try our signature..."</li>
              <li><strong>Reading Customers:</strong> Identify birthday groups, dates, business groups</li>
              <li><strong>Service Recovery:</strong> Free round for significant wait times (manager approval)</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>🛡️ Alcohol Safety & Compliance</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Mandatory review before handling any alcohol</p>
            <div style={{background: '#ffeaa7', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>ZERO TOLERANCE POLICIES:</h5>
              <ul>
                <li>No service to visibly intoxicated patrons</li>
                <li>No exceptions on ID verification</li>
                <li>No drinking while on shift</li>
                <li>No comp drinks without manager approval</li>
              </ul>
            </div>
            <ul className="training-list">
              <li><strong>ID Verification:</strong> Check everyone who appears under 40 - no exceptions</li>
              <li><strong>Recognizing Intoxication:</strong> Slurred speech, imbalance, loud behavior, glassy eyes</li>
              <li><strong>Responsible Service:</strong> "I'm sorry, I cannot serve you another drink at this time"</li>
              <li><strong>Legal Requirements:</strong> Last call 1:30 AM, all drinks consumed by 2:00 AM</li>
              <li><strong>Documentation:</strong> Incident reports required for any refused service</li>
              <li><strong>Safety Protocols:</strong> Know emergency exits and security signal locations</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>🍹 Mixology & Craft Cocktails</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Master basics before signature cocktails</p>
            <div style={{background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>Decades Signature Drinks (Know These First):</h5>
              <ul>
                <li>Decades Old Fashioned</li>
                <li>2000's Cosmo</li>
                <li>Rooftop Mule</li>
                <li>Hip Hop Margarita</li>
              </ul>
            </div>
            <ul className="training-list">
              <li><strong>Classic Cocktails:</strong> Old Fashioned, Manhattan, Martini, Negroni</li>
              <li><strong>Modern Techniques:</strong> Batch prep for high-volume ingredients</li>
              <li><strong>Flavor Profiling:</strong> Balance is key - taste test everything</li>
              <li><strong>Seasonal Creations:</strong> Summer = lighter, Winter = spirit-forward</li>
              <li><strong>Presentation Skills:</strong> Clean glass rims, consistent garnishes</li>
              <li><strong>Signature Development:</strong> Submit new recipes to bar manager for testing</li>
            </ul>
            <p style={{marginTop: '15px', fontStyle: 'italic'}}>
              <strong>Visit Drink Recipes Section</strong> for complete cocktail specifications
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>📊 Inventory & Cost Control</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Learn during closing shifts with experienced staff</p>
            <div style={{background: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
              <h5>Closing Responsibilities:</h5>
              <ul>
                <li>Liquor counts for empty bottles</li>
                <li>Waste documentation with reason codes</li>
                <li>Beer cooler organization and rotation</li>
                <li>Clean and restock all stations</li>
              </ul>
            </div>
            <ul className="training-list">
              <li><strong>Pour Cost Calculation:</strong> Target 18-22% for liquor</li>
              <li><strong>Inventory Procedures:</strong> Count sheets completed accurately</li>
              <li><strong>Waste Management:</strong> Document every spilled or returned drink</li>
              <li><strong>Portion Control:</strong> Jiggers prevent over-pouring losses</li>
              <li><strong>Stock Rotation:</strong> New product goes behind existing stock</li>
              <li><strong>Supplier Relations:</strong> Report low stock before completely out</li>
            </ul>
            <p style={{marginTop: '15px', fontStyle: 'italic'}}>
              <strong>Visit Bar Cleaning Section</strong> for detailed closing procedures
            </p>
          </div>
        </div>
      </div>

      {/* High-Volume Night Club Tips */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>🎵 Decades Night Club Specific Tips</h4>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
            <div>
              <h5>🔄 Rush Hour Strategies</h5>
              <ul>
                <li>Work in pairs during peak hours</li>
                <li>One bartender takes orders, other makes drinks</li>
                <li>Use batch methods for popular cocktails</li>
                <li>Keep backup ice easily accessible</li>
                <li>Pre-slice common garnishes before rush</li>
              </ul>
            </div>
            <div>
              <h5>🎤 Music & Environment</h5>
              <ul>
                <li>Learn to read lips when music is loud</li>
                <li>Use clear hand signals with barbacks</li>
                <li>Know the DJ schedule for peak times</li>
                <li>Energy matches the music vibe</li>
                <li>Security hand signals for assistance</li>
              </ul>
            </div>
            <div>
              <h5>👥 Crowd Management</h5>
              <ul>
                <li>Serve in order of arrival - no favorites</li>
                <li>Identify regulars for faster service</li>
                <li>Group similar orders together</li>
                <li>Clear communication with wait staff</li>
                <li>Know when to call for backup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Training Progression */}
      <div className="card">
        <div className="card-header">
          <h4>🎯 Training Progression Timeline</h4>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <div style={{textAlign: 'center', padding: '15px', background: '#e8f5e8', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>1-2</div>
              <strong>Days</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Review documentation on Bar training portal</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#fff3cd', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>1</div>
              <strong>Day</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Supervised training 2000's Floor<br/><em>Focus: Observation</em></p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#d4edda', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>1</div>
              <strong>Day</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Supervised training HH & Rooftop<br/><em>Focus: Participation</em></p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#cce7ff', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>Final</div>
              <strong>Test</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Procedures / Practices / Policies</p>
            </div>
          </div>
          
          <div style={{marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h5>✅ Training Completion Requirements</h5>
            <ul>
              <li>Score 90% or higher on written test</li>
              <li>Successfully complete 2 supervised shifts</li>
              <li>Demonstrate proficiency in 10 most popular cocktails</li>
              <li>Show competency in POS system operation</li>
              <li>Understand and follow all safety protocols</li>
              <li>Receive positive evaluation from training bartender</li>
            </ul>
          </div>
        </div>
      </div>
      <ProgressSection />
    </div>
  );
}