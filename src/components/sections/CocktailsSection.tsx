import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';


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
      trackSectionVisit(currentUser.email, 'cocktails', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

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
        },

       {
      name: 'Vesper Martini',
      ingredients: ['3 oz Gin', '1 oz Vodka', '½ oz Lillet Blanc', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice for 30 seconds', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Dirty Martini',
      ingredients: ['2½ oz Gin or Vodka', '½ oz Dry Vermouth', '½ oz Olive Brine', '2-3 Olives for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with olives']
    },
    {
      name: 'Gibson',
      ingredients: ['2½ oz Gin', '½ oz Dry Vermouth', 'Cocktail Onion for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with cocktail onion']
    },
    {
      name: 'Perfect Martini',
      ingredients: ['2½ oz Gin', '¼ oz Dry Vermouth', '¼ oz Sweet Vermouth', 'Lemon twist or olive for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish as preferred']
    },
    {
      name: '50-50 Martini',
      ingredients: ['2 oz Gin', '2 oz Dry Vermouth', 'Lemon twist for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Wet Martini',
      ingredients: ['2 oz Gin', '1 oz Dry Vermouth', 'Lemon twist for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Dry Martini',
      ingredients: ['2½ oz Gin', '¼ oz Dry Vermouth', 'Lemon twist for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Extra Dry Martini',
      ingredients: ['3 oz Gin', 'Barspoon Dry Vermouth', 'Lemon twist for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Bone Dry Martini',
      ingredients: ['3 oz Gin', 'Rinse of Dry Vermouth', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with vermouth and discard', 'Add gin to mixing glass', 'Stir with ice', 'Strain into prepared glass']
    },
    {
      name: 'Smoky Martini',
      ingredients: ['2½ oz Gin', '½ oz Scotch', 'Lemon twist for garnish'],
      instructions: ['Add gin and scotch to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Savoy Martini',
      ingredients: ['2 oz Gin', '½ oz Dry Vermouth', '½ oz Orange Juice', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with orange twist']
    },
    {
      name: 'Tuxedo Martini',
      ingredients: ['2 oz Gin', '1 oz Dry Vermouth', '¼ oz Maraschino Liqueur', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with lemon twist']
    },
    {
      name: 'Hanky Panky',
      ingredients: ['1½ oz Gin', '1½ oz Sweet Vermouth', '2 dashes Fernet-Branca', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with orange twist']
    },
    {
      name: 'Martinez',
      ingredients: ['1½ oz Old Tom Gin', '1½ oz Sweet Vermouth', '¼ oz Maraschino Liqueur', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Bronx',
      ingredients: ['2 oz Gin', '½ oz Dry Vermouth', '½ oz Sweet Vermouth', '½ oz Orange Juice', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with orange twist']
    },
    {
      name: 'Alaska',
      ingredients: ['2 oz Gin', '¾ oz Yellow Chartreuse', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Bijou',
      ingredients: ['1 oz Gin', '1 oz Green Chartreuse', '1 oz Sweet Vermouth', '1 dash Orange Bitters', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Boulevardier',
      ingredients: ['1½ oz Bourbon', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Rob Roy',
      ingredients: ['2 oz Scotch', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Blood and Sand',
      ingredients: ['¾ oz Scotch', '¾ oz Sweet Vermouth', '¾ oz Cherry Heering', '¾ oz Orange Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'No garnish needed']
    },
    {
      name: 'White Negroni',
      ingredients: ['1½ oz Gin', '1 oz Lillet Blanc', '½ oz Suze', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Americano',
      ingredients: ['1½ oz Campari', '1½ oz Sweet Vermouth', 'Soda Water to top', 'Orange slice for garnish'],
      instructions: ['Add Campari and vermouth to highball glass', 'Fill with ice', 'Top with soda water', 'Garnish with orange slice']
    },
    {
      name: 'Gin Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', 'Soda Water to top'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass', 'Top with soda water']
    },
    {
      name: 'Ramos Gin Fizz',
      ingredients: ['2 oz Gin', '½ oz Lemon Juice', '½ oz Lime Juice', '¾ oz Simple Syrup', '1 oz Heavy Cream', '1 Egg White', '3 drops Orange Flower Water', 'Soda Water to top'],
      instructions: ['Add all ingredients except soda to shaker', 'Dry shake without ice', 'Shake with ice for 2 minutes', 'Strain into highball glass', 'Top with soda water']
    },
    {
      name: 'Southside',
      ingredients: ['2 oz Gin', '1 oz Lime Juice', '¾ oz Simple Syrup', '6-8 Mint Leaves'],
      instructions: ['Muddle mint in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Bramble',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Crème de Mûre'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over crushed ice', 'Drizzle crème de mûre over top']
    },
    {
      name: 'Clover Club',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '¾ oz Raspberry Syrup', '½ oz Egg White'],
      instructions: ['Add all ingredients to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Pegu Club',
      ingredients: ['2 oz Gin', '¾ oz Orange Curaçao', '¾ oz Lime Juice', '1 dash Angostura Bitters', '1 dash Orange Bitters'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Jack Rose',
      ingredients: ['2 oz Applejack', '¾ oz Lemon Juice', '¾ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Sidecar',
      ingredients: ['2 oz Cognac', '¾ oz Orange Liqueur', '¾ oz Lemon Juice', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Between the Sheets',
      ingredients: ['1 oz White Rum', '1 oz Cognac', '1 oz Triple Sec', '½ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Stinger',
      ingredients: ['2 oz Cognac', '¾ oz White Crème de Menthe'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Champs-Élysées',
      ingredients: ['2 oz Cognac', '½ oz Green Chartreuse', '¾ oz Lemon Juice', '¼ oz Simple Syrup', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'French Connection',
      ingredients: ['1½ oz Cognac', '¾ oz Amaretto'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Sazerac',
      ingredients: ['2 oz Rye Whiskey', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add whiskey and ice', 'Stir and strain', 'Garnish with lemon twist']
    },
    {
      name: 'Vieux Carré',
      ingredients: ['1 oz Rye Whiskey', '1 oz Cognac', '1 oz Sweet Vermouth', '¼ oz Benedictine', '2 dashes Peychaud\'s Bitters', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Monte Carlo',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Benedictine', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'De La Louisiane',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Sweet Vermouth', '¾ oz Benedictine', '3 dashes Peychaud\'s Bitters', '3 dashes Absinthe'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Revolver',
      ingredients: ['2 oz Bourbon', '½ oz Coffee Liqueur', '2 dashes Orange Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Black Manhattan',
      ingredients: ['2 oz Rye Whiskey', '1 oz Averna', '2 dashes Angostura Bitters', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Greenpoint',
      ingredients: ['2 oz Rye Whiskey', '½ oz Yellow Chartreuse', '½ oz Sweet Vermouth', '2 dashes Angostura Bitters', '2 dashes Orange Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Little Italy',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Cynar', '¾ oz Sweet Vermouth', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with cherry']
    },
    {
      name: 'Red Hook',
      ingredients: ['2 oz Rye Whiskey', '½ oz Punt e Mes', '¼ oz Maraschino Liqueur', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with cherry']
    },
    {
      name: 'Benton\'s Old Fashioned',
      ingredients: ['2 oz Bacon-Infused Bourbon', '¼ oz Maple Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Improved Whiskey Cocktail',
      ingredients: ['2 oz Rye Whiskey', '¼ oz Maraschino Liqueur', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Toronto',
      ingredients: ['2 oz Canadian Whisky', '¼ oz Fernet-Branca', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Remember the Maine',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Sweet Vermouth', '½ oz Cherry Heering', '¼ oz Absinthe', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Brooklyn',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Dry Vermouth', '¼ oz Maraschino Liqueur', '¼ oz Amer Picon', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Ward Eight',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Lemon Juice', '¾ oz Orange Juice', '½ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Whiskey Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'New York Sour',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Red Wine float'],
      instructions: ['Add whiskey, lemon, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Float red wine on top']
    },
    {
      name: 'Godfather',
      ingredients: ['2 oz Scotch', '¾ oz Amaretto'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Rusty Nail',
      ingredients: ['2 oz Scotch', '¾ oz Drambuie'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Penicillin',
      ingredients: ['2 oz Blended Scotch', '¾ oz Lemon Juice', '¾ oz Honey-Ginger Syrup', '¼ oz Islay Scotch float'],
      instructions: ['Add blended scotch, lemon, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Float Islay scotch on top']
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
        },
     {
      name: 'Cadillac Margarita',
      ingredients: ['2 oz Reposado Tequila', '1 oz Lime Juice', '¾ oz Grand Marnier', '½ oz Agave Syrup', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Spicy Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', '2-3 Jalapeño slices'],
      instructions: ['Muddle jalapeño in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into salt-rimmed glass']
    },
    {
      name: 'Watermelon Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Watermelon Juice', 'Tajín rim'],
      instructions: ['Rim glass with Tajín', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Mango Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Mango Purée', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into salt-rimmed glass', 'Garnish with mango slice']
    },
    {
      name: 'Pineapple Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Pineapple Juice', 'Chili salt rim'],
      instructions: ['Rim glass with chili salt', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Cucumber Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '4-5 Cucumber slices', '½ oz Simple Syrup'],
      instructions: ['Muddle cucumber in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Blue Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Blue Curaçao', '½ oz Simple Syrup', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Skinny Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '½ oz Orange Juice', 'Splash of Soda Water', 'No sugar added'],
      instructions: ['Add tequila and lime juice to shaker', 'Shake with ice', 'Strain into glass', 'Top with orange juice and soda']
    },
    {
      name: 'Frozen Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', '1 cup Ice'],
      instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into margarita glass', 'Garnish with lime wedge']
    },
    {
      name: 'Blood Orange Margarita',
      ingredients: ['2 oz Tequila', '1 oz Blood Orange Juice', '¾ oz Triple Sec', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into salt-rimmed glass', 'Garnish with blood orange slice']
    },
    {
      name: 'Pear Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Pear Liqueur', '½ oz Simple Syrup', 'Pear slice for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with pear slice']
    },
    {
      name: 'Blackberry Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '6-8 Blackberries', '½ oz Simple Syrup'],
      instructions: ['Muddle blackberries in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Coconut Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Coconut Cream', '¾ oz Triple Sec', 'Toasted coconut rim'],
      instructions: ['Rim glass with toasted coconut', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Jalapeño Pineapple Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '2 oz Pineapple Juice', '2-3 Jalapeño slices', '¾ oz Triple Sec'],
      instructions: ['Muddle jalapeño in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Mezcal Margarita',
      ingredients: ['1½ oz Mezcal', '½ oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Agave Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into salt-rimmed glass', 'Garnish with lime wheel']
    },
    {
      name: 'Pomegranate Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Pomegranate Juice', '¾ oz Triple Sec', 'Pomegranate seeds for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with pomegranate seeds']
    },
    {
      name: 'Avocado Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ Avocado', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to blender', 'Blend with ice until smooth', 'Pour into salt-rimmed glass', 'Garnish with lime']
    },
    {
      name: 'Ginger Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Ginger Syrup', 'Candied ginger for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with candied ginger']
    },
    {
      name: 'Hibiscus Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Hibiscus Tea (cooled)', '¾ oz Triple Sec', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with dried hibiscus']
    },
    {
      name: 'Smoky Margarita',
      ingredients: ['2 oz Smoked Tequila', '1 oz Lime Juice', '¾ oz Mezcal', '½ oz Agave Syrup', 'Smoked salt rim'],
      instructions: ['Rim glass with smoked salt', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Passion Fruit Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Passion Fruit Purée', '¾ oz Triple Sec', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with passion fruit']
    },
    {
      name: 'Cantaloupe Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Cantaloupe Purée', 'Mint sprig for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with mint']
    },
    {
      name: 'Raspberry Lime Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '½ cup Raspberries', '½ oz Simple Syrup'],
      instructions: ['Muddle raspberries in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Tamarind Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '1 oz Tamarind Paste', 'Chili powder rim'],
      instructions: ['Rim glass with chili powder', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Horchata Margarita',
      ingredients: ['2 oz Tequila', '1 oz Horchata', '¾ oz Coffee Liqueur', '½ oz Simple Syrup', 'Cinnamon sugar rim'],
      instructions: ['Rim glass with cinnamon sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Dragon Fruit Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Dragon Fruit Purée', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with dragon fruit slice']
    },
    {
      name: 'Matcha Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '1 tsp Matcha Powder', '½ oz Simple Syrup'],
      instructions: ['Whisk matcha with lime juice first', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Rosemary Grapefruit Margarita',
      ingredients: ['2 oz Tequila', '1 oz Grapefruit Juice', '¾ oz Triple Sec', '½ oz Lime Juice', '1 Rosemary sprig'],
      instructions: ['Muddle rosemary in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Peach Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Peach Schnapps', '2 oz Peach Purée', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with peach slice']
    },
    {
      name: 'Mint Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '8-10 Mint Leaves', '½ oz Simple Syrup'],
      instructions: ['Muddle mint in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Apricot Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Apricot Liqueur', '½ oz Simple Syrup', 'Apricot slice for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with apricot slice']
    },
    {
      name: 'Cilantro Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '¼ cup Cilantro Leaves', '½ oz Simple Syrup'],
      instructions: ['Muddle cilantro in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Guava Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '2 oz Guava Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with lime wheel']
    },
    {
      name: 'Basil Margarita',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '¾ oz Triple Sec', '6-8 Basil Leaves', '½ oz Simple Syrup'],
      instructions: ['Muddle basil in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Tequila Sour',
      ingredients: ['2 oz Tequila', '¾ oz Lime Juice', '¾ oz Simple Syrup', '½ oz Egg White', 'Angostura bitters'],
      instructions: ['Dry shake all ingredients first', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Matador',
      ingredients: ['2 oz Tequila', '1 oz Pineapple Juice', '½ oz Lime Juice', 'Pineapple wedge for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with pineapple']
    },
    {
      name: 'El Diablo',
      ingredients: ['2 oz Tequila', '½ oz Crème de Cassis', '½ oz Lime Juice', 'Ginger Beer to top'],
      instructions: ['Add tequila, crème de cassis, and lime to glass', 'Fill with ice', 'Top with ginger beer', 'Stir gently']
    },
    {
      name: 'Tequila Mockingbird',
      ingredients: ['2 oz Tequila', '¾ oz Lime Juice', '¾ oz Green Chartreuse', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Brave Bull',
      ingredients: ['2 oz Tequila', '1 oz Coffee Liqueur'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Tequila Sunset',
      ingredients: ['2 oz Tequila', '4 oz Orange Juice', '½ oz Grenadine', '½ oz Blackberry Liqueur'],
      instructions: ['Add tequila and orange juice to glass', 'Fill with ice', 'Layer grenadine then blackberry liqueur', 'Do not stir']
    },
    {
      name: 'Mexican Mule',
      ingredients: ['2 oz Tequila', '½ oz Lime Juice', 'Ginger Beer to top', 'Lime wedge for garnish'],
      instructions: ['Add tequila and lime juice to copper mug', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
    },
    {
      name: 'Tequila Old Fashioned',
      ingredients: ['2 oz Añejo Tequila', '¼ oz Agave Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to rocks glass', 'Add ice and stir', 'Garnish with orange twist']
    },
    {
      name: 'Bloody Maria',
      ingredients: ['2 oz Tequila', '4 oz Tomato Juice', '½ oz Lime Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce', 'Pinch of Salt and Pepper'],
      instructions: ['Rim glass with salt and pepper', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Tequila Collins',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add tequila, lime juice, and syrup to shaker', 'Shake with ice', 'Strain into collins glass over ice', 'Top with club soda']
    },
    {
      name: 'Mexican Firing Squad',
      ingredients: ['2 oz Tequila', '¾ oz Lime Juice', '¾ oz Grenadine', '2 dashes Angostura Bitters', 'Club Soda to top'],
      instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with club soda']
    },
    {
      name: 'Tequila Gimlet',
      ingredients: ['2 oz Tequila', '¾ oz Lime Juice', '¾ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Oaxaca Old Fashioned',
      ingredients: ['1½ oz Reposado Tequila', '½ oz Mezcal', '¼ oz Agave Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Tequila Press',
      ingredients: ['2 oz Tequila', '½ oz Lime Juice', 'Club Soda to top', '7-Up to top'],
      instructions: ['Add tequila and lime juice to highball glass', 'Fill with ice', 'Top with equal parts club soda and 7-Up', 'Stir gently']
    },
    {
      name: 'Bandera',
      ingredients: ['1 oz Tequila', '1 oz Lime Juice', '1 oz Grenadine'],
      instructions: ['Layer in shot glass: tequila, lime juice, grenadine', 'Serve as layered shot', 'Drink in one go']
    },
    {
      name: 'Tequila Slammer',
      ingredients: ['1 oz Tequila', '1 oz 7-Up or Sprite'],
      instructions: ['Pour tequila into shot glass', 'Cover with napkin and slam on table', 'Drink immediately while fizzing']
    },
    {
      name: 'Mexican Martini',
      ingredients: ['2 oz Tequila', '1 oz Lime Juice', '½ oz Orange Liqueur', '½ oz Olive Brine', 'Green olive for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into martini glass', 'Garnish with olive']
    },
    {
      name: 'Acapulco',
      ingredients: ['2 oz Tequila', '1 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Simple Syrup', 'Mint sprig for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with mint']
    },
    {
      name: 'Toreador',
      ingredients: ['2 oz Tequila', '1 oz Apricot Brandy', '½ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Vampiro',
      ingredients: ['2 oz Tequila', '3 oz Tomato Juice', '½ oz Lime Juice', '½ oz Orange Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce'],
      instructions: ['Rim glass with salt and chili powder', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Charro Negro',
      ingredients: ['2 oz Tequila', 'Coca-Cola to top', '½ oz Lime Juice'],
      instructions: ['Add tequila and lime juice to highball glass', 'Fill with ice', 'Top with Coca-Cola', 'Stir gently']
    },
    {
      name: 'Tequila Fresca',
      ingredients: ['2 oz Tequila', 'Grapefruit Soda to top', 'Lime wedge for garnish'],
      instructions: ['Add tequila to highball glass', 'Fill with ice', 'Top with grapefruit soda', 'Garnish with lime wedge']
    },
    {
      name: 'Rosita',
      ingredients: ['1½ oz Tequila', '¾ oz Sweet Vermouth', '¾ oz Campari', '½ oz Dry Vermouth', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Valencia',
      ingredients: ['2 oz Tequila', '1 oz Orange Juice', '½ oz Lime Juice', '¼ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Tequila Sazerac',
      ingredients: ['2 oz Añejo Tequila', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add tequila and ice', 'Stir and strain', 'Garnish with lemon twist']
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
        },
     {
      name: 'Cosmopolitan',
      ingredients: ['1½ oz Citrus Vodka', '1 oz Cointreau', '½ oz Lime Juice', '1 oz Cranberry Juice', 'Lime twist for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with lime twist']
    },
    {
      name: 'Espresso Martini',
      ingredients: ['2 oz Vodka', '1 oz Coffee Liqueur', '1 oz Fresh Espresso', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake vigorously with ice', 'Strain into chilled martini glass', 'Garnish with coffee beans']
    },
    {
      name: 'Bloody Mary',
      ingredients: ['2 oz Vodka', '4 oz Tomato Juice', '½ oz Lemon Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce', 'Pinch of Salt and Pepper', 'Celery stalk for garnish'],
      instructions: ['Rim glass with salt and pepper', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with celery']
    },
    {
      name: 'Screwdriver',
      ingredients: ['2 oz Vodka', 'Orange Juice to top', 'Orange slice for garnish'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Top with orange juice', 'Garnish with orange slice']
    },
    {
      name: 'Bay Breeze',
      ingredients: ['2 oz Vodka', '3 oz Pineapple Juice', '1 oz Cranberry Juice'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Add pineapple and cranberry juice', 'Stir gently']
    },
    {
      name: 'Cape Codder',
      ingredients: ['2 oz Vodka', 'Cranberry Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Top with cranberry juice', 'Garnish with lime wedge']
    },
    {
      name: 'Sex on the Beach',
      ingredients: ['1½ oz Vodka', '½ oz Peach Schnapps', '2 oz Orange Juice', '2 oz Cranberry Juice'],
      instructions: ['Add vodka and schnapps to highball glass', 'Fill with ice', 'Add orange and cranberry juice', 'Stir gently']
    },
    {
      name: 'Harvey Wallbanger',
      ingredients: ['1½ oz Vodka', '4 oz Orange Juice', '½ oz Galliano'],
      instructions: ['Add vodka and orange juice to highball glass', 'Fill with ice', 'Float Galliano on top', 'Do not stir']
    },
    {
      name: 'Kamikaze',
      ingredients: ['1½ oz Vodka', '¾ oz Triple Sec', '¾ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Lemon Drop Martini',
      ingredients: ['2 oz Vodka', '1 oz Triple Sec', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into martini glass']
    },
    {
      name: 'French Martini',
      ingredients: ['2 oz Vodka', '1 oz Raspberry Liqueur', '1 oz Pineapple Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Appletini',
      ingredients: ['2 oz Vodka', '1 oz Sour Apple Schnapps', '½ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with apple slice']
    },
    {
      name: 'Chocolate Martini',
      ingredients: ['2 oz Vodka', '1 oz Chocolate Liqueur', '½ oz Crème de Cacao', 'Chocolate shavings for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with chocolate shavings']
    },
    {
      name: 'Espresso Martini (Variant)',
      ingredients: ['1½ oz Vodka', '1 oz Coffee Liqueur', '1 oz Cold Brew Concentrate', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake vigorously with ice', 'Strain into chilled martini glass', 'Garnish with coffee beans']
    },
    {
      name: 'White Chocolate Martini',
      ingredients: ['2 oz Vodka', '1 oz White Crème de Cacao', '½ oz Irish Cream', 'White chocolate shavings for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with white chocolate']
    },
    {
      name: 'Chocolate-Covered Cherry Martini',
      ingredients: ['2 oz Vodka', '1 oz Cherry Liqueur', '½ oz Dark Crème de Cacao', 'Maraschino cherry for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with cherry']
    },
    {
      name: 'Cucumber Vodka Martini',
      ingredients: ['2 oz Cucumber-Infused Vodka', '½ oz Dry Vermouth', 'Cucumber slice for garnish'],
      instructions: ['Add vodka and vermouth to mixing glass', 'Stir with ice', 'Strain into chilled martini glass', 'Garnish with cucumber']
    },
    {
      name: 'Basil Vodka Martini',
      ingredients: ['2 oz Vodka', '4-6 Basil Leaves', '½ oz Simple Syrup', '½ oz Lime Juice'],
      instructions: ['Muddle basil in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Honeydew Martini',
      ingredients: ['2 oz Vodka', '1 oz Midori', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with honeydew ball']
    },
    {
      name: 'Pomegranate Martini',
      ingredients: ['2 oz Vodka', '1 oz Pomegranate Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with pomegranate seeds']
    },
    {
      name: 'Pear Martini',
      ingredients: ['2 oz Vodka', '1 oz Pear Liqueur', '½ oz Lemon Juice', 'Pear slice for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with pear slice']
    },
    {
      name: 'Blueberry Martini',
      ingredients: ['2 oz Vodka', '1 oz Blueberry Liqueur', '½ oz Lime Juice', '½ oz Simple Syrup', 'Fresh blueberries for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with blueberries']
    },
    {
      name: 'Raspberry Martini',
      ingredients: ['2 oz Vodka', '1 oz Raspberry Liqueur', '½ oz Lime Juice', '½ oz Simple Syrup', 'Fresh raspberries for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with raspberries']
    },
    {
      name: 'Strawberry Martini',
      ingredients: ['2 oz Vodka', '4-5 Fresh Strawberries', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Muddle strawberries in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Watermelon Martini',
      ingredients: ['2 oz Vodka', '2 oz Watermelon Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with watermelon wedge']
    },
    {
      name: 'Mango Martini',
      ingredients: ['2 oz Vodka', '2 oz Mango Purée', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with mango slice']
    },
    {
      name: 'Pineapple Martini',
      ingredients: ['2 oz Vodka', '2 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with pineapple wedge']
    },
    {
      name: 'Coconut Martini',
      ingredients: ['2 oz Vodka', '1 oz Coconut Cream', '1 oz Pineapple Juice', 'Toasted coconut for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with toasted coconut']
    },
    {
      name: 'Peach Martini',
      ingredients: ['2 oz Vodka', '1 oz Peach Schnapps', '½ oz Lime Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with peach slice']
    },
    {
      name: 'Green Tea Martini',
      ingredients: ['2 oz Vodka', '1 oz Peach Schnapps', '½ oz Sweet & Sour Mix', 'Splash of 7-Up'],
      instructions: ['Add vodka, schnapps, and sour mix to shaker', 'Shake with ice', 'Strain into martini glass', 'Top with 7-Up']
    },
    {
      name: 'Madras',
      ingredients: ['2 oz Vodka', '3 oz Cranberry Juice', '1 oz Orange Juice'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Add cranberry and orange juice', 'Stir gently']
    },
    {
      name: 'Salty Dog',
      ingredients: ['2 oz Vodka', 'Grapefruit Juice to top', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add vodka to highball glass', 'Fill with ice', 'Top with grapefruit juice']
    },
    {
      name: 'Greyhound',
      ingredients: ['2 oz Vodka', 'Grapefruit Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Top with grapefruit juice', 'Garnish with lime wedge']
    },
    {
      name: 'Blackberry Bramble',
      ingredients: ['2 oz Vodka', '1 oz Lemon Juice', '½ oz Simple Syrup', '½ oz Crème de Mûre', 'Fresh blackberries for garnish'],
      instructions: ['Add vodka, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over crushed ice', 'Drizzle crème de mûre and garnish with blackberries']
    },
    {
      name: 'Vodka Gimlet',
      ingredients: ['2 oz Vodka', '¾ oz Lime Juice', '¾ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Vodka Collins',
      ingredients: ['2 oz Vodka', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add vodka, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into collins glass over ice', 'Top with club soda']
    },
    {
      name: 'Vodka Sour',
      ingredients: ['2 oz Vodka', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Egg White (optional)', 'Angostura bitters for garnish'],
      instructions: ['Add all ingredients to shaker (dry shake first if using egg white)', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Vodka Tonic',
      ingredients: ['2 oz Vodka', 'Tonic Water to top', 'Lime wedge for garnish'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Top with tonic water', 'Garnish with lime wedge']
    },
    {
      name: 'Vodka Red Bull',
      ingredients: ['2 oz Vodka', 'Red Bull to top'],
      instructions: ['Add vodka to highball glass', 'Fill with ice', 'Top with Red Bull', 'Serve immediately']
    },
    {
      name: 'White Spider',
      ingredients: ['2 oz Vodka', '1 oz White Crème de Menthe'],
      instructions: ['Add both ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Mind Eraser',
      ingredients: ['1½ oz Vodka', '1½ oz Coffee Liqueur', '1½ oz Club Soda'],
      instructions: ['Layer in highball glass: coffee liqueur, vodka, then club soda', 'Serve with straw to drink quickly']
    },
    {
      name: 'Black Magic',
      ingredients: ['2 oz Vodka', '½ oz Coffee Liqueur', '½ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Balalaika',
      ingredients: ['2 oz Vodka', '1 oz Triple Sec', '1 oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Vodka Espresso',
      ingredients: ['1½ oz Vodka', '1 oz Coffee Liqueur', '1 oz Fresh Espresso', 'Coffee beans for garnish'],
      instructions: ['Add all ingredients to shaker', 'Shake vigorously with ice', 'Strain into rocks glass over ice', 'Garnish with coffee beans']
    },
    {
      name: 'White Night',
      ingredients: ['2 oz Vodka', '½ oz White Crème de Cacao', '½ oz Cream'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass']
    },
    {
      name: 'Woo Woo',
      ingredients: ['1½ oz Vodka', '½ oz Peach Schnapps', '2 oz Cranberry Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over ice']
    },
    {
      name: 'Purple Haze',
      ingredients: ['2 oz Vodka', '1 oz Chambord', '1 oz Cranberry Juice', 'Splash of 7-Up'],
      instructions: ['Add vodka, Chambord, and cranberry juice to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with 7-Up']
    },
    {
      name: 'Blue Lagoon',
      ingredients: ['2 oz Vodka', '1 oz Blue Curaçao', 'Lemonade to top', 'Cherry for garnish'],
      instructions: ['Add vodka and blue curaçao to highball glass', 'Fill with ice', 'Top with lemonade', 'Garnish with cherry']
    },
    {
      name: 'Purple Rain',
      ingredients: ['2 oz Vodka', '½ oz Blue Curaçao', '½ oz Chambord', 'Lemonade to top'],
      instructions: ['Add vodka and liqueurs to highball glass', 'Fill with ice', 'Top with lemonade', 'Stir gently']
    },
    {
      name: 'Electric Lemonade',
      ingredients: ['2 oz Vodka', '1 oz Blue Curaçao', '1 oz Sweet & Sour Mix', 'Splash of 7-Up'],
      instructions: ['Add vodka, blue curaçao, and sour mix to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with 7-Up']
    },
    {
      name: 'Tokyo Iced Tea',
      ingredients: ['½ oz Vodka', '½ oz Gin', '½ oz Rum', '½ oz Tequila', '½ oz Triple Sec', '½ oz Midori', 'Sour Mix to fill'],
      instructions: ['Add all liquors to big cup', 'Fill with sour mix', 'Stir gently', 'Serve with straw']
    },
    {
      name: 'Lemon Drop Shot',
      ingredients: ['1 oz Vodka', '½ oz Triple Sec', '½ oz Lemon Juice', 'Sugar rim'],
      instructions: ['Rim shot glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into shot glass']
    },
    {
      name: 'Washington Apple Shot',
      ingredients: ['1 oz Vodka', '½ oz Sour Apple Schnapps', 'Cranberry Juice'],
      instructions: ['Add vodka and schnapps to shaker', 'Shake with ice', 'Strain into shot glass', 'Top with splash of cranberry']
    },
    {
      name: 'Buttery Nipple Shot',
      ingredients: ['½ oz Butterscotch Schnapps', '½ oz Irish Cream'],
      instructions: ['Layer Irish cream over butterscotch schnapps', 'Serve as layered shot']
    },
    {
      name: 'Jelly Bean Shot',
      ingredients: ['½ oz Blackberry Brandy', '½ oz Anisette', 'Sour Mix'],
      instructions: ['Layer brandy and anisette in shot glass', 'Drop into half glass of sour mix', 'Drink immediately']
    },
    {
      name: 'Cinnamon Toast Shot',
      ingredients: ['½ oz Fireball', '½ oz RumChata'],
      instructions: ['Layer Fireball and RumChata in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Pineapple Upside-Down Shot',
      ingredients: ['½ oz Vanilla Vodka', '½ oz Pineapple Juice', 'Splash of Grenadine'],
      instructions: ['Add vodka and pineapple juice to shaker', 'Shake with ice', 'Strain into shot glass', 'Add grenadine splash']
    },
    {
      name: 'Apple Pie Shot',
      ingredients: ['1 oz Vodka', '½ oz Butterscotch Schnapps', 'Cinnamon sugar rim'],
      instructions: ['Rim shot glass with cinnamon sugar', 'Add vodka and schnapps to shaker', 'Shake with ice', 'Strain into shot glass']
    },
    {
      name: 'Caramel Apple Shot',
      ingredients: ['½ oz Butterscotch Schnapps', '½ oz Sour Apple Schnapps'],
      instructions: ['Layer schnapps in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Chocolate Cake Shot',
      ingredients: ['1 oz Vanilla Vodka', '½ oz Frangelico', 'Lemon wedge and sugar'],
      instructions: ['Coat lemon wedge in sugar', 'Shoot vodka and Frangelico', 'Suck lemon wedge immediately after']
    },
    {
      name: 'Birthday Cake Shot',
      ingredients: ['1 oz Vanilla Vodka', '½ oz Cake Liqueur', 'Sprinkles for garnish'],
      instructions: ['Rim shot glass with sprinkles', 'Add vodka and cake liqueur to shaker', 'Shake with ice', 'Strain into shot glass']
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
        },
     {
      name: 'Whiskey Sour',
      ingredients: ['2 oz Bourbon', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Egg White (optional)', 'Angostura bitters for garnish'],
      instructions: ['Add all ingredients to shaker (dry shake first if using egg white)', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Mint Julep',
      ingredients: ['2½ oz Bourbon', '8-10 Mint Leaves', '½ oz Simple Syrup', 'Crushed Ice'],
      instructions: ['Muddle mint with simple syrup', 'Add bourbon and crushed ice', 'Stir until frost forms', 'Garnish with mint sprig']
    },
    {
      name: 'Godfather',
      ingredients: ['2 oz Scotch', '1 oz Amaretto'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Irish Coffee',
      ingredients: ['1½ oz Irish Whiskey', '4 oz Hot Coffee', '1 tsp Brown Sugar', 'Whipped Cream to top'],
      instructions: ['Add sugar and whiskey to warm glass', 'Add hot coffee and stir', 'Top with whipped cream']
    },

    // Additional recipes to reach 50+
    {
      name: 'Old Fashioned',
      ingredients: ['2 oz Bourbon', '1 Sugar Cube', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Muddle sugar cube with bitters', 'Add bourbon and ice', 'Stir gently', 'Garnish with orange twist']
    },
    {
      name: 'Manhattan',
      ingredients: ['2 oz Rye Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Boulevardier',
      ingredients: ['1½ oz Bourbon', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Whiskey Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'New York Sour',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Red Wine float'],
      instructions: ['Add whiskey, lemon, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Float red wine on top']
    },
    {
      name: 'Penicillin',
      ingredients: ['2 oz Blended Scotch', '¾ oz Lemon Juice', '¾ oz Honey-Ginger Syrup', '¼ oz Islay Scotch float'],
      instructions: ['Add blended scotch, lemon, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Float Islay scotch on top']
    },
    {
      name: 'Rusty Nail',
      ingredients: ['2 oz Scotch', '¾ oz Drambuie'],
      instructions: ['Add both ingredients to rocks glass', 'Fill with ice', 'Stir gently']
    },
    {
      name: 'Sazerac',
      ingredients: ['2 oz Rye Whiskey', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add whiskey and ice', 'Stir and strain', 'Garnish with lemon twist']
    },
    {
      name: 'Vieux Carré',
      ingredients: ['1 oz Rye Whiskey', '1 oz Cognac', '1 oz Sweet Vermouth', '¼ oz Benedictine', '2 dashes Peychaud\'s Bitters', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Monte Carlo',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Benedictine', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Black Manhattan',
      ingredients: ['2 oz Rye Whiskey', '1 oz Averna', '2 dashes Angostura Bitters', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Revolver',
      ingredients: ['2 oz Bourbon', '½ oz Coffee Liqueur', '2 dashes Orange Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Benton\'s Old Fashioned',
      ingredients: ['2 oz Bacon-Infused Bourbon', '¼ oz Maple Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Improved Whiskey Cocktail',
      ingredients: ['2 oz Rye Whiskey', '¼ oz Maraschino Liqueur', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Toronto',
      ingredients: ['2 oz Canadian Whisky', '¼ oz Fernet-Branca', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Remember the Maine',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Sweet Vermouth', '½ oz Cherry Heering', '¼ oz Absinthe', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Brooklyn',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Dry Vermouth', '¼ oz Maraschino Liqueur', '¼ oz Amer Picon', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Ward Eight',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Lemon Juice', '¾ oz Orange Juice', '½ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Rob Roy',
      ingredients: ['2 oz Scotch', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Blood and Sand',
      ingredients: ['¾ oz Scotch', '¾ oz Sweet Vermouth', '¾ oz Cherry Heering', '¾ oz Orange Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Bobby Burns',
      ingredients: ['2 oz Scotch', '1 oz Sweet Vermouth', '¼ oz Benedictine', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Scotch & Soda',
      ingredients: ['2 oz Scotch', 'Soda Water to top', 'Lemon twist for garnish'],
      instructions: ['Add scotch to highball glass', 'Fill with ice', 'Top with soda water', 'Garnish with lemon twist']
    },
    {
      name: 'Hot Toddy',
      ingredients: ['2 oz Whiskey', '1 tbsp Honey', '½ oz Lemon Juice', '4 oz Hot Water', 'Cinnamon stick for garnish'],
      instructions: ['Add honey and lemon to mug', 'Add whiskey and hot water', 'Stir until honey dissolves', 'Garnish with cinnamon stick']
    },
    {
      name: 'Irish Whiskey Sour',
      ingredients: ['2 oz Irish Whiskey', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Egg White', 'Angostura bitters for garnish'],
      instructions: ['Dry shake all ingredients first', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Tipperary',
      ingredients: ['2 oz Irish Whiskey', '1 oz Sweet Vermouth', '½ oz Green Chartreuse', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Blackthorn',
      ingredients: ['2 oz Irish Whiskey', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', '2 dashes Absinthe'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Japanese Cocktail',
      ingredients: ['2 oz Cognac', '½ oz Orgeat Syrup', '2 dashes Angostura Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Gold Rush',
      ingredients: ['2 oz Bourbon', '¾ oz Honey Syrup', '¾ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Brown Derby',
      ingredients: ['2 oz Bourbon', '1 oz Grapefruit Juice', '½ oz Honey Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Final Ward',
      ingredients: ['¾ oz Rye Whiskey', '¾ oz Green Chartreuse', '¾ oz Maraschino Liqueur', '¾ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Red Hook',
      ingredients: ['2 oz Rye Whiskey', '½ oz Punt e Mes', '¼ oz Maraschino Liqueur', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with cherry']
    },
    {
      name: 'Little Italy',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Cynar', '¾ oz Sweet Vermouth', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with cherry']
    },
    {
      name: 'Greenpoint',
      ingredients: ['2 oz Rye Whiskey', '½ oz Yellow Chartreuse', '½ oz Sweet Vermouth', '2 dashes Angostura Bitters', '2 dashes Orange Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Division Bell',
      ingredients: ['1½ oz Mezcal', '¾ oz Aperol', '½ oz Maraschino Liqueur', '¾ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Paper Plane',
      ingredients: ['¾ oz Bourbon', '¾ oz Aperol', '¾ oz Amaro Nonino', '¾ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass']
    },
    {
      name: 'Boulevardier Noir',
      ingredients: ['1½ oz Bourbon', '1 oz Campari', '1 oz Sweet Vermouth', 'Coffee bean for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with coffee bean']
    },
    {
      name: 'Whiskey Ginger',
      ingredients: ['2 oz Whiskey', 'Ginger Ale to top', 'Lime wedge for garnish'],
      instructions: ['Add whiskey to highball glass', 'Fill with ice', 'Top with ginger ale', 'Garnish with lime wedge']
    },
    {
      name: 'Whiskey & Cola',
      ingredients: ['2 oz Whiskey', 'Cola to top', 'Lime wedge for garnish'],
      instructions: ['Add whiskey to highball glass', 'Fill with ice', 'Top with cola', 'Garnish with lime wedge']
    },
    {
      name: 'Presbyterian',
      ingredients: ['2 oz Whiskey', 'Ginger Ale to top', 'Club Soda to top'],
      instructions: ['Add whiskey to highball glass', 'Fill with ice', 'Top with equal parts ginger ale and club soda']
    },
    {
      name: 'John Collins',
      ingredients: ['2 oz Whiskey', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add whiskey, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into collins glass over ice', 'Top with club soda']
    },
    {
      name: 'Algonquin',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Dry Vermouth', '¾ oz Pineapple Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'De Rigueur',
      ingredients: ['2 oz Rye Whiskey', '¾ oz Sweet Vermouth', '¼ oz Maraschino Liqueur', '2 dashes Orange Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Blinker',
      ingredients: ['2 oz Rye Whiskey', '1 oz Grapefruit Juice', '½ oz Raspberry Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Lion\'s Tail',
      ingredients: ['2 oz Bourbon', '½ oz Allspice Dram', '½ oz Lime Juice', '½ oz Simple Syrup', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Seelbach',
      ingredients: ['1 oz Bourbon', '½ oz Cointreau', '7 dashes Peychaud\'s Bitters', '7 dashes Angostura Bitters', 'Champagne to top'],
      instructions: ['Add bourbon, cointreau, and bitters to champagne flute', 'Top with champagne', 'Stir gently']
    },
    {
      name: 'Bourbon Renewal',
      ingredients: ['2 oz Bourbon', '1 oz Lemon Juice', '½ oz Crème de Cassis', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon Crusta',
      ingredients: ['2 oz Bourbon', '¾ oz Lemon Juice', '½ oz Maraschino Liqueur', '½ oz Simple Syrup', '2 dashes Angostura Bitters', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Bourbon Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon & Branch',
      ingredients: ['2 oz Bourbon', '4 oz Water'],
      instructions: ['Add bourbon to rocks glass', 'Add ice', 'Top with water', 'Stir gently']
    },
    {
      name: 'Bourbon Press',
      ingredients: ['2 oz Bourbon', '½ oz Lemon Juice', 'Ginger Ale to top', '7-Up to top'],
      instructions: ['Add bourbon and lemon juice to highball glass', 'Fill with ice', 'Top with equal parts ginger ale and 7-Up']
    },
    {
      name: 'Bourbon Milk Punch',
      ingredients: ['2 oz Bourbon', '4 oz Milk', '½ oz Simple Syrup', '½ tsp Vanilla Extract', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with nutmeg']
    },
    {
      name: 'Bourbon Alexander',
      ingredients: ['2 oz Bourbon', '1 oz Dark Crème de Cacao', '1 oz Cream', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with nutmeg']
    },
    {
      name: 'Bourbon Flip',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '1 Whole Egg', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with nutmeg']
    },
    {
      name: 'Bourbon Daisy',
      ingredients: ['2 oz Bourbon', '¾ oz Lemon Juice', '½ oz Orange Curaçao', '½ oz Simple Syrup', 'Splash of Club Soda'],
      instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with club soda']
    },
    {
      name: 'Bourbon Sidecar',
      ingredients: ['2 oz Bourbon', '¾ oz Cointreau', '¾ oz Lemon Juice', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Bourbon Stinger',
      ingredients: ['2 oz Bourbon', '¾ oz White Crème de Menthe'],
      instructions: ['Add both ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Bourbon Rickey',
      ingredients: ['2 oz Bourbon', '½ oz Lime Juice', 'Club Soda to top'],
      instructions: ['Add bourbon and lime juice to highball glass', 'Fill with ice', 'Top with club soda', 'Stir gently']
    },
    {
      name: 'Bourbon Highball',
      ingredients: ['2 oz Bourbon', 'Ginger Ale to top', 'Lemon twist for garnish'],
      instructions: ['Add bourbon to highball glass', 'Fill with ice', 'Top with ginger ale', 'Garnish with lemon twist']
    },
    {
      name: 'Bourbon Sweet Tea',
      ingredients: ['2 oz Bourbon', '4 oz Sweet Tea', 'Lemon wedge for garnish'],
      instructions: ['Add bourbon to highball glass', 'Fill with ice', 'Top with sweet tea', 'Garnish with lemon wedge']
    },
    {
      name: 'Bourbon Peach Tea',
      ingredients: ['2 oz Bourbon', '1 oz Peach Schnapps', '4 oz Iced Tea', 'Lemon wedge for garnish'],
      instructions: ['Add bourbon and schnapps to highball glass', 'Fill with ice', 'Top with iced tea', 'Garnish with lemon wedge']
    },
    {
      name: 'Bourbon Apple Cider',
      ingredients: ['2 oz Bourbon', '4 oz Apple Cider', 'Cinnamon stick for garnish'],
      instructions: ['Add bourbon to mug', 'Heat apple cider and pour over bourbon', 'Stir gently', 'Garnish with cinnamon stick']
    },
    {
      name: 'Bourbon Maple Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Maple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add bourbon and maple syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon Cherry Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '4-6 Cherries', '6-8 Mint Leaves'],
      instructions: ['Muddle cherries and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon Blackberry Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '6-8 Blackberries', '6-8 Mint Leaves'],
      instructions: ['Muddle blackberries and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon Blueberry Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '10-12 Blueberries', '6-8 Mint Leaves'],
      instructions: ['Muddle blueberries and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Bourbon Raspberry Smash',
      ingredients: ['2 oz Bourbon', '¾ oz Simple Syrup', '8-10 Raspberries', '6-8 Mint Leaves'],
      instructions: ['Muddle raspberries and mint in shaker', 'Add bourbon and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    }
  ]
}
,
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
        },
    {
      name: 'Negroni',
      ingredients: ['1 oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Martini',
      ingredients: ['2½ oz Gin', '½ oz Dry Vermouth', 'Lemon twist or olive for garnish'],
      instructions: ['Add gin and vermouth to mixing glass', 'Stir with ice for 30 seconds', 'Strain into chilled martini glass', 'Garnish with lemon twist or olive']
    },
    {
      name: 'Gimlet',
      ingredients: ['2 oz Gin', '¾ oz Lime Juice', '¾ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Southside',
      ingredients: ['2 oz Gin', '1 oz Lime Juice', '¾ oz Simple Syrup', '6-8 Mint Leaves'],
      instructions: ['Muddle mint in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Bramble',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '½ oz Simple Syrup', '½ oz Crème de Mûre', 'Fresh blackberries for garnish'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into rocks glass over crushed ice', 'Drizzle crème de mûre and garnish with blackberries']
    },
    {
      name: 'Clover Club',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '¾ oz Raspberry Syrup', '½ oz Egg White'],
      instructions: ['Add all ingredients to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Pegu Club',
      ingredients: ['2 oz Gin', '¾ oz Orange Curaçao', '¾ oz Lime Juice', '1 dash Angostura Bitters', '1 dash Orange Bitters'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'White Lady',
      ingredients: ['2 oz Gin', '1 oz Cointreau', '¾ oz Lemon Juice', '½ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Corpse Reviver #2',
      ingredients: ['¾ oz Gin', '¾ oz Cointreau', '¾ oz Lillet Blanc', '¾ oz Lemon Juice', 'Absinthe rinse'],
      instructions: ['Rinse glass with absinthe', 'Add remaining ingredients to shaker', 'Shake with ice', 'Strain into coupe glass']
    },
    {
      name: 'Last Word',
      ingredients: ['¾ oz Gin', '¾ oz Green Chartreuse', '¾ oz Maraschino Liqueur', '¾ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Bijou',
      ingredients: ['1 oz Gin', '1 oz Green Chartreuse', '1 oz Sweet Vermouth', '1 dash Orange Bitters', 'Cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Alaska',
      ingredients: ['2 oz Gin', '¾ oz Yellow Chartreuse', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Singapore Sling',
      ingredients: ['1½ oz Gin', '½ oz Cherry Brandy', '¼ oz Cointreau', '¼ oz Benedictine', '4 oz Pineapple Juice', '½ oz Lime Juice', '½ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Garnish with cherry and pineapple']
    },
    {
      name: 'Gin Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Ramos Gin Fizz',
      ingredients: ['2 oz Gin', '½ oz Lemon Juice', '½ oz Lime Juice', '¾ oz Simple Syrup', '1 oz Heavy Cream', '1 Egg White', '3 drops Orange Flower Water', 'Club Soda to top'],
      instructions: ['Add all ingredients except soda to shaker', 'Dry shake without ice', 'Shake with ice for 2 minutes', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Silver Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '1 Egg White', 'Club Soda to top'],
      instructions: ['Add gin, lemon juice, syrup, and egg white to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Golden Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '1 Egg Yolk', 'Club Soda to top'],
      instructions: ['Add gin, lemon juice, syrup, and egg yolk to shaker', 'Shake with ice', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Royal Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '1 Whole Egg', 'Club Soda to top'],
      instructions: ['Add gin, lemon juice, syrup, and egg to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Diamond Fizz',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', 'Champagne to top'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass', 'Top with champagne']
    },
    {
      name: 'Gin Rickey',
      ingredients: ['2 oz Gin', '½ oz Lime Juice', 'Club Soda to top'],
      instructions: ['Add gin and lime juice to highball glass', 'Fill with ice', 'Top with club soda', 'Stir gently']
    },
    {
      name: 'Gin Buck',
      ingredients: ['2 oz Gin', '½ oz Lime Juice', 'Ginger Ale to top'],
      instructions: ['Add gin and lime juice to highball glass', 'Fill with ice', 'Top with ginger ale', 'Stir gently']
    },
    {
      name: 'Gin Sling',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add gin, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Top with club soda']
    },
    {
      name: 'Gin Daisy',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '½ oz Orange Curaçao', '½ oz Simple Syrup', 'Splash of Club Soda'],
      instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with club soda']
    },
    {
      name: 'Gin Smash',
      ingredients: ['2 oz Gin', '¾ oz Simple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add gin and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Gin Sour',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '¾ oz Simple Syrup', '½ oz Egg White (optional)', 'Angostura bitters for garnish'],
      instructions: ['Add all ingredients to shaker (dry shake first if using egg white)', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Gin Flip',
      ingredients: ['2 oz Gin', '¾ oz Simple Syrup', '1 Whole Egg', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with nutmeg']
    },
    {
      name: 'Gin Cobbler',
      ingredients: ['2 oz Gin', '½ oz Simple Syrup', 'Seasonal fruits', 'Crushed ice'],
      instructions: ['Fill glass with crushed ice', 'Add gin and syrup', 'Stir gently', 'Garnish with seasonal fruits']
    },
    {
      name: 'Gin Crusta',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '½ oz Maraschino Liqueur', '½ oz Simple Syrup', '2 dashes Angostura Bitters', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Gin Fix',
      ingredients: ['2 oz Gin', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Crushed ice'],
      instructions: ['Fill glass with crushed ice', 'Add gin, lemon juice, and syrup', 'Stir gently', 'Garnish with lemon slice']
    },
    {
      name: 'Gin Julep',
      ingredients: ['2½ oz Gin', '8-10 Mint Leaves', '½ oz Simple Syrup', 'Crushed ice'],
      instructions: ['Muddle mint with simple syrup', 'Add gin and crushed ice', 'Stir until frost forms', 'Garnish with mint sprig']
    },
    {
      name: 'Gin Swizzle',
      ingredients: ['2 oz Gin', '¾ oz Lime Juice', '½ oz Simple Syrup', '2 dashes Angostura Bitters', 'Crushed ice'],
      instructions: ['Add all ingredients to glass', 'Fill with crushed ice', 'Swizzle with swizzle stick', 'Top with bitters']
    },
    {
      name: 'Gin Toddy',
      ingredients: ['2 oz Gin', '1 tbsp Honey', '½ oz Lemon Juice', '4 oz Hot Water', 'Cinnamon stick for garnish'],
      instructions: ['Add honey and lemon to mug', 'Add gin and hot water', 'Stir until honey dissolves', 'Garnish with cinnamon stick']
    },
    {
      name: 'Pink Gin',
      ingredients: ['2 oz Gin', '2-3 dashes Angostura Bitters'],
      instructions: ['Swirl bitters in glass to coat', 'Add gin', 'Serve neat or with ice']
    },
    {
      name: 'Red Snapper',
      ingredients: ['2 oz Gin', '4 oz Tomato Juice', '½ oz Lemon Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce', 'Pinch of Salt and Pepper'],
      instructions: ['Rim glass with salt and pepper', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Gin Bloody Mary',
      ingredients: ['2 oz Gin', '4 oz Tomato Juice', '½ oz Lemon Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce', 'Pinch of Salt and Pepper', 'Celery stalk for garnish'],
      instructions: ['Rim glass with salt and pepper', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with celery']
    },
    {
      name: 'Gin Sangaree',
      ingredients: ['2 oz Gin', '½ oz Simple Syrup', '1 oz Port Wine float', 'Fresh grated nutmeg'],
      instructions: ['Add gin and syrup to glass', 'Fill with ice', 'Float port wine on top', 'Garnish with nutmeg']
    },
    {
      name: 'Gin Sazerac',
      ingredients: ['2 oz Gin', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add gin and ice', 'Stir and strain', 'Garnish with lemon twist']
    },
    {
      name: 'Gin Old Fashioned',
      ingredients: ['2 oz Gin', '¼ oz Simple Syrup', '2 dashes Orange Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to rocks glass', 'Add ice and stir', 'Garnish with orange twist']
    },
    {
      name: 'Gin Manhattan',
      ingredients: ['2 oz Gin', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Gin Boulevardier',
      ingredients: ['1½ oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Gin Negroni Sbagliato',
      ingredients: ['1 oz Gin', '1 oz Campari', '1 oz Sweet Vermouth', 'Prosecco to top'],
      instructions: ['Add Campari and vermouth to rocks glass', 'Fill with ice', 'Top with prosecco', 'Garnish with orange twist']
    },
    {
      name: 'Gin Campari Spritz',
      ingredients: ['1½ oz Gin', '1½ oz Campari', 'Prosecco to top', 'Soda Water to top', 'Orange slice for garnish'],
      instructions: ['Add gin and Campari to wine glass', 'Fill with ice', 'Top with equal parts prosecco and soda', 'Garnish with orange slice']
    },
    {
      name: 'Gin Aperol Spritz',
      ingredients: ['1½ oz Gin', '2 oz Aperol', 'Prosecco to top', 'Soda Water to top', 'Orange slice for garnish'],
      instructions: ['Add gin and Aperol to wine glass', 'Fill with ice', 'Top with equal parts prosecco and soda', 'Garnish with orange slice']
    },
    {
      name: 'Gin Basil Smash',
      ingredients: ['2 oz Gin', '1 oz Lemon Juice', '¾ oz Simple Syrup', '8-10 Basil Leaves'],
      instructions: ['Muddle basil in shaker', 'Add remaining ingredients', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Gin Cucumber Cooler',
      ingredients: ['2 oz Gin', '4-5 Cucumber slices', '½ oz Lime Juice', '½ oz Simple Syrup', 'Soda Water to top'],
      instructions: ['Muddle cucumber in shaker', 'Add gin, lime juice, and syrup', 'Shake with ice', 'Strain into glass over ice', 'Top with soda water']
    },
    {
      name: 'Gin Elderflower Spritz',
      ingredients: ['2 oz Gin', '1 oz Elderflower Liqueur', '½ oz Lemon Juice', 'Prosecco to top'],
      instructions: ['Add gin, elderflower liqueur, and lemon juice to shaker', 'Shake with ice', 'Strain into wine glass', 'Top with prosecco']
    },
    {
      name: 'Gin Ginger Rogers',
      ingredients: ['2 oz Gin', '¾ oz Lime Juice', '¾ oz Ginger Syrup', 'Soda Water to top'],
      instructions: ['Add gin, lime juice, and ginger syrup to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Top with soda water']
    },
    {
      name: 'Gin Lemon Drop',
      ingredients: ['2 oz Gin', '1 oz Triple Sec', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into martini glass']
    },
    {
      name: 'Gin Margarita',
      ingredients: ['2 oz Gin', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', 'Salt rim (optional)'],
      instructions: ['Rim glass with salt if desired', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Gin Mojito',
      ingredients: ['2 oz Gin', '1 oz Lime Juice', '2 tsp Sugar', '6-8 Mint Leaves', 'Club Soda to top'],
      instructions: ['Muddle mint with sugar and lime juice', 'Add gin and ice', 'Top with club soda', 'Garnish with mint sprig']
    },
    {
      name: 'Gin Caipirinha',
      ingredients: ['2 oz Gin', '1 Lime cut into wedges', '2 tsp Sugar'],
      instructions: ['Muddle lime wedges with sugar', 'Add gin and ice', 'Stir well', 'Serve with muddled lime']
    },
    {
      name: 'Gin Pisco Sour',
      ingredients: ['2 oz Gin', '1 oz Lime Juice', '¾ oz Simple Syrup', '½ oz Egg White', 'Angostura bitters'],
      instructions: ['Dry shake all ingredients first', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Gin Sidecar',
      ingredients: ['2 oz Gin', '¾ oz Cointreau', '¾ oz Lemon Juice', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Gin Stinger',
      ingredients: ['2 oz Gin', '¾ oz White Crème de Menthe'],
      instructions: ['Add both ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Gin Sazerac Variation',
      ingredients: ['2 oz Gin', '¼ oz Absinthe', '¼ oz Simple Syrup', '2 dashes Peychaud\'s Bitters', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Add gin, syrup, and bitters to mixing glass', 'Stir with ice', 'Strain into prepared glass', 'Garnish with lemon twist']
    },
    {
      name: 'Gin Vieux Carré',
      ingredients: ['1 oz Gin', '1 oz Cognac', '1 oz Sweet Vermouth', '¼ oz Benedictine', '2 dashes Peychaud\'s Bitters', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Gin Paper Plane',
      ingredients: ['¾ oz Gin', '¾ oz Aperol', '¾ oz Amaro Nonino', '¾ oz Lemon Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into coupe glass']
    },
    {
      name: 'Gin French 75 Variation',
      ingredients: ['1 oz Gin', '½ oz Lemon Juice', '½ oz Simple Syrup', '½ oz St. Germain', 'Champagne to top'],
      instructions: ['Add gin, lemon juice, syrup, and St. Germain to shaker', 'Shake with ice', 'Strain into champagne flute', 'Top with champagne']
    },
    {
      name: 'Gin Spritz Veneziano',
      ingredients: ['2 oz Gin', '3 oz Prosecco', '1 oz Soda Water', '½ oz Aperol', 'Orange slice for garnish'],
      instructions: ['Add gin and Aperol to wine glass', 'Fill with ice', 'Top with prosecco and soda', 'Garnish with orange slice']
    },
    {
      name: 'Gin Paloma',
      ingredients: ['2 oz Gin', '½ oz Lime Juice', 'Grapefruit Soda to top', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add gin and lime juice', 'Fill with ice and top with grapefruit soda', 'Stir gently']
    },
    {
      name: 'Gin Mule',
      ingredients: ['2 oz Gin', '½ oz Lime Juice', 'Ginger Beer to top', 'Lime wedge for garnish'],
      instructions: ['Add gin and lime juice to copper mug', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
    },
    {
      name: 'Gin Dark & Stormy',
      ingredients: ['2 oz Gin', 'Ginger Beer to top', 'Lime wedge for garnish'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
    },
    {
      name: 'Gin Cuba Libre',
      ingredients: ['2 oz Gin', 'Coca-Cola to top', '½ oz Lime Juice'],
      instructions: ['Add gin and lime juice to highball glass', 'Fill with ice', 'Top with Coca-Cola', 'Stir gently']
    },
    {
      name: 'Gin Tequila Sunrise',
      ingredients: ['2 oz Gin', '4 oz Orange Juice', '½ oz Grenadine'],
      instructions: ['Add gin to highball glass', 'Fill with ice and orange juice', 'Slowly pour grenadine down the side', 'Do not stir - let it settle']
    },
    {
      name: 'Gin Sea Breeze',
      ingredients: ['2 oz Gin', '3 oz Cranberry Juice', '1 oz Grapefruit Juice'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Add cranberry and grapefruit juice', 'Stir gently']
    },
    {
      name: 'Gin Bay Breeze',
      ingredients: ['2 oz Gin', '3 oz Pineapple Juice', '1 oz Cranberry Juice'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Add pineapple and cranberry juice', 'Stir gently']
    },
    {
      name: 'Gin Madras',
      ingredients: ['2 oz Gin', '3 oz Cranberry Juice', '1 oz Orange Juice'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Add cranberry and orange juice', 'Stir gently']
    },
    {
      name: 'Gin Greyhound',
      ingredients: ['2 oz Gin', 'Grapefruit Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Top with grapefruit juice', 'Garnish with lime wedge']
    },
    {
      name: 'Gin Salty Dog',
      ingredients: ['2 oz Gin', 'Grapefruit Juice to top', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add gin to highball glass', 'Fill with ice', 'Top with grapefruit juice']
    },
    {
      name: 'Gin Screwdriver',
      ingredients: ['2 oz Gin', 'Orange Juice to top', 'Orange slice for garnish'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Top with orange juice', 'Garnish with orange slice']
    },
    {
      name: 'Gin Cape Codder',
      ingredients: ['2 oz Gin', 'Cranberry Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add gin to highball glass', 'Fill with ice', 'Top with cranberry juice', 'Garnish with lime wedge']
    },
    {
      name: 'Gin Sex on the Beach',
      ingredients: ['1½ oz Gin', '½ oz Peach Schnapps', '2 oz Orange Juice', '2 oz Cranberry Juice'],
      instructions: ['Add gin and schnapps to highball glass', 'Fill with ice', 'Add orange and cranberry juice', 'Stir gently']
    },
    {
      name: 'Gin Harvey Wallbanger',
      ingredients: ['1½ oz Gin', '4 oz Orange Juice', '½ oz Galliano'],
      instructions: ['Add gin and orange juice to highball glass', 'Fill with ice', 'Float Galliano on top', 'Do not stir']
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
        },
    {
      name: 'Mai Tai',
      ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Orange Curaçao', '¼ oz Orgeat Syrup', '¼ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice', 'Garnish with mint sprig and lime wheel']
    },
    {
      name: 'Piña Colada',
      ingredients: ['2 oz White Rum', '2 oz Coconut Cream', '4 oz Pineapple Juice', '½ cup Crushed Ice'],
      instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into hurricane glass', 'Garnish with pineapple wedge and cherry']
    },
    {
      name: 'Zombie',
      ingredients: ['1½ oz Gold Rum', '1½ oz Dark Rum', '¾ oz Apricot Brandy', '1 oz Lime Juice', '1 oz Pineapple Juice', '½ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into tiki mug over crushed ice', 'Garnish with mint sprig']
    },
    {
      name: 'Painkiller',
      ingredients: ['2 oz Dark Rum', '4 oz Pineapple Juice', '1 oz Orange Juice', '1 oz Coconut Cream', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Pour into tall glass over ice', 'Garnish with nutmeg']
    },
    {
      name: 'Bahama Mama',
      ingredients: ['1 oz Dark Rum', '1 oz Coconut Rum', '1 oz Coffee Liqueur', '2 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Grenadine'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over ice', 'Garnish with orange slice and cherry']
    },
    {
      name: 'Blue Hawaiian',
      ingredients: ['1½ oz White Rum', '¾ oz Blue Curaçao', '2 oz Pineapple Juice', '1 oz Coconut Cream', '½ cup Crushed Ice'],
      instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour into hurricane glass', 'Garnish with pineapple wedge']
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
    },
    {
      name: 'Rum Runner',
      ingredients: ['1 oz Light Rum', '1 oz Dark Rum', '½ oz Banana Liqueur', '½ oz Blackberry Liqueur', '2 oz Pineapple Juice', '1 oz Orange Juice', '½ oz Lime Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into hurricane glass over ice', 'Garnish with cherry']
    },
    {
      name: 'Planter\'s Punch',
      ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Simple Syrup', '2 dashes Angostura bitters', 'Splash of soda water'],
      instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into tall glass over ice', 'Top with soda water']
    },
    {
      name: 'Navy Punch',
      ingredients: ['2 oz Navy Strength Rum', '¾ oz Lime Juice', '¾ oz Simple Syrup', '2 dashes Angostura bitters'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Rum Swizzle',
      ingredients: ['2 oz Dark Rum', '¾ oz Lime Juice', '½ oz Simple Syrup', '2 dashes Angostura bitters', 'Crushed ice'],
      instructions: ['Add all ingredients to glass', 'Fill with crushed ice', 'Swizzle with swizzle stick', 'Top with bitters']
    },
    {
      name: 'Rum Sour',
      ingredients: ['2 oz White Rum', '¾ oz Lime Juice', '¾ oz Simple Syrup', '½ oz Egg White (optional)', 'Angostura bitters for garnish'],
      instructions: ['Add all ingredients to shaker (dry shake first if using egg white)', 'Shake with ice', 'Strain into rocks glass', 'Garnish with bitters']
    },
    {
      name: 'Rum Old Fashioned',
      ingredients: ['2 oz Aged Rum', '¼ oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to rocks glass', 'Add ice and stir', 'Garnish with orange twist']
    },
    {
      name: 'Rum Manhattan',
      ingredients: ['2 oz Aged Rum', '1 oz Sweet Vermouth', '2 dashes Angostura Bitters', 'Maraschino cherry for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with cherry']
    },
    {
      name: 'Rum Negroni',
      ingredients: ['1 oz Aged Rum', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Rum Boulevardier',
      ingredients: ['1½ oz Aged Rum', '1 oz Campari', '1 oz Sweet Vermouth', 'Orange twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with orange twist']
    },
    {
      name: 'Rum Martinez',
      ingredients: ['1½ oz Aged Rum', '1½ oz Sweet Vermouth', '¼ oz Maraschino Liqueur', '2 dashes Orange Bitters', 'Lemon twist for garnish'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass', 'Garnish with lemon twist']
    },
    {
      name: 'Rum Sazerac',
      ingredients: ['2 oz Aged Rum', '¼ oz Absinthe', '1 Sugar Cube', '3 dashes Peychaud\'s Bitters', 'Lemon twist for garnish'],
      instructions: ['Rinse glass with absinthe', 'Muddle sugar with bitters', 'Add rum and ice', 'Stir and strain', 'Garnish with lemon twist']
    },
    {
      name: 'Rum Vieux Carré',
      ingredients: ['1 oz Aged Rum', '1 oz Cognac', '1 oz Sweet Vermouth', '¼ oz Benedictine', '2 dashes Peychaud\'s Bitters', '2 dashes Angostura Bitters'],
      instructions: ['Add all ingredients to mixing glass', 'Stir with ice', 'Strain into rocks glass over ice', 'Garnish with lemon twist']
    },
    {
      name: 'Rum Sidecar',
      ingredients: ['2 oz Aged Rum', '¾ oz Cointreau', '¾ oz Lemon Juice', 'Sugar rim'],
      instructions: ['Rim glass with sugar', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into prepared glass']
    },
    {
      name: 'Rum Stinger',
      ingredients: ['2 oz Aged Rum', '¾ oz White Crème de Menthe'],
      instructions: ['Add both ingredients to mixing glass', 'Stir with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Rum Flip',
      ingredients: ['2 oz Dark Rum', '¾ oz Simple Syrup', '1 Whole Egg', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Dry shake without ice', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with nutmeg']
    },
    {
      name: 'Rum Toddy',
      ingredients: ['2 oz Dark Rum', '1 tbsp Honey', '½ oz Lemon Juice', '4 oz Hot Water', 'Cinnamon stick for garnish'],
      instructions: ['Add honey and lemon to mug', 'Add rum and hot water', 'Stir until honey dissolves', 'Garnish with cinnamon stick']
    },
    {
      name: 'Rum Milk Punch',
      ingredients: ['2 oz Dark Rum', '4 oz Milk', '½ oz Simple Syrup', '½ tsp Vanilla Extract', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with nutmeg']
    },
    {
      name: 'Rum Alexander',
      ingredients: ['2 oz Dark Rum', '1 oz Dark Crème de Cacao', '1 oz Cream', 'Fresh grated nutmeg'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass', 'Garnish with nutmeg']
    },
    {
      name: 'Rum Sangaree',
      ingredients: ['2 oz Dark Rum', '½ oz Simple Syrup', '1 oz Port Wine float', 'Fresh grated nutmeg'],
      instructions: ['Add rum and syrup to glass', 'Fill with ice', 'Float port wine on top', 'Garnish with nutmeg']
    },
    {
      name: 'Rum Cobbler',
      ingredients: ['2 oz Rum', '½ oz Simple Syrup', 'Seasonal fruits', 'Crushed ice'],
      instructions: ['Fill glass with crushed ice', 'Add rum and syrup', 'Stir gently', 'Garnish with seasonal fruits']
    },
    {
      name: 'Rum Fix',
      ingredients: ['2 oz Rum', '¾ oz Lemon Juice', '½ oz Simple Syrup', 'Crushed ice'],
      instructions: ['Fill glass with crushed ice', 'Add rum, lemon juice, and syrup', 'Stir gently', 'Garnish with lemon slice']
    },
    {
      name: 'Rum Julep',
      ingredients: ['2½ oz Rum', '8-10 Mint Leaves', '½ oz Simple Syrup', 'Crushed ice'],
      instructions: ['Muddle mint with simple syrup', 'Add rum and crushed ice', 'Stir until frost forms', 'Garnish with mint sprig']
    },
    {
      name: 'Rum Rickey',
      ingredients: ['2 oz Rum', '½ oz Lime Juice', 'Club Soda to top'],
      instructions: ['Add rum and lime juice to highball glass', 'Fill with ice', 'Top with club soda', 'Stir gently']
    },
    {
      name: 'Rum Buck',
      ingredients: ['2 oz Rum', '½ oz Lime Juice', 'Ginger Ale to top'],
      instructions: ['Add rum and lime juice to highball glass', 'Fill with ice', 'Top with ginger ale', 'Stir gently']
    },
    {
      name: 'Rum Collins',
      ingredients: ['2 oz Rum', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add rum, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into collins glass over ice', 'Top with club soda']
    },
    {
      name: 'Rum Fizz',
      ingredients: ['2 oz Rum', '1 oz Lemon Juice', '¾ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add rum, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass', 'Top with club soda']
    },
    {
      name: 'Rum Sling',
      ingredients: ['2 oz Rum', '1 oz Lemon Juice', '½ oz Simple Syrup', 'Club Soda to top'],
      instructions: ['Add rum, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into highball glass over ice', 'Top with club soda']
    },
    {
      name: 'Rum Daisy',
      ingredients: ['2 oz Rum', '¾ oz Lemon Juice', '½ oz Orange Curaçao', '½ oz Simple Syrup', 'Splash of Club Soda'],
      instructions: ['Add all ingredients except soda to shaker', 'Shake with ice', 'Strain into glass over ice', 'Top with club soda']
    },
    {
      name: 'Rum Smash',
      ingredients: ['2 oz Rum', '¾ oz Simple Syrup', '3 Lemon Wedges', '6-8 Mint Leaves'],
      instructions: ['Muddle lemon and mint in shaker', 'Add rum and syrup', 'Shake with ice', 'Strain into rocks glass over ice']
    },
    {
      name: 'Rum Press',
      ingredients: ['2 oz Rum', '½ oz Lime Juice', 'Club Soda to top', '7-Up to top'],
      instructions: ['Add rum and lime juice to highball glass', 'Fill with ice', 'Top with equal parts club soda and 7-Up', 'Stir gently']
    },
    {
      name: 'Rum Mule',
      ingredients: ['2 oz Rum', '½ oz Lime Juice', 'Ginger Beer to top', 'Lime wedge for garnish'],
      instructions: ['Add rum and lime juice to copper mug', 'Fill with ice', 'Top with ginger beer', 'Garnish with lime wedge']
    },
    {
      name: 'Rum Margarita',
      ingredients: ['2 oz Rum', '1 oz Lime Juice', '¾ oz Triple Sec', '½ oz Simple Syrup', 'Salt rim (optional)'],
      instructions: ['Rim glass with salt if desired', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice']
    },
    {
      name: 'Rum Cosmo',
      ingredients: ['1½ oz Rum', '1 oz Cointreau', '½ oz Lime Juice', '1 oz Cranberry Juice'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled martini glass', 'Garnish with lime wheel']
    },
    {
      name: 'Rum Martini',
      ingredients: ['2½ oz Rum', '½ oz Dry Vermouth', 'Lemon twist or olive for garnish'],
      instructions: ['Add rum and vermouth to mixing glass', 'Stir with ice for 30 seconds', 'Strain into chilled martini glass', 'Garnish with lemon twist or olive']
    },
    {
      name: 'Rum Gimlet',
      ingredients: ['2 oz Rum', '¾ oz Lime Juice', '¾ oz Simple Syrup'],
      instructions: ['Add all ingredients to shaker', 'Shake with ice', 'Strain into chilled coupe glass']
    },
    {
      name: 'Rum French 75',
      ingredients: ['1 oz Rum', '½ oz Lemon Juice', '½ oz Simple Syrup', 'Champagne to top'],
      instructions: ['Add rum, lemon juice, and syrup to shaker', 'Shake with ice', 'Strain into champagne flute', 'Top with champagne']
    },
    {
      name: 'Rum Bloody Mary',
      ingredients: ['2 oz Rum', '4 oz Tomato Juice', '½ oz Lemon Juice', '2 dashes Hot Sauce', '2 dashes Worcestershire Sauce', 'Pinch of Salt and Pepper', 'Celery stalk for garnish'],
      instructions: ['Rim glass with salt and pepper', 'Add all ingredients to shaker', 'Shake with ice', 'Strain into glass over ice', 'Garnish with celery']
    },
    {
      name: 'Rum Screwdriver',
      ingredients: ['2 oz Rum', 'Orange Juice to top', 'Orange slice for garnish'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Top with orange juice', 'Garnish with orange slice']
    },
    {
      name: 'Rum Cape Codder',
      ingredients: ['2 oz Rum', 'Cranberry Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Top with cranberry juice', 'Garnish with lime wedge']
    },
    {
      name: 'Rum Sea Breeze',
      ingredients: ['2 oz Rum', '3 oz Cranberry Juice', '1 oz Grapefruit Juice'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Add cranberry and grapefruit juice', 'Stir gently']
    },
    {
      name: 'Rum Bay Breeze',
      ingredients: ['2 oz Rum', '3 oz Pineapple Juice', '1 oz Cranberry Juice'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Add pineapple and cranberry juice', 'Stir gently']
    },
    {
      name: 'Rum Madras',
      ingredients: ['2 oz Rum', '3 oz Cranberry Juice', '1 oz Orange Juice'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Add cranberry and orange juice', 'Stir gently']
    },
    {
      name: 'Rum Greyhound',
      ingredients: ['2 oz Rum', 'Grapefruit Juice to top', 'Lime wedge for garnish'],
      instructions: ['Add rum to highball glass', 'Fill with ice', 'Top with grapefruit juice', 'Garnish with lime wedge']
    },
    {
      name: 'Rum Salty Dog',
      ingredients: ['2 oz Rum', 'Grapefruit Juice to top', 'Salt rim'],
      instructions: ['Rim glass with salt', 'Add rum to highball glass', 'Fill with ice', 'Top with grapefruit juice']
    },
    {
      name: 'Rum Sex on the Beach',
      ingredients: ['1½ oz Rum', '½ oz Peach Schnapps', '2 oz Orange Juice', '2 oz Cranberry Juice'],
      instructions: ['Add rum and schnapps to highball glass', 'Fill with ice', 'Add orange and cranberry juice', 'Stir gently']
    },
    {
      name: 'Rum Harvey Wallbanger',
      ingredients: ['1½ oz Rum', '4 oz Orange Juice', '½ oz Galliano'],
      instructions: ['Add rum and orange juice to highball glass', 'Fill with ice', 'Float Galliano on top', 'Do not stir']
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
        },
     {
      name: 'B-52',
      ingredients: ['⅓ oz Kahlúa', '⅓ oz Baileys Irish Cream', '⅓ oz Grand Marnier'],
      instructions: ['Layer in order: Kahlúa, Baileys, Grand Marnier', 'Serve as layered shot', 'Do not mix']
    },
    {
      name: 'Slippery Nipple',
      ingredients: ['½ oz Sambuca', '½ oz Baileys Irish Cream'],
      instructions: ['Layer Baileys over Sambuca', 'Serve as layered shot']
    },
    {
      name: 'Jelly Bean',
      ingredients: ['½ oz Blackberry Brandy', '½ oz Anisette', 'Sour Mix'],
      instructions: ['Layer brandy and anisette in shot glass', 'Drop into half glass of sour mix', 'Drink immediately']
    },
    {
      name: 'Purple Hooter',
      ingredients: ['½ oz Vodka', '½ oz Raspberry Liqueur', '½ oz Sour Mix', 'Lemon-Lime Soda'],
      instructions: ['Mix vodka and raspberry liqueur in shot glass', 'Drop into half glass of sour mix and soda', 'Drink immediately']
    },
    {
      name: 'Cement Mixer',
      ingredients: ['½ oz Irish Cream', '½ oz Lime Juice'],
      instructions: ['Layer Irish cream and lime juice in shot glass', 'Drop into empty glass', 'Let curdle then drink']
    },
    {
      name: 'Scooby Snack',
      ingredients: ['½ oz Malibu Rum', '½ oz Midori', '½ oz Pineapple Juice', 'Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Drop into half glass with cream', 'Drink immediately']
    },
    {
      name: 'Jolly Rancher',
      ingredients: ['½ oz Vodka', '½ oz Watermelon Schnapps', '½ oz Sour Apple Schnapps', 'Cranberry Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of cranberry juice', 'Drink immediately']
    },
    {
      name: 'Pineapple Bomb',
      ingredients: ['½ oz Malibu Rum', '½ oz Vodka', 'Pineapple Juice'],
      instructions: ['Mix Malibu and vodka in shot glass', 'Drop into half glass of pineapple juice', 'Drink immediately']
    },
    {
      name: 'Caribou Lou',
      ingredients: ['½ oz 151 Proof Rum', '½ oz Malibu Rum', '½ oz Pineapple Juice'],
      instructions: ['Mix all ingredients in shot glass', 'Drop into half glass of pineapple juice', 'Drink immediately']
    },
    {
      name: 'Washington Apple Bomb',
      ingredients: ['½ oz Crown Royal', '½ oz Sour Apple Schnapps', 'Cranberry Juice'],
      instructions: ['Layer Crown Royal and sour apple in shot glass', 'Drop into half glass of cranberry juice', 'Drink immediately']
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
      name: 'Car Bomb',
      ingredients: ['½ oz Irish Cream', '½ oz Irish Whiskey', 'Guinness Stout'],
      instructions: ['Layer Irish cream and whiskey in shot glass', 'Drop into half glass of Guinness', 'Drink immediately']
    },
    {
      name: 'Atomic Bomb',
      ingredients: ['½ oz Vodka', '½ oz Rum', '½ oz Tequila', '½ oz Gin', 'Energy Drink'],
      instructions: ['Mix all liquors in shot glass', 'Drop into half glass of energy drink', 'Drink immediately']
    },
    {
      name: 'Mind Eraser',
      ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', '½ oz Club Soda'],
      instructions: ['Layer vodka and coffee liqueur in shot glass', 'Drop into half glass of club soda', 'Drink immediately']
    },
    {
      name: 'Tequila Bomb',
      ingredients: ['1 oz Tequila', 'Lager Beer'],
      instructions: ['Pour tequila into shot glass', 'Drop shot into half glass of lager', 'Drink immediately']
    },
    {
      name: 'Flaming Dr. Pepper',
      ingredients: ['½ oz Amaretto', '½ oz 151 Proof Rum', 'Beer'],
      instructions: ['Layer amaretto and 151 rum in shot glass', 'Ignite the rum', 'Drop into half glass of beer', 'Extinguish and drink']
    },
    {
      name: 'Screaming Orgasm',
      ingredients: ['½ oz Vodka', '½ oz Amaretto', '½ oz Coffee Liqueur', '½ oz Irish Cream', 'Milk'],
      instructions: ['Mix all liquors in shot glass', 'Drop into half glass of milk', 'Drink immediately']
    },
    {
      name: 'Baby Guinness',
      ingredients: ['¾ oz Coffee Liqueur', '¼ oz Irish Cream'],
      instructions: ['Layer Irish cream over coffee liqueur', 'Create Guinness-like appearance', 'Serve as layered shot']
    },
    {
      name: 'Irish Car Bomb',
      ingredients: ['½ oz Irish Cream', '½ oz Irish Whiskey', 'Guinness Stout'],
      instructions: ['Layer Irish cream and whiskey in shot glass', 'Drop into half glass of Guinness', 'Drink immediately']
    },
    {
      name: 'Three Wise Men',
      ingredients: ['⅓ oz Jack Daniels', '⅓ oz Jim Beam', '⅓ oz Johnnie Walker'],
      instructions: ['Layer all three whiskeys in shot glass', 'Serve as straight shot', 'Drink in one go']
    },
    {
      name: 'Four Horsemen',
      ingredients: ['¼ oz Jack Daniels', '¼ oz Jim Beam', '¼ oz Johnnie Walker', '¼ oz Jose Cuervo'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot', 'Drink carefully']
    },
    {
      name: 'Sake Bomb',
      ingredients: ['1 oz Sake', 'Lager Beer'],
      instructions: ['Pour sake into shot glass', 'Drop shot into half glass of lager', 'Drink immediately']
    },
    {
      name: 'Jäger Bomb (Variant)',
      ingredients: ['1 oz Jägermeister', 'Energy Drink'],
      instructions: ['Pour Jägermeister into shot glass', 'Drop shot into half glass of energy drink', 'Drink immediately']
    },
    {
      name: 'Vegas Bomb',
      ingredients: ['½ oz Crown Royal', '½ oz Peach Schnapps', '½ oz Cranberry Juice', 'Red Bull'],
      instructions: ['Layer Crown Royal, peach schnapps, and cranberry in shot glass', 'Drop into half glass of Red Bull', 'Drink immediately']
    },
    {
      name: 'Cinnamon Toast',
      ingredients: ['½ oz Fireball', '½ oz RumChata'],
      instructions: ['Layer Fireball and RumChata in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Caramel Apple',
      ingredients: ['½ oz Butterscotch Schnapps', '½ oz Sour Apple Schnapps'],
      instructions: ['Layer schnapps in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Chocolate Cake',
      ingredients: ['1 oz Vanilla Vodka', '½ oz Frangelico', 'Lemon wedge and sugar'],
      instructions: ['Coat lemon wedge in sugar', 'Shoot vodka and Frangelico', 'Suck lemon wedge immediately after']
    },
    {
      name: 'Birthday Cake',
      ingredients: ['1 oz Vanilla Vodka', '½ oz Cake Liqueur', 'Sprinkles for garnish'],
      instructions: ['Rim shot glass with sprinkles', 'Add vodka and cake liqueur to shaker', 'Shake with ice', 'Strain into shot glass']
    },
    {
      name: 'Pumpkin Pie',
      ingredients: ['½ oz Vanilla Vodka', '½ oz Pumpkin Liqueur', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Key Lime Pie',
      ingredients: ['½ oz Vanilla Vodka', '½ oz Lime Juice', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Banana Split',
      ingredients: ['½ oz Banana Liqueur', '½ oz Chocolate Liqueur', '½ oz Cream'],
      instructions: ['Layer liqueurs and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Strawberry Shortcake',
      ingredients: ['½ oz Strawberry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Blueberry Muffin',
      ingredients: ['½ oz Blueberry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Coconut Cream Pie',
      ingredients: ['½ oz Coconut Rum', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Peach Cobbler',
      ingredients: ['½ oz Peach Schnapps', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Apple Pie',
      ingredients: ['½ oz Apple Schnapps', '½ oz Cinnamon Schnapps', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Cherry Cheesecake',
      ingredients: ['½ oz Cherry Liqueur', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Mocha',
      ingredients: ['½ oz Coffee Liqueur', '½ oz Chocolate Liqueur', '½ oz Cream'],
      instructions: ['Layer liqueurs and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'White Russian Shot',
      ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', '½ oz Cream'],
      instructions: ['Layer vodka, coffee liqueur, and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Black Russian Shot',
      ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur'],
      instructions: ['Mix vodka and coffee liqueur in shot glass', 'Serve straight']
    },
    {
      name: 'Espresso Shot',
      ingredients: ['½ oz Vodka', '½ oz Coffee Liqueur', 'Fresh Espresso'],
      instructions: ['Mix vodka and coffee liqueur in shot glass', 'Drop into half glass of espresso', 'Drink immediately']
    },
    {
      name: 'Cappuccino Shot',
      ingredients: ['½ oz Coffee Liqueur', '½ oz Irish Cream', '½ oz Cream'],
      instructions: ['Layer liqueurs and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Caramel Macchiato Shot',
      ingredients: ['½ oz Caramel Liqueur', '½ oz Coffee Liqueur', '½ oz Cream'],
      instructions: ['Layer liqueurs and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Vanilla Latte Shot',
      ingredients: ['½ oz Vanilla Vodka', '½ oz Coffee Liqueur', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Hazelnut Shot',
      ingredients: ['½ oz Hazelnut Liqueur', '½ oz Coffee Liqueur', '½ oz Cream'],
      instructions: ['Layer liqueurs and cream in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Almond Joy',
      ingredients: ['½ oz Amaretto', '½ oz Coconut Rum', '½ oz Chocolate Liqueur'],
      instructions: ['Layer liqueurs in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Snickers',
      ingredients: ['½ oz Caramel Liqueur', '½ oz Chocolate Liqueur', '½ oz Peanut Liqueur'],
      instructions: ['Layer liqueurs in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Reese\'s',
      ingredients: ['½ oz Chocolate Liqueur', '½ oz Peanut Butter Whiskey'],
      instructions: ['Layer liqueurs in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Twix',
      ingredients: ['½ oz Caramel Liqueur', '½ oz Chocolate Liqueur', '½ oz Vanilla Vodka'],
      instructions: ['Layer liqueurs and vodka in shot glass', 'Serve as layered shot']
    },
    {
      name: 'Oreo',
      ingredients: ['½ oz Chocolate Liqueur', '½ oz Vanilla Vodka', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Grasshopper Shot',
      ingredients: ['½ oz Green Crème de Menthe', '½ oz White Crème de Cacao', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Golden Cadillac Shot',
      ingredients: ['½ oz Galliano', '½ oz White Crème de Cacao', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Pink Squirrel Shot',
      ingredients: ['½ oz Crème de Noyaux', '½ oz White Crème de Cacao', '½ oz Cream'],
      instructions: ['Mix all ingredients in shot glass', 'Serve chilled']
    },
    {
      name: 'Angel\'s Tip',
      ingredients: ['½ oz White Crème de Cacao', '½ oz Cream', 'Maraschino cherry'],
      instructions: ['Layer cream over crème de cacao', 'Top with cherry', 'Serve as layered shot']
    },
    {
      name: 'B-53',
      ingredients: ['⅓ oz Kahlúa', '⅓ oz Sambuca', '⅓ oz Irish Cream'],
      instructions: ['Layer in order: Kahlúa, Sambuca, Irish Cream', 'Serve as layered shot']
    },
    {
      name: 'B-54',
      ingredients: ['⅓ oz Kahlúa', '⅓ oz Grand Marnier', '⅓ oz Frangelico'],
      instructions: ['Layer in order: Kahlúa, Grand Marnier, Frangelico', 'Serve as layered shot']
    },
    {
      name: 'B-55',
      ingredients: ['⅓ oz Kahlúa', '⅓ oz Amaretto', '⅓ oz Irish Cream'],
      instructions: ['Layer in order: Kahlúa, Amaretto, Irish Cream', 'Serve as layered shot']
    },
    {
      name: 'Tokyo Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Midori'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Long Island Iced Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'AMF Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Blue Curaçao'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Grateful Dead Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Chambord'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Adios Motherf***er Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Blue Curaçao', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Tokyo Iced Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Midori'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Miami Iced Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Peach Schnapps'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'California Iced Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Midori'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Texas Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Whiskey'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Electric Iced Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Blue Curaçao'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Gator Aid Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Melon Liqueur'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Gin Long Island Shot',
      ingredients: ['½ oz Gin', '¼ oz Vodka', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Vodka Long Island Shot',
      ingredients: ['½ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Rum Long Island Shot',
      ingredients: ['½ oz Rum', '¼ oz Vodka', '¼ oz Gin', '¼ oz Tequila', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Tequila Long Island Shot',
      ingredients: ['½ oz Tequila', '¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Triple Sec'],
      instructions: ['Mix all liquors in shot glass', 'Serve as straight shot']
    },
    {
      name: 'Long Beach Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Cranberry Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of cranberry juice', 'Drink immediately']
    },
    {
      name: 'AMF Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Blue Curaçao', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Tokyo Tea Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Watermelon Pucker', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Miami Iced Tea Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Peach Schnapps', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'California Iced Tea Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Midori', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Texas Tea Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Whiskey', 'Coke'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Coke', 'Drink immediately']
    },
    {
      name: 'Electric Iced Tea Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', '¼ oz Blue Curaçao', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Grateful Dead Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Chambord', '¼ oz Triple Sec', 'Coke'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Coke', 'Drink immediately']
    },
    {
      name: 'Adios Motherf***er Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Blue Curaçao', '¼ oz Triple Sec', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Gator Aid Shot (Variant)',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Melon Liqueur', 'Sprite'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of Sprite', 'Drink immediately']
    },
    {
      name: 'Long Island Lemonade Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Lemonade'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of lemonade', 'Drink immediately']
    },
    {
      name: 'Long Island Sweet Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Sweet Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of sweet tea', 'Drink immediately']
    },
    {
      name: 'Long Island Arnold Palmer Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Half Lemonade Half Sweet Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of lemonade and sweet tea', 'Drink immediately']
    },
    {
      name: 'Long Island Pineapple Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Pineapple Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of pineapple juice', 'Drink immediately']
    },
    {
      name: 'Long Island Orange Juice Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Orange Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of orange juice', 'Drink immediately']
    },
    {
      name: 'Long Island Grapefruit Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Grapefruit Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of grapefruit juice', 'Drink immediately']
    },
    {
      name: 'Long Island Apple Juice Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Apple Juice'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of apple juice', 'Drink immediately']
    },
    {
      name: 'Long Island Ginger Ale Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Ginger Ale'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of ginger ale', 'Drink immediately']
    },
    {
      name: 'Long Island Club Soda Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Club Soda'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of club soda', 'Drink immediately']
    },
    {
      name: 'Long Island Energy Drink Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Monster/Red Bull'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of energy drink', 'Drink immediately']
    },
    {
      name: 'Long Island Coconut Water Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Coconut Water'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of coconut water', 'Drink immediately']
    },
    {
      name: 'Long Island Green Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Green Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of green tea', 'Drink immediately']
    },
    {
      name: 'Long Island Hibiscus Tea Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Hibiscus Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of hibiscus tea', 'Drink immediately']
    },
    {
      name: 'Long Island Chai Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Chai Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of chai tea', 'Drink immediately']
    },
    {
      name: 'Long Island Horchata Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Horchata'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of horchata', 'Drink immediately']
    },
    {
      name: 'Long Island Matcha Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Matcha Green Tea'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of matcha tea', 'Drink immediately']
    },
    {
      name: 'Long Island Yerba Mate Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Yerba Mate'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of yerba mate', 'Drink immediately']
    },
    {
      name: 'Long Island Kombucha Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Kombucha'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of kombucha', 'Drink immediately']
    },
    {
      name: 'Long Island Cold Brew Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Cold Brew Coffee'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of cold brew', 'Drink immediately']
    },
    {
      name: 'Long Island Espresso Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Fresh Espresso'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of espresso', 'Drink immediately']
    },
    {
      name: 'Long Island Chocolate Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Chocolate Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of chocolate milk', 'Drink immediately']
    },
    {
      name: 'Long Island Almond Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Almond Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of almond milk', 'Drink immediately']
    },
    {
      name: 'Long Island Oat Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Oat Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of oat milk', 'Drink immediately']
    },
    {
      name: 'Long Island Coconut Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Coconut Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of coconut milk', 'Drink immediately']
    },
    {
      name: 'Long Island Soy Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Soy Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of soy milk', 'Drink immediately']
    },
    {
      name: 'Long Island Rice Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Rice Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of rice milk', 'Drink immediately']
    },
    {
      name: 'Long Island Hemp Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Hemp Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of hemp milk', 'Drink immediately']
    },
    {
      name: 'Long Island Cashew Milk Shot',
      ingredients: ['¼ oz Vodka', '¼ oz Gin', '¼ oz Rum', '¼ oz Tequila', '¼ oz Triple Sec', 'Cashew Milk'],
      instructions: ['Mix liquors in shot glass', 'Drop into half glass of cashew milk', 'Drink immediately']
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