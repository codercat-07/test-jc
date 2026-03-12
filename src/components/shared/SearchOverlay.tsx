"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  FileSearch, 
  BookOpen, 
  Newspaper, 
  GraduationCap, 
  Search,
  PenTool,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SearchOverlay() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-border/50 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-all group"
      >
        <Search className="h-4 w-4 opacity-50 group-hover:opacity-100" />
        <span>Search platform...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type to search content..." 
          value={query} 
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[450px]">
          <CommandEmpty className="py-12 text-center">
             <div className="flex flex-col items-center gap-3">
                <FileSearch className="h-10 w-10 text-muted-foreground/20" />
                <p className="text-muted-foreground font-medium">No results found for "{query}"</p>
             </div>
          </CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => onSelect(result.url)}
                  className="rounded-xl flex items-center gap-4 py-4 px-4 cursor-pointer aria-selected:bg-primary/5 group"
                >
                  <div className="h-10 w-10 min-w-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary group-aria-selected:bg-white group-aria-selected:shadow-sm">
                     {result.type === "MCQ" && <HelpCircle className="h-5 w-5" />}
                     {result.type === "Blog" && <Newspaper className="h-5 w-5" />}
                     {result.type === "Exam" && <GraduationCap className="h-5 w-5" />}
                     {result.type === "Lecture" && <BookOpen className="h-5 w-5" />}
                     {result.type === "Written" && <PenTool className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold line-clamp-1">{result.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <Badge variant="outline" className="text-[9px] h-4 font-black uppercase tracking-tighter opacity-50">
                          {result.type}
                       </Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-aria-selected:opacity-100 transition-opacity text-primary" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          <CommandGroup heading="Shortcuts">
            <CommandItem onSelect={() => onSelect("/mcq")} className="rounded-xl py-3 px-4">
              <BookOpen className="mr-3 h-4 w-4" /> MCQ Bank
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/exams")} className="rounded-xl py-3 px-4">
              <GraduationCap className="mr-3 h-4 w-4" /> Live Exams
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/blog")} className="rounded-xl py-3 px-4">
              <Newspaper className="mr-3 h-4 w-4" /> Insights & News
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function HelpCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
