'use client';

import React, { useState, useCallback } from 'react';
import NewspaperTemplate, {
  type NewspaperData,
} from '@/components/NewspaperTemplate';

type FlowState = 'input' | 'generating' | 'preview';

export default function Home() {
  // --- Input State ---
  const [birthdayName, setBirthdayName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [habit1, setHabit1] = useState('');
  const [habit2, setHabit2] = useState('');
  const [habit3, setHabit3] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // --- Flow State ---
  const [flowState, setFlowState] = useState<FlowState>('input');
  const [generatedData, setGeneratedData] = useState<NewspaperData>({});
  const [errorMessage, setErrorMessage] = useState('');

  // Derived
  const hasGenerated = flowState === 'preview';
  const canGenerate = birthdayName.trim() && age && habit1.trim();

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPhotoBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setFlowState('generating');
    setErrorMessage('');

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthdayName: birthdayName.trim(),
          age: Number(age),
          habits: [habit1.trim(), habit2.trim(), habit3.trim()].filter(Boolean),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate roast');
      }

      const aiData = await res.json();
      const roastData: NewspaperData = {
        mainHeadline: aiData.mainHeadline,
        birthdayName: birthdayName.trim(),
        age: Number(age),
        articleText1: aiData.articleText1,
        articleText2: aiData.articleText2,
        articleText3: aiData.articleText3,
        weatherForecast: aiData.weatherForecast,
        localAnnouncement: aiData.localAnnouncement,
        advertisement: aiData.advertisement,
        reporterName: aiData.reporterName,
      };

      setGeneratedData(roastData);
      setFlowState('preview');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
      setFlowState('input');
    }
  }, [birthdayName, age, habit1, habit2, habit3, canGenerate]);

  const handlePayClick = () => {
    // Save roast data and photo to localStorage
    localStorage.setItem('pending_roast_data', JSON.stringify(generatedData));
    if (photoBase64) {
      localStorage.setItem('pending_roast_photo', photoBase64);
    }

    // Redirect to Razorpay Payment Page
    window.location.href = 'https://rzp.io/l/BZsfu6uB';
  };

  const handleReset = () => {
    setBirthdayName('');
    setAge('');
    setHabit1('');
    setHabit2('');
    setHabit3('');
    setPhotoBase64(null);
    setGeneratedData({});
    setFlowState('input');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-900 pb-16">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black p-2.5 rounded-xl shadow-lg shadow-amber-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                Birthday Roast <span className="text-amber-500">Generator</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                AI-powered modern roasts
              </p>
            </div>
          </div>
          {hasGenerated && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <section className="lg:col-span-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col gap-5">
          <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Roast Details
          </h2>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subject Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={birthdayName}
              onChange={(e) => setBirthdayName(e.target.value)}
              disabled={hasGenerated}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Arthur Pendelton"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Age <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              disabled={hasGenerated}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., 40"
            />
          </div>

          {/* 3 Habits */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Funny Habit #1 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={habit1}
              onChange={(e) => setHabit1(e.target.value)}
              disabled={hasGenerated}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Falls asleep during movies"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Funny Habit #2
            </label>
            <input
              type="text"
              value={habit2}
              onChange={(e) => setHabit2(e.target.value)}
              disabled={hasGenerated}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Aggressive lawn mowing at 7am"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Funny Habit #3
            </label>
            <input
              type="text"
              value={habit3}
              onChange={(e) => setHabit3(e.target.value)}
              disabled={hasGenerated}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Says 'back in my day' unironically"
            />
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subject Mugshot (optional)
            </label>
            <div className="relative border-2 border-slate-800 border-dashed hover:border-amber-500/40 rounded-xl p-4 transition-all bg-slate-950 flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={hasGenerated}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
              />
              <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-semibold text-slate-400 text-center">
                {photoBase64 ? 'Photo Loaded ✓' : 'Click to upload photo'}
              </span>
            </div>
            {photoBase64 && !hasGenerated && (
              <button
                type="button"
                onClick={() => setPhotoBase64(null)}
                className="text-xs font-semibold text-red-400 hover:text-red-300 text-left mt-1 self-start"
              >
                Clear Photo
              </button>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {/* Generate Button */}
          {!hasGenerated && (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || flowState === 'generating'}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
            >
              {flowState === 'generating' ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating your roast…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Roast
                </>
              )}
            </button>
          )}

          {/* Post-generate info */}
          {hasGenerated && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-200/80">
                🔥 Your roast is ready! Review the preview, then unlock to download the watermark-free high-res JPEG.
              </p>
            </div>
          )}
        </section>

        {/* Right: Preview */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-900/20 border border-slate-800/80 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                {hasGenerated ? 'Watermarked Preview' : 'Preview'}
              </h3>
              <p className="text-xs text-slate-500">
                {hasGenerated
                  ? 'This is a preview with watermark. Purchase to unlock clean version.'
                  : 'Fill in the form and click "Generate Roast" to begin'}
              </p>
            </div>
            {hasGenerated && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/20`}
              >
                <span className={`w-2 h-2 rounded-full bg-amber-400`} />
                Watermarked
              </div>
            )}
          </div>

          {/* Newspaper or Placeholder */}
          <div className="overflow-x-auto w-full flex justify-center bg-slate-900/20 p-2 md:p-6 rounded-2xl border border-slate-800/50">
            {hasGenerated ? (
              <div className="w-full max-w-3xl min-w-[320px]">
                <NewspaperTemplate
                  data={generatedData}
                  photoUrl={photoBase64}
                  showWatermark={true}
                />
              </div>
            ) : (
              <div className="w-full max-w-3xl min-w-[320px] flex flex-col items-center justify-center py-32 gap-4 text-slate-600">
                <svg className="w-20 h-20 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <p className="text-lg font-semibold text-slate-500">Your roast will appear here</p>
                <p className="text-sm text-slate-600">
                  Fill in the details on the left and hit &quot;Generate Roast&quot;
                </p>
              </div>
            )}
          </div>

          {/* CTA Button to Razorpay */}
          {hasGenerated && (
            <button
              onClick={handlePayClick}
              className="flex items-center gap-2 font-serif font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Remove Watermark &amp; Download High-Res — ₹199
            </button>
          )}
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-400 border-t border-slate-800 mt-10">
        <span className="font-semibold text-slate-200">Version</span>{' '}
        <span className="text-amber-400">v1.0.0</span>
      </footer>
    </div>
  );
}
