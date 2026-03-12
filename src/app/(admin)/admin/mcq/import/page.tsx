"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminMcqImportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Map common CSV columns to our internal format
        const mapped = results.data.map((row: any) => ({
          questionPlain: row.Question || row.question || "",
          options: [
            { textPlain: row["Option A"] || row.a || "", isCorrect: String(row.Correct).toUpperCase() === "A" },
            { textPlain: row["Option B"] || row.b || "", isCorrect: String(row.Correct).toUpperCase() === "B" },
            { textPlain: row["Option C"] || row.c || "", isCorrect: String(row.Correct).toUpperCase() === "C" },
            { textPlain: row["Option D"] || row.d || "", isCorrect: String(row.Correct).toUpperCase() === "D" },
          ],
          explanationPlain: row.Explanation || row.explanation || "",
          subjectName: row.Subject || row.subject || "",
          examHeading: row.Exam || row.exam || "",
        })).filter(q => q.questionPlain);

        setData(mapped);
        toast.success(`Successfully loaded ${mapped.length} questions from CSV`);
      },
      error: (err) => {
        toast.error("Failed to parse CSV: " + err.message);
      }
    });
  };

  const startImport = async () => {
    if (data.length === 0) return;

    setLoading(true);
    setProgress(10);

    try {
      // Chunking for very large imports if needed, but for now single request
      const response = await fetch("/api/mcq/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Import failed");
      }

      setProgress(100);
      toast.success(`Imported ${data.length} MCQs successfully!`);
      router.push("/admin/mcq");
    } catch (error: any) {
      toast.error(error.message);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/mcq"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Import MCQs</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass-card border-none card-shadow h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> Upload CSV
            </CardTitle>
            <CardDescription>
              Upload a standard CSV file with the following columns: 
              <span className="block mt-2 font-mono text-[10px] bg-muted p-2 rounded leading-loose">
                Question, Option A, Option B, Option C, Option D, Correct (A/B/C/D), Explanation, Subject
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 transition-all bg-muted/5">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer space-y-4 block">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Click to Upload</p>
                  <p className="text-sm text-muted-foreground">or drag and drop your CSV file</p>
                </div>
              </label>
            </div>

            {data.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ready for import:</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">{data.length} Questions</Badge>
                </div>
                
                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={startImport} 
                  disabled={loading} 
                  className="w-full shadow-lg"
                >
                  {loading ? "Importing..." : <><CheckCircle2 className="mr-2 h-4 w-4" /> Start Bulk Import</>}
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setData([])} 
                  disabled={loading}
                  className="w-full text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Clear and Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-none card-shadow overflow-hidden">
           <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.length > 0 ? (
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="bg-background sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[40%]">Question</TableHead>
                      <TableHead>Correct</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 50).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium truncate max-w-[200px]">{row.questionPlain}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/5 text-success border-success/20">
                            {row.options.find((o: any) => o.isCorrect)?.textPlain || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{row.subjectName || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{row.examHeading || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.length > 50 && (
                  <div className="p-4 bg-muted/20 text-center text-xs text-muted-foreground italic">
                    Showing first 50 of {data.length} items...
                  </div>
                )}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center px-8">
                 <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
                 </div>
                 <p className="text-muted-foreground max-w-xs">
                   No data to preview. Upload a CSV file to see its contents here before importing.
                 </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
