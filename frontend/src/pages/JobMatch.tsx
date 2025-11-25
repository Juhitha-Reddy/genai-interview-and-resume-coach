import React from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE_URL as string) || 'http://localhost:5000';

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function JobMatch() {
  const [url, setUrl] = React.useState('');
  const [jdText, setJdText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(false);

  const charCount = jdText.length;
  const charLimit = 15000;

  const handleFetch = async () => {
    setError(null);
    if (!isValidHttpUrl(url)) {
      setError('Please enter a valid http(s) URL');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/jd/fetch`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      const text = (data && data.text) || '';
      setJdText(text);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Job Match: Job Description Input</h2>
      <p style={{ color: '#555', marginTop: 0 }}>
        Paste a job description or fetch it from a URL.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label htmlFor="jd-url" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>
            Job Description URL (optional)
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="jd-url"
              type="url"
              placeholder="https://company.com/jobs/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }}
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #1f6feb',
                background: loading ? '#93c5fd' : '#2563eb',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Fetching…' : 'Fetch from URL'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="jd-text" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>
            Job Description Text
          </label>
          <textarea
            id="jd-text"
            placeholder="Paste the job description here…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value.slice(0, charLimit))}
            rows={12}
            style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginTop: 4 }}>
            <span>Characters: {charCount.toLocaleString()} / {charLimit.toLocaleString()}</span>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}
            >
              {expanded ? 'Collapse preview' : 'Expand preview'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: 10, borderRadius: 6 }}>
            {error}
          </div>
        )}

        <div>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Preview</div>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              background: '#111827',
              color: '#f9fafb',
              padding: 12,
              borderRadius: 6,
              overflow: 'auto',
              maxHeight: expanded ? 480 : 240,
            }}
          >
            {jdText || '(No content yet)'}
          </div>
        </div>
      </div>
    </div>
  );
}



