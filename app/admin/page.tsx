"use client";

import { useEffect, useState, useRef } from "react";
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
import { uploadToR2 } from "@/lib/r2";
import { AUDIO_UPLOAD_CONSTRAINTS, validateAudioFileClient } from "@/lib/audio-constants";
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
          <TabsTrigger value="essays">Essays ({essays.length})</TabsTrigger>
          <TabsTrigger value="fragments">Fragments ({blogPosts.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
          </TabsList>

            <TabsContent value="music">
              <MusicSpecimensTab 
                specimens={specimens} 
                onRefresh={loadData} 
              />
            </TabsContent>

            <TabsContent value="fragments">
              <FragmentsTab 
                fragments={blogPosts} 
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("");
  const [specimenType, setSpecimenType] = useState("leaf");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState(""); // Original URL from existing specimen
  const [newUploadedUrl, setNewUploadedUrl] = useState<string | null>(null); // URL after uploading new file
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const resetForm = () => {
    setTitle("");
    setNote("");
    setMood("");
    setSpecimenType("leaf");
    setAudioFile(null);
    setAudioUrl("");
    setNewUploadedUrl(null);
    setEditingId(null);
    setShowForm(false);
    setFileError(null);
    setUploadStatus("idle");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (file: File | null) => {
    console.log("[v0] handleFileSelect called with:", file?.name || "null");
    setFileError(null);
    setNewUploadedUrl(null);
    setUploadStatus("idle");
    
    if (!file) {
      console.log("[v0] handleFileSelect - no file, clearing state");
      setAudioFile(null);
      return;
    }
    
    // Validate using client-side function (not a server action)
    const validation = validateAudioFileClient(file);
    if (!validation.valid) {
      console.log("[v0] handleFileSelect - validation failed:", validation.error);
      setFileError(validation.error || "Invalid file");
      setAudioFile(null);
      return;
    }
    
    console.log("[v0] handleFileSelect - validation passed, setting audioFile");
    setAudioFile(file);
  };

  const handleEdit = (specimen: MusicSpecimen) => {
    // Reset file-related state first
    setAudioFile(null);
    setNewUploadedUrl(null);
    setFileError(null);
    setUploadStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Set specimen data
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

    // Debug: log all relevant state at submit time
    console.log("[v0] handleSubmit - editingId:", editingId);
    console.log("[v0] handleSubmit - audioFile:", audioFile?.name || "null");
    console.log("[v0] handleSubmit - audioUrl:", audioUrl || "empty");
    console.log("[v0] handleSubmit - newUploadedUrl:", newUploadedUrl || "null");

    try {
      // Determine the final audio URL
      // Priority: newly uploaded URL > newly selected file (will upload) > existing URL
      let finalAudioUrl = newUploadedUrl || audioUrl;

      // Upload audio if new file selected and not already uploaded
      if (audioFile && !newUploadedUrl) {
        // Validate file first (client-side validation)
        const validation = validateAudioFileClient(audioFile);
        if (!validation.valid) {
          setFileError(validation.error || "Invalid file");
          throw new Error(validation.error || "Invalid audio file");
        }
        setUploadStatus("uploading");
        const formData = new FormData();
        formData.append("file", audioFile);
        
        console.log("[v0] Uploading new audio file via API route:", audioFile.name, "size:", (audioFile.size / (1024 * 1024)).toFixed(2), "MB");
        
        // Use API route instead of server action to bypass body size limit
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok || !uploadResult.success || !uploadResult.publicUrl) {
          setUploadStatus("error");
          throw new Error(uploadResult.error || "Upload failed");
        }
        
        console.log("[v0] Upload successful, new URL:", uploadResult.publicUrl);
        finalAudioUrl = uploadResult.publicUrl;
        setNewUploadedUrl(uploadResult.publicUrl);
        setUploadStatus("success");
      }

      // Validate we have an audio URL
      if (!finalAudioUrl) {
        console.log("[v0] No finalAudioUrl - checking state: audioFile=", audioFile?.name, "audioUrl=", audioUrl, "newUploadedUrl=", newUploadedUrl);
        throw new Error("Please select an audio file. Make sure to choose a file before saving.");
      }

      console.log("[v0] Saving specimen with audio_url:", finalAudioUrl);
      
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

      console.log("[v0] Specimen saved successfully");
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("[v0] Error saving specimen:", error);
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
                ref={fileInputRef}
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
              
              {/* Current file status (when editing) */}
              {editingId && audioUrl && !audioFile && !newUploadedUrl && (
                <div className="mt-2 rounded-md bg-blue-500/10 px-2.5 py-1.5 text-xs text-blue-700 dark:text-blue-400">
                  <span className="font-medium">Current file:</span> {audioUrl.split("/").pop()}
                </div>
              )}
              
              {/* Newly selected file (pending upload) */}
              {audioFile && !newUploadedUrl && uploadStatus !== "uploading" && (
                <div className="mt-2 rounded-md bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-700 dark:text-yellow-400">
                  <span className="font-medium">New file selected:</span> {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(1)}MB)
                  <br />
                  <span className="text-[10px]">Will be uploaded on save</span>
                </div>
              )}
              
              {/* Upload in progress */}
              {uploadStatus === "uploading" && (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-700 dark:text-yellow-400">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
                  <span>Uploading...</span>
                </div>
              )}
              
              {/* Upload successful */}
              {newUploadedUrl && uploadStatus === "success" && (
                <div className="mt-2 rounded-md bg-green-500/10 px-2.5 py-1.5 text-xs text-green-700 dark:text-green-400">
                  <span className="font-medium">New file uploaded:</span> {audioFile?.name || newUploadedUrl.split("/").pop()}
                  <br />
                  <span className="text-[10px]">This will replace the old file when saved</span>
                </div>
              )}
              
              {/* Upload error */}
              {uploadStatus === "error" && (
                <div className="mt-2 rounded-md bg-red-500/10 px-2.5 py-1.5 text-xs text-red-700 dark:text-red-400">
                  <span className="font-medium">Upload failed.</span> Please try again.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading || !!fileError}>
                {uploading ? (uploadStatus === "uploading" ? "Uploading file..." : "Saving...") : "Save Specimen"}
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

// Fragments Tab (short-form writing)
function FragmentsTab({ fragments, onRefresh }: { fragments: BlogPost[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save effect for editing existing fragments
  useEffect(() => {
    if (!editingId || !title) return;

    // Clear previous timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    // Set status to indicate pending save
    setSaveStatus("idle");

    // Auto-save after 2 seconds of no changes
    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      
      const data = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt,
        content,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        published,
      };

      const result = await updateBlogPost(editingId, data);
      
      if (result.success) {
        setSaveStatus("saved");
        setLastSaved(new Date());
      } else {
        setSaveStatus("error");
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [editingId, title, slug, excerpt, content, tags, published]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setTags("");
    setPublished(false);
    setEditingId(null);
    setShowForm(false);
    setSaveStatus("idle");
    setLastSaved(null);
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
        <h2 className="font-serif text-lg font-light">Fragments</h2>
        <Button onClick={() => setShowForm(true)}>New Fragment</Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-foreground/10 bg-card/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">
              {editingId ? "Edit Fragment" : "New Fragment"}
            </h3>
            {editingId && (
              <div className="flex items-center gap-2 text-xs">
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                    Saving...
                  </span>
                )}
                {saveStatus === "saved" && lastSaved && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="flex items-center gap-1.5 text-red-600">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Save failed
                  </span>
                )}
              </div>
            )}
          </div>
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
        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            className="flex items-center justify-between rounded-lg border border-foreground/8 bg-card/30 p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{fragment.title}</h3>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                  fragment.published 
                    ? "bg-green-500/20 text-green-700" 
                    : "bg-yellow-500/20 text-yellow-700"
                }`}>
                  {fragment.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {fragment.date} • /{fragment.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(fragment)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(fragment.id)}>
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

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save effect for editing existing essays
  useEffect(() => {
    if (!editingId || !title) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    setSaveStatus("idle");

    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      
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

      const result = await updateEssay(editingId, data);
      
      if (result.success) {
        setSaveStatus("saved");
        setLastSaved(new Date());
      } else {
        setSaveStatus("error");
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [editingId, title, subtitle, slug, content, tags, published, featured]);

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
    setSaveStatus("idle");
    setLastSaved(null);
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">
              {editingId ? "Edit Essay" : "New Essay"}
            </h3>
            {editingId && (
              <div className="flex items-center gap-2 text-xs">
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                    Saving...
                  </span>
                )}
                {saveStatus === "saved" && lastSaved && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="flex items-center gap-1.5 text-red-600">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Save failed
                  </span>
                )}
              </div>
            )}
          </div>
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
