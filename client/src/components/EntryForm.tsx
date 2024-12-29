import { useState } from "react";
import { useEntries } from "@/hooks/use-entries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine } from "lucide-react";

export default function EntryForm() {
  const [content, setContent] = useState("");
  const { createEntry } = useEntries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createEntry(content);
    setContent("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          Today's Memory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's a happy memory from today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length}/280 characters
            </span>
            <Button type="submit" disabled={!content.trim()}>
              Save Memory
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}