'use client'
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import { JSX, SVGProps, SetStateAction, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function TextSpace() {
  const [text, setText] = useState('');
  const { id } = useParams();
  const [notesID, setNotesID] = useState(id);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTextById = async () => {
      try {
        const response = await fetch(`${process.env.API_ROUTE}${notesID}`);

        if (!response.ok) {
          throw new Error('Failed to fetch text');
        }

        const data = await response.json();
        setText(data.note);
        console.log('Fetched text:',  data.note);
      } catch (error) {
        toast.error('Failed to fetch text.');
        console.error('Error fetching text:', error);
      }
    };

    if (id) {
      fetchTextById();
    }
  }, [id, notesID]);

  const handlechange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setText(event.target.value);
  }

  const handlePostRequest = async () => {
    try {
      setSubmitting(true);

      let method = 'POST';
      let endpoint = `${process.env.API_ROUTE}${id}`;
      const existingText = text.trim();

      if (existingText) {
        method = 'PUT';
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: text, notesID: id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response:', data);
      toast.success('Successfully updated!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        setSubmitting(false);
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        setSubmitting(false);
      }, 5000);
    }
  };

  const copyLinkToClipboard = () => {
    const url = `${window.location.origin}/${id}`;

    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center">
        <Textarea
          placeholder="Start typing..."
          className="w-full max-w-3xl text-2xl md:text-3xl font-medium bg-transparent border-none outline-none resize-none"
          rows={20}
          value={text}
          onChange={handlechange}
        ></Textarea>
      </div>
      <div className="bg-black border-t px-4 py-3 flex items-center justify-between gap-4 md:px-6 md:py-4">
        <Button className="bg-black text-white border border-gray-300 rounded hover:bg-gray-300 hover:text-black hover:border-gray-300"
          onClick={copyLinkToClipboard}>
          <ShareIcon className="w-5 h-5 mr-2" />
          {copied ? (
            "Link copied!"
          ) : (
            "Share Link"
          )}
        </Button>
        <Button className="bg-white text-black border border-gray-300 rounded hover:bg-gray-300 hover:text-white hover:border-gray-300"
          onClick={handlePostRequest} >
          <SendIcon className="w-5 h-5 mr-2" />
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}

function SendIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function ShareIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
