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

// High-contrast solid gold for small text legibility
export const solidGoldStyle = {
    color: '#FFD700',
    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.5))',
};

// Branding Font Utility
export const brandFont = 'var(--font-outfit), sans-serif';

// Style for Sidebar Navigation Links
export const navLinkTextStyle = {
    ...solidGoldStyle,
    fontFamily: brandFont,
    fontWeight: 500, // Increased weight for better legibility
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontSize: '0.85rem',
};

// Base Style for Section Headers (Structure only)
export const sectionHeaderStyle = {
    fontFamily: brandFont,
    fontWeight: 200,
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
    fontSize: '1.4rem',
    margin: 0,
};

// Premium Card Title Style (Structure only)
export const cardHeaderStyle = {
    fontFamily: brandFont,
    fontWeight: 400,
    fontSize: '1.2rem',
    letterSpacing: '1px',
    margin: 0,
};

// Full Gold Header styles (for convenience in cases without icons)
export const goldSectionHeaderStyle = {
    ...sectionHeaderStyle,
    ...goldTextStyle,
};

export const goldCardHeaderStyle = {
    ...cardHeaderStyle,
    ...goldTextStyle,
};
