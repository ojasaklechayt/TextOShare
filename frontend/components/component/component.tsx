'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const generateRandomId = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => 
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
};

export function MainComponent() {
  const router = useRouter();

  const handleClick = () => {
    const id = generateRandomId(12);
    router.push(`/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
      <div className="max-w-3xl w-full px-4 sm:px-6 py-12 sm:py-16 bg-[#0F2027]/80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">TextOShare</h1>
          <p className="text-lg sm:text-xl text-gray-300">The future of text sharing is here.</p>
          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-md font-medium text-white shadow-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:underline"
          >
            Generate Link
          </button>
        </div>
      </div>
    </div>
  );
}