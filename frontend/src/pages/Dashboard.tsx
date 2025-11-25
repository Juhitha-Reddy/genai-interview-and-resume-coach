import React from 'react';

export default function Dashboard({ onGo }: { onGo: (p: 'Resume' | 'Interview' | 'Feedback' | 'JobMatch') => void }) {
  const cards = [
    {
      title: 'Resume Upload',
      desc: 'Upload a PDF or TXT resume to parse and analyze.',
      action: () => onGo('Resume'),
      cta: 'Go to Resume',
    },
    {
      title: 'Interview Practice',
      desc: 'Generate tailored questions and practice with AI.',
      action: () => onGo('Interview'),
      cta: 'Start Practice',
    },
    {
      title: 'Job Match',
      desc: 'Paste a job description or fetch by URL, then score later.',
      action: () => onGo('JobMatch'),
      cta: 'Open Job Match',
    },
    {
      title: 'Recent Sessions',
      desc: 'Review your latest attempts and feedback.',
      action: () => onGo('Feedback'),
      cta: 'View Feedback',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="bg-white border rounded-lg p-4 flex flex-col">
            <div className="font-medium">{c.title}</div>
            <p className="text-sm text-gray-600 mt-1 flex-1">{c.desc}</p>
            <button
              onClick={c.action}
              className="mt-3 inline-flex items-center justify-center rounded bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
            >
              {c.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



