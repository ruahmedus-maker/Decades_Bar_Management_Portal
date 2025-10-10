export default function UniformGuideSection() {
  return (
    <div className="section active" id="uniform-guide">
      <div className="section-header">
        <h3>Uniform Guidelines</h3>
        <span className="badge">Updated</span>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>Fellas</h4>
          </div>
          <div className="card-body">
            <p><strong>Required Attire:</strong></p>
            <ul>
              <li>Black Decades branded shirt</li>
              <li>Concept Themed T-shirts - Genre of Music/Culture according to floor</li>
              <li>Trending Urban Wear - Must be fly</li>
              <li>Special event attire will be communicated 1 week in advance</li>
              <li>No sweat pants</li>
            </ul>
            <p style={{marginTop: '15px'}}><strong>Grooming Standards:</strong></p>
            <ul>
              <li>Hair must be neat and styled</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Ladies</h4>
          </div>
          <div className="card-body">
            <p><strong>Required Attire</strong></p>
            <ul>
              <li>Concept themed - Otional</li>
              <li>Mostly do your thing because you always look good</li>
              <li>Special event attire will be communicated 1 week in advance</li>
              <li>No sweat pants</li>
              <li>Must not look like Cocktail waitress'</li>
            </ul>
            <p style={{marginTop: '15px'}}><strong>Grooming Standards:</strong></p>
            <ul>
              <li>Must have your hair did and your make up on</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Appearance Standards</h4>
          </div>
          <div className="card-body">
            <p><strong>Professional Presentation:</strong></p>
            <ul>
              <li>Uniform must be clean and pressentable</li>
              <li>Facial hair must be well-groomed</li>
            </ul>
            <p style={{marginTop: '15px'}}><strong>Personal Hygiene:</strong></p>
            <ul>
              <li>Daily shower recommended before shift</li>
              <li>Use of deodorant/antiperspirant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}