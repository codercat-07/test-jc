"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon, 
  Youtube as YoutubeIcon, 
  Table as TableIcon, 
  Code, 
  Sigma, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2, 
  Heading3, 
  Highlighter,
  Link as LinkIcon,
  Eraser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  onImageUpload 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Handled by lowlight
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg border border-border max-w-full h-auto",
        },
      }),
      Youtube.configure({
        width: 480,
        height: 320,
        HTMLAttributes: {
          class: "rounded-lg border border-border aspect-video max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[200px] px-4 py-3 bg-background rounded-b-lg border border-t-0 border-border",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && onImageUpload) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error("Image upload failed", error);
        }
      }
    };
    input.click();
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  return (
    <div className="w-full flex flex-col border border-border rounded-lg overflow-hidden glass-card">
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            tooltip="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            tooltip="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            tooltip="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>
          
          <Separator orientation="vertical" className="h-6 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            tooltip="H1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            tooltip="H2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            tooltip="H3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            tooltip="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            tooltip="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            tooltip="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            tooltip="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <ToolbarButton onClick={setLink} active={editor.isActive("link")} tooltip="Link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} tooltip="Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addYoutubeVideo} tooltip="YouTube">
            <YoutubeIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
            tooltip="Table"
          >
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
          
          <Separator orientation="vertical" className="h-6 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            tooltip="Code Block"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().insertContent("$...$").run()}
            tooltip="Math (Inline)"
          >
            <Sigma className="h-4 w-4" />
          </ToolbarButton>

          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} tooltip="Undo">
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} tooltip="Redo">
              <Redo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Clear Style"
            >
              <Eraser className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </TooltipProvider>

      <EditorContent editor={editor} />
      
      <div className="px-4 py-2 bg-muted/10 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        <span>Rich Text Editor</span>
        <span>{editor.storage.characterCount?.characters?.() || 0} characters</span>
      </div>
    </div>
  );
}

function ToolbarButton({ 
  onClick, 
  active, 
  children, 
  className,
  tooltip
}: { 
  onClick: () => void; 
  active?: boolean; 
  children: React.ReactNode;
  className?: string;
  tooltip: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={active ? "secondary" : "ghost"}
          size="sm"
          onClick={onClick}
          className={cn("h-8 w-8 p-0 rounded-md", active && "bg-primary/20 text-primary hover:bg-primary/30", className)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs font-semibold py-1 px-2">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
