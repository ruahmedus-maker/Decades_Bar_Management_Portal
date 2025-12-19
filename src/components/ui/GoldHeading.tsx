'use client';

import React from 'react';
import { goldTextStyle } from '@/lib/brand-styles';

interface GoldHeadingProps {
    text: string;
    style?: React.CSSProperties;
    Component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'div';
}

/**
 * A component that applies the Cinematic Gold effect to text 
 * while preserving the original appearance of leading icons/emojis.
 */
export default function GoldHeading({ text, style = {}, Component = 'span' }: GoldHeadingProps) {
    // Regex to match leading and trailing emojis or icons
    const leadingEmojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u;
    const trailingEmojiRegex = /\s*(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;

    const leadingMatch = text.match(leadingEmojiRegex);
    const trailingMatch = text.match(trailingEmojiRegex);

    let cleanText = text;
    let leadingEmoji = '';
    let trailingEmoji = '';

    if (leadingMatch) {
        leadingEmoji = leadingMatch[0];
        cleanText = cleanText.slice(leadingEmoji.length);
    }

    if (trailingMatch) {
        trailingEmoji = trailingMatch[0];
        cleanText = cleanText.slice(0, cleanText.length - trailingEmoji.length);
    }

    const emojiStyle: React.CSSProperties = {
        WebkitTextFillColor: 'initial',
        WebkitBackgroundClip: 'initial',
        background: 'none',
        filter: 'none',
        display: 'inline-block'
    };

    return (
        <Component style={{ ...style, display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {leadingEmoji && <span style={emojiStyle}>{leadingEmoji}</span>}
            <span style={goldTextStyle}>{cleanText}</span>
            {trailingEmoji && <span style={emojiStyle}>{trailingEmoji}</span>}
        </Component>
    );
}
