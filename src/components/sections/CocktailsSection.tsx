import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the cocktail section color
const SECTION_COLOR = '#FF6B6B'; // Coral color for cocktails section
const SECTION_COLOR_RGB = '255, 107, 107';

// Simplified Card Component without hover effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
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

// Cocktail Card Component without hover effects
function CocktailCard({ name, ingredients, instructions, index }: {
  name: string;
  ingredients: string[];
  instructions: string[];
  index: number;
}) {
  // Different colors for each cocktail card
  const cocktailColors = [
    'rgba(255, 107, 107, 0.1)', // Coral red
    'rgba(255, 158, 107, 0.1)', // Coral orange
    'rgba(255, 107, 158, 0.1)', // Coral pink
    'rgba(255, 142, 107, 0.1)'  // Coral peach
  ];

  const cocktailColor = cocktailColors[index] || `rgba(255, 107, 107, 0.1)`;

  return (
    <div 
      style={{
        textAlign: 'left',
        padding: '20px',
        background: cocktailColor,
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          color: 'white',
          marginBottom: '15px',
          fontSize: '1.1rem',
          fontWeight: 600,
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          paddingBottom: '8px'
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

// Category Tab Component WITH Hover Effects
function CategoryTab({ category, isActive, onClick, index }: { 
  category: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for category tabs
  const glowColors = [
    'linear-gradient(45deg, #FF6B6B, #FF8E8E, transparent)',
    'linear-gradient(45deg, #FF9E6B, #FFB08E, transparent)',
    'linear-gradient(45deg, #FF6B9E, #FF8EBA, transparent)',
    'linear-gradient(45deg, #FF8E6B, #FFAB8E, transparent)',
    'linear-gradient(45deg, #FF6B8E, #FF8EA8, transparent)',
    'linear-gradient(45deg, #FF6B7A, #FF8E9A, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #FF8E8E, transparent)`;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 20px',
        background: isActive 
          ? `rgba(${SECTION_COLOR_RGB}, 0.3)` 
          : isHovered 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.08)',
        border: isActive 
          ? `2px solid rgba(${SECTION_COLOR_RGB}, 0.6)` 
          : isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '10px',
        color: isActive ? SECTION_COLOR : 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored Glow Effect for active or hovered tabs */}
      {(isActive || isHovered) && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '12px',
          background: glowColor,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <span style={{ position: 'relative', zIndex: 1 }}>
        {category}
      </span>
    </button>
  );
}

export default function CocktailsSection() {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'cocktails', 30);
      console.log('Section auto-completed after 30 seconds');
    }, 30000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  // Updated cocktailCategories array with 50+ recipes per category
const cocktailCategories = [
  {
    title: 'Long Island Variations',
    cocktails: [
      {
        name: 'Long Island Iced Tea (L.I.T)',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Long Beach',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Equal parts Sour Mix & Cranberry'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and cranberry', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'AMF (Blue Motorcycle)',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Blue Curaçao', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Tokyo Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Watermelon Pucker', 'Sour Mix & Sprite to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with sour mix and sprite', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Electric Iced Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', '½ oz Blue Curaçao', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Garnish with lemon wedge']
      },
      {
        name: 'Miami Iced Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Splash of Peach Schnapps', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Garnish with lime wedge']
      },
      {
        name: 'California Iced Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Splash of Midori', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Garnish with cherry']
      },
      {
        name: 'Texas Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Splash of Whiskey', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Adios Motherf***er',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Blue Curaçao', '½ oz Triple Sec', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Grateful Dead',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Chambord', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Garnish with lime']
      },
      {
        name: 'Gator Aid',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Melon Liqueur', 'Equal parts Sour Mix & Sprite'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and sprite', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Gin Long Island',
        ingredients: ['1 oz Gin', '½ oz Vodka', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Garnish with lemon']
      },
      {
        name: 'Vodka Long Island',
        ingredients: ['1 oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Serve with straw']
      },
      {
        name: 'Rum Long Island',
        ingredients: ['1 oz Rum', '½ oz Vodka', '½ oz Gin', '½ oz Tequila', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Garnish with lime']
      },
      {
        name: 'Tequila Long Island',
        ingredients: ['1 oz Tequila', '½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Triple Sec', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Stir gently', 'Salt rim optional']
      },
      {
        name: 'Long Island with a Splash',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Splash of Cranberry', 'Equal parts Sour Mix & Coke'],
        instructions: ['Add all liquors to big cup', 'Fill with equal parts sour mix and coke', 'Add splash of cranberry', 'Stir gently']
      },
      {
        name: 'Long Island with Red Bull',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Red Bull to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with Red Bull', 'Stir gently', 'Serve immediately']
      },
      {
        name: 'Long Island Lemonade',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Lemonade to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with lemonade', 'Stir gently', 'Garnish with lemon wedge']
      },
      {
        name: 'Long Island Sweet Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Sweet Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with sweet tea', 'Stir gently', 'Garnish with lemon']
      },
      {
        name: 'Long Island Arnold Palmer',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Half Lemonade Half Sweet Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with half lemonade half sweet tea', 'Stir gently', 'Garnish with lemon']
      },
      {
        name: 'Long Island with Pineapple',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Pineapple Juice to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with pineapple juice', 'Stir gently', 'Garnish with pineapple wedge']
      },
      {
        name: 'Long Island with Orange Juice',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Orange Juice to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with orange juice', 'Stir gently', 'Garnish with orange slice']
      },
      {
        name: 'Long Island with Grapefruit',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Grapefruit Juice to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with grapefruit juice', 'Stir gently', 'Garnish with grapefruit wedge']
      },
      {
        name: 'Long Island with Apple Juice',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Apple Juice to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with apple juice', 'Stir gently', 'Garnish with apple slice']
      },
      {
        name: 'Long Island with Ginger Ale',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Ginger Ale to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with ginger ale', 'Stir gently', 'Garnish with lime']
      },
      {
        name: 'Long Island with Club Soda',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Club Soda to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with club soda', 'Stir gently', 'Low-calorie option']
      },
      {
        name: 'Long Island with Energy Drink',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Monster/Red Bull to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with energy drink', 'Stir gently', 'Serve immediately']
      },
      {
        name: 'Long Island with Coconut Water',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Coconut Water to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with coconut water', 'Stir gently', 'Hydrating option']
      },
      {
        name: 'Long Island with Green Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Green Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with green tea', 'Stir gently', 'Antioxidant boost']
      },
      {
        name: 'Long Island with Hibiscus Tea',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Hibiscus Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with hibiscus tea', 'Stir gently', 'Floral notes']
      },
      {
        name: 'Long Island with Chai',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Chai Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with chai tea', 'Stir gently', 'Spiced variation']
      },
      {
        name: 'Long Island with Horchata',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Horchata to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with horchata', 'Stir gently', 'Creamy variation']
      },
      {
        name: 'Long Island with Matcha',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Matcha Green Tea to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with matcha tea', 'Stir gently', 'Energy boost']
      },
      {
        name: 'Long Island with Yerba Mate',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Yerba Mate to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with yerba mate', 'Stir gently', 'South American twist']
      },
      {
        name: 'Long Island with Kombucha',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Kombucha to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with kombucha', 'Stir gently', 'Probiotic option']
      },
      {
        name: 'Long Island with Cold Brew',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Cold Brew Coffee to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with cold brew', 'Stir gently', 'Coffee variation']
      },
      {
        name: 'Long Island with Espresso',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Fresh Espresso to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with espresso', 'Stir gently', 'Strong coffee kick']
      },
      {
        name: 'Long Island with Chocolate Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Chocolate Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with chocolate milk', 'Stir gently', 'Dessert variation']
      },
      {
        name: 'Long Island with Almond Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Almond Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with almond milk', 'Stir gently', 'Dairy-free option']
      },
      {
        name: 'Long Island with Oat Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Oat Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with oat milk', 'Stir gently', 'Creamy dairy-free']
      },
      {
        name: 'Long Island with Coconut Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Coconut Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with coconut milk', 'Stir gently', 'Tropical creamy']
      },
      {
        name: 'Long Island with Soy Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Soy Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with soy milk', 'Stir gently', 'Plant-based option']
      },
      {
        name: 'Long Island with Rice Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Rice Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with rice milk', 'Stir gently', 'Light dairy-free']
      },
      {
        name: 'Long Island with Hemp Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Hemp Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with hemp milk', 'Stir gently', 'Nutty flavor']
      },
      {
        name: 'Long Island with Cashew Milk',
        ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', 'Cashew Milk to fill'],
        instructions: ['Add all liquors to big cup', 'Fill with cashew milk', 'Stir gently', 'Creamy plant-based']
      }
    ]
  },
  {
    title: 'Bombs',
    cocktails: [
      {
        name: 'Jäger Bomb',
        ingredients: ['1 oz Jägermeister', 'Red Bull'],
        instructions: ['Pour Jägermeister into shot glass', 'Drop shot into half glass of Red Bull', 'Drink immediately']
      },
      {
        name: 'Vegas Bomb',
        ingredients: ['½ oz Crown Royal', '½ oz Peach Schnapps', '½ oz Cranberry Juice', 'Red Bull'],
        instructions: ['Layer Crown Royal, peach schnapps, and cranberry in shot glass', 'Drop into half glass of Red Bull', 'Drink immediately']
      },
      {
        name: 'Jameson Bomb',
        ingredients: ['1 oz Jameson Irish Whiskey', 'Irish Red Ale'],
        instructions: ['Pour Jameson into shot glass', 'Drop shot into half glass of Irish red ale', 'Drink immediately']
      },
      {
        name: 'Fireball Bomb',
        ingredients: ['1 oz Fireball Cinnamon Whisky', 'Apple Cider'],
        instructions: ['Pour Fireball into shot glass', 'Drop shot into half glass of apple cider', 'Drink immediately']
      },
      {
        name: 'Washington Apple Bomb',
        ingredients: ['½ oz Crown Royal', '½ oz Sour Apple Schnapps', 'Cranberry Juice'],
        instructions: ['Layer Crown Royal and sour apple in shot glass', 'Drop into half glass of cranberry juice', 'Drink immediately']
      },
      {
        name: 'Jolly Rancher Bomb',
        ingredients: ['½ oz Vodka', '½ oz Watermelon Schnapps', '½ oz Sour Apple Schnapps', 'Cranberry Juice'],
        instructions: ['Mix liquors in shot glass', 'Drop into half glass of cranberry juice', 'Drink immediately']
      },
      {
        name: 'Pineapple Bomb',
        ingredients: ['½ oz Malibu Rum', '½ oz Vodka', 'Pineapple Juice'],
        instructions: ['Mix Malibu and vodka in shot glass', 'Drop into half glass of pineapple juice', 'Drink immediately']
      },
      {
        name: 'Caribou Bomb',
        ingredients: ['½ oz Canadian Whisky', '½ oz Coffee Liqueur', '½ oz Cream', 'Cola'],
        instructions: ['Layer whisky, coffee liqueur, and cream in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      },
      {
        name: 'Irish Car Bomb',
        ingredients: ['½ oz Irish Cream', '½ oz Irish Whiskey', 'Guinness Stout'],
        instructions: ['Layer Irish cream and whiskey in shot glass', 'Drop into half glass of Guinness', 'Drink immediately']
      },
      {
        name: 'Flaming Dr. Pepper',
        ingredients: ['½ oz Amaretto', '½ oz 151 Proof Rum', 'Beer'],
        instructions: ['Layer amaretto and 151 rum in shot glass', 'Ignite the rum', 'Drop into half glass of beer', 'Extinguish and drink']
      },
      {
        name: 'Scooby Snack Bomb',
        ingredients: ['½ oz Malibu Rum', '½ oz Midori', '½ oz Pineapple Juice', 'Cream'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass with cream', 'Drink immediately']
      },
      {
        name: 'Jelly Bean Bomb',
        ingredients: ['½ oz Blackberry Brandy', '½ oz Anisette', 'Sour Mix'],
        instructions: ['Layer brandy and anisette in shot glass', 'Drop into half glass of sour mix', 'Drink immediately']
      },
      {
        name: 'Atomic Bomb',
        ingredients: ['½ oz Vodka', '½ oz Rum', '½ oz Tequila', '½ oz Gin', 'Energy Drink'],
        instructions: ['Mix all liquors in shot glass', 'Drop into half glass of energy drink', 'Drink immediately']
      },
      {
        name: 'B-52 Bomb',
        ingredients: ['½ oz Kahlúa', '½ oz Baileys', '½ oz Grand Marnier', 'Coffee'],
        instructions: ['Layer liqueurs in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'Mind Eraser Bomb',
        ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', '½ oz Club Soda'],
        instructions: ['Layer vodka and coffee liqueur in shot glass', 'Drop into half glass of club soda', 'Drink immediately']
      },
      {
        name: 'Tequila Bomb',
        ingredients: ['1 oz Tequila', 'Lager Beer'],
        instructions: ['Pour tequila into shot glass', 'Drop shot into half glass of lager', 'Drink immediately']
      },
      {
        name: 'Cement Mixer Bomb',
        ingredients: ['½ oz Irish Cream', '½ oz Lime Juice'],
        instructions: ['Layer Irish cream and lime juice in shot glass', 'Drop into empty glass', 'Let curdle then drink']
      },
      {
        name: 'Buttery Nipple Bomb',
        ingredients: ['½ oz Butterscotch Schnapps', '½ oz Irish Cream', 'Milk'],
        instructions: ['Layer schnapps and Irish cream in shot glass', 'Drop into half glass of milk', 'Drink immediately']
      },
      {
        name: 'Screaming Orgasm Bomb',
        ingredients: ['½ oz Vodka', '½ oz Amaretto', '½ oz Coffee Liqueur', '½ oz Irish Cream', 'Milk'],
        instructions: ['Mix all liquors in shot glass', 'Drop into half glass of milk', 'Drink immediately']
      },
      {
        name: 'Purple Hooter Bomb',
        ingredients: ['½ oz Vodka', '½ oz Raspberry Liqueur', '½ oz Sour Mix', 'Lemon-Lime Soda'],
        instructions: ['Mix vodka and raspberry liqueur in shot glass', 'Drop into half glass of sour mix and soda', 'Drink immediately']
      },
      {
        name: 'Lemon Drop Bomb',
        ingredients: ['½ oz Vodka', '½ oz Triple Sec', '½ oz Lemon Juice', 'Lemon-Lime Soda'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of soda', 'Drink immediately']
      },
      {
        name: 'Cinnamon Toast Bomb',
        ingredients: ['½ oz Fireball', '½ oz RumChata', 'Apple Cider'],
        instructions: ['Layer Fireball and RumChata in shot glass', 'Drop into half glass of apple cider', 'Drink immediately']
      },
      {
        name: 'Caramel Apple Bomb',
        ingredients: ['½ oz Butterscotch Schnapps', '½ oz Sour Apple Schnapps', 'Apple Juice'],
        instructions: ['Layer schnapps in shot glass', 'Drop into half glass of apple juice', 'Drink immediately']
      },
      {
        name: 'Chocolate Cake Bomb',
        ingredients: ['½ oz Vodka', '½ oz Frangelico', '½ oz Lemon Juice', 'Sugar rim'],
        instructions: ['Rim shot glass with sugar', 'Mix ingredients in shot glass', 'Drop into empty glass', 'Drink immediately']
      },
      {
        name: 'Birthday Cake Bomb',
        ingredients: ['½ oz Vanilla Vodka', '½ oz Cake Liqueur', '½ oz Cream', 'Sparkling Wine'],
        instructions: ['Mix vodka and cake liqueur in shot glass', 'Drop into half glass of sparkling wine and cream', 'Drink immediately']
      },
      {
        name: 'Pumpkin Pie Bomb',
        ingredients: ['½ oz Vanilla Vodka', '½ oz Pumpkin Liqueur', '½ oz Cream', 'Ginger Ale'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of ginger ale', 'Drink immediately']
      },
      {
        name: 'Key Lime Pie Bomb',
        ingredients: ['½ oz Vanilla Vodka', '½ oz Lime Juice', '½ oz Cream', 'Lemon-Lime Soda'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of soda', 'Drink immediately']
      },
      {
        name: 'Banana Split Bomb',
        ingredients: ['½ oz Banana Liqueur', '½ oz Chocolate Liqueur', '½ oz Cream', 'Cola'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      },
      {
        name: 'Strawberry Shortcake Bomb',
        ingredients: ['½ oz Strawberry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream', 'Lemon-Lime Soda'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of soda', 'Drink immediately']
      },
      {
        name: 'Blueberry Muffin Bomb',
        ingredients: ['½ oz Blueberry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream', 'Lemon-Lime Soda'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of soda', 'Drink immediately']
      },
      {
        name: 'Coconut Cream Pie Bomb',
        ingredients: ['½ oz Coconut Rum', '½ oz Vanilla Vodka', '½ oz Cream', 'Pineapple Juice'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of pineapple juice', 'Drink immediately']
      },
      {
        name: 'Peach Cobbler Bomb',
        ingredients: ['½ oz Peach Schnapps', '½ oz Vanilla Vodka', '½ oz Cream', 'Ginger Ale'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of ginger ale', 'Drink immediately']
      },
      {
        name: 'Apple Pie Bomb',
        ingredients: ['½ oz Apple Schnapps', '½ oz Cinnamon Schnapps', '½ oz Cream', 'Apple Cider'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of apple cider', 'Drink immediately']
      },
      {
        name: 'Cherry Cheesecake Bomb',
        ingredients: ['½ oz Cherry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream', 'Lemon-Lime Soda'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of soda', 'Drink immediately']
      },
      {
        name: 'Mocha Bomb',
        ingredients: ['½ oz Coffee Liqueur', '½ oz Chocolate Liqueur', '½ oz Cream', 'Coffee'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'White Russian Bomb',
        ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', '½ oz Cream', 'Cola'],
        instructions: ['Layer vodka, coffee liqueur, and cream in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      },
      {
        name: 'Black Russian Bomb',
        ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', 'Cola'],
        instructions: ['Mix vodka and coffee liqueur in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      },
      {
        name: 'Espresso Bomb',
        ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', 'Fresh Espresso'],
        instructions: ['Mix vodka and coffee liqueur in shot glass', 'Drop into half glass of espresso', 'Drink immediately']
      },
      {
        name: 'Cappuccino Bomb',
        ingredients: ['½ oz Coffee Liqueur', '½ oz Irish Cream', '½ oz Cream', 'Coffee'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'Caramel Macchiato Bomb',
        ingredients: ['½ oz Caramel Liqueur', '½ oz Coffee Liqueur', '½ oz Cream', 'Coffee'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'Vanilla Latte Bomb',
        ingredients: ['½ oz Vanilla Vodka', '½ oz Coffee Liqueur', '½ oz Cream', 'Coffee'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'Hazelnut Bomb',
        ingredients: ['½ oz Hazelnut Liqueur', '½ oz Coffee Liqueur', '½ oz Cream', 'Coffee'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass of coffee', 'Drink immediately']
      },
      {
        name: 'Almond Joy Bomb',
        ingredients: ['½ oz Amaretto', '½ oz Coconut Rum', '½ oz Chocolate Liqueur', 'Cream'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass with cream', 'Drink immediately']
      },
      {
        name: 'Snickers Bomb',
        ingredients: ['½ oz Caramel Liqueur', '½ oz Chocolate Liqueur', '½ oz Peanut Liqueur', 'Cream'],
        instructions: ['Layer liqueurs and cream in shot glass', 'Drop into half glass with cream', 'Drink immediately']
      },
      {
        name: 'Reese\'s Bomb',
        ingredients: ['½ oz Chocolate Liqueur', '½ oz Peanut Butter Whiskey', '½ oz Cream', 'Cola'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      },
      {
        name: 'Twix Bomb',
        ingredients: ['½ oz Caramel Liqueur', '½ oz Chocolate Liqueur', '½ oz Vanilla Vodka', 'Cream'],
        instructions: ['Layer liqueurs and vodka in shot glass', 'Drop into half glass with cream', 'Drink immediately']
      },
      {
        name: 'Oreo Bomb',
        ingredients: ['½ oz Chocolate Liqueur', '½ oz Vanilla Vodka', '½ oz Cream', 'Cola'],
        instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of cola', 'Drink immediately']
      }
    ]
  },
  {
    title: 'Trending Cocktails',
    cocktails: [
      {
        name: 'Espresso Martini',
        ingredients: ['2 oz Vodka', '1 oz Coffee Liqueur', '1 oz Fresh Espresso', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake vigorously with ice', 'Strain into chilled martini glass', 'Garnish with coffee beans']
      },
      {
        name: 'Aperol Spritz',
        ingredients: ['3 oz Prosecco', '2 oz Aperol', '1 oz Club Soda', 'Orange slice'],
        instructions: ['Add ice to wine glass', 'Add Aperol and prosecco', 'Top with club soda', 'Garnish with orange slice']
      },
      {
        name: 'Negroni Sbagliato',
        ingredients: ['1 oz Campari', '1 oz Sweet Vermouth', 'Prosecco to top'],
        instructions: ['Add Campari and vermouth to rocks glass', 'Fill with ice', 'Top with prosecco', 'Garnish with orange twist']
      },
      {
        name: 'Paper Plane',
        ingredients: ['¾ oz Bourbon', '¾ oz Aperol', '¾ oz Amaro Nonino', '¾ oz Lemon Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass', 'No garnish']
      },
      {
        name: 'French 75',
        ingredients: ['1 oz Gin', '½ oz Lemon Juice', '½ oz Simple Syrup', 'Champagne to top'],
        instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into champagne flute', 'Top with champagne']
      },
      {
        name: 'Paloma',
        ingredients: ['2 oz Tequila', '½ oz Lime Juice', 'Grapefruit Soda to top', 'Salt rim'],
        instructions: ['Rim glass with salt', 'Add tequila and lime juice', 'Fill with ice and top with grapefruit soda', 'Stir gently']
      },
      {
        name: 'Moscow Mule',
        ingredients: ['2 oz Vodka', '½ oz Lime Juice', 'Ginger Beer to top', 'Lime wedge'],
        instructions: ['Add vodka and lime juice to copper mug', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
      },
      {
        name: 'Old Fashioned',
        ingredients: ['2 oz Bourbon', '1 Sugar Cube', '2 dashes Angostura Bitters', 'Orange twist'],
        instructions: ['Muddle sugar cube with bitters', 'Add bourbon and ice', 'Stir gently', 'Garnish with orange twist']
      },
      {
        name: 'Whiskey Sour',
        ingredients: ['2 oz Bourbon', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Egg White'],
        instructions: ['Dry shake all ingredients first', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
      },
      {
        name: 'Mai Tai',
        ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Orange Curaçao', '¼ oz Orgeat Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with mint']
      },
      {
        name: 'Pina Colada',
        ingredients: ['2 oz White Rum', '2 oz Coconut Cream', '4 oz Pineapple Juice', '½ cup Crushed Ice'],
        instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into hurricane glass', 'Garnish with pineapple wedge']
      },
      {
        name: 'Mojito',
        ingredients: ['2 oz White Rum', '1 oz Lime Juice', '2 tsp Sugar', '6-8 Mint Leaves', 'Club Soda'],
        instructions: ['Muddle mint with sugar and lime juice', 'Add rum and ice', 'Top with club soda', 'Garnish with mint sprig']
      },
      {
        name: 'Daiquiri',
        ingredients: ['2 oz White Rum', '1 oz Lime Juice', '¾ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with lime wheel']
      },
      {
        name: 'Margarita',
        ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', 'Salt rim'],
        instructions: ['Rim glass with salt', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass']
      },
      {
        name: 'Cosmopolitan',
        ingredients: ['1½ oz Citrus Vodka', '1 oz Cointreau', '½ oz Lime Juice', '1 oz Cranberry Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with lime wheel']
      },
      {
        name: 'Manhattan',
        ingredients: ['2 oz Rye Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Cherry'],
        instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
      },
      {
        name: 'Gin & Tonic',
        ingredients: ['2 oz Gin', 'Tonic Water to top', 'Lime wedge'],
        instructions: ['Add gin to highball glass', 'Fill with ice', 'Top with tonic water', 'Garnish with lime wedge']
      },
      {
        name: 'Tom Collins',
        ingredients: ['2 oz Gin', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda'],
        instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into collins glass over ice', 'Top with club soda']
      },
      {
        name: 'Singapore Sling',
        ingredients: ['1½ oz Gin', '½ oz Cherry Brandy', '¼ oz Cointreau', '¼ oz Benedictine', '4 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Garnish with cherry and pineapple']
      },
      {
        name: 'Porn Star Martini',
        ingredients: ['2 oz Vanilla Vodka', '1 oz Passion Fruit Purée', '½ oz Lime Juice', '½ oz Simple Syrup', 'Prosecco sidecar'],
        instructions: ['Add all ingredients except prosecco to shaker', 'Shake with ice', 'Strain into martini glass', 'Serve with prosecco shot']
      },
      {
        name: 'Boulevardier',
        ingredients: ['1½ oz Bourbon', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist'],
        instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
      },
      {
        name: 'White Lady',
        ingredients: ['2 oz Gin', '1 oz Cointreau', '¾ oz Lemon Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'No garnish']
      },
      {
        name: 'Aviation',
        ingredients: ['2 oz Gin', '½ oz Maraschino Liqueur', '¼ oz Crème de Violette', '¾ oz Lemon Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
      },
      {
        name: 'Last Word',
        ingredients: ['¾ oz Gin', '¾ oz Green Chartreuse', '¾ oz Maraschino Liqueur', '¾ oz Lime Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'No garnish']
      },
      {
        name: 'Corpse Reviver #2',
        ingredients: ['¾ oz Gin', '¾ oz Cointreau', '¾ oz Lillet Blanc', '¾ oz Lemon Juice', 'Absinthe rinse'],
        instructions: ['Rinse glass with absinthe', 'Add remaining ingredients to shaker', 'Shake with ice', 'Strain into coupe glass']
      },
      {
        name: 'Vieux Carré',
        ingredients: ['1 oz Rye Whiskey', '1 oz Cognac', '1 oz Sweet Vermouth', '¼ oz Benedictine', '2 dashes Peychaud\'s Bitters', '2 dashes Angostura Bitters'],
        instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
      },
      {
        name: 'Sazerac',
        ingredients: ['2 oz Rye Whiskey', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist'],
        instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add whiskey and ice', 'Stir and strain', 'Garnish with lemon twist']
      },
      {
        name: 'Mint Julep',
        ingredients: ['2½ oz Bourbon', '8-10 Mint Leaves', '½ oz Simple Syrup', 'Crushed Ice'],
        instructions: ['Muddle mint with simple syrup', 'Add bourbon and crushed ice', 'Stir until frost forms', 'Garnish with mint sprig']
      },
      {
        name: 'Dark & Stormy',
        ingredients: ['2 oz Dark Rum', 'Ginger Beer to top', 'Lime wedge'],
        instructions: ['Add rum to highball glass', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
      },
      {
        name: 'Cuba Libre',
        ingredients: ['2 oz White Rum', 'Coca-Cola to top', '½ oz Lime Juice'],
        instructions: ['Add rum and lime juice to highball glass', 'Fill with ice', 'Top with Coca-Cola', 'Stir gently']
      },
      {
        name: 'Caipirinha',
        ingredients: ['2 oz Cachaça', '1 Lime cut into wedges', '2 tsp Sugar'],
        instructions: ['Muddle lime wedges with sugar', 'Add cachaça and ice', 'Stir well', 'Serve with muddled lime']
      },
      {
        name: 'Pisco Sour',
        ingredients: ['2 oz Pisco', '1 oz Lime Juice', '¾ oz Simple Syrup', '½ oz Egg White', 'Angostura bitters'],
        instructions: ['Dry shake all ingredients first', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
      },
      {
        name: 'Mimosa',
        ingredients: ['3 oz Champagne', '2 oz Orange Juice'],
        instructions: ['Add orange juice to champagne flute', 'Top with champagne', 'Stir gently', 'No garnish']
      },
      {
        name: 'Bellini',
        ingredients: ['3 oz Prosecco', '2 oz Peach Purée'],
        instructions: ['Add peach purée to champagne flute', 'Top with prosecco', 'Stir gently', 'No garnish']
      },
      {
        name: 'Kir Royale',
        ingredients: ['4 oz Champagne', '½ oz Crème de Cassis'],
        instructions: ['Add crème de cassis to champagne flute', 'Top with champagne', 'Stir gently', 'No garnish']
      },
      {
        name: 'French Martini',
        ingredients: ['2 oz Vodka', '1 oz Raspberry Liqueur', '1 oz Pineapple Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'No garnish']
      },
      {
        name: 'Lemon Drop Martini',
        ingredients: ['2 oz Vodka', '1 oz Triple Sec', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Sugar rim'],
        instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into martini glass']
      },
      {
        name: 'Appletini',
        ingredients: ['2 oz Vodka', '1 oz Sour Apple Schnapps', '½ oz Lime Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with apple slice']
      },
      {
        name: 'Chocolate Martini',
        ingredients: ['2 oz Vodka', '1 oz Chocolate Liqueur', '½ oz Crème de Cacao', 'Chocolate shavings'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with chocolate shavings']
      },
      {
        name: 'Espresso Martini (Variant)',
        ingredients: ['1½ oz Vodka', '1 oz Coffee Liqueur', '1 oz Cold Brew Concentrate', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake vigorously with ice', 'Strain into chilled martini glass', 'Garnish with coffee beans']
      },
      {
        name: 'Smoked Old Fashioned',
        ingredients: ['2 oz Bourbon', '¼ oz Maple Syrup', '2 dashes Angostura Bitters', 'Orange twist', 'Smoke with wood chips'],
        instructions: ['Add bourbon, maple syrup, and bitters to glass', 'Smoke with wood chips', 'Add ice and stir', 'Garnish with orange twist']
      },
      {
        name: 'Watermelon Margarita',
        ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Watermelon Juice', 'Tajín rim'],
        instructions: ['Rim glass with Tajín', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
      },
      {
        name: 'Spicy Margarita',
        ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', '2-3 Jalapeño slices'],
        instructions: ['Muddle jalapeño in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into salt-rimmed glass']
      },
      {
        name: 'Cucumber Gin & Tonic',
        ingredients: ['2 oz Gin', 'Tonic Water to top', '4-5 Cucumber slices', 'Lime wedge'],
        instructions: ['Muddle cucumber in glass', 'Add gin and ice', 'Top with tonic water', 'Garnish with lime wedge']
      },
      {
        name: 'Blackberry Bramble',
        ingredients: ['2 oz Gin', '1 oz Lemon Juice', '½ oz Simple Syrup', '½ oz Crème de Mûre', 'Blackberries'],
        instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over crushed ice', 'Drizzle crème de mûre and garnish with blackberries']
      },
      {
        name: 'Gin Basil Smash',
        ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '8-10 Basil Leaves'],
        instructions: ['Muddle basil in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into rocks glass over ice']
      }
    ]
  },
      {
    title: 'Tropical & Beach Cocktails',
    cocktails: [
      {
        name: 'Mai Tai',
        ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Orange Curaçao', '¼ oz Orgeat Syrup', '¼ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with mint sprig and lime wheel']
      },
      {
        name: 'Pina Colada',
        ingredients: ['2 oz White Rum', '2 oz Coconut Cream', '4 oz Pineapple Juice', '½ cup Crushed Ice'],
        instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into hurricane glass', 'Garnish with pineapple wedge and cherry']
      },
      {
        name: 'Blue Hawaiian',
        ingredients: ['1½ oz White Rum', '¾ oz Blue Curaçao', '2 oz Pineapple Juice', '1 oz Coconut Cream', '½ cup Crushed Ice'],
        instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into hurricane glass', 'Garnish with pineapple wedge']
      },
      {
        name: 'Zombie',
        ingredients: ['1½ oz Gold Rum', '1½ oz Dark Rum', '¾ oz Apricot Brandy', '1 oz Lime Juice', '1 oz Pineapple Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tiki mug over crushed ice', 'Garnish with mint sprig']
      },
      {
        name: 'Bahama Mama',
        ingredients: ['1 oz Dark Rum', '1 oz Coconut Rum', '1 oz Coffee Liqueur', '2 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over ice', 'Garnish with orange slice and cherry']
      },
      {
        name: 'Scorpion Bowl',
        ingredients: ['2 oz Light Rum', '1 oz Brandy', '1 oz Orange Juice', '1 oz Lemon Juice', '½ oz Orgeat Syrup', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Pour into scorpion bowl with crushed ice', 'Garnish with gardenia and mint']
      },
      {
        name: 'Navy Grog',
        ingredients: ['1 oz Light Rum', '1 oz Dark Rum', '1 oz Demerara Rum', '1 oz Grapefruit Juice', '½ oz Lime Juice', '½ oz Honey Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into double old fashioned glass over crushed ice', 'Garnish with mint sprig']
      },
      {
        name: 'Tradewinds',
        ingredients: ['1½ oz Gold Rum', '1 oz Apricot Brandy', '1 oz Lime Juice', '1 oz Coconut Cream', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to blender', 'Blend with crushed ice', 'Pour into highball glass', 'Garnish with lime wheel']
      },
      {
        name: 'Jet Pilot',
        ingredients: ['1 oz Dark Rum', '1 oz Gold Rum', '¾ oz Lime Juice', '½ oz Cinnamon Syrup', '½ oz Falernum', '2 dashes Absinthe'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tiki mug over crushed ice', 'Garnish with cinnamon stick']
      },
      {
        name: 'Three Dots and a Dash',
        ingredients: ['2 oz Aged Rum', '½ oz Allspice Dram', '½ oz Honey Syrup', '½ oz Lime Juice', '½ oz Orange Juice', '2 dashes Angostura Bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tall glass over crushed ice', 'Garnish with three cherries and pineapple spear']
      },
      {
        name: 'Saturn',
        ingredients: ['2 oz Gin', '½ oz Passion Fruit Syrup', '½ oz Lemon Juice', '¼ oz Orgeat Syrup', '¼ oz Velvet Falernum'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tall glass over crushed ice', 'Garnish with lemon wheel and cherry']
      },
      {
        name: 'Painkiller',
        ingredients: ['2 oz Dark Rum', '4 oz Pineapple Juice', '1 oz Orange Juice', '1 oz Coconut Cream', 'Fresh grated nutmeg'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Pour into tall glass over ice', 'Garnish with nutmeg']
      },
      {
        name: 'Jungle Bird',
        ingredients: ['1½ oz Dark Rum', '¾ oz Campari', '1½ oz Pineapple Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with pineapple leaf']
      },
      {
        name: 'Queen\'s Park Swizzle',
        ingredients: ['2 oz White Rum', '¾ oz Lime Juice', '¾ oz Simple Syrup', '8-10 Mint Leaves', 'Angostura bitters'],
        instructions: ['Muddle mint with lime and syrup', 'Add rum and crushed ice', 'Swizzle with swizzle stick', 'Top with bitters and mint sprig']
      },
      {
        name: 'Halekulani',
        ingredients: ['2 oz Light Rum', '½ oz Orange Curaçao', '½ oz Pineapple Juice', '½ oz Lemon Juice', '½ oz Orgeat Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass', 'Garnish with orchid']
      },
      {
        name: 'Shrunken Skull',
        ingredients: ['1½ oz Dark Rum', '1½ oz Cherry Heering', '½ oz Lime Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with lime wheel']
      },
      {
        name: 'Test Pilot',
        ingredients: ['1½ oz Dark Rum', '¾ oz Cointreau', '¾ oz Lime Juice', '½ oz Falernum', '2 dashes Absinthe', '2 dashes Angostura bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass', 'Garnish with lime twist']
      },
      {
        name: 'Port Light',
        ingredients: ['2 oz Bourbon', '1 oz Lemon Juice', '½ oz Honey Syrup', '½ oz Passion Fruit Syrup', 'Egg white'],
        instructions: ['Dry shake all ingredients', 'Shake with ice', 'Strain into rocks glass', 'Garnish with cherry']
      },
      {
        name: 'Humuhumunukunukuapua\'a',
        ingredients: ['1½ oz Light Rum', '½ oz Melon Liqueur', '½ oz Pineapple Juice', '½ oz Lime Juice', '½ oz Orgeat Syrup', '2 dashes Angostura bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tiki mug over crushed ice', 'Garnish with orchid and mint']
      },
      {
        name: 'Nui Nui',
        ingredients: ['2 oz Dark Rum', '½ oz Vanilla Syrup', '½ oz Cinnamon Syrup', '½ oz Lime Juice', '2 dashes Angostura bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into snifter over crushed ice', 'Garnish with cinnamon stick']
      },
      {
        name: 'Ancient Mariner',
        ingredients: ['2 oz Aged Rum', '1 oz Lime Juice', '½ oz Grapefruit Juice', '½ oz Simple Syrup', '½ oz Allspice Dram'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into double old fashioned glass over crushed ice', 'Garnish with lime wheel']
      },
      {
        name: 'Cobra\'s Fang',
        ingredients: ['2 oz Aged Rum', '½ oz Falernum', '½ oz Orange Juice', '½ oz Lime Juice', '½ oz Passion Fruit Syrup', '2 dashes Angostura bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tiki mug over crushed ice', 'Garnish with mint and cherry']
      },
      {
        name: 'Doctor Funk',
        ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Grenadine', '½ oz Simple Syrup', '¼ oz Absinthe', 'Soda water'],
        instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into tall glass over ice', 'Top with soda water']
      },
      {
        name: 'Kahiko Punch',
        ingredients: ['1½ oz Light Rum', '1½ oz Pineapple Juice', '¾ oz Lemon Juice', '½ oz Orgeat Syrup', '½ oz Orange Curaçao'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over crushed ice', 'Garnish with pineapple wedge']
      },
      {
        name: 'Menehune Madness',
        ingredients: ['1 oz Light Rum', '1 oz Dark Rum', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Passion Fruit Syrup', '½ oz Coconut Cream'],
        instructions: ['Add all ingredients to blender', 'Blend with crushed ice', 'Pour into tiki mug', 'Garnish with pineapple and cherry']
      },
      {
        name: 'Polynesian Paralysis',
        ingredients: ['1 oz Light Rum', '1 oz Dark Rum', '1 oz Pineapple Juice', '½ oz Orange Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over crushed ice', 'Garnish with orchid']
      },
      {
        name: 'Tiki Bowl',
        ingredients: ['2 oz Light Rum', '1 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice', '½ oz Orgeat Syrup', '½ oz Dark Rum float'],
        instructions: ['Add all ingredients except dark rum to shaker', 'Shake with ice', 'Pour into bowl over crushed ice', 'Float dark rum on top']
      },
      {
        name: 'Volcano Bowl',
        ingredients: ['1 oz Light Rum', '1 oz Dark Rum', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Orange Juice', '½ oz Passion Fruit Syrup', '151 rum for flame'],
        instructions: ['Add all ingredients except 151 to blender', 'Blend with ice', 'Pour into volcano bowl', 'Add 151 rum and ignite carefully']
      },
      {
        name: 'Tahitian Rum Punch',
        ingredients: ['2 oz Light Rum', '1 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Garnish with fruit skewer']
      },
      {
        name: 'Caribbean Cruise',
        ingredients: ['1½ oz Light Rum', '1 oz Coconut Rum', '2 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice', '½ oz Grenadine'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over ice', 'Garnish with orange slice']
      },
      {
        name: 'Island Breeze',
        ingredients: ['2 oz Light Rum', '1 oz Cranberry Juice', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Garnish with lime wheel']
      },
      {
        name: 'Tropical Storm',
        ingredients: ['1½ oz Dark Rum', '1 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice', '½ oz Passion Fruit Syrup', 'Splash of soda'],
        instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into tall glass over ice', 'Top with soda']
      },
      {
        name: 'Paradise Found',
        ingredients: ['2 oz White Rum', '1 oz Peach Schnapps', '2 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over crushed ice', 'Garnish with peach slice']
      },
      {
        name: 'Coconut Grove',
        ingredients: ['1½ oz Coconut Rum', '1½ oz Pineapple Juice', '1 oz Coconut Cream', '½ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to blender', 'Blend with ice', 'Pour into coconut shell or glass', 'Garnish with toasted coconut']
      },
      {
        name: 'Mango Tango',
        ingredients: ['2 oz Light Rum', '1 oz Mango Purée', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with mango slice']
      },
      {
        name: 'Passion Fruit Daiquiri',
        ingredients: ['2 oz White Rum', '1 oz Passion Fruit Purée', '¾ oz Lime Juice', '½ oz Simple Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass', 'Garnish with passion fruit']
      },
      {
        name: 'Guava Cooler',
        ingredients: ['2 oz Light Rum', '1½ oz Guava Juice', '½ oz Lime Juice', '½ oz Simple Syrup', 'Soda water'],
        instructions: ['Add rum, guava juice, lime, and syrup to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Top with soda']
      },
      {
        name: 'Banana Cabana',
        ingredients: ['1½ oz Light Rum', '1 oz Banana Liqueur', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Coconut Cream'],
        instructions: ['Add all ingredients to blender', 'Blend with ice', 'Pour into hurricane glass', 'Garnish with banana slice']
      },
      {
        name: 'Pineapple Express',
        ingredients: ['2 oz Gold Rum', '2 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Honey Syrup', '2 dashes Angostura bitters'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with pineapple wedge']
      },
      {
        name: 'Tropical Itch',
        ingredients: ['1½ oz Bourbon', '½ oz Light Rum', '1 oz Pineapple Juice', '½ oz Orange Juice', '½ oz Lime Juice', '½ oz Passion Fruit Syrup'],
        instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tall glass over ice', 'Garnish with backscratcher']
      },
      {
        name: 'Hawaiian Sunset',
        ingredients: ['2 oz Light Rum', '1 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Grenadine', '½ oz Lime Juice'],
        instructions: ['Add rum and juices to shaker', 'Shake with ice', 'Strain into hurricane glass', 'Slowly pour grenadine for sunset effect']
      },
      {
        name: 'Tiki Torch',
        ingredients: ['1½ oz Dark Rum', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Orgeat Syrup', '½ oz Falernum', '151 rum float'],
        instructions: ['Add all ingredients except 151 to shaker', 'Shake with ice', 'Strain into tiki mug', 'Float 151 rum on top']
      }
    ]
  },
    {
      title: 'Martinis & Classics',
      cocktails: [
        {
          name: 'Classic Martini',
          ingredients: [
            '2½ oz Gin',
            '½ oz Dry Vermouth',
            'Lemon twist or olive for garnish'
          ],
          instructions: [
            'Add gin and vermouth to mixing glass',
            'Stir with ice for 30 seconds',
            'Strain into chilled martini glass',
            'Garnish with lemon twist or olive'
          ]
        },
        {
          name: 'Cosmopolitan',
          ingredients: [
            '1½ oz Citrus Vodka',
            '1 oz Cointreau',
            '½ oz Lime Juice',
            '1 oz Cranberry Juice'
          ],
          instructions: [
            'Add all ingredients to shaker',
            'Shake with ice',
            'Strain into chilled martini glass',
            'Garnish with lime wheel'
          ]
        },
        {
          name: 'Manhattan',
          ingredients: [
            '2 oz Rye Whiskey',
            '1 oz Sweet Vermouth',
            '2 dashes Angostura Bitters',
            'Maraschino cherry for garnish'
          ],
          instructions: [
            'Add all ingredients to mixing glass',
            'Stir with ice for 30 seconds',
            'Strain into chilled coupe glass',
            'Garnish with cherry'
          ]
        },
        {
          name: 'Negroni',
          ingredients: [
            '1 oz Gin',
            '1 oz Campari',
            '1 oz Sweet Vermouth',
            'Orange twist for garnish'
          ],
          instructions: [
            'Add all ingredients to mixing glass',
            'Stir with ice',
            'Strain into rocks glass over ice',
            'Garnish with orange twist'
          ]
        },
        {
          name: 'Old Fashioned',
          ingredients: [
            '2 oz Bourbon',
            '1 Sugar Cube',
            '2 dashes Angostura Bitters',
            'Orange twist for garnish'
          ],
          instructions: [
            'Muddle sugar cube with bitters',
            'Add bourbon and ice',
            'Stir gently',
            'Garnish with orange twist'
          ]
        }
      ]
    },
    {
      title: 'Margaritas & Tequila',
      cocktails: [
        {
          name: 'Classic Margarita',
          ingredients: [
            '2 oz Tequila',
            '1 oz Lime Juice',
            '¾ oz Triple Sec',
            '½ oz Simple Syrup',
            'Salt for rim (optional)'
          ],
          instructions: [
            'Rim glass with salt if desired',
            'Add all ingredients to shaker',
            'Shake with ice',
            'Strain into glass over ice'
          ]
        },
        {
          name: 'Strawberry Margarita',
          ingredients: [
            '2 oz Tequila',
            '1 oz Lime Juice',
            '¾ oz Triple Sec',
            '4-5 Fresh Strawberries',
            '½ oz Simple Syrup'
          ],
          instructions: [
            'Muddle strawberries in shaker',
            'Add remaining ingredients',
            'Shake with ice',
            'Strain into salt-rimmed glass'
          ]
        },
        {
          name: 'Paloma',
          ingredients: [
            '2 oz Tequila',
            '½ oz Lime Juice',
            'Grapefruit Soda to top',
            'Salt for rim'
          ],
          instructions: [
            'Rim glass with salt',
            'Add tequila and lime juice',
            'Fill with ice and top with grapefruit soda',
            'Stir gently'
          ]
        },
        {
          name: 'Tequila Sunrise',
          ingredients: [
            '2 oz Tequila',
            '4 oz Orange Juice',
            '½ oz Grenadine'
          ],
          instructions: [
            'Add tequila to highball glass',
            'Fill with ice and orange juice',
            'Slowly pour grenadine down the side',
            'Do not stir - let it settle'
          ]
        }
      ]
    },
    {
      title: 'Vodka Specialties',
      cocktails: [
        {
          name: 'Moscow Mule',
          ingredients: [
            '2 oz Vodka',
            '½ oz Lime Juice',
            'Ginger Beer to top',
            'Lime wedge for garnish'
          ],
          instructions: [
            'Add vodka and lime juice to copper mug',
            'Fill with ice',
            'Top with ginger beer',
            'Garnish with lime wedge'
          ]
        },
        {
          name: 'White Russian',
          ingredients: [
            '2 oz Vodka',
            '1 oz Coffee Liqueur',
            '1 oz Heavy Cream'
          ],
          instructions: [
            'Add vodka and coffee liqueur to rocks glass',
            'Fill with ice',
            'Float cream on top',
            'Serve with straw'
          ]
        },
        {
          name: 'Black Russian',
          ingredients: [
            '2 oz Vodka',
            '1 oz Coffee Liqueur'
          ],
          instructions: [
            'Add both ingredients to rocks glass',
            'Fill with ice',
            'Stir gently'
          ]
        },
        {
          name: 'Sea Breeze',
          ingredients: [
            '2 oz Vodka',
            '3 oz Cranberry Juice',
            '1 oz Grapefruit Juice'
          ],
          instructions: [
            'Add vodka to highball glass',
            'Fill with ice',
            'Add cranberry and grapefruit juice',
            'Stir gently'
          ]
        }
      ]
    },
    {
      title: 'Whiskey & Bourbon',
      cocktails: [
        {
          name: 'Whiskey Sour',
          ingredients: [
            '2 oz Bourbon',
            '¾ oz Lemon Juice',
            '¾ oz Simple Syrup',
            '½ oz Egg White (optional)',
            'Angostura bitters for garnish'
          ],
          instructions: [
            'Add all ingredients to shaker (dry shake first if using egg white)',
            'Shake with ice',
            'Strain into rocks glass',
            'Garnish with bitters'
          ]
        },
        {
          name: 'Mint Julep',
          ingredients: [
            '2½ oz Bourbon',
            '8-10 Mint Leaves',
            '½ oz Simple Syrup',
            'Crushed Ice'
          ],
          instructions: [
            'Muddle mint with simple syrup',
            'Add bourbon and crushed ice',
            'Stir until frost forms',
            'Garnish with mint sprig'
          ]
        },
        {
          name: 'Godfather',
          ingredients: [
            '2 oz Scotch',
            '1 oz Amaretto'
          ],
          instructions: [
            'Add both ingredients to rocks glass',
            'Fill with ice',
            'Stir gently'
          ]
        },
        {
          name: 'Irish Coffee',
          ingredients: [
            '1½ oz Irish Whiskey',
            '4 oz Hot Coffee',
            '1 tsp Brown Sugar',
            'Whipped Cream to top'
          ],
          instructions: [
            'Add sugar and whiskey to warm glass',
            'Add hot coffee and stir',
            'Top with whipped cream'
          ]
        }
      ]
    },
    {
      title: 'Gin Classics',
      cocktails: [
        {
          name: 'Gin & Tonic',
          ingredients: [
            '2 oz Gin',
            'Tonic Water to top',
            'Lime wedge for garnish'
          ],
          instructions: [
            'Add gin to highball glass',
            'Fill with ice',
            'Top with tonic water',
            'Garnish with lime wedge'
          ]
        },
        {
          name: 'Tom Collins',
          ingredients: [
            '2 oz Gin',
            '1 oz Lemon Juice',
            '½ oz Simple Syrup',
            'Club Soda to top'
          ],
          instructions: [
            'Add gin, lemon juice, and syrup to shaker',
            'Shake with ice',
            'Strain into collins glass over ice',
            'Top with club soda'
          ]
        },
        {
          name: 'French 75',
          ingredients: [
            '1 oz Gin',
            '½ oz Lemon Juice',
            '½ oz Simple Syrup',
            'Champagne to top'
          ],
          instructions: [
            'Add gin, lemon juice, and syrup to shaker',
            'Shake with ice',
            'Strain into champagne flute',
            'Top with champagne'
          ]
        },
        {
          name: 'Aviation',
          ingredients: [
            '2 oz Gin',
            '½ oz Maraschino Liqueur',
            '¼ oz Crème de Violette',
            '¾ oz Lemon Juice'
          ],
          instructions: [
            'Add all ingredients to shaker',
            'Shake with ice',
            'Strain into chilled coupe glass',
            'Garnish with cherry'
          ]
        }
      ]
    },
    {
      title: 'Rum Favorites',
      cocktails: [
        {
          name: 'Mojito',
          ingredients: [
            '2 oz White Rum',
            '1 oz Lime Juice',
            '2 tsp Sugar',
            '6-8 Mint Leaves',
            'Club Soda to top'
          ],
          instructions: [
            'Muddle mint with sugar and lime juice',
            'Add rum and ice',
            'Top with club soda',
            'Garnish with mint sprig'
          ]
        },
        {
          name: 'Daiquiri',
          ingredients: [
            '2 oz White Rum',
            '1 oz Lime Juice',
            '¾ oz Simple Syrup'
          ],
          instructions: [
            'Add all ingredients to shaker',
            'Shake with ice',
            'Strain into chilled coupe glass',
            'Garnish with lime wheel'
          ]
        },
        {
          name: 'Dark & Stormy',
          ingredients: [
            '2 oz Dark Rum',
            'Ginger Beer to top',
            'Lime wedge for garnish'
          ],
          instructions: [
            'Add rum to highball glass',
            'Fill with ice',
            'Top with ginger beer',
            'Garnish with lime wedge'
          ]
        },
        {
          name: 'Cuba Libre',
          ingredients: [
            '2 oz White Rum',
            'Coca-Cola to top',
            '½ oz Lime Juice'
          ],
          instructions: [
            'Add rum and lime juice to highball glass',
            'Fill with ice',
            'Top with Coca-Cola',
            'Stir gently'
          ]
        }
      ]
    },
    {
      title: 'Shots & Shooters',
      cocktails: [
        {
          name: 'Jäger Bomb',
          ingredients: [
            '1 oz Jägermeister',
            'Red Bull'
          ],
          instructions: [
            'Pour Jägermeister into shot glass',
            'Drop shot into half glass of Red Bull',
            'Drink immediately'
          ]
        },
        {
          name: 'Washington Apple',
          ingredients: [
            '1 oz Crown Royal',
            '½ oz Sour Apple Schnapps',
            'Cranberry Juice'
          ],
          instructions: [
            'Add liquors to shaker',
            'Shake with ice',
            'Strain into shot glass',
            'Top with splash of cranberry'
          ]
        },
        {
          name: 'Buttery Nipple',
          ingredients: [
            '½ oz Butterscotch Schnapps',
            '½ oz Irish Cream'
          ],
          instructions: [
            'Layer Irish cream over butterscotch schnapps',
            'Serve as layered shot'
          ]
        },
        {
          name: 'Lemon Drop',
          ingredients: [
            '1 oz Vodka',
            '½ oz Triple Sec',
            '½ oz Lemon Juice',
            'Sugar for rim'
          ],
          instructions: [
            'Rim shot glass with sugar',
            'Add all ingredients to shaker',
            'Shake with ice',
            'Strain into shot glass'
          ]
        }
      ]
    }
  ];

  
  // Get all categories for tabs
  const allCategories = ['All', ...cocktailCategories.map(cat => cat.title)];

  // Filter cocktails based on search and category
  const filteredCocktails = cocktailCategories
    .filter(category => selectedCategory === 'All' || category.title === selectedCategory)
    .flatMap(category => category.cocktails)
    .filter(cocktail => 
      cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cocktail.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
          {filteredCocktails.length} Recipes
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Search Bar */}
        <AnimatedCard
          title="🔍 Search Cocktails"
          index={0}
        >
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </AnimatedCard>

        {/* Category Tabs - WITH HOVER EFFECTS */}
        <AnimatedCard
          title="📂 Cocktail Categories"
          index={1}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {allCategories.map((category, index) => (
              <CategoryTab
                key={category}
                category={category}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                index={index}
              />
            ))}
          </div>
          
          {/* Results Count */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            marginBottom: '20px'
          }}>
            Showing {filteredCocktails.length} cocktails
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </AnimatedCard>

        {/* Cocktails Grid */}
        <AnimatedCard
          title={`🍹 ${selectedCategory === 'All' ? 'All Cocktails' : selectedCategory}`}
          index={2}
        >
          {filteredCocktails.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {filteredCocktails.map((cocktail, index) => (
                <CocktailCard
                  key={`${cocktail.name}-${index}`}
                  name={cocktail.name}
                  ingredients={cocktail.ingredients}
                  instructions={cocktail.instructions}
                  index={index % 4}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <h4 style={{ color: 'white', marginBottom: '10px' }}>No cocktails found</h4>
              <p>Try adjusting your search or selecting a different category</p>
            </div>
          )}
        </AnimatedCard>

        {/* Tips Section */}
        <AnimatedCard
          title="🎯 Mixology Tips & Best Practices"
          index={3}
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