import React from 'react';

type Page = 'Dashboard' | 'Resume' | 'Interview' | 'Feedback' | 'JobMatch';

export default function Sidebar({ active, onNavigate }: { active: Page; onNavigate: (p: Page) => void }) {
  const items: { key: Page; label: string; icon?: string }[] = [
    { key: 'Dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'Resume', label: 'Resume', icon: '📄' },
    { key: 'Interview', label: 'Interview', icon: '💬' },
    { key: 'Feedback', label: 'Feedback', icon: '⭐' },
    { key: 'JobMatch', label: 'Job Match', icon: '📊' },
  ];

  return (
    <nav className="h-full">
      <ul className="p-2">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <li key={it.key}>
              <button
                onClick={() => onNavigate(it.key)}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{it.icon}</span>
                <span className="text-sm">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}



