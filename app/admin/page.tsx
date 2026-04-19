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
  createMusicSpecimen,
  updateMusicSpecimen,
  deleteMusicSpecimen,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  approveVisitorMessage,
  deleteVisitorMessage,
} from "@/lib/actions";
import { uploadToR2 } from "@/lib/r2";
import type { MusicSpecimen, BlogPost, VisitorMessage } from "@/lib/database.types";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("music");

  // Data states
  const [specimens, setSpecimens] = useState<MusicSpecimen[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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
    const [specimensRes, postsRes, messagesRes] = await Promise.all([
      getMusicSpecimens(),
      getAllBlogPosts(),
      getAllVisitorMessages(),
    ]);
    
    if (specimensRes.data) setSpecimens(specimensRes.data);
    if (postsRes.data) setBlogPosts(postsRes.data);
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

  const resetForm = () => {
    setTitle("");
    setNote("");
    setMood("");
    setSpecimenType("leaf");
    setAudioFile(null);
    setAudioUrl("");
    setEditingId(null);
    setShowForm(false);
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
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              {audioUrl && !audioFile && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Current: {audioUrl.split("/").pop()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save"}
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

// Simple markdown to HTML renderer for preview
function renderMarkdownPreview(content: string): string {
  if (!content) return "";
  let html = content;
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-medium mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-medium mt-5 mb-3">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-medium mt-5 mb-3">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-foreground/5 rounded p-3 my-3 text-xs overflow-x-auto"><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-foreground/10 px-1 rounded text-xs">$1</code>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-primary/30 pl-3 my-3 italic text-muted-foreground">$1</blockquote>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  html = html.replace(/^---$/gm, '<hr class="my-6 border-foreground/10" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 rounded max-w-full" />');
  html = html.split(/\n\n+/).map(block => {
    if (block.startsWith('<') || block.trim() === '') return block;
    return `<p class="my-3 leading-relaxed">${block.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');
  return html;
}

// Blog Posts Tab
function BlogPostsTab({ posts, onRefresh }: { posts: BlogPost[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
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
    setShowPreview(false);
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
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium">Content (Markdown)</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Supports: # headings, **bold**, *italic*, `code`, - lists, {">"} quotes, [links](url), ![images](url)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="rounded px-2 py-1 text-xs bg-secondary hover:bg-secondary/80"
                  >
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>
              
              {showPreview ? (
                <div 
                  className="min-h-[280px] rounded-md border border-foreground/10 bg-background p-4 text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder={`# My Post Title

Write your content here using **Markdown**.

## Section Heading

- Bullet point 1
- Bullet point 2

> A blockquote for emphasis

\`\`\`
code block
\`\`\`

[Link text](https://example.com)`}
                  className="w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm font-mono"
                />
              )}
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
