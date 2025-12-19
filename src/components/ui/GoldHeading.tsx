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
    // Regex to match leading emojis or icons (including variation selectors)
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u;
    const match = text.match(emojiRegex);

    if (match) {
        const emoji = match[0];
        const remainingText = text.slice(emoji.length);

        return (
            <Component style={{ ...style, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ WebkitTextFillColor: 'initial', WebkitBackgroundClip: 'initial', background: 'none', filter: 'none' }}>
                    {emoji}
                </span>
                <span style={goldTextStyle}>{remainingText}</span>
            </Component>
        );
    }

    return (
        <Component style={{ ...style, ...goldTextStyle }}>
            {text}
        </Component>
    );
}
