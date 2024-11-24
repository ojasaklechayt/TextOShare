'use client';

import { useEffect, useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Note {
  note: string;
  timestamp: string;
}

interface APIError {
  error: string;
}

export function TextSpace() {
  const params = useParams();
  const id = params?.id as string;
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a debounced version of the save function
  const debouncedSave = useCallback(
    debounce(async (noteId: string, newText: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: newText }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorData = data as APIError;
          throw new Error(errorData.error || 'Failed to save changes');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to save changes');
        }
      }
    }, 1000),
    []
  );

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/notes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          const errorData = data as APIError;
          throw new Error(errorData.error || 'Failed to load note');
        }

        const noteData = data as Note;
        setText(noteData.note || '');
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to load note');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);

    if (id) {
      debouncedSave(id, newText);
    }
  };

  const copyLink = async () => {
    if (!id) return;

    const url = `${window.location.origin}/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F2027]">
      <div className="flex-1 flex items-center justify-center p-4">
        <Textarea
          placeholder="Start typing..."
          className="w-full max-w-3xl text-2xl md:text-3xl font-medium bg-transparent border-none outline-none resize-none text-white"
          rows={20}
          value={text}
          onChange={handleTextChange}
        />
      </div>
      <div className="bg-black border-t border-gray-800 px-4 py-3 flex items-center justify-between gap-4 md:px-6 md:py-4">
        <Button
          onClick={copyLink}
          disabled={isLoading || !id}
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
        >
          {copied ? (
            <span className="flex items-center">
              <CheckIcon className="w-4 h-4 mr-2" />
              Copied!
            </span>
          ) : (
            <span className="flex items-center">
              <ShareIcon className="w-4 h-4 mr-2" />
              Share Link
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

const ShareIcon = ({ className = "" }) => (
  <svg
    className={className}
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
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const CheckIcon = ({ className = "" }) => (
  <svg
    className={className}
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);