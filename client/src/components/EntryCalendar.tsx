import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEntries } from "@/hooks/use-entries";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function EntryCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { getEntriesByDate } = useEntries();
  const [dateEntries, setDateEntries] = useState<any[]>([]);

  const handleSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const entries = await getEntriesByDate(date);
      setDateEntries(entries);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Browse Memories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md border"
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {dateEntries.length > 0 ? (
              <div className="space-y-2">
                {dateEntries.map((entry) => (
                  <div key={entry.id} className="text-sm text-gray-600">
                    {entry.content}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No memories recorded for this date</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
