// TypeScript interfaces for cocktail data
export interface CocktailCategory {
    id: string;
    name: string;
    description?: string;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Cocktail {
    id: string;
    name: string;
    category_id: string;
    ingredients: string[];
    instructions: string[];
    description?: string;
    glass_type?: string;
    garnish?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    prep_time_seconds?: number;
    is_signature: boolean;
    is_seasonal: boolean;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface CocktailWithCategory extends Cocktail {
    category?: CocktailCategory;
}

// For the legacy format used in the current component
export interface LegacyCocktail {
    name: string;
    ingredients: string[];
    instructions: string[];
}

export interface LegacyCategory {
    title: string;
    cocktails: LegacyCocktail[];
}
