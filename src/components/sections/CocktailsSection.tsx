import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { getAllCategories, getCocktails } from '@/lib/supabase-cocktails';
import type { Cocktail, CocktailCategory } from '@/types/cocktails';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Standard Aloha Blue Background
const SECTION_BLUE = 'rgba(37, 99, 235, 0.2)';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, footer, children }: any) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            ...cardHeaderStyle,
            ...premiumWhiteStyle,
            letterSpacing: '3px',
            fontSize: '1rem'
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '16px 20px' }}>
          {children || (
            <>
              <p style={{ ...premiumBodyStyle, marginBottom: '12px', fontSize: '0.95rem' }}>{description}</p>
              <ul style={{ paddingLeft: '18px', marginBottom: '0', marginTop: '12px' }}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ ...premiumBodyStyle, marginBottom: '6px', fontSize: '0.9rem' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Cocktail Card Component - ALOHA STYLED
function CocktailCard({ name, ingredients, instructions }: {
  name: string;
  ingredients: string[];
  instructions: string[];
}) {
  return (
    <div
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          ...cardHeaderStyle,
          ...premiumWhiteStyle,
          fontSize: '1rem',
          marginBottom: '15px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px',
          letterSpacing: '2px'
        }}>
          {name}
        </h5>

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 400,
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            Ingredients:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>
            {ingredients.map((ingredient, idx) => (
              <li key={idx} style={{
                ...premiumBodyStyle,
                marginBottom: '4px',
                fontSize: '0.9rem',
                fontWeight: 300
              }}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 400,
            marginBottom: '8px',
            marginTop: '15px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            Instructions:
          </div>
          <ol style={{ margin: '8px 0', paddingLeft: '18px' }}>
            {instructions.map((instruction, idx) => (
              <li key={idx} style={{
                ...premiumBodyStyle,
                marginBottom: '4px',
                fontSize: '0.9rem',
                fontWeight: 300
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

// Category Tab Component - ALOHA STYLED
function CategoryTab({ category, isActive, onClick }: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: isActive
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: 300,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 4px 12px rgba(255, 255, 255, 0.1)' : 'none'
      }}
    >
      {category}
    </button>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div style={{ padding: '25px' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: '100px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            margin: '15px 0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: 0.5
          }}
        />
      ))}
    </div>
  );
}

export default function CocktailsSection() {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<CocktailCategory[]>([]);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'cocktails', 60);
    }, 60000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesData, cocktailsData] = await Promise.all([
        getAllCategories(),
        getCocktails()
      ]);
      setCategories(categoriesData);
      setCocktails(cocktailsData);
      setFilteredCocktails(cocktailsData);
    } catch (err) {
      console.error('Error fetching cocktail data:', err);
      setError('Failed to load cocktails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = cocktails;
    if (selectedCategory !== 'All') {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) filtered = filtered.filter(c => c.category_id === category.id);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cocktail =>
        cocktail.name.toLowerCase().includes(query) ||
        cocktail.ingredients.some(ing => ing.toLowerCase().includes(query))
      );
    }
    setFilteredCocktails(filtered);
  }, [searchQuery, selectedCategory, cocktails, categories]);

  const allCategories = ['All', ...categories.map(cat => cat.name)];

  return (
    <div
      id="cocktails"
      style={{
        marginBottom: '25px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            Cocktail Recipes
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.7,
            color: 'white',
            fontSize: '0.8rem',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Professional builds and mixology standards
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          color: 'white',
          fontWeight: 300,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '1px'
        }}>
          {filteredCocktails.length} RECIPES
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Search Bar */}
        <AnimatedCard title="🔍 Search Database">
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 300,
                letterSpacing: '0.5px'
              }}
            />
          </div>
        </AnimatedCard>

        {/* Categories */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          margin: '10px 0 20px 0',
          padding: '0 5px'
        }}>
          {allCategories.map((category) => (
            <CategoryTab
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>

        {loading ? <LoadingSkeleton /> : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            marginTop: '10px'
          }}>
            {filteredCocktails.length > 0 ? (
              filteredCocktails.map((cocktail) => (
                <CocktailCard
                  key={cocktail.id}
                  name={cocktail.name}
                  ingredients={cocktail.ingredients}
                  instructions={cocktail.instructions}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                <p style={premiumBodyStyle}>No recipes match your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Best Practices */}
        <AnimatedCard
          title="🎯 Mixology Standards"
        >
          <ul style={{
            margin: 0,
            paddingLeft: '18px',
            ...premiumBodyStyle,
            opacity: 0.9,
            fontSize: '0.9rem'
          }}>
            <li style={{ marginBottom: '8px' }}>Always use fresh ingredients and juices when possible</li>
            <li style={{ marginBottom: '8px' }}>Measure accurately for consistency - use the jigger</li>
            <li style={{ marginBottom: '8px' }}>Shake cocktails vigorously for proper dilution and chill</li>
            <li style={{ marginBottom: '8px' }}>Garnish appropriately for presentation and aroma</li>
            <li style={{ marginBottom: '8px' }}>Keep your workstation organized and clean at all times</li>
          </ul>
        </AnimatedCard>

        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}