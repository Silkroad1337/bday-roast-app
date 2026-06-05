'use client';

import React, { forwardRef } from 'react';

/**
 * NewspaperTemplate Component
 * 
 * Props:
 * - data: NewspaperData object with roast content
 * - photoUrl: Base64 photo string (optional)
 * - showWatermark: Boolean to control watermark display
 * 
 * Features:
 * - Large, readable typography for mobile users
 * - Conditional watermark overlay
 * - Responsive design with print-friendly styling
 */

export interface NewspaperData {
  mainHeadline?: string;
  birthdayName?: string;
  age?: number;
  articleText1?: string;
  articleText2?: string;
  articleText3?: string;
  weatherForecast?: string;
  localAnnouncement?: string;
  advertisement?: string;
  reporterName?: string;
}

interface NewspaperTemplateProps {
  data: NewspaperData;
  photoUrl?: string | null;
  showWatermark?: boolean;
}

const NewspaperTemplate = forwardRef<HTMLDivElement, NewspaperTemplateProps>(
  function NewspaperTemplate({ data, photoUrl, showWatermark = false }, ref) {
    const headline = data.mainHeadline || 'LOCAL LEGEND REACHES HISTORIC AGE!';
    const name = data.birthdayName || 'John Doe';
    const age = data.age || 30;
    const reporter = data.reporterName || 'Tattletale Thompson';
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const article1 =
      data.articleText1 ||
      `In what officials are calling a "statistical anomaly," ${name} officially marked another trip around the sun. Friends and colleagues have expressed deep concern regarding the subject's ability to locate their keys, remember why they walked into a room, or operate basic technological devices without sighing heavily.`;
    const article2 =
      data.articleText2 ||
      `Eyewitnesses report that the primary source of the target's aging stems from questionable life decisions and high caffeine intake. Local coffee shops report a sharp spike in revenue, while local gyms report a complete absence of the subject's presence, despite a recurring monthly membership.`;
    const article3 =
      data.articleText3 ||
      `"It's like watching a train wreck in slow motion, except the train is holding a lukewarm cup of tea and looking for its glasses," commented an anonymous family member. "We are just glad they made it to ${age} without accidentally locking themselves out of the house again."`;
    const weather =
      data.weatherForecast ||
      'Cloudy with a 99% chance of complaining about joint pain, lower back stiffness, and "kids these days." Wind speeds may increase when blowing out birthday candles.';
    const announcement =
      data.localAnnouncement ||
      'The City Council has passed an emergency resolution declaring any nap exceeding 45 minutes as an "essential health measure" for individuals of the target\'s advanced age.';

    // Split the advertisement text into a headline and body
    let adHeadline = 'Is your back hurting?';
    let adBody =
      'Try "Miracle Balm No. 9"! Specially formulated for people who make noises when they sit down.';
    if (data.advertisement) {
      const parts = data.advertisement.split(/[.\n]/).filter(Boolean);
      if (parts.length >= 2) {
        adHeadline = parts[0].trim();
        adBody = parts.slice(1).join('. ').trim();
      } else {
        adBody = data.advertisement;
      }
    }

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Printable Area */}
        <div
          ref={ref}
          className="w-full bg-[#f4f1ea] text-zinc-900 p-8 md:p-12 font-serif border-[12px] border-zinc-800 shadow-2xl relative select-none overflow-hidden"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* WATERMARK OVERLAY - Conditional */}
          {showWatermark && (
            <div
              className="absolute inset-0 z-30 pointer-events-none overflow-hidden flex items-center justify-center"
              aria-hidden="true"
            >
              <div
                className="absolute"
                style={{
                  width: '200%',
                  height: '200%',
                  top: '-50%',
                  left: '-50%',
                  transform: 'rotate(-30deg)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'center',
                  justifyContent: 'center',
                  gap: '40px 60px',
                }}
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-4xl md:text-5xl font-black uppercase select-none whitespace-nowrap"
                    style={{
                      color: 'rgba(220, 38, 38, 0.13)',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 2px rgba(220,38,38,0.06)',
                    }}
                  >
                    PREVIEW ONLY
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Newspaper Header */}
          <header className="border-b-4 border-double border-zinc-900 pb-4 mb-6 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase font-serif border-b border-zinc-400 pb-2 mb-2">
                The Daily Roast
              </h1>
              <p className="italic text-lg md:text-xl font-medium tracking-wide text-zinc-700">
                &quot;The Truth, Heavily Exaggerated &amp; Slightly Charred&quot;
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold uppercase border-t-2 border-b-2 border-zinc-900 py-1.5 mt-4 px-2">
              <span>Vol. XCVII No. {age}</span>
              <span>{date}</span>
              <span>Price: One Pint</span>
            </div>
          </header>

          {/* Main Headline */}
          <div className="text-center mb-6 relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight text-zinc-950 mb-2">
              {headline}
            </h2>
            <div className="h-0.5 bg-zinc-900 w-1/3 mx-auto my-3" />
            <p className="text-lg md:text-xl italic text-zinc-700 max-w-2xl mx-auto">
              Subject identified as{' '}
              <span className="font-bold not-italic">{name}</span>, who has somehow survived
              for <span className="font-bold not-italic">{age} years</span> despite
              overwhelming evidence of tomfoolery.
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-400 relative z-10">
            {/* Left Column */}
            <div className="md:col-span-2 flex flex-col gap-4 pr-0 md:pr-4 md:border-r border-zinc-300">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                <span>By {reporter}</span>
                <span>•</span>
                <span>Senior Roast Correspondent</span>
              </div>

              {photoUrl ? (
                <div className="w-full bg-zinc-300 border-2 border-zinc-800 p-1 mb-2">
                  <div className="relative w-full aspect-[4/3] overflow-hidden grayscale contrast-125 brightness-95">
                    <img
                      src={photoUrl}
                      alt="Roast Target"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
                  </div>
                  <p className="text-sm italic text-center mt-2 text-zinc-700">
                    Exhibit A: {name} in their natural habitat, attempting to look innocent.
                  </p>
                </div>
              ) : (
                <div className="w-full bg-zinc-200 border-2 border-zinc-400 border-dashed p-6 text-center mb-2 flex flex-col items-center justify-center aspect-[4/3]">
                  <svg
                    className="w-12 h-12 text-zinc-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-zinc-500 italic">No Mugshot Provided</p>
                </div>
              )}

              {/* Article text - LARGE & READABLE */}
              <div className="text-base md:text-lg lg:text-xl leading-relaxed text-zinc-800 text-justify flex flex-col gap-4 font-serif">
                <p>
                  <span className="text-5xl md:text-6xl font-extrabold float-left mr-2 mt-1 text-zinc-950">
                    {article1.charAt(0)}
                  </span>
                  {article1.substring(1)}
                </p>
                <p>{article2}</p>
                <p>{article3}</p>
              </div>
            </div>

            {/* Right Column - LARGE & READABLE */}
            <div className="flex flex-col gap-6">
              <div className="border-b border-zinc-400 pb-4">
                <h3 className="text-xl md:text-2xl font-extrabold uppercase leading-tight text-zinc-950 mb-2">
                  WEATHER FORECAST
                </h3>
                <p className="text-xs font-semibold uppercase text-zinc-500 mb-1">
                  High Chance of Whining
                </p>
                <p className="text-base md:text-lg leading-tight text-zinc-800 text-justify">{weather}</p>
              </div>

              <div className="border-b border-zinc-400 pb-4">
                <h3 className="text-xl md:text-2xl font-extrabold uppercase leading-tight text-zinc-950 mb-2">
                  LOCAL ANNOUNCEMENT
                </h3>
                <p className="text-xs font-semibold uppercase text-zinc-500 mb-1">
                  Public Notice
                </p>
                <p className="text-base md:text-lg leading-tight text-zinc-800 text-justify">{announcement}</p>
              </div>

              <div className="border-2 border-zinc-800 p-4 bg-zinc-100 flex flex-col items-center text-center mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Advertisement
                </span>
                <h4 className="font-black uppercase tracking-tight text-base md:text-lg text-zinc-950 mb-1">
                  {adHeadline}
                </h4>
                <p className="text-sm md:text-base italic text-zinc-700 leading-tight">{adBody}</p>
                <div className="border border-zinc-800 text-[10px] font-bold px-2 py-0.5 mt-2 uppercase">
                  Only 5¢ a jar
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t-4 border-double border-zinc-900 pt-3 mt-6 text-center text-xs font-bold uppercase text-zinc-500 relative z-10">
            <span>
              © {new Date().getFullYear()} The Daily Roast Publishing Corp. All rights reserved.
            </span>
          </footer>
        </div>
      </div>
    );
  }
);

export default NewspaperTemplate;

