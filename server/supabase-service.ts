import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;
  
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !anonKey) {
    return null;
  }
  
  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}

export async function fetchCategories() {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching categories from Supabase:', error);
    return [];
  }
  return data;
}

export async function getMappedBlogPosts() {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  try {
    const categories = await fetchCategories();
    const catMap = new Map();
    categories.forEach((cat: any) => {
      catMap.set(cat.id, cat);
    });
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return posts.map((post: any) => {
      const cat = catMap.get(post.category_id);
      const categoriesList = cat ? [cat.name_en] : ['General'];
      
      return {
        id: post.id,
        slug: post.slug || '',
        author: {
          name: "Harendra Lamsal",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          bioEn: "Founder of Lamsal Web Solutions & Freelancing Brand. Senior Software Engineer & Technical Architect.",
          bioNp: "लम्साल वेभ सोलुसन्सका संस्थापक र डिजिटल मार्केटिङ विशेषज्ञ।",
          role: "Founder & Lead Consultant"
        },
        translations: {
          en: {
            title: post.title_en || '',
            excerpt: post.excerpt_en || '',
            content: post.body_en || '',
            seoTitle: post.seo_title || '',
            seoDescription: post.seo_description || ''
          },
          ne: {
            title: post.title_ne || '',
            excerpt: post.excerpt_ne || '',
            content: post.body_ne || '',
            seoTitle: post.seo_title || '',
            seoDescription: post.seo_description || ''
          }
        },
        featuredImage: post.cover_image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        categories: categoriesList,
        tags: post.tags || [],
        publishedAt: post.published_at || post.created_at || new Date().toISOString(),
        isFeatured: post.published && (post.views_count ? post.views_count > 100 : false),
        isPopular: post.views_count ? post.views_count > 50 : false,
        status: post.published ? 'published' : 'draft',
        readingTimeMin: post.reading_minutes || 5,
        views: post.views_count || 0,
        commentsCount: 0
      };
    });
  } catch (err) {
    console.error('Error fetching mapped blogs from Supabase:', err);
    throw err;
  }
}

export async function insertMappedBlogPost(post: any) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not initialized');
  
  try {
    // 1. Resolve or create category
    let categoryId = null;
    const catName = post.categories && post.categories[0] ? post.categories[0] : 'General';
    
    // Fetch categories to see if it exists
    const categories = await fetchCategories();
    const existingCat = categories.find((c: any) => c.name_en?.toLowerCase() === catName.toLowerCase());
    
    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      // Create new category
      const { data: newCat, error: catErr } = await supabase
        .from('blog_categories')
        .insert({
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name_en: catName,
          name_ne: catName
        })
        .select()
        .single();
        
      if (!catErr && newCat) {
        categoryId = newCat.id;
      }
    }
    
    // 2. Insert post
    const dbPost = {
      id: post.id || undefined,
      slug: post.slug,
      title_en: post.translations?.en?.title || '',
      title_ne: post.translations?.ne?.title || '',
      excerpt_en: post.translations?.en?.excerpt || '',
      excerpt_ne: post.translations?.ne?.excerpt || '',
      body_en: post.translations?.en?.content || '',
      body_ne: post.translations?.ne?.content || '',
      cover_image_url: post.featuredImage,
      category_id: categoryId,
      tags: post.tags || [],
      lang: post.translations?.ne?.title ? 'bilingual' : 'en',
      reading_minutes: post.readingTimeMin || 5,
      seo_title: post.translations?.en?.seoTitle || post.translations?.en?.title || '',
      seo_description: post.translations?.en?.seoDescription || post.translations?.en?.excerpt || '',
      published: post.status === 'published',
      published_at: post.publishedAt || new Date().toISOString(),
      views_count: post.views || 0,
      focus_keyword: post.translations?.en?.seoTitle || post.translations?.en?.title || '',
      secondary_keywords: [],
      internal_link_suggestions: [],
      external_references: []
    };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(dbPost)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error inserting mapped blog post into Supabase:', err);
    throw err;
  }
}

export async function deleteSupabasePost(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not initialized');
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting post ${id} from Supabase:`, error);
    throw error;
  }
  return true;
}

export async function incrementSupabaseBlogView(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: post, error: fetchErr } = await supabase
      .from('blog_posts')
      .select('id, views_count')
      .eq('slug', slug)
      .single();

    if (fetchErr || !post) {
      console.warn(`[Supabase View Inc Warning]: Could not find post with slug ${slug}`);
      return null;
    }

    const currentViews = post.views_count || 0;

    const { data, error: updateErr } = await supabase
      .from('blog_posts')
      .update({ views_count: currentViews + 1 })
      .eq('id', post.id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return data;
  } catch (err) {
    console.error(`Error incrementing views for post slug ${slug}:`, err);
    return null;
  }
}

