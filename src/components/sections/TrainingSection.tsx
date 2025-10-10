export default function TrainingMaterials() {
  return (
    <div className="section active" id="training">
      <div className="section-header">
        <h3>Training Materials</h3>
        <span className="badge">Updated</span>
      </div>
      <p>Our comprehensive training program covers all aspects of bartending, from basic skills to advanced techniques.</p>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>Bartending Fundamentals</h4>
          </div>
          <div className="card-body">
            <p>Learn the essential skills every bartender needs: pouring, mixing, garnishing, and customer interaction.</p>
            <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
              <li>Proper pouring techniques</li>
              <li>Glassware knowledge</li>
              <li>Product Knowledge</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>POS System Training</h4>
          </div>
          <div className="card-body">
            <p>Master our point-of-sale system for efficient order processing, payment handling, and inventory tracking.</p>
            <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
              <li>Order entry workflow</li>
              <li>Split billing procedures</li>
              <li>Daily closing reports</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>Customer Service Excellence</h4>
          </div>
          <div className="card-body">
            <p>Develop the interpersonal skills that create memorable experiences and build customer loyalty.</p>
            <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
              <li>Greeting protocols</li>
              <li>Handling difficult situations</li>
              <li>Upselling techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}