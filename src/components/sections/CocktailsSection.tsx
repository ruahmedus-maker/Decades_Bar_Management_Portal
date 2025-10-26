import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the cocktail section color
const SECTION_COLOR = '#FF6B6B'; // Coral color for cocktails section
const SECTION_COLOR_RGB = '255, 107, 107';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - coral theme for cocktails
  const glowColors = [
    'linear-gradient(45deg, #FF6B6B, #FF8E8E, transparent)', // Coral red
    'linear-gradient(45deg, #FF9E6B, #FFB08E, transparent)', // Coral orange
    'linear-gradient(45deg, #FF6B9E, #FF8EBA, transparent)', // Coral pink
    'linear-gradient(45deg, #FF8E6B, #FFAB8E, transparent)', // Coral peach
    'linear-gradient(45deg, #FF6B8E, #FF8EA8, transparent)', // Coral rose
    'linear-gradient(45deg, #FF6B7A, #FF8E9A, transparent)'  // Coral blush
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #FF8E8E, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(255, 107, 107, 0.1)' 
          : '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: glowColor,
          zIndex: 0,
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
                {items.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(237, 242, 247, 0.15)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Cocktail Card Component with Enhanced Glow Effects
function CocktailCard({ name, ingredients, instructions, index }: {
  name: string;
  ingredients: string[];
  instructions: string[];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Different colors for each cocktail card
  const cocktailColors = [
    'linear-gradient(45deg, #FF6B6B, transparent)', // Coral red
    'linear-gradient(45deg, #FF9E6B, transparent)', // Coral orange
    'linear-gradient(45deg, #FF6B9E, transparent)', // Coral pink
    'linear-gradient(45deg, #FF8E6B, transparent)'  // Coral peach
  ];

  const cocktailColor = cocktailColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`;

  return (
    <div 
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        backdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        WebkitBackdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Individual Cocktail Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: cocktailColor,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          color: isHovered ? SECTION_COLOR : 'white',
          marginBottom: '15px',
          fontSize: '1.1rem',
          fontWeight: 600,
          borderBottom: `1px solid ${isHovered ? `rgba(${SECTION_COLOR_RGB}, 0.6)` : `rgba(${SECTION_COLOR_RGB}, 0.3)`}`,
          paddingBottom: '8px',
          transition: 'all 0.3s ease',
          textShadow: isHovered ? `0 0 10px rgba(${SECTION_COLOR_RGB}, 0.3)` : 'none'
        }}>
          {name}
        </h5>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Ingredients:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {ingredients.map((ingredient, idx) => (
              <li key={idx} style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '4px', 
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px',
            marginTop: '15px'
          }}>
            Instructions:
          </div>
          <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {instructions.map((instruction, idx) => (
              <li key={idx} style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '4px', 
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// Category Card Component with Glow Effects
function CocktailCategoryCard({ category, index }: { 
  category: { 
    title: string; 
    cocktails: Array<{ 
      name: string; 
      ingredients: string[]; 
      instructions: string[]; 
    }>; 
  };
  index: number;
}) {
  return (
    <AnimatedCard
      title={category.title}
      index={index}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {category.cocktails.map((cocktail, cocktailIndex) => (
          <CocktailCard
            key={cocktailIndex}
            name={cocktail.name}
            ingredients={cocktail.ingredients}
            instructions={cocktail.instructions}
            index={cocktailIndex}
          />
        ))}
      </div>
    </AnimatedCard>
  );
}

export default function CocktailsSection() {
  const { currentUser } = useApp();
  const [isMainHovered, setIsMainHovered] = useState(false);

  // Track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'cocktails');
    }
  }, [currentUser]);

  // Cocktail data
  const cocktailCategories = [
    {
      title: 'Long Island Variations',
      cocktails: [
        {
          name: 'Long Island Iced Tea (L.I.T)',
          ingredients: [
            '½ oz Vodka',
            '½ oz Gin',
            '½ oz Rum',
            '½ oz Tequila',
            '½ oz Triple Sec',
            'Equal parts Sour Mix & Coke'
          ],
          instructions: [
            'Add all liquors to big cup',
            'Fill with equal parts sour mix and coke',
            'Stir gently',
            'Serve with straw'
          ]
        },
        {
          name: 'Long Beach',
          ingredients: [
            '½ oz Vodka',
            '½ oz Gin',
            '½ oz Rum',
            '½ oz Tequila',
            '½ oz Triple Sec',
            'Equal parts Sour Mix & Cranberry'
          ],
          instructions: [
            'Add all liquors to big cup',
            'Fill with equal parts sour mix and cranberry',
            'Stir gently',
            'Serve with straw'
          ]
        },
        {
          name: 'AMF (Blue Motorcycle)',
          ingredients: [
            '½ oz Vodka',
            '½ oz Gin',
            '½ oz Rum',
            '½ oz Tequila',
            '½ oz Blue Curaçao',
            'Equal parts Sour Mix & Sprite'
          ],
          instructions: [
            'Add all liquors to big cup',
            'Fill with equal parts sour mix and sprite',
            'Stir gently',
            'Serve with straw'
          ]
        },
        {
          name: 'Tokyo Tea',
          ingredients: [
            '½ oz Vodka',
            '½ oz Gin',
            '½ oz Rum',
            '½ oz Tequila',
            '½ oz Watermelon Pucker',
            'Sour Mix & Sprite to fill'
          ],
          instructions: [
            'Add all liquors to big cup',
            'Fill with sour mix and sprite',
            'Stir gently',
            'Serve with straw'
          ]
        }
      ]
    }
    // Additional categories can be added here
  ];

  return (
    <div 
      id="cocktails"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Cocktail Recipe Database
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Professional recipes and instructions for all classic cocktails
          </p>
        </div>
        <span style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          29 Recipes
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="🍸 Decades Cocktail Mastery"
          description="Master the art of mixology with Decades' signature cocktails and classic preparations. Each recipe is crafted for excellence in high-volume nightclub service."
          items={[
            'Signature Decades cocktails',
            'Classic drink preparations', 
            'Seasonal specials',
            'Garnishing & presentation guides'
          ]}
          footer={{ left: '50+ recipes', right: '✨ Mixology' }}
          index={0}
        />

        {/* Cocktail Categories */}
        {cocktailCategories.map((category, categoryIndex) => (
          <CocktailCategoryCard
            key={categoryIndex}
            category={category}
            index={categoryIndex + 1}
          />
        ))}

        {/* Tips Section */}
        <AnimatedCard
          title="🎯 Mixology Tips & Best Practices"
          index={5}
        >
          <ul style={{ 
            marginBottom: 0, 
            paddingLeft: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6
          }}>
            <li>Always use fresh ingredients when possible</li>
            <li>Measure accurately for consistent results</li>
            <li>Shake cocktails with ice for proper dilution and chilling</li>
            <li>Stir spirit-forward cocktails to maintain clarity</li>
            <li>Garnish appropriately for presentation</li>
            <li>Keep your workstation clean and organized</li>
            <li>Practice efficient pouring techniques for high-volume service</li>
          </ul>
        </AnimatedCard>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}