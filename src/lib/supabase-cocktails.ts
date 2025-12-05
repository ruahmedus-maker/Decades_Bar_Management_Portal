// Supabase service for cocktail operations
import { supabase } from './supabase';
import type { Cocktail, CocktailCategory, CocktailWithCategory } from '@/types/cocktails';

/**
 * Fetch all cocktail categories ordered by display_order
 */
export const getAllCategories = async (): Promise<CocktailCategory[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktail_categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

/**
 * Fetch all cocktails, optionally filtered by category
 */
export const getCocktails = async (categoryId?: string): Promise<Cocktail[]> => {
    try {
        let query = supabase
            .from('cocktails')
            .select('*')
            .order('name', { ascending: true });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching cocktails:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch cocktails:', error);
        throw error;
    }
};

/**
 * Fetch cocktails by category ID
 */
export const getCocktailsByCategory = async (categoryId: string): Promise<Cocktail[]> => {
    return getCocktails(categoryId);
};

/**
 * Search cocktails by name or ingredients
 */
export const searchCocktails = async (query: string): Promise<Cocktail[]> => {
    try {
        if (!query || query.trim() === '') {
            return getCocktails();
        }

        const searchTerm = query.toLowerCase().trim();

        // Fetch all cocktails and filter client-side for now
        // TODO: Implement server-side full-text search for better performance
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error searching cocktails:', error);
            throw error;
        }

        if (!data) return [];

        // Filter by name or ingredients
        return data.filter(cocktail => {
            const nameMatch = cocktail.name.toLowerCase().includes(searchTerm);
            const ingredientsMatch = cocktail.ingredients.some((ing: string) =>
                ing.toLowerCase().includes(searchTerm)
            );
            return nameMatch || ingredientsMatch;
        });
    } catch (error) {
        console.error('Failed to search cocktails:', error);
        throw error;
    }
};

/**
 * Get a single cocktail by ID
 */
export const getCocktailById = async (id: string): Promise<Cocktail | null> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching cocktail:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch cocktail:', error);
        return null;
    }
};

/**
 * Get cocktails with their category information
 */
export const getCocktailsWithCategories = async (): Promise<CocktailWithCategory[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select(`
        *,
        category:cocktail_categories(*)
      `)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching cocktails with categories:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch cocktails with categories:', error);
        throw error;
    }
};

/**
 * Get signature cocktails
 */
export const getSignatureCocktails = async (): Promise<Cocktail[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .eq('is_signature', true)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching signature cocktails:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch signature cocktails:', error);
        throw error;
    }
};

/**
 * Get seasonal cocktails
 */
export const getSeasonalCocktails = async (): Promise<Cocktail[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .eq('is_seasonal', true)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching seasonal cocktails:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch seasonal cocktails:', error);
        throw error;
    }
};

/**
 * Get cocktails by difficulty level
 */
export const getCocktailsByDifficulty = async (
    difficulty: 'easy' | 'medium' | 'hard'
): Promise<Cocktail[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .eq('difficulty', difficulty)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching cocktails by difficulty:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch cocktails by difficulty:', error);
        throw error;
    }
};

/**
 * Get cocktails by tags
 */
export const getCocktailsByTags = async (tags: string[]): Promise<Cocktail[]> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .select('*')
            .contains('tags', tags)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching cocktails by tags:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch cocktails by tags:', error);
        throw error;
    }
};

/**
 * Admin function: Create a new cocktail
 */
export const createCocktail = async (cocktail: Omit<Cocktail, 'id' | 'created_at' | 'updated_at'>): Promise<Cocktail | null> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .insert(cocktail)
            .select()
            .single();

        if (error) {
            console.error('Error creating cocktail:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to create cocktail:', error);
        return null;
    }
};

/**
 * Admin function: Update a cocktail
 */
export const updateCocktail = async (id: string, updates: Partial<Cocktail>): Promise<Cocktail | null> => {
    try {
        const { data, error } = await supabase
            .from('cocktails')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating cocktail:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to update cocktail:', error);
        return null;
    }
};

/**
 * Admin function: Delete a cocktail
 */
export const deleteCocktail = async (id: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('cocktails')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting cocktail:', error);
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Failed to delete cocktail:', error);
        return false;
    }
};
