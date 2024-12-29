import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Entry, InsertEntry } from "@db/schema";
import { useToast } from '@/hooks/use-toast';

export function useEntries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: entries, isLoading } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
  });

  const createEntry = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      toast({
        title: "Success",
        description: "Entry saved successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getEntriesByDate = async (date: Date): Promise<Entry[]> => {
    const res = await fetch(`/api/entries/${date.toISOString().split('T')[0]}`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  };

  return {
    entries,
    isLoading,
    createEntry: createEntry.mutateAsync,
    getEntriesByDate
  };
}
