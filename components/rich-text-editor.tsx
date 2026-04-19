"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { uploadImageToR2 } from "@/lib/r2";

const lowlight = createLowlight(common);

type ViewMode = "edit" | "preview" | "split";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showImageGridDialog, setShowImageGridDialog] = useState(false);
  const [gridImages, setGridImages] = useState<string[]>(["", ""]);
  const [gridColumns, setGridColumns] = useState(2);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      ImageResize.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4",
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] focus:outline-none p-4",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const images = files.filter(file => file.type.startsWith("image/"));
          if (images.length > 0) {
            event.preventDefault();
            images.forEach(file => handleImageUpload(file));
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                handleImageUpload(file);
                return true;
              }
            }
          }
        }
        return false;
      },
    },
  });

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await uploadImageToR2(formData);
      
      if (result.success && result.publicUrl) {
        editor.chain().focus().setImage({ src: result.publicUrl }).run();
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }, [editor]);

  // Handle file input change
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      Array.from(files).forEach(file => handleImageUpload(file));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [handleImageUpload]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Add image from URL
  const addImageFromUrl = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Insert image grid
  const insertImageGrid = useCallback(() => {
    if (!editor) return;
    
    const validImages = gridImages.filter(url => url.trim());
    if (validImages.length < 2) {
      alert("Please add at least 2 images for a grid");
      return;
    }

    // Create HTML for image grid
    const gridHtml = `
      <div class="image-grid image-grid-${gridColumns}" style="display: grid; grid-template-columns: repeat(${gridColumns}, 1fr); gap: 0.5rem; margin: 1rem 0;">
        ${validImages.map(url => `<img src="${url}" alt="" style="width: 100%; height: auto; border-radius: 0.375rem; object-fit: cover;" />`).join("")}
      </div>
    `;

    editor.chain().focus().insertContent(gridHtml).run();
    
    setShowImageGridDialog(false);
    setGridImages(["", ""]);
    setGridColumns(2);
  }, [editor, gridImages, gridColumns]);

  // Upload image for grid
  const uploadGridImage = useCallback(async (index: number, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await uploadImageToR2(formData);
      
      if (result.success && result.publicUrl) {
        setGridImages(prev => {
          const newImages = [...prev];
          newImages[index] = result.publicUrl!;
          return newImages;
        });
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (showLinkInput) {
      if (linkUrl) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .run();
      }
      setShowLinkInput(false);
      setLinkUrl("");
    } else {
      const previousUrl = editor.getAttributes("link").href;
      setLinkUrl(previousUrl || "");
      setShowLinkInput(true);
      setTimeout(() => linkInputRef.current?.focus(), 0);
    }
  }, [editor, showLinkInput, linkUrl]);

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer?.files;
    if (files?.length) {
      const images = Array.from(files).filter(file => file.type.startsWith("image/"));
      images.forEach(file => handleImageUpload(file));
    }
  }, [handleImageUpload]);

  if (!editor) {
    return (
      <div className="rounded-md border border-foreground/10 bg-background p-4 min-h-[300px] animate-pulse" />
    );
  }

  return (
    <div 
      ref={editorContainerRef}
      className={`rounded-md border bg-background overflow-hidden transition-colors ${
        dragOver 
          ? "border-primary border-2 bg-primary/5" 
          : "border-foreground/10"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* View mode tabs */}
      <div className="flex items-center justify-between border-b border-foreground/10 bg-secondary/20 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <ViewModeButton 
            mode="edit" 
            currentMode={viewMode} 
            onClick={() => setViewMode("edit")}
            label="Edit"
          />
          <ViewModeButton 
            mode="preview" 
            currentMode={viewMode} 
            onClick={() => setViewMode("preview")}
            label="Preview"
          />
          <ViewModeButton 
            mode="split" 
            currentMode={viewMode} 
            onClick={() => setViewMode("split")}
            label="Split"
          />
        </div>
        {uploading && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Uploading...</span>
          </div>
        )}
      </div>

      {/* Toolbar - only show in edit or split mode */}
      {(viewMode === "edit" || viewMode === "split") && (
        <EditorToolbar 
          editor={editor}
          showLinkInput={showLinkInput}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          setLink={setLink}
          removeLink={removeLink}
          setShowLinkInput={setShowLinkInput}
          linkInputRef={linkInputRef}
          openFilePicker={openFilePicker}
          addImageFromUrl={addImageFromUrl}
          uploading={uploading}
          onOpenImageGrid={() => setShowImageGridDialog(true)}
        />
      )}

      {/* Image Grid Dialog */}
      {showImageGridDialog && (
        <ImageGridDialog
          gridImages={gridImages}
          setGridImages={setGridImages}
          gridColumns={gridColumns}
          setGridColumns={setGridColumns}
          onInsert={insertImageGrid}
          onClose={() => {
            setShowImageGridDialog(false);
            setGridImages(["", ""]);
            setGridColumns(2);
          }}
          onUpload={uploadGridImage}
          uploading={uploading}
        />
      )}

      {/* Content area - based on view mode */}
      <div className={`${viewMode === "split" ? "grid grid-cols-2 divide-x divide-foreground/10" : ""}`}>
        {/* Editor */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={viewMode === "split" ? "min-h-[400px]" : ""}>
            {dragOver && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 pointer-events-none">
                <div className="rounded-lg bg-background/90 px-6 py-4 shadow-lg">
                  <p className="text-sm font-medium text-primary">Drop image to upload</p>
                </div>
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`${viewMode === "split" ? "min-h-[400px] overflow-auto" : ""}`}>
            <PreviewPanel content={content} />
          </div>
        )}
      </div>

      {/* Footer hint */}
      {viewMode !== "preview" && (
        <div className="border-t border-foreground/5 bg-secondary/10 px-3 py-1.5 text-[10px] text-muted-foreground/50">
          Drag & drop or paste images. Use Image Grid for side-by-side layouts.
        </div>
      )}

      {/* Editor styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
          padding: 1rem;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
          line-height: 1.6;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        .ProseMirror ul > li {
          list-style-type: disc;
        }
        .ProseMirror ol > li {
          list-style-type: decimal;
        }
        .ProseMirror blockquote {
          border-left: 3px solid hsl(var(--primary) / 0.3);
          margin: 1rem 0;
          padding-left: 1rem;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        .ProseMirror code {
          background: hsl(var(--foreground) / 0.1);
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        .ProseMirror pre {
          background: hsl(var(--foreground) / 0.05);
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background: transparent;
          padding: 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid hsl(var(--foreground) / 0.1);
          margin: 1.5rem 0;
        }
        .ProseMirror img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem auto;
          display: block;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid hsl(var(--primary));
        }
        .ProseMirror .image-resizer {
          display: inline-flex;
          position: relative;
          flex-grow: 0;
        }
        .ProseMirror .image-resizer .resize-trigger {
          position: absolute;
          right: -6px;
          bottom: -6px;
          opacity: 0;
          transition: opacity 0.2s ease;
          width: 12px;
          height: 12px;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          border-radius: 50%;
          cursor: nwse-resize;
        }
        .ProseMirror .image-resizer:hover .resize-trigger,
        .ProseMirror .image-resizer.is-resizing .resize-trigger {
          opacity: 1;
        }
        .ProseMirror .image-resizer img {
          cursor: default;
        }
        .ProseMirror .image-grid {
          display: grid;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .ProseMirror .image-grid img {
          margin: 0;
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// View mode button component
function ViewModeButton({ 
  mode, 
  currentMode, 
  onClick, 
  label 
}: { 
  mode: ViewMode; 
  currentMode: ViewMode; 
  onClick: () => void; 
  label: string;
}) {
  const isActive = mode === currentMode;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-md transition-colors ${
        isActive 
          ? "bg-primary/15 text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      }`}
    >
      {label}
    </button>
  );
}

// Preview panel component
function PreviewPanel({ content }: { content: string }) {
  return (
    <div className="preview-content p-4 min-h-[300px]">
      <style jsx global>{`
        .preview-content h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-family: var(--font-serif);
        }
        .preview-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
        }
        .preview-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
        }
        .preview-content p {
          margin: 0.75rem 0;
          line-height: 1.7;
          color: hsl(var(--foreground) / 0.85);
        }
        .preview-content ul,
        .preview-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .preview-content ul > li {
          list-style-type: disc;
          margin: 0.35rem 0;
        }
        .preview-content ol > li {
          list-style-type: decimal;
          margin: 0.35rem 0;
        }
        .preview-content blockquote {
          border-left: 3px solid hsl(var(--primary) / 0.4);
          margin: 1rem 0;
          padding-left: 1rem;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        .preview-content code {
          background: hsl(var(--foreground) / 0.08);
          border-radius: 0.25rem;
          padding: 0.15rem 0.35rem;
          font-family: monospace;
          font-size: 0.875em;
        }
        .preview-content pre {
          background: hsl(var(--foreground) / 0.04);
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .preview-content pre code {
          background: transparent;
          padding: 0;
        }
        .preview-content hr {
          border: none;
          border-top: 1px solid hsl(var(--foreground) / 0.1);
          margin: 1.5rem 0;
        }
        .preview-content img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem auto;
          display: block;
        }
        .preview-content .image-grid,
        .preview-content div[class*="image-grid"] {
          display: grid;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .preview-content .image-grid-2,
        .preview-content div[style*="repeat(2"] {
          grid-template-columns: repeat(2, 1fr);
        }
        .preview-content .image-grid-3,
        .preview-content div[style*="repeat(3"] {
          grid-template-columns: repeat(3, 1fr);
        }
        .preview-content .image-grid img,
        .preview-content div[class*="image-grid"] img {
          margin: 0;
          width: 100%;
          height: auto;
          aspect-ratio: 1;
          object-fit: cover;
        }
        .preview-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .preview-content .image-grid,
          .preview-content div[class*="image-grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-muted-foreground/50 italic text-sm">Nothing to preview yet...</p>
      )}
    </div>
  );
}

// Editor toolbar component
function EditorToolbar({
  editor,
  showLinkInput,
  linkUrl,
  setLinkUrl,
  setLink,
  removeLink,
  setShowLinkInput,
  linkInputRef,
  openFilePicker,
  addImageFromUrl,
  uploading,
  onOpenImageGrid,
}: {
  editor: Editor;
  showLinkInput: boolean;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  setLink: () => void;
  removeLink: () => void;
  setShowLinkInput: (show: boolean) => void;
  linkInputRef: React.RefObject<HTMLInputElement>;
  openFilePicker: () => void;
  addImageFromUrl: () => void;
  uploading: boolean;
  onOpenImageGrid: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-foreground/10 bg-secondary/30 p-2">
        {/* Text formatting */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <StrikeIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            <CodeIcon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <ListIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <OrderedListIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <QuoteIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
            <CodeBlockIcon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Links and Images */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Add link"
          >
            <LinkIcon />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton onClick={removeLink} title="Remove link">
              <UnlinkIcon />
            </ToolbarButton>
          )}
          <ToolbarButton onClick={openFilePicker} title="Upload image" disabled={uploading}>
            <UploadIcon />
          </ToolbarButton>
          <ToolbarButton onClick={addImageFromUrl} title="Image from URL">
            <ImageIcon />
          </ToolbarButton>
          <ToolbarButton onClick={onOpenImageGrid} title="Image grid (side-by-side)">
            <GridIcon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align left"
          >
            <AlignLeftIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align center"
          >
            <AlignCenterIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align right"
          >
            <AlignRightIcon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Utilities */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >
            <HorizontalRuleIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <RedoIcon />
          </ToolbarButton>
        </ToolbarGroup>
      </div>

      {/* Link URL input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 border-b border-foreground/10 bg-secondary/20 p-2">
          <input
            ref={linkInputRef}
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setLink();
              } else if (e.key === "Escape") {
                setShowLinkInput(false);
                setLinkUrl("");
              }
            }}
            className="flex-1 rounded border border-foreground/10 bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="button" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={setLink}>Apply</Button>
          <Button type="button" size="sm" variant="ghost" onMouseDown={(e) => e.preventDefault()} onClick={() => { setShowLinkInput(false); setLinkUrl(""); editor?.chain().focus().run(); }}>
            Cancel
          </Button>
        </div>
      )}
    </>
  );
}

// Image Grid Dialog
function ImageGridDialog({
  gridImages,
  setGridImages,
  gridColumns,
  setGridColumns,
  onInsert,
  onClose,
  onUpload,
  uploading,
}: {
  gridImages: string[];
  setGridImages: React.Dispatch<React.SetStateAction<string[]>>;
  gridColumns: number;
  setGridColumns: (cols: number) => void;
  onInsert: () => void;
  onClose: () => void;
  onUpload: (index: number, file: File) => void;
  uploading: boolean;
}) {
  const addImageSlot = () => {
    setGridImages(prev => [...prev, ""]);
  };

  const removeImageSlot = (index: number) => {
    if (gridImages.length > 2) {
      setGridImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    setGridImages(prev => {
      const newImages = [...prev];
      newImages[index] = url;
      return newImages;
    });
  };

  return (
    <div className="border-b border-foreground/10 bg-secondary/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium">Create Image Grid</h4>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Column selector */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Columns:</span>
        {[2, 3].map((cols) => (
          <button
            key={cols}
            type="button"
            onClick={() => setGridColumns(cols)}
            className={`px-3 py-1 text-xs rounded ${
              gridColumns === cols 
                ? "bg-primary text-primary-foreground" 
                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
            }`}
          >
            {cols}
          </button>
        ))}
      </div>

      {/* Image slots */}
      <div className="mb-4 space-y-2">
        {gridImages.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
            <input
              type="text"
              placeholder="Image URL or upload"
              value={url}
              onChange={(e) => updateImageUrl(index, e.target.value)}
              className="flex-1 rounded border border-foreground/10 bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <label className="cursor-pointer rounded bg-foreground/5 px-2 py-1 text-xs hover:bg-foreground/10">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(index, file);
                }}
              />
            </label>
            {gridImages.length > 2 && (
              <button
                type="button"
                onClick={() => removeImageSlot(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add more / Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addImageSlot}
          className="text-xs text-primary hover:underline"
        >
          + Add another image
        </button>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onInsert} disabled={uploading}>
            Insert Grid
          </Button>
        </div>
      </div>

      {/* Preview */}
      {gridImages.some(url => url.trim()) && (
        <div className="mt-4 border-t border-foreground/10 pt-4">
          <p className="mb-2 text-xs text-muted-foreground">Preview:</p>
          <div 
            className="rounded-lg bg-foreground/5 p-2"
            style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, 
              gap: "0.5rem" 
            }}
          >
            {gridImages.map((url, index) => (
              <div 
                key={index} 
                className="aspect-square rounded bg-foreground/10 overflow-hidden"
              >
                {url.trim() ? (
                  <img 
                    src={url} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground/50">
                    Empty
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Toolbar components
function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-foreground/10" />;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
        active
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// Icons
const BoldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const StrikeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 12a4 4 0 0 1 0 8H6" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const OrderedListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
  </svg>
);

const CodeBlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="m10 10-2 2 2 2" />
    <path d="m14 10 2 2-2 2" />
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const UnlinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
    <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
    <line x1="8" y1="2" x2="8" y2="5" />
    <line x1="2" y1="8" x2="5" y2="8" />
    <line x1="16" y1="19" x2="16" y2="22" />
    <line x1="19" y1="16" x2="22" y2="16" />
  </svg>
);

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="15" y1="12" x2="3" y2="12" />
    <line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="17" y1="12" x2="7" y2="12" />
    <line x1="19" y1="18" x2="5" y2="18" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="12" x2="9" y2="12" />
    <line x1="21" y1="18" x2="7" y2="18" />
  </svg>
);

const HorizontalRuleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const UndoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const RedoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
  </svg>
);
