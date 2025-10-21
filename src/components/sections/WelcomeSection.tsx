'use client';

import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';





function DecadesIntroduction() {
  return (
    <div className="card" style={{
      marginBottom: '25px', 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      color: '#2d3748' // Ensure good contrast
    }}>
      <div className="card-body">
        <div style={{textAlign: 'center', marginBottom: '25px'}}>
          <h1 style={{
            color: '#1a202c', 
            fontSize: '2.5rem', 
            marginBottom: '10px',
            fontWeight: '700',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>🎵 Welcome to Decades 🎵</h1>
          <p style={{
            fontSize: '1.3rem', 
            color: '#4a5568',
            fontWeight: '500'
          }}>Where Every Floor is a Different Era</p>
        </div>
        {/* Rest of your content with proper text colors */}
      </div>
    </div>
  );
}

export default function WelcomeSection() {
  const { currentUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'welcome');
    }
  }, [currentUser]);

  return (
    <div className="section active" id="welcome" style={{
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      margin: '24px',
      overflow: 'hidden'
    }}>
      <div className="section-header">
        <h3>Welcome to Your Training Hub</h3>
        <span className="badge">New</span>
      </div>

      <DecadesIntroduction />

      <p>Welcome to the Decades Bar Resource Center, your comprehensive guide to excellence in high-volume nightclub bartending. This portal contains everything you need to master our procedures, signature cocktails, customer service standards, and more.</p>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>🚀 Getting Started Guide</h4>
          </div>
          <div className="card-body">
            <p>Begin your Decades journey with our structured training program. Follow the step-by-step guide to build your skills from foundation to mastery.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>Review training materials & procedures</li>
              <li>Study Decades-specific standards</li>
              <li>Complete POS system training</li>
              <li>Practice signature cocktail recipes</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>Estimated: 2-3 days</span>
            <span>⭐ Essential</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>🎬 Video Training Library</h4>
          </div>
          <div className="card-body">
            <p>Watch our comprehensive training videos covering everything from Aloha POS operations to advanced mixology techniques and bar cleaning procedures.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>POS system tutorials</li>
              <li>Pouring technique demonstrations</li>
              <li>Cocktail preparation videos</li>
              <li>Customer service scenarios</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>20+ training videos</span>
            <span>📺 Visual Learning</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>🍹 Decades Cocktail Recipes</h4>
          </div>
          <div className="card-body">
            <p>Access our complete recipe database featuring Decades signature cocktails, classic preparations, and seasonal specials with detailed instructions and presentation standards.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>Signature Decades cocktails</li>
              <li>Classic drink preparations</li>
              <li>Seasonal specials</li>
              <li>Garnishing & presentation guides</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>50+ recipes</span>
            <span>✨ Mixology</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>⚡ Bar Operations</h4>
          </div>
          <div className="card-body">
            <p>Master the operational side of Decades including cleaning procedures, inventory management, closing protocols, and high-volume service strategies.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>Daily cleaning checklists</li>
              <li>Inventory & cost control</li>
              <li>Closing procedures</li>
              <li>Rush hour strategies</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>Essential Procedures</span>
            <span>🛠️ Operations</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>🎵 Floor-Specific Training</h4>
          </div>
          <div className="card-body">
            <p>Learn the unique requirements and service styles for each Decades floor - from the high-energy 2000's to the premium Rooftop experience.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>2000's Floor procedures</li>
              <li>Hip Hop Floor service</li>
              <li>Rooftop bottle service</li>
              <li>Floor-specific cocktails</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>Multi-floor expertise</span>
            <span>🏢 Environment</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>📊 Progress Tracking</h4>
          </div>
          <div className="card-body">
            <p>Monitor your training progress and completion status across all sections. Track which materials you've reviewed and identify areas for further study.</p>
            <ul style={{paddingLeft: '20px', marginBottom: '0'}}>
              <li>Section completion tracking</li>
              <li>Training progress overview</li>
              <li>Skill assessment readiness</li>
              <li>Performance metrics</li>
            </ul>
          </div>
          <div className="card-footer">
            <span>Real-time tracking</span>
            <span>📈 Analytics</span>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="card" style={{marginTop: '25px'}}>
        <div className="card-header">
          <h4>🎯 Your First Week at Decades</h4>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div style={{textAlign: 'center', padding: '15px', background: '#e8f5e8', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>📚</div>
              <h5>Days 1-2</h5>
              <p><strong>Portal Review</strong><br/>Complete all training sections in this portal</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#fff3cd', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>👀</div>
              <h5>Day 3</h5>
              <p><strong>Observation Shift</strong><br/>Shadow on 2000's Floor - focus on learning</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#d4edda', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>🛠️</div>
              <h5>Day 4</h5>
              <p><strong>Hands-On Training</strong><br/>Practice on Hip Hop & Rooftop floors</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', background: '#cce7ff', borderRadius: '8px'}}>
              <div style={{fontSize: '2rem', marginBottom: '10px'}}>🎓</div>
              <h5>Day 5</h5>
              <p><strong>Assessment</strong><br/>Final test and evaluation for shift readiness</p>
            </div>
          </div>
        </div>
      </div>

      <ProgressSection />
    </div>
  );
}