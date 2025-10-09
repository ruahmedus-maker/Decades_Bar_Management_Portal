export default function ProceduresSection() {
  return (
    <div className="section" id="procedures">
      <div className="section-header">
        <h3>Standard Operating Procedures</h3>
      </div>
      <p>Consistency is key to our success. Follow these procedures to maintain our high standards and a clean work place.</p>
      
      <div className="card">
        <div className="card-header">
          <h4>Opening Checklist</h4>
        </div>
        <div className="card-body">
          <ol style={{ paddingLeft: '20px' }}>
            <li>Arrive ready for your shift and clock it at the start time indicated on your schedule</li>
            <li>Collect banks and check-books (HH & Rooftop floors) from the office and confirm registers are assigned</li>
            <li>Remove all caps from liquor bottles and soak in soda water</li>
            <li>Set up the well - marry bottles and gather the liquor required for the shift</li>
            <li>Ensure all necessary tools, shakers, jiggers, etc are present</li>
            <li>Straight face all bottles on the back-bar display and fill any empty spaces with the appropriate bottles</li>
            <li>Review daily specials/promotions and make sure the specials menus are displayed on the bar</li>
          </ol>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h4>Closing Procedures</h4>
        </div>
        <div className="card-body">
          <ol style={{ paddingLeft: '20px' }}>
            <li>Do not start entering tips into the POS system or start any other closing duties until the lights go up and we are no longer serving customers</li>
            <li>Soak bar guns in hot water (where available) or soda water to disolve residue</li>
            <li>Enter tips, change out cash tips with the drawer (giving the low denomination bills to the house in exchange for larger bills for yourselves), count the bank to $300. Straight face the remaining cash in the drawer (this will be the blind drop). Once you are done with those procedures please exit out of your screen so that management can run the report.</li>
            <li>Remove all bottles from the well and clean all steel surfaces with a wet rag and cleaning solution</li>
            <li>Clean all bottles in the same fashion and restore to the well</li>
            <li>Soak up standing water from the resevoir surrounding the ice bin</li>
            <li>Break down bar guns and clean thoroughly then place into holder</li>
            <li>Return any chilled bottles that may have been in your well back into the coolers</li>
            <li>Cap all bottles including those in the coolers</li>
            <li>Visually inspect the bar for any oversight</li>
            <li>Proceed to office for cash out</li>
          </ol>
        </div>
      </div>
    </div>
  );
}