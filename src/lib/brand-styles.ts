/**
 * Centralized branding styles for the Decades Bar Management Portal.
 * Consistent use of the Cinematic Gold effect and Outfit font.
 */

// Cinematic Gold Text Effect Gradient & Shadow
export const goldTextStyle = {
    background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

// High-contrast solid gold for small text legibility
export const solidGoldStyle = {
    color: '#FFD700',
};

// Premium White Style (Aloha POS Style)
export const premiumWhiteStyle = {
    color: '#FFFFFF',
    fontWeight: 200,
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
};

// Premium Body Style (Aloha Content Style)
export const premiumBodyStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: 300,
    lineHeight: '1.6',
    letterSpacing: '0.5px',
};

// Branding Font Utility
export const brandFont = 'var(--font-outfit), sans-serif';

// Style for Sidebar Navigation Links
export const navLinkTextStyle = {
    ...premiumWhiteStyle,
    fontFamily: brandFont,
    fontWeight: 300, // Slightly heavier than header for better legibility in nav
    textTransform: 'uppercase' as const,
    letterSpacing: '2px', // Wide spacing
    fontSize: '0.85rem',
};

// Base Style for Section Headers (Structure only)
export const sectionHeaderStyle = {
    ...premiumWhiteStyle,
    fontFamily: brandFont,
    fontSize: '1.4rem',
    margin: 0,
};

// Premium Card Title Style (Structure only)
export const cardHeaderStyle = {
    ...premiumWhiteStyle,
    fontFamily: brandFont,
    fontWeight: 400,
    fontSize: '1.1rem',
    letterSpacing: '2px',
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

// UI Background & Professional Glassmorphism
export const uiBackground = 'rgba(18, 18, 18, 0.9)'; // Off-black professional look
export const uiBackdropFilter = 'none'; // Better readability
export const uiBackdropFilterWebkit = 'none';
