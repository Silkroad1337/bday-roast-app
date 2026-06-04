'use client';

import React, { useState, useEffect } from 'react';
import NewspaperTemplate from '@/components/NewspaperTemplate';

export default function Home() {
  // Newspaper data states
  const [birthdayName, setBirthdayName] = useState('Arthur Pendelton');
  const [age, setAge] = useState(40);
  const [mainHeadline, setMainHeadline] = useState('LOCAL MAN FORGETS WHY HE ENTERED LIVING ROOM');
  const [roastTopic, setRoastTopic] = useState('Excessive groaning upon standing, aggressive lawn mowing, and an alarming collections of pocket knives');
  const [reporterName, setReporterName] = useState('Gossip Gertrude');
  const [dateText, setDateText] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Set default date text on load
  useEffect(() => {
    const formatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDateText(formatted);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local object URL for the uploaded file
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleReset = () => {
    setBirthdayName('Arthur Pendelton');
    setAge(40);
    setMainHeadline('LOCAL MAN FORGETS WHY HE ENTERED LIVING ROOM');
    setRoastTopic('Excessive groaning upon standing, aggressive lawn mowing, and an alarming collections of pocket knives');
    setReporterName('Gossip Gertrude');
    setPhotoUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-900 pb-16">
      {/* Premium Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black p-2.5 rounded-xl shadow-lg shadow-amber-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                Birthday Roast <span className="text-amber-500">Generator</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Create and download vintage printable roast newspapers</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Customize Form */}
        <section className="lg:col-span-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col gap-5">
          <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Customize Roast Details
          </h2>

          {/* Subject Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Name</label>
            <input
              type="text"
              value={birthdayName}
              onChange={(e) => setBirthdayName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100"
              placeholder="e.g., Arthur Pendelton"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Age (Vol. Edition Number)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100"
              placeholder="e.g., 40"
            />
          </div>

          {/* Main Headline */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Main Headline</label>
            <textarea
              value={mainHeadline}
              onChange={(e) => setMainHeadline(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 min-h-[80px]"
              placeholder="e.g., LOCAL MAN FORGETS WHY HE ENTERED LIVING ROOM"
            />
          </div>

          {/* Roast Topics / Crimes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Offences / Roast Topics</label>
            <textarea
              value={roastTopic}
              onChange={(e) => setRoastTopic(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 min-h-[100px]"
              placeholder="e.g., high caffeine intake, bad dad jokes..."
            />
          </div>

          {/* Reporter Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Reporter Name</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100"
              placeholder="e.g., Gossip Gertrude"
            />
          </div>

          {/* Custom Date Text */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Date text</label>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100"
              placeholder="e.g., Friday, June 5, 2026"
            />
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Mugshot (JPEG/PNG)</label>
            <div className="relative border-2 border-slate-800 border-dashed hover:border-amber-500/40 rounded-xl p-4 transition-all bg-slate-950 flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-xs font-semibold text-slate-400 text-center">
                {photoUrl ? "Image Loaded Successfully" : "Click or drag to upload target photo"}
              </span>
              <span className="text-[10px] text-slate-600 mt-1">Converts to local grey-scale vintage photo</span>
            </div>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="text-xs font-semibold text-red-400 hover:text-red-300 text-left mt-1 self-start"
              >
                Clear Photo
              </button>
            )}
          </div>
        </section>

        {/* Right Side: Live Newspaper Preview & Download */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-900/20 border border-slate-800/80 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Interactive Preview</h3>
              <p className="text-xs text-slate-500">How your high-res JPEG print will look when downloaded</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </div>
          </div>

          <div className="overflow-x-auto w-full flex justify-center bg-slate-900/20 p-2 md:p-6 rounded-2xl border border-slate-800/50">
            <div className="w-full max-w-3xl min-w-[320px]">
              <NewspaperTemplate
                data={{
                  mainHeadline,
                  birthdayName,
                  age,
                  roastTopic,
                  reporterName,
                  dateText,
                }}
                photoUrl={photoUrl}
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
