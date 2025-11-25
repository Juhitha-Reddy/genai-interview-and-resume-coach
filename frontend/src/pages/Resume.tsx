import React from 'react';
import ResumeUpload from '../components/resume/ResumeUpload';

export default function ResumePage() {
  const [data, setData] = React.useState<any | null>(null);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resume</h2>
      <ResumeUpload onParsed={(s) => setData(s)} />
      {!data && <p className="text-sm text-gray-600">Upload a .pdf or .txt to see the parsed result.</p>}
      {data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="bg-white border rounded-lg p-4">
            <div className="font-medium mb-2">Contact</div>
            <div className="text-sm text-gray-700">
              <div><span className="text-gray-500">Name:</span> {data.contact?.name || '-'}</div>
              <div><span className="text-gray-500">Email:</span> {data.contact?.email || '-'}</div>
              <div><span className="text-gray-500">Phone:</span> {data.contact?.phone || '-'}</div>
            </div>
          </section>
          <section className="bg-white border rounded-lg p-4">
            <div className="font-medium mb-2">Skills</div>
            <div className="flex flex-wrap gap-2">
              {(data.skills || []).length ? data.skills.map((s: string) => (
                <span key={s} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-2 py-1">{s}</span>
              )) : <span className="text-sm text-gray-600">-</span>}
            </div>
          </section>
          <section className="bg-white border rounded-lg p-4 lg:col-span-2">
            <div className="font-medium mb-2">Summary</div>
            <pre className="text-sm bg-gray-50 border rounded p-3 whitespace-pre-wrap">{data.summary || '-'}</pre>
          </section>
          <section className="bg-white border rounded-lg p-4">
            <div className="font-medium mb-2">Experience</div>
            <pre className="text-sm bg-gray-50 border rounded p-3 whitespace-pre-wrap">{data.experience || '-'}</pre>
          </section>
          <section className="bg-white border rounded-lg p-4">
            <div className="font-medium mb-2">Education</div>
            <pre className="text-sm bg-gray-50 border rounded p-3 whitespace-pre-wrap">{data.education || '-'}</pre>
          </section>
          {data.projects && (
            <section className="bg-white border rounded-lg p-4 lg:col-span-2">
              <div className="font-medium mb-2">Projects</div>
              <pre className="text-sm bg-gray-50 border rounded p-3 whitespace-pre-wrap">{data.projects}</pre>
            </section>
          )}
          <section className="bg-white border rounded-lg p-4 lg:col-span-2">
            <div className="font-medium mb-2">Raw (trimmed)</div>
            <pre className="text-xs bg-gray-900 text-gray-100 rounded p-3 overflow-auto max-h-80">{data.raw}</pre>
          </section>
        </div>
      )}
    </div>
  );
}


