"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getMusicSpecimens,
  getAllBlogPosts,
  getAllVisitorMessages,
  getAllEssays,
  createMusicSpecimen,
  updateMusicSpecimen,
  deleteMusicSpecimen,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createEssay,
  updateEssay,
  deleteEssay,
  approveVisitorMessage,
  deleteVisitorMessage,
} from "@/lib/actions";
import { uploadToR2, validateAudioFile, AUDIO_UPLOAD_CONSTRAINTS } from "@/lib/r2";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { MusicSpecimen, BlogPost, VisitorMessage, Essay } from "@/lib/database.types";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("music");

  // Data states
  const [specimens, setSpecimens] = useState<MusicSpecimen[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [messages, setMessages] = useState<VisitorMessage[]>([]);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }
      
      setUser({ email: user.email });
      setLoading(false);
      
      // Load data
      loadData();
    }
    checkAuth();
  }, [router]);

  async function loadData() {
    const [specimensRes, postsRes, essaysRes, messagesRes] = await Promise.all([
      getMusicSpecimens(),
      getAllBlogPosts(),
      getAllEssays(),
      getAllVisitorMessages(),
    ]);
    
    if (specimensRes.data) setSpecimens(specimensRes.data);
    if (postsRes.data) setBlogPosts(postsRes.data);
    if (essaysRes.data) setEssays(essaysRes.data);
    if (messagesRes.data) setMessages(messagesRes.data);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/8 bg-card/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to garden
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <h1 className="font-serif text-lg font-light text-foreground">
              Garden Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
<TabsList className="mb-6">
          <TabsTrigger value="music">Music Specimens ({specimens.length})</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts ({blogPosts.length})</TabsTrigger>
          <TabsTrigger value="essays">Essays ({essays.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
          </TabsList>

            <TabsContent value="music">
              <MusicSpecimensTab 
                specimens={specimens} 
                onRefresh={loadData} 
              />
            </TabsContent>

            <TabsContent value="blog">
              <BlogPostsTab 
                posts={blogPosts} 
                onRefresh={loadData} 
              />
            </TabsContent>

<TabsContent value="essays">
          <EssaysTab
            essays={essays}
            onRefresh={loadData}
          />
          </TabsContent>

          <TabsContent value="messages">
          <MessagesTab
                messages={messages} 
                onRefresh={loadData} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Music Specimens Tab
function MusicSpecimensTab({ specimens, onRefresh }: { specimens: MusicSpecimen[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("");
  const [specimenType, setSpecimenType] = useState("leaf");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setNote("");
    setMood("");
    setSpecimenType("leaf");
    setAudioFile(null);
    setAudioUrl("");
    setEditingId(null);
    setShowForm(false);
    setFileError(null);
  };

  const handleFileSelect = async (file: File | null) => {
    setFileError(null);
    if (!file) {
      setAudioFile(null);
      return;
    }
    
    // Validate file before setting
    const validation = await validateAudioFile(file);
    if (!validation.valid) {
      setFileError(validation.error || "Invalid file");
      setAudioFile(null);
      return;
    }
    
    setAudioFile(file);
  };

  const handleEdit = (specimen: MusicSpecimen) => {
    setTitle(specimen.title);
    setNote(specimen.note || "");
    setMood(specimen.mood?.join(", ") || "");
    setSpecimenType(specimen.specimen_type);
    setAudioUrl(specimen.audio_url);
    setEditingId(specimen.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalAudioUrl = audioUrl;

      // Upload audio if new file selected
      if (audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        
        const uploadResult = await uploadToR2(formData);
        
        if (!uploadResult.success || !uploadResult.publicUrl) {
          throw new Error(uploadResult.error || "Upload failed");
        }
        
        finalAudioUrl = uploadResult.publicUrl;
      }

      // Validate we have an audio URL
      if (!finalAudioUrl) {
        throw new Error("Please select an audio file");
      }

      const data = {
        title,
        note,
        mood: mood.split(",").map(m => m.trim()).filter(Boolean),
        specimen_type: specimenType,
        audio_url: finalAudioUrl,
      };

      const result = editingId 
        ? await updateMusicSpecimen(editingId, data)
        : await createMusicSpecimen(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to save specimen");
      }

      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Error saving specimen:", error);
      alert(error instanceof Error ? error.message : "Error saving specimen");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this specimen?")) return;
    await deleteMusicSpecimen(id);
    onRefresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg font-light">Music Specimens</h2>
        <Button onClick={() => setShowForm(true)}>Add New</Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-foreground/10 bg-card/50 p-6">
          <h3 className="mb-4 font-medium">
            {editingId ? "Edit Specimen" : "New Specimen"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Type</label>
                <select
                  value={specimenType}
                  onChange={(e) => setSpecimenType(e.target.value)}
                  className="w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm"
                >
                  <option value="leaf">Leaf</option>
                  <option value="petal">Petal</option>
                  <option value="wind">Wind</option>
                  <option value="fern">Fern</option>
                  <option value="seed">Seed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Mood (comma-separated)</label>
              <Input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="peaceful, calm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Audio File</label>
              <input
                type="file"
                accept=".mp3,.m4a,.aac,.ogg,.webm,audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/webm"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="text-sm"
              />
              {/* Upload constraints helper text */}
              <div className="mt-2 rounded-md bg-secondary/30 p-2.5 text-[11px] text-muted-foreground">
                <p className="font-medium text-foreground/80">Upload requirements:</p>
                <ul className="mt-1 space-y-0.5 ml-2">
                  <li>Recommended: <span className="text-primary">{AUDIO_UPLOAD_CONSTRAINTS.recommendedFormat}</span> for best web playback</li>
                  <li>Max size: {AUDIO_UPLOAD_CONSTRAINTS.maxSizeMB}MB</li>
                  <li>Supported: MP3, M4A, AAC, OGG, WebM</li>
                  <li className="text-destructive/70">Not supported: WAV, FLAC, AIFF (too large for web)</li>
                </ul>
              </div>
              {/* File validation error */}
              {fileError && (
                <p className="mt-2 rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                  {fileError}
                </p>
              )}
              {/* Current file indicator */}
              {audioFile && (
                <p className="mt-2 text-xs text-green-600">
                  Selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(1)}MB)
                </p>
              )}
              {audioUrl && !audioFile && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Current: {audioUrl.split("/").pop()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading || !!fileError}>
                {uploading ? "Uploading..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {specimens.map((specimen) => (
          <div
            key={specimen.id}
            className="flex items-center justify-between rounded-lg border border-foreground/8 bg-card/30 p-4"
          >
            <div>
              <h3 className="font-medium">{specimen.title}</h3>
              <p className="text-xs text-muted-foreground">
                {specimen.date} • {specimen.specimen_type}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(specimen)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(specimen.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Blog Posts Tab
function BlogPostsTab({ posts, onRefresh }: { posts: BlogPost[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setTags("");
    setPublished(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setTags(post.tags?.join(", ") || "");
    setPublished(post.published);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      slug,
      excerpt,
      content,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      published,
    };

    if (editingId) {
      await updateBlogPost(editingId, data);
    } else {
      await createBlogPost(data);
    }

    resetForm();
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deleteBlogPost(id);
    onRefresh();
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg font-light">Blog Posts</h2>
        <Button onClick={() => setShowForm(true)}>Add New</Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-foreground/10 bg-card/50 p-6">
          <h3 className="mb-4 font-medium">
            {editingId ? "Edit Post" : "New Post"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium">Content</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your post..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="music, thoughts"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="published" className="text-sm">Published</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-foreground/8 bg-card/30 p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{post.title}</h3>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                  post.published 
                    ? "bg-green-500/20 text-green-700" 
                    : "bg-yellow-500/20 text-yellow-700"
                }`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {post.date} • /{post.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Essays Tab
function EssaysTab({ essays, onRefresh }: { essays: Essay[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setSlug("");
    setContent("");
    setTags("");
    setPublished(false);
    setFeatured(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const data = {
      title,
      subtitle: subtitle || null,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      published,
      featured,
      reading_time_minutes: readingTime,
      date: new Date().toISOString().split('T')[0],
    };

    if (editingId) {
      await updateEssay(editingId, data);
    } else {
      await createEssay(data);
    }

    resetForm();
    onRefresh();
  };

  const handleEdit = (essay: Essay) => {
    setEditingId(essay.id);
    setTitle(essay.title);
    setSubtitle(essay.subtitle || "");
    setSlug(essay.slug);
    setContent(essay.content);
    setTags(essay.tags.join(", "));
    setPublished(essay.published);
    setFeatured(essay.featured);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this essay?")) return;
    await deleteEssay(id);
    onRefresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg font-light">Essays</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>New Essay</Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-foreground/10 bg-card/50 p-6">
          <h3 className="mb-4 font-medium">
            {editingId ? "Edit Essay" : "New Essay"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Essay title"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Subtitle</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Optional subtitle or description"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Tags (comma separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="reflection, music, creativity"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">Content *</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your essay..."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-foreground/20"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-foreground/20"
                />
                Featured
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {essays.map((essay) => (
          <div
            key={essay.id}
            className="flex items-center justify-between rounded-lg border border-foreground/8 bg-card/30 p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{essay.title}</h3>
                {essay.featured && (
                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-700">
                    Featured
                  </span>
                )}
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                  essay.published 
                    ? "bg-green-500/20 text-green-700" 
                    : "bg-yellow-500/20 text-yellow-700"
                }`}>
                  {essay.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {essay.date} • /{essay.slug} • {essay.reading_time_minutes || 1} min read
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(essay)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(essay.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {essays.length === 0 && (
          <p className="text-sm text-muted-foreground">No essays yet. Create your first essay above.</p>
        )}
      </div>
    </div>
  );
}

// Messages Tab
function MessagesTab({ messages, onRefresh }: { messages: VisitorMessage[]; onRefresh: () => void }) {
  const handleApprove = async (id: string) => {
    await approveVisitorMessage(id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await deleteVisitorMessage(id);
    onRefresh();
  };

  const pendingMessages = messages.filter(m => !m.approved);
  const approvedMessages = messages.filter(m => m.approved);

  return (
    <div>
      <h2 className="mb-6 font-serif text-lg font-light">Visitor Messages</h2>

      {/* Pending */}
      {pendingMessages.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium text-yellow-600">
            Pending Review ({pendingMessages.length})
          </h3>
          <div className="space-y-3">
            {pendingMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{msg.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(msg.id)}>
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(msg.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-green-600">
          Approved ({approvedMessages.length})
        </h3>
        <div className="space-y-3">
          {approvedMessages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-lg border border-foreground/8 bg-card/30 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{msg.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(msg.id)}>
                  Delete
                </Button>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
