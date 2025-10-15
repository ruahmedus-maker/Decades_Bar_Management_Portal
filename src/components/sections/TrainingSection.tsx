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
      <p>Our comprehensive training program covers all aspects of bartending, from basic skills to advanced techniques. Follow the structured schedule below to ensure proper floor training and skill development.</p>

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
            <h5 style={{color: '#856404', marginBottom: '10px'}}>Training Objectives</h5>
            <ul style={{color: '#856404'}}>
              <li>Master Decades signature cocktails</li>
              <li>Develop efficient workflow habits</li>
              <li>Learn floor-specific customer service</li>
              <li>Understand inventory management basics</li>
              <li>Practice safe alcohol service</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>Bartending Fundamentals</h4>
          </div>
          <div className="card-body">
            <p>Learn the essential skills every bartender needs: pouring, mixing, garnishing, and customer interaction.</p>
            <ul className="training-list">
              <li><strong>Pouring Techniques:</strong> Free pouring vs jigger use, consistent measurements</li>
              <li><strong>Mixing Methods:</strong> Shaking, stirring, building, blending</li>
              <li><strong>Glassware Knowledge:</strong> Proper glass for each drink type</li>
              <li><strong>Garnishing:</strong> Creating visually appealing presentations</li>
              <li><strong>Product Knowledge:</strong> Spirits, wines, beers, and mixers</li>
              <li><strong>Speed & Efficiency:</strong> Workstation organization and workflow</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>POS System Training</h4>
          </div>
          <div className="card-body">
            <p>Master our point-of-sale system for efficient order processing, payment handling, and inventory tracking.</p>
            <ul className="training-list">
              <li><strong>Order Entry Workflow:</strong> Table vs bar orders, modifications</li>
              <li><strong>Payment Processing:</strong> Cash, credit, gift cards, room charges</li>
              <li><strong>Split Billing Procedures:</strong> Multiple payment methods</li>
              <li><strong>Daily Closing Reports:</strong> End-of-shift reconciliation</li>
              <li><strong>Tab Management:</strong> Opening, modifying, and closing checks</li>
              <li><strong>Menu Navigation:</strong> Quick keys and category organization</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>Customer Service Excellence</h4>
          </div>
          <div className="card-body">
            <p>Develop the interpersonal skills that create memorable experiences and build customer loyalty.</p>
            <ul className="training-list">
              <li><strong>Greeting Protocols:</strong> First impressions and welcome standards</li>
              <li><strong>Menu Knowledge:</strong> Confident recommendations and descriptions</li>
              <li><strong>Handling Difficult Situations:</strong> Conflict resolution techniques</li>
              <li><strong>Upselling Techniques:</strong> Suggestive selling without pressure</li>
              <li><strong>Reading Customers:</strong> Identifying needs and preferences</li>
              <li><strong>Service Recovery:</strong> Turning problems into opportunities</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Alcohol Safety & Compliance</h4>
          </div>
          <div className="card-body">
            <p>Essential knowledge for responsible alcohol service and legal compliance.</p>
            <ul className="training-list">
              <li><strong>ID Verification:</strong> Proper checking procedures and valid forms</li>
              <li><strong>Recognizing Intoxication:</strong> Early warning signs and cues</li>
              <li><strong>Responsible Service:</strong> When and how to refuse service</li>
              <li><strong>Legal Requirements:</strong> Local and state alcohol laws</li>
              <li><strong>Documentation:</strong> Incident reporting and record keeping</li>
              <li><strong>Safety Protocols:</strong> Emergency procedures and first aid</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Mixology & Craft Cocktails</h4>
          </div>
          <div className="card-body">
            <p>Advanced techniques for creating exceptional cocktails and developing your own recipes.</p>
            <ul className="training-list">
              <li><strong>Classic Cocktails:</strong> History and proper preparation</li>
              <li><strong>Modern Techniques:</strong> Infusions, syrups, and house-made ingredients</li>
              <li><strong>Flavor Profiling:</strong> Balancing sweet, sour, bitter, and spirit-forward</li>
              <li><strong>Seasonal Creations:</strong> Adapting menus to available ingredients</li>
              <li><strong>Presentation Skills:</strong> Glass selection, garnishes, and final touches</li>
              <li><strong>Signature Development:</strong> Creating unique Decades cocktails</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Inventory & Cost Control</h4>
          </div>
          <div className="card-body">
            <p>Understanding the business side of bartending and maintaining profitability.</p>
            <ul className="training-list">
              <li><strong>Pour Cost Calculation:</strong> Tracking liquor costs and profitability</li>
              <li><strong>Inventory Procedures:</strong> Regular counts and ordering processes</li>
              <li><strong>Waste Management:</strong> Minimizing spillage and product loss</li>
              <li><strong>Portion Control:</strong> Consistent measurements for cost control</li>
              <li><strong>Stock Rotation:</strong> FIFO (First In, First Out) principles</li>
              <li><strong>Supplier Relations:</strong> Working with vendors and deliveries</li>
            </ul>
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
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Supervised training 2000's Floor</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#d4edda', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>1</div>
              <strong>Day</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Supervised training HH & Rooftop</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#cce7ff', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>Final</div>
              <strong>Test</strong>
              <p style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>Procedures / Practices / Policies</p>
            </div>
          </div>
        </div>
      </div>
       <ProgressSection />
    </div>
  );
}