export default function CocktailsSection() {
  return (
    <div className="section active" id="cocktails">
      <div className="section-header">
        <h3>Cocktail Recipe Database</h3>
        <span className="badge">29 Recipes</span>
      </div>

      {/* Long Island Variations */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>Long Island Variations</h4>
        </div>
        <div className="card-body">
          <div className="cocktail-grid">
            {/* Long Island Iced Tea */}
            <div className="cocktail-card">
              <h5>Long Island Iced Tea (L.I.T)</h5>
              <div className="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>½ oz Vodka</li>
                  <li>½ oz Gin</li>
                  <li>½ oz Rum</li>
                  <li>½ oz Tequila</li>
                  <li>½ oz Triple Sec</li>
                  <li>Equal parts Sour Mix & Coke</li>
                </ul>
              </div>
              <div className="instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Add all liquors to big cup</li>
                  <li>Fill with equal parts sour mix and coke</li>
                  <li>Stir gently</li>
                  <li>Serve with straw</li>
                </ol>
              </div>
            </div>

            {/* Long Beach */}
            <div className="cocktail-card">
              <h5>Long Beach</h5>
              <div className="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>½ oz Vodka</li>
                  <li>½ oz Gin</li>
                  <li>½ oz Rum</li>
                  <li>½ oz Tequila</li>
                  <li>½ oz Triple Sec</li>
                  <li>Equal parts Sour Mix & Cranberry</li>
                </ul>
              </div>
              <div className="instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Add all liquors to big cup</li>
                  <li>Fill with equal parts sour mix and cranberry</li>
                  <li>Stir gently</li>
                  <li>Serve with straw</li>
                </ol>
              </div>
            </div>

            {/* AMF / Blue Motorcycle */}
            <div className="cocktail-card">
              <h5>AMF (Blue Motorcycle)</h5>
              <div className="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>½ oz Vodka</li>
                  <li>½ oz Gin</li>
                  <li>½ oz Rum</li>
                  <li>½ oz Tequila</li>
                  <li>½ oz Blue Curaçao</li>
                  <li>Equal parts Sour Mix & Sprite</li>
                </ul>
              </div>
              <div className="instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Add all liquors to big cup</li>
                  <li>Fill with equal parts sour mix and sprite</li>
                  <li>Stir gently</li>
                  <li>Serve with straw</li>
                </ol>
              </div>
            </div>

            {/* Tokyo Tea */}
            <div className="cocktail-card">
              <h5>Tokyo Tea</h5>
              <div className="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>½ oz Vodka</li>
                  <li>½ oz Gin</li>
                  <li>½ oz Rum</li>
                  <li>½ oz Tequila</li>
                  <li>½ oz Watermelon Pucker</li>
                  <li>Sour Mix & Sprite to fill</li>
                </ul>
              </div>
              <div className="instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Add all liquors to big cup</li>
                  <li>Fill with sour mix and sprite</li>
                  <li>Stir gently</li>
                  <li>Serve with straw</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add more cocktail sections here following the same pattern */}
    </div>
  );
}