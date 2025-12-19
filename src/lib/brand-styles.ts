/**
 * Centralized branding styles for the Decades Bar Management Portal.
 * Consistent use of the Cinematic Gold effect and Outfit font.
 */

// Cinematic Gold Text Effect Gradient & Shadow
export const goldTextStyle = {
    background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.5))',
};

// Branding Font Utility
export const brandFont = 'var(--font-outfit), sans-serif';

// Base Style for Section Headers (Main title at the top of sections)
export const sectionHeaderStyle = {
    ...goldTextStyle,
    fontFamily: brandFont,
    fontWeight: 200,
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
    fontSize: '1.4rem',
    margin: 0,
};

// Style for Sidebar Navigation Links
export const navLinkTextStyle = {
    ...goldTextStyle,
    fontFamily: brandFont,
    fontWeight: 300, // Slightly thicker for readability in small navigation links
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontSize: '0.9rem',
};

// Premium Card Title Style
export const cardHeaderStyle = {
    ...goldTextStyle,
    fontFamily: brandFont,
    fontWeight: 400,
    fontSize: '1.2rem',
    letterSpacing: '1px',
};
