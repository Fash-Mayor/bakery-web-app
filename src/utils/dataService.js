import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============== PRODUCT SERVICES ==============

/**
 * Fetch all products from the database
 * @param {string} searchQuery - Optional search query to filter products
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of products
 */
export const fetchAllProducts = async (searchQuery = '', category = null) => {
    try {
        let query = supabase
            .from('product')
            .select('*, baker(id, shop_name), tags(tag_name)');

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Apply client-side search filtering
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return data.filter(p => {
                const combined = `${p.name} ${p.category} ${p.description}`.toLowerCase();
                return combined.includes(q);
            });
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Fetch a single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
export const fetchProductById = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*, baker(id, shop_name, address, instagram), tags(tag_name)')
            .eq('id', productId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

/**
 * Fetch products by baker ID
 * @param {string} bakerId - Baker ID (UUID)
 * @returns {Promise<Array>} Array of baker's products
 */
export const fetchBakerProducts = async (bakerId) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*, tags(tag_name)')
            .eq('baker_id', bakerId);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching baker products:', error);
        throw error;
    }
};

/**
 * Get unique categories
 * @returns {Promise<Array>} Array of unique categories
 */
export const fetchCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('category')
            .not('category', 'is', null);

        if (error) throw error;

        const categories = [...new Set(data.map(p => p.category))];
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// ============== BAKER SERVICES ==============

/**
 * Fetch baker profile by ID
 * @param {number} bakerId - Baker ID
 * @returns {Promise<Object>} Baker details
 */
export const fetchBakerProfile = async (bakerId) => {
    try {
        const { data, error } = await supabase
            .from('baker')
            .select('*')
            .eq('id', bakerId)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching baker profile:', error);
        throw error;
    }
};

/**
 * Fetch all bakers (for selecting where an order goes).
 * @returns {Promise<Array<{id: string, shop_name: string}>>}
 */
export const fetchAllBakers = async () => {
    try {
        const { data, error } = await supabase
            .from("baker")
            .select("id, shop_name")
            .order("shop_name", { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching bakers:", error);
        throw error;
    }
};

/**
 * Create a new baker profile
 * @param {Object} bakerData - Baker data { shop_name, address, instagram }
 * @returns {Promise<Object>} Created baker profile
 */
export const createBakerProfile = async (bakerData) => {
    try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('User must be authenticated to create a baker profile');
        }

        // Create baker profile with user's ID
        const bakerWithId = {
            id: user.id,  // Use auth user ID as baker ID
            ...bakerData
        };

        const { data, error } = await supabase
            .from('baker')
            .insert([bakerWithId])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating baker profile:', error);
        throw error;
    }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user object
 */
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response
 */
export const signUpUser = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response
 */
export const signInUser = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Update baker profile
 * @param {number} bakerId - Baker ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated baker profile
 */
export const updateBakerProfile = async (bakerId, updates) => {
    try {
        const { data, error } = await supabase
            .from('baker')
            .update(updates)
            .eq('id', bakerId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating baker profile:', error);
        throw error;
    }
};

// ============== PRODUCT UPLOAD/MANAGEMENT ==============

/**
 * Upload a new product
 * @param {Object} productData - Product data
 * @param {string} bakerId - Baker ID (UUID)
 * @returns {Promise<Object>} Created product
 */
export const uploadProduct = async (productData, bakerId) => {
    try {
        // Verify user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User must be authenticated to upload products');
        }

        // Only allow baker to upload their own products
        if (user.id !== bakerId) {
            throw new Error('You can only upload products to your own profile');
        }

        const { data, error } = await supabase
            .from('product')
            .insert([{ ...productData, baker_id: bakerId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error uploading product:', error);
        throw error;
    }
};

/**
 * Update a product
 * @param {number} productId - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, updates) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .update(updates)
            .eq('id', productId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

/**
 * Delete a product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Deleted product
 */
export const deleteProduct = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .delete()
            .eq('id', productId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// ============== IMAGE UPLOAD (Supabase Storage) ==============

/**
 * Upload image to Supabase storage
 * @param {File} file - Image file
 * @param {string} bucket - Storage bucket name (e.g., 'product-images')
 * @param {string} path - Path in bucket (e.g., 'products/product-1')
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadImage = async (file, bucket = 'product-images', path) => {
    try {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${path}/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// ============== TAGS SERVICES ==============

/**
 * Add tags to a product
 * @param {number} productId - Product ID
 * @param {Array<string>} tagNames - Array of tag names
 * @returns {Promise<Array>} Created tags
 */
export const addTagsToProduct = async (productId, tagNames) => {
    try {
        const tagRecords = tagNames.map(tag_name => ({ product_id: productId, tag_name }));

        const { data, error } = await supabase
            .from('tags')
            .insert(tagRecords)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding tags:', error);
        throw error;
    }
};

/**
 * Get Supabase client (for advanced queries)
 * @returns {Object} Supabase client
 */
export const getSupabaseClient = () => supabase;

export default supabase;
