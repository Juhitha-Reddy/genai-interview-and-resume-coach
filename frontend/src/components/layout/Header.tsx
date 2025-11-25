import React from 'react';

export default function Header() {
  const env = process.env.NODE_ENV || 'development';
  const badge = env === 'production' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800';
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-indigo-600" />
          <h1 className="text-lg font-semibold">Resume & Interview Coach</h1>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${badge}`}>ENV: {env}</div>
      </div>
    </header>
  );
}



