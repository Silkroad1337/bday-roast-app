'use client';

import React, { useRef } from 'react';
import { toJpeg } from 'html-to-image';

interface NewspaperTemplateProps {
  data: {
    mainHeadline?: string;
    birthdayName?: string;
    age?: number;
    roastTopic?: string;
    reporterName?: string;
    dateText?: string;
  };
  photoUrl?: string | null;
}

export default function NewspaperTemplate({ data, photoUrl }: NewspaperTemplateProps) {
  const newspaperRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (newspaperRef.current === null) return;
    
    try {
      // Convert the HTML element into a data URL representation of a JPEG
      const dataUrl = await toJpeg(newspaperRef.current, { 
        quality: 0.95, 
        pixelRatio: 2,
        backgroundColor: '#f4f1ea' // Ensure background color is preserved in output image
      });
      
      // Create a temporary link element to trigger the browser download
      const link = document.createElement('a');
      link.download = `${data.mainHeadline?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'birthday-roast'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  // Default values for template display
  const headline = data.mainHeadline || "LOCAL LEGEND REACHES HISTORIC AGE!";
  const name = data.birthdayName || "John Doe";
  const age = data.age || 30;
  const topic = data.roastTopic || "Questionable life decisions and high caffeine intake";
  const reporter = data.reporterName || "Tattletale Thompson";
  const date = data.dateText || new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Action Button */}
      <button 
        onClick={handleDownload}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold px-8 py-4 rounded-xl shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        Download High-Res Print JPEG
      </button>

      {/* Printable Area - styled like a vintage newspaper */}
      <div 
        ref={newspaperRef} 
        className="w-full bg-[#f4f1ea] text-zinc-900 p-10 font-serif border-[12px] border-zinc-800 shadow-2xl relative select-none"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Subtle vintage texture/aging overlay (only visible in UI, but background color exports nicely) */}
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

        {/* Newspaper Header */}
        <header className="border-b-4 border-double border-zinc-900 pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase font-serif border-b border-zinc-400 pb-2 mb-2">
              The Daily Roast
            </h1>
            <p className="italic text-lg md:text-xl font-medium tracking-wide text-zinc-700">
              "The Truth, Heavily Exaggerated & Slightly Charred"
            </p>
          </div>
          
          {/* Metadata bar */}
          <div className="flex justify-between items-center text-xs font-semibold uppercase border-t-2 border-b-2 border-zinc-900 py-1.5 mt-4 px-2">
            <span>Vol. XCVII No. {age}</span>
            <span>{date}</span>
            <span>Price: One Pint</span>
          </div>
        </header>

        {/* Main Headline */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight text-zinc-950 mb-2">
            {headline}
          </h2>
          <div className="h-0.5 bg-zinc-900 w-1/3 mx-auto my-3"></div>
          <p className="text-lg italic text-zinc-700 max-w-2xl mx-auto">
            Subject identified as <span className="font-bold not-italic">{name}</span>, who has somehow survived for <span className="font-bold not-italic">{age} years</span> despite overwhelming evidence of tomfoolery.
          </p>
        </div>

        {/* Two-Column Newspaper Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-400">
          
          {/* Left Column: Story Details */}
          <div className="md:col-span-2 flex flex-col gap-4 pr-0 md:pr-4 md:border-r border-zinc-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              <span>By {reporter}</span>
              <span>•</span>
              <span>Senior Roast Correspondent</span>
            </div>

            {/* Photo Section */}
            {photoUrl ? (
              <div className="w-full bg-zinc-300 border-2 border-zinc-800 p-1 mb-2">
                <div className="relative w-full aspect-[4/3] overflow-hidden grayscale contrast-125 brightness-95">
                  <img 
                    src={photoUrl} 
                    alt="Roast Target" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
                </div>
                <p className="text-xs italic text-center mt-2 text-zinc-700">
                  Exhibit A: {name} in their natural habitat, attempting to look innocent.
                </p>
              </div>
            ) : (
              <div className="w-full bg-zinc-200 border-2 border-zinc-400 border-dashed p-6 text-center mb-2 flex flex-col items-center justify-center aspect-[4/3]">
                <svg className="w-12 h-12 text-zinc-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm font-medium text-zinc-500 italic">No Mugshot Provided</p>
              </div>
            )}

            {/* Paragraphs */}
            <div className="text-sm leading-relaxed text-zinc-800 text-justify flex flex-col gap-4 font-serif">
              <p>
                <span className="text-4xl font-extrabold float-left mr-2 mt-1 line-height-none text-zinc-950">I</span>n what officials are calling a "statistical anomaly," <span className="font-semibold">{name}</span> officially marked another trip around the sun. Friends and colleagues have expressed deep concern regarding the subject's ability to locate their keys, remember why they walked into a room, or operate basic technological devices without sighing heavily.
              </p>
              <p>
                Eyewitnesses report that the primary source of the target's aging stems from <span className="italic">{topic}</span>. Local coffee shops report a sharp spike in revenue, while local gyms report a complete absence of the subject's presence, despite a recurring monthly membership.
              </p>
              <p>
                "It's like watching a train wreck in slow motion, except the train is holding a lukewarm cup of tea and looking for its glasses," commented an anonymous family member. "We are just glad they made it to {age} without accidentally locking themselves out of the house again."
              </p>
            </div>
          </div>

          {/* Right Column: Side Stories / Advertisements */}
          <div className="flex flex-col gap-6">
            
            {/* Side Story 1 */}
            <div className="border-b border-zinc-400 pb-4">
              <h3 className="text-lg font-extrabold uppercase leading-tight text-zinc-950 mb-2">
                WEATHER FORECAST
              </h3>
              <p className="text-xs font-semibold uppercase text-zinc-500 mb-1">High Chance of Whining</p>
              <p className="text-sm leading-tight text-zinc-800 text-justify">
                Cloudy with a 99% chance of complaining about joint paint, lower back stiffness, and "kids these days." Wind speeds may increase when blowing out birthday candles.
              </p>
            </div>

            {/* Side Story 2 */}
            <div className="border-b border-zinc-400 pb-4">
              <h3 className="text-lg font-extrabold uppercase leading-tight text-zinc-950 mb-2">
                LOCAL ANNOUNCEMENT
              </h3>
              <p className="text-xs font-semibold uppercase text-zinc-500 mb-1">Naps Declared Essential</p>
              <p className="text-sm leading-tight text-zinc-800 text-justify">
                The City Council has passed an emergency resolution declaring any nap exceeding 45 minutes as an "essential health measure" for individuals of the target's advanced age.
              </p>
            </div>

            {/* Retro Ad block */}
            <div className="border-2 border-zinc-800 p-3 bg-zinc-100 flex flex-col items-center text-center mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Advertisement</span>
              <h4 className="font-black uppercase tracking-tight text-sm text-zinc-950 mb-1">
                Is your back hurting?
              </h4>
              <p className="text-xs italic text-zinc-700 leading-tight">
                Try "Miracle Balm No. 9"! Specially formulated for people who make noises when they sit down.
              </p>
              <div className="border border-zinc-800 text-[10px] font-bold px-2 py-0.5 mt-2 uppercase">
                Only 5¢ a jar
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-4 border-double border-zinc-900 pt-3 mt-6 text-center text-xs font-bold uppercase text-zinc-500">
          <span>© {new Date().getFullYear()} The Daily Roast Publishing Corp. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}
