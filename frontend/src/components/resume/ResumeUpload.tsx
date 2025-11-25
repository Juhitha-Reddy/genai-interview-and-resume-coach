import React from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE_URL as string) || 'http://localhost:5001';

export default function ResumeUpload({ onParsed }: { onParsed: (structured: any) => void }) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    if (!/\.(pdf|txt)$/i.test(file.name)) {
      setError('Unsupported file type. Use .pdf or .txt');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/resume/upload`, { method: 'POST', body: form });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      onParsed(data.structuredResume);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'}`}
      >
        <p className="text-sm text-gray-700">
          Drag & drop your resume here, or{' '}
          <button className="text-indigo-700 underline" onClick={() => inputRef.current?.click()} type="button">
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500 mt-1">Accepted: .pdf, .txt</p>
        <input ref={inputRef} type="file" className="hidden" accept=".pdf,.txt" onChange={onChange} />
      </div>
      {fileName && <div className="text-sm text-gray-600">Selected: {fileName}</div>}
      {loading && <div className="text-sm text-gray-600">Uploading and parsing…</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
    </div>
  );
}


