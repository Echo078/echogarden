"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { 
  MusicSpecimen, 
  BlogPost, 
  VisitorMessage,
  Essay,
  MusicSpecimenInsert,
  BlogPostInsert,
  EssayInsert,
  MusicSpecimenUpdate,
  BlogPostUpdate,
  EssayUpdate
} from "./database.types";

// ============================================
// Music Specimens (Diary Entries)
// ============================================

export async function getMusicSpecimens(): Promise<{ data: MusicSpecimen[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("music_specimens")
    .select("*")
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching music specimens:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getMusicSpecimenById(id: string): Promise<MusicSpecimen | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("music_specimens")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching music specimen:", error);
    return null;
  }
  
  return data;
}

export async function createMusicSpecimen(specimen: MusicSpecimenInsert): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("music_specimens")
    .insert(specimen);
  
  if (error) {
    console.error("Error creating music specimen:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/diary");
  revalidatePath("/");
  return { success: true };
}

export async function updateMusicSpecimen(id: string, updates: MusicSpecimenUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("music_specimens")
    .update(updates)
    .eq("id", id);
  
  if (error) {
    console.error("Error updating music specimen:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/diary");
  revalidatePath("/");
  return { success: true };
}

export async function deleteMusicSpecimen(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("music_specimens")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting music specimen:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/diary");
  revalidatePath("/");
  return { success: true };
}

// ============================================
// Blog Posts
// ============================================

export async function getBlogPosts(): Promise<{ data: BlogPost[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching blog posts:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getAllBlogPosts(): Promise<{ data: BlogPost[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching all blog posts:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
  
  return data;
}

export async function createBlogPost(post: BlogPostInsert): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .insert(post);
  
  if (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: string, updates: BlogPostUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id);
  
  if (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/blog");
  return { success: true };
}

// ============================================
// Visitor Messages (Echo Wall)
// ============================================

export async function getVisitorMessages(): Promise<{ data: VisitorMessage[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visitor_messages")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching messages:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getAllVisitorMessages(): Promise<{ data: VisitorMessage[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visitor_messages")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching all messages:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function submitVisitorMessage(name: string, message: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("visitor_messages")
    .insert({ name, message, approved: false });
  
  if (error) {
    console.error("Error submitting message:", error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

export async function approveVisitorMessage(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("visitor_messages")
    .update({ approved: true })
    .eq("id", id);
  
  if (error) {
    console.error("Error approving message:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/");
  return { success: true };
}

export async function deleteVisitorMessage(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("visitor_messages")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/");
  return { success: true };
}

// ============================================
// Essays
// ============================================

export async function getEssays(): Promise<{ data: Essay[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching essays:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getAllEssays(): Promise<{ data: Essay[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching all essays:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function getEssayBySlug(slug: string): Promise<Essay | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) {
    console.error("Error fetching essay:", error);
    return null;
  }
  
  return data;
}

export async function getFeaturedEssays(): Promise<{ data: Essay[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("essays")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("date", { ascending: false })
    .limit(3);
  
  if (error) {
    console.error("Error fetching featured essays:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data || [], error: null };
}

export async function createEssay(essay: EssayInsert): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("essays")
    .insert(essay);
  
  if (error) {
    console.error("Error creating essay:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/essays");
  return { success: true };
}

export async function updateEssay(id: string, updates: EssayUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("essays")
    .update(updates)
    .eq("id", id);
  
  if (error) {
    console.error("Error updating essay:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/essays");
  return { success: true };
}

export async function deleteEssay(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("essays")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting essay:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/essays");
  return { success: true };
}

// ============================================
// Authentication helpers
// ============================================

export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
