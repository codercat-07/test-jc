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
import { common, createLowlight } from "lowlight";
import "katex/dist/katex.min.css";
import "@/styles/editor.css"; // We'll create this for custom prose styles

const lowlight = createLowlight(common);

interface ContentRendererProps {
  content: any;
  className?: string;
}

export default function ContentRenderer({ content, className }: ContentRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
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
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}
