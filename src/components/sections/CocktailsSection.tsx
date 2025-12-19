import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { getAllCategories, getCocktails, searchCocktails as searchCocktailsAPI } from '@/lib/supabase-cocktails';
import type { Cocktail, CocktailCategory } from '@/types/cocktails';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle } from '@/lib/brand-styles';

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
          <h4 style={cardHeaderStyle}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '0', marginTop: '15px' }}>
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

  const cocktailColor = cocktailColors[index % cocktailColors.length];

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
          ...cardHeaderStyle,
          fontSize: '1.1rem',
          marginBottom: '15px',
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

  const glowColor = glowColors[index % glowColors.length];

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
        transition: 'none', // Removed - caused scroll crashes
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

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div style={{ padding: '25px' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            margin: '15px 0',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Error Display Component
function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h3 style={sectionHeaderStyle}>⚠️ Error Loading Cocktails</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px' }}>{message}</p>
        <button
          onClick={onRetry}
          style={{
            padding: '12px 24px',
            background: 'rgba(239, 68, 68, 0.3)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}
        >
          Try Again
        </button>
      </div>
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

  // Track section visit
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

  // Fetch categories and cocktails on mount
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
      setError('Failed to load cocktails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter cocktails based on search and category
  useEffect(() => {
    let filtered = cocktails;

    // Filter by category
    if (selectedCategory !== 'All') {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) {
        filtered = filtered.filter(c => c.category_id === category.id);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cocktail =>
        cocktail.name.toLowerCase().includes(query) ||
        cocktail.ingredients.some(ing => ing.toLowerCase().includes(query))
      );
    }

    setFilteredCocktails(filtered);
  }, [searchQuery, selectedCategory, cocktails, categories]);

  // Get all categories for tabs
  const allCategories = ['All', ...categories.map(cat => cat.name)];

  if (loading) {
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
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
        }}
        className="active"
      >
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0
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
            Loading cocktails...
          </p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
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
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
        }}
        className="active"
      >
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0
          }}>
            Cocktail Recipe Database
          </h3>
        </div>
        <ErrorDisplay message={error} onRetry={fetchData} />
      </div>
    );
  }

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
          <h3 style={sectionHeaderStyle}>
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

        {/* Category Tabs */}
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
                  key={cocktail.id}
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
              <h4 style={cardHeaderStyle}>No cocktails found</h4>
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