'use client';

import React, { useState, useRef, useCallback } from 'react';
import NewspaperTemplate, {
  type NewspaperData,
  type NewspaperTemplateHandle,
} from '@/components/NewspaperTemplate';

type FlowState = 'input' | 'generating' | 'preview' | 'checkout' | 'processing' | 'unlocked';

export default function Home() {
  // --- Input State ---
  const [birthdayName, setBirthdayName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [habit1, setHabit1] = useState('');
  const [habit2, setHabit2] = useState('');
  const [habit3, setHabit3] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // --- Flow State ---
  const [flowState, setFlowState] = useState<FlowState>('input');
  const [generatedData, setGeneratedData] = useState<NewspaperData>({});
  const [errorMessage, setErrorMessage] = useState('');

  const newspaperRef = useRef<NewspaperTemplateHandle>(null);

  // Derived
  const isLocked = flowState !== 'unlocked';
  const hasGenerated = flowState === 'preview' || flowState === 'checkout' || flowState === 'processing' || flowState === 'unlocked';
  const canGenerate = birthdayName.trim() && age && habit1.trim();

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
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
      setGeneratedData({
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
      });
      setFlowState('preview');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
      setFlowState('input');
    }
  }, [birthdayName, age, habit1, habit2, habit3, canGenerate]);

  const handlePayClick = () => setFlowState('checkout');
  const handleCloseCheckout = () => setFlowState('preview');

  const handleConfirmPay = async () => {
    setFlowState('processing');
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    setFlowState('unlocked');
    // Auto-download after unlock
    setTimeout(() => {
      newspaperRef.current?.triggerDownload();
    }, 600);
  };

  const handleReset = () => {
    setBirthdayName('');
    setAge('');
    setHabit1('');
    setHabit2('');
    setHabit3('');
    setPhotoUrl(null);
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
                AI-powered vintage newspaper roasts
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
              Birthday Person&apos;s Name <span className="text-rose-400">*</span>
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
                {photoUrl ? 'Photo Loaded ✓' : 'Click to upload photo'}
              </span>
            </div>
            {photoUrl && !hasGenerated && (
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
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
          {hasGenerated && flowState !== 'unlocked' && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-200/80">
                🔥 Your roast is ready! Review the preview, then unlock to download the watermark-free high-res JPEG.
              </p>
            </div>
          )}
          {flowState === 'unlocked' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-300">
                ✅ Unlocked! Your high-res JPEG is downloading. Click the button above to download again.
              </p>
            </div>
          )}
        </section>

        {/* Right: Preview */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-900/20 border border-slate-800/80 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                {hasGenerated ? 'AI-Generated Preview' : 'Preview'}
              </h3>
              <p className="text-xs text-slate-500">
                {hasGenerated
                  ? isLocked
                    ? 'Watermarked preview — unlock to download clean version'
                    : 'Premium unlocked — download your high-res JPEG below'
                  : 'Fill in the form and click "Generate Roast" to begin'}
              </p>
            </div>
            {hasGenerated && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isLocked
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLocked ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                {isLocked ? 'Watermarked' : 'Unlocked'}
              </div>
            )}
          </div>

          {/* Newspaper or Placeholder */}
          <div className="overflow-x-auto w-full flex justify-center bg-slate-900/20 p-2 md:p-6 rounded-2xl border border-slate-800/50">
            {hasGenerated ? (
              <div className="w-full max-w-3xl min-w-[320px]">
                <NewspaperTemplate
                  ref={newspaperRef}
                  data={generatedData}
                  photoUrl={photoUrl}
                  isLocked={isLocked}
                  onDownloadClick={handlePayClick}
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
        </section>
      </main>

      {/* Checkout Modal */}
      {(flowState === 'checkout' || flowState === 'processing') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={flowState === 'checkout' ? handleCloseCheckout : undefined}
          />
          {/* Modal Card */}
          <div className="relative bg-slate-900/95 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl z-10">
            {flowState === 'processing' ? (
              /* Processing State */
              <div className="flex flex-col items-center gap-6 py-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-amber-500 animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">Processing Payment…</h3>
                  <p className="text-sm text-slate-400">
                    Verifying your card and unlocking the roast.
                  </p>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <>
                {/* Close Button */}
                <button
                  onClick={handleCloseCheckout}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                    <svg className="w-7 h-7 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Unlock Your Roast</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Remove the watermark and download a print-quality JPEG
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-800/60 rounded-xl p-4 mb-6 border border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Birthday Roast for {generatedData.birthdayName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-res JPEG • Watermark removed • Instant download
                      </p>
                    </div>
                    <span className="text-xl font-black text-amber-400">₹199</span>
                  </div>
                </div>

                {/* Demo Card Fields (visual only) */}
                <div className="flex flex-col gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4242 4242 4242 4242"
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="12 / 28"
                      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="123"
                      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleConfirmPay}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
                >
                  Pay ₹199 &amp; Download
                </button>

                <p className="text-center text-[11px] text-slate-600 mt-4">
                  🔒 Demo checkout — no real payment will be processed
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
