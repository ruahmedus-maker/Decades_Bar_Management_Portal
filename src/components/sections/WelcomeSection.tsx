import ProgressSection from '@/components/ProgressSection';

export default function WelcomeSection() {
  return (
    <>
      <div className="section active" id="welcome">
        <div className="section-header">
          <h3>Welcome to Your Training Hub</h3>
          <span className="badge">New</span>
        </div>
        <p>Welcome to the Bar Resource Center, your comprehensive guide to excellence in bartending and bar management. This resource contains everything you need to know about our procedures, cocktail recipes, customer service standards, and more.</p>
        
        <div className="card-grid">
          <div className="card">
            <div className="card-header">
              <h4>Getting Started</h4>
            </div>
            <div className="card-body">
              <p>Begin your journey by reviewing our training materials and standard procedures. This will give you a solid foundation for your role.</p>
            </div>
            <div className="card-footer">
              <span>Estimated: 2 hours</span>
              <span><i className="fas fa-star"></i> Essential</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h4>Video Library</h4>
            </div>
            <div className="card-body">
              <p>Watch our training videos to see proper techniques in action, from basic pouring to advanced cocktail creation.</p>
            </div>
            <div className="card-footer">
              <span>15+ videos</span>
              <span><i className="fas fa-play-circle"></i> Visual Learning</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h4>Cocktail Recipes</h4>
            </div>
            <div className="card-body">
              <p>Access our complete recipe database with detailed instructions, garnishing tips, and presentation standards.</p>
            </div>
            <div className="card-footer">
              <span>50+ recipes</span>
              <span><i className="fas fa-cocktail"></i> Mixology</span>
            </div>
          </div>
        </div>
      </div>
      {/* ProgressSection is used here - it will appear below the welcome content */}
      <ProgressSection />
    </>
  );
}