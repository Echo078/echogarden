// Database types for Echo Garden

export interface MusicSpecimen {
  id: string;
  date: string;
  title: string;
  note: string | null;
  mood: string[];
  audio_url: string;
  specimen_type: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  date: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitorMessage {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

// Insert types (for creating new records)
export type MusicSpecimenInsert = Omit<MusicSpecimen, 'id' | 'created_at' | 'updated_at'>;
export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type VisitorMessageInsert = Pick<VisitorMessage, 'name' | 'message'>;

// Update types
export type MusicSpecimenUpdate = Partial<MusicSpecimenInsert>;
export type BlogPostUpdate = Partial<BlogPostInsert>;
