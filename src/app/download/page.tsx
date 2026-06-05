'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toJpeg } from 'html-to-image';
import NewspaperTemplate, { type NewspaperData } from '@/components/NewspaperTemplate';

/**
 * Download Page - Accessed after successful Razorpay payment
 * 
 * Flow:
 * 1. User completes payment on Razorpay → redirected to /download?razorpay_payment_id=pay_xxx
 * 2. This page verifies the payment_id exists in URL params
 * 3. Retrieves roast data and photo from localStorage
 * 4. Displays clean (unwatermarked) NewspaperTemplate
 * 5. Provides a download button using html-to-image library
 */
export default function DownloadPage() {
  const searchParams = useSearchParams();
  const newspaperRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [roastData, setRoastData] = useState<NewspaperData | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Check for payment success on mount
  useEffect(() => {
    const paymentId = searchParams.get('razorpay_payment_id');

    if (!paymentId) {
      // Payment ID missing - access denied
      setHasError(true);
      return;
    }

    // Retrieve data from localStorage
    const storedRoastData = localStorage.getItem('pending_roast_data');
    const storedPhoto = localStorage.getItem('pending_roast_photo');

    if (!storedRoastData) {
      setHasError(true);
      return;
    }

    try {
      const parsedRoastData = JSON.parse(storedRoastData) as NewspaperData;
      setRoastData(parsedRoastData);
      if (storedPhoto) {
        setPhotoUrl(storedPhoto);
      }
    } catch (error) {
      console.error('Failed to parse roast data from localStorage:', error);
      setHasError(true);
    }
  }, [searchParams]);

  /**
   * Handle JPEG download using html-to-image
   * Captures the newspaper container and converts to high-quality JPEG
   */
  const handleDownload = async () => {
    if (!newspaperRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toJpeg(newspaperRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#f4f1ea',
      });

      const link = document.createElement('a');
      link.download = `${roastData?.mainHeadline?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'birthday-roast'}.jpg`;
      link.href = dataUrl;
      link.click();

      // Clean up localStorage after successful download
      localStorage.removeItem('pending_roast_data');
      localStorage.removeItem('pending_roast_photo');
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Error State: Payment ID missing or data not found
  if (hasError || !roastData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-full p-6">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-8">
            It looks like your payment wasn't completed or the link has expired. Please go back and try again.
          </p>

          {/* Back Home Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 duration-150"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Generator
          </a>
        </div>
      </div>
    );
  }

  // Success State: Display clean newspaper and download button
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Your Roast <span className="text-emerald-400">Unlocked</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">High-resolution download ready</p>
          </div>
          <a
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
          >
            Create Another
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 mt-8">
        {/* Download Button */}
        <div className="mb-8">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform duration-150 ${
              isDownloading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:-translate-y-0.5'
            }`}
          >
            {isDownloading ? (
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
                Generating High-Res JPEG…
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download High-Res JPEG
              </>
            )}
          </button>
        </div>

        {/* Clean Newspaper Preview */}
        <div className="bg-slate-900/20 border border-slate-800/50 p-4 md:p-8 rounded-2xl overflow-x-auto flex justify-center">
          <div className="w-full max-w-3xl">
            <NewspaperTemplate
              ref={newspaperRef}
              data={roastData}
              photoUrl={photoUrl}
              showWatermark={false}
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            This high-resolution JPEG is perfect for printing, sharing on social media, or framing.
          </p>
        </div>
      </main>
    </div>
  );
}
