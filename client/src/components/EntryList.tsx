import { useEntries } from "@/hooks/use-entries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

export default function EntryList() {
  const { entries, isLoading } = useEntries();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Past Memories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {entries?.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <p className="text-sm text-gray-500 mb-2">
                  {format(new Date(entry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="text-gray-700">{entry.content}</p>
              </div>
            ))}
            {entries?.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No memories recorded yet. Start journaling today!
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
