import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseClient: any = null;

function cleanEnvValue(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function resolveSupabaseEnv() {
  const rawUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  // FIX: Removed process.env.GEMINI_API_KEY from the fallback list of Supabase anon key as they are completely different
  const rawAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = cleanEnvValue(rawUrl);
  const anonKey = cleanEnvValue(rawAnonKey);

  return { url, anonKey };
}

export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const { url, anonKey } = resolveSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }

  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}

export async function fetchCategories() {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log(
        "[Supabase Probe]: Categories list returned empty/offline.",
        error.message
      );
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.log(
      "[Supabase Probe]: Categories fetch check yielded offline.",
      err.message
    );
    return [];
  }
}

export async function getMappedBlogPosts() {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const categories = await fetchCategories();
    const catMap = new Map();
    categories.forEach((cat: any) => {
      catMap.set(cat.id, cat);
    });

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!posts) return [];

    return posts.map((post: any) => {
      const cat = catMap.get(post.category_id);
      const categoriesList = cat ? [cat.name_en] : ["General"];

      return {
        id: post.id,
        slug: post.slug || "",
        author: {
          name: "Harendra Lamsal",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          bioEn:
            "Founder of Lamsal Web Solutions & Freelancing Brand. Senior Software Engineer & Technical Architect.",
          bioNp: "लम्साल वेभ सोलुसन्सका संस्थापक र डिजिटल मार्केटिङ विशेषज्ञ।",
          role: "Founder & Lead Consultant",
        },
        translations: {
          en: {
            title: post.title_en || "",
            excerpt: post.excerpt_en || "",
            content: post.body_en || "",
            seoTitle: post.seo_title || "",
            seoDescription: post.seo_description || "",
          },
          ne: {
            title: post.title_ne || "",
            excerpt: post.excerpt_ne || "",
            content: post.body_ne || "",
            seoTitle: post.seo_title || "",
            seoDescription: post.seo_description || "",
          },
        },
        featuredImage:
          post.cover_image_url ||
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        categories: categoriesList,
        category: categoriesList[0] || "General",
        tags: post.tags || [],
        publishedAt:
          post.published_at || post.created_at || new Date().toISOString(),
        isFeatured: Boolean(
          post.published && (post.views_count ? post.views_count > 100 : false)
        ),
        isPopular: Boolean(post.views_count ? post.views_count > 50 : false),
        status: post.published ? "published" : "draft",
        readingTimeMin: post.reading_minutes || 5,
        views: post.views_count || 0,
        commentsCount: 0,
      };
    });
  } catch (err: any) {
    console.log("[Supabase Probe]: Mapped blog list check yielded offline.");
    throw err;
  }
}

export async function insertMappedBlogPost(post: any) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase client not initialized");

  try {
    let categoryId = null;
    const catName =
      post.categories && post.categories[0] ? post.categories[0] : (post.category || "General");

    const categories = await fetchCategories();
    const existingCat = (categories || []).find(
      (c: any) => c.name_en?.toLowerCase() === catName.toLowerCase()
    );

    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat, error: catErr } = await supabase
        .from("blog_categories")
        .insert({
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name_en: catName,
          name_ne: catName,
        })
        .select()
        .single();

      if (!catErr && newCat) {
        categoryId = newCat.id;
      }
    }

    const isValidUUID = post.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id);

    const dbPost: any = {
      slug: post.slug,
      title_en: post.translations?.en?.title || "",
      title_ne: post.translations?.ne?.title || "",
      excerpt_en: post.translations?.en?.excerpt || "",
      excerpt_ne: post.translations?.ne?.excerpt || "",
      body_en: post.translations?.en?.content || "",
      body_ne: post.translations?.ne?.content || "",
      cover_image_url: post.featuredImage,
      category_id: categoryId,
      tags: post.tags || [],
      lang: post.translations?.ne?.title ? "bilingual" : "en",
      reading_minutes: post.readingTimeMin || 5,
      seo_title:
        post.translations?.en?.seoTitle || post.translations?.en?.title || "",
      seo_description:
        post.translations?.en?.seoDescription ||
        post.translations?.en?.excerpt ||
        "",
      published: post.status === "published",
      published_at: post.publishedAt || new Date().toISOString(),
      views_count: post.views || 0,
      focus_keyword:
        post.translations?.en?.seoTitle || post.translations?.en?.title || "",
      secondary_keywords: [],
      internal_link_suggestions: [],
      external_references: [],
    };

    if (isValidUUID) {
      dbPost.id = post.id;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(dbPost)
      .select()
      .single();

    if (error) {
      console.error("[Supabase Insert Database Error]:", error);
      throw error;
    }

    // Fetch the fully mapped post structure to return to the client
    const mappedPost = await getMappedBlogPost(data.id);
    return mappedPost || data;
  } catch (err) {
    console.error(
      "Error inserting mapped blog post into Supabase:",
      (err as any).message
    );
    throw err;
  }
}

export async function getMappedBlogPost(id: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) return null;

    const categories = await fetchCategories();
    const catMap = new Map();
    categories.forEach((cat: any) => {
      catMap.set(cat.id, cat);
    });

    const cat = catMap.get(post.category_id);
    const categoriesList = cat ? [cat.name_en] : ["General"];

    return {
      id: post.id,
      slug: post.slug || "",
      author: {
        name: "Harendra Lamsal",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        bioEn:
          "Founder of Lamsal Web Solutions & Freelancing Brand. Senior Software Engineer & Technical Architect.",
        bioNp: "लम्साल वेभ सोलुसन्सका संस्थापक र डिजिटल मार्केटिङ विशेषज्ञ।",
        role: "Founder & Lead Consultant",
      },
      translations: {
        en: {
          title: post.title_en || "",
          excerpt: post.excerpt_en || "",
          content: post.body_en || "",
          seoTitle: post.seo_title || "",
          seoDescription: post.seo_description || "",
        },
        ne: {
          title: post.title_ne || "",
          excerpt: post.excerpt_ne || "",
          content: post.body_ne || "",
          seoTitle: post.seo_title || "",
          seoDescription: post.seo_description || "",
        },
      },
      featuredImage:
        post.cover_image_url ||
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      categories: categoriesList,
      category: categoriesList[0] || "General",
      tags: post.tags || [],
      publishedAt:
        post.published_at || post.created_at || new Date().toISOString(),
      isFeatured: Boolean(
        post.published && (post.views_count ? post.views_count > 100 : false)
      ),
      isPopular: Boolean(post.views_count ? post.views_count > 50 : false),
      status: post.published ? "published" : "draft",
      readingTimeMin: post.reading_minutes || 5,
      views: post.views_count || 0,
      commentsCount: 0,
    };
  } catch (err: any) {
    console.log("[Supabase Probe]: Failed to map single blog post.");
    return null;
  }
}

export async function updateSupabasePost(id: string, post: any) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      slug: post.slug,
      title_en: post.translations?.en?.title || "",
      title_ne: post.translations?.ne?.title || "",
      excerpt_en: post.translations?.en?.excerpt || "",
      excerpt_ne: post.translations?.ne?.excerpt || "",
      body_en: post.translations?.en?.content || "",
      body_ne: post.translations?.ne?.content || "",
      cover_image_url: post.featuredImage,
      tags: post.tags || [],
      published: post.status === "published",
      published_at: post.publishedAt || new Date().toISOString(),
      reading_minutes: post.readingTimeMin || 5,
      seo_title:
        post.translations?.en?.seoTitle || post.translations?.en?.title || "",
      seo_description:
        post.translations?.en?.seoDescription ||
        post.translations?.en?.excerpt ||
        "",
      views_count: post.views || 0,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating post ${id} in Supabase:`, error);
    throw error;
  }

  return data;
}

export async function deleteSupabasePost(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

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
      .from("blog_posts")
      .select("id, views_count")
      .eq("slug", slug)
      .single();

    if (fetchErr || !post) {
      console.warn(
        `[Supabase View Inc Warning]: Could not find post with slug ${slug}`
      );
      return null;
    }

    const currentViews = post.views_count || 0;

    const { data, error: updateErr } = await supabase
      .from("blog_posts")
      .update({ views_count: currentViews + 1 })
      .eq("id", post.id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return data;
  } catch (err) {
    console.error(`Error incrementing views for post slug ${slug}:`, err);
    return null;
  }
}
