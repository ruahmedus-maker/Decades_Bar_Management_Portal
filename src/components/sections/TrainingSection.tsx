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
      
      {/* Getting Started Card - Using CSS classes only */}
      <div className="card decades-intro-card">
        <div className="card-header">
          <h4>🎯 Getting Started - Your Training Roadmap</h4>
        </div>
        <div className="card-body">
          <p className="intro-subtitle">
            Welcome to Decades! Follow this structured learning path to master your role as a bartender in our high-volume night club environment.
          </p>
          <div className="week-grid">
            <div className="week-day week-day-1">
              <h5>📚 Phase 1: Foundation Knowledge</h5>
              <ul>
                <li>Review this Training Section</li>
                <li>Study Drink Recipes & Glassware Guide</li>
                <li>Learn Bar Cleaning Procedures</li>
                <li>Understand POS System Basics</li>
              </ul>
            </div>
            <div className="week-day week-day-2">
              <h5>🛠️ Phase 2: Practical Training</h5>
              <ul>
                <li>Shadow experienced bartenders</li>
                <li>Practice pouring techniques</li>
                <li>Learn floor-specific workflows</li>
                <li>Master closing procedures</li>
              </ul>
            </div>
            <div className="week-day week-day-3">
              <h5>🎓 Phase 3: Mastery & Independence</h5>
              <ul>
                <li>Solo shifts with support</li>
                <li>Speed and efficiency training</li>
                <li>Customer service excellence</li>
                <li>Final proficiency assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Decades Standards - Using CSS classes */}
      <div className="card">
        <div className="card-header">
          <h4>⚡ Decades Bar Standards</h4>
        </div>
        <div className="card-body">
          <div className="week-grid">
            <div className="week-day week-day-1">
              <h5>Pouring Standards</h5>
              <ul>
                <li><strong>Standard Cocktail Pour:</strong> 1.5oz</li>
                <li><strong>Straight Shot Pour:</strong> ~1.25oz (just below shot glass rim)</li>
                <li><strong>Premium Pour:</strong> 2oz (for top-shelf spirits)</li>
                <li><strong>Wine Pour:</strong> 6oz (5oz for sparkling)</li>
              </ul>
            </div>
            <div className="week-day week-day-2">
              <h5>Speed Expectations</h5>
              <ul>
                <li><strong>Simple Cocktails:</strong> 30-45 seconds</li>
                <li><strong>Complex Cocktails:</strong> 60-90 seconds</li>
                <li><strong>Beer/Shot Orders:</strong> 15-20 seconds</li>
                <li><strong>Rush Hour Goal:</strong> 2-3 customers/minute</li>
              </ul>
            </div>
            <div className="week-day week-day-3">
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

      {/* Training Schedule - Using CSS classes */}
      <div className="card">
        <div className="card-header">
          <h4>📅 Training Schedule & Floor Assignments</h4>
        </div>
        <div className="card-body">
          <div className="week-grid">
            <div className="week-day week-day-1">
              <h5>Friday Training</h5>
              <div className="day-highlight">2000's Floor</div>
              <ul>
                <li>Focus on mainstream cocktails</li>
                <li>High-volume service training</li>
                <li>Group ordering techniques</li>
                <li>Time management skills</li>
              </ul>
            </div>

            <div className="week-day week-day-2">
              <h5>Saturday Training</h5>
              <div className="day-highlight">Hip Hop & Rooftop</div>
              <ul>
                <li>Premium service techniques</li>
                <li>Bottle service protocols</li>
                <li>VIP customer handling</li>
                <li>Upselling strategies</li>
              </ul>
            </div>
          </div>

          <div className="week-day week-day-4 training-focus">
            <h5>🎯 First Shift Focus: Watch & Learn</h5>
            <p>
              <strong>Your primary goal during the first shift is OBSERVATION.</strong> Pay close attention to how experienced bartenders:
            </p>
            <ul>
              <li>Handle multiple drink orders simultaneously</li>
              <li>Manage customer interactions during peak hours</li>
              <li>Maintain organization in their workspace</li>
              <li>Use the POS system efficiently</li>
              <li>Communicate with barbacks and other staff</li>
              <li>Handle difficult situations or customers</li>
            </ul>
            <p className="training-note">
              Take mental notes and ask thoughtful questions during slower moments.
            </p>
          </div>
        </div>
      </div>
      
      {/* Card Grid - Using proper CSS classes */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>🧪 Bartending Fundamentals</h4>
          </div>
          <div className="card-body">
            <p><strong>Learning Path:</strong> Start with basic techniques before moving to complex cocktails</p>
            <div className="week-day week-day-1 practice-sequence">
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
        
        {/* ... rest of the cards follow the same pattern - remove inline styles ... */}
        
      </div>

      <ProgressSection />
    </div>
  );
}