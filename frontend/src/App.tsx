import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import JobMatch from './pages/JobMatch';
import ResumePage from './pages/Resume';
import './index.css';

type Page = 'Dashboard' | 'Resume' | 'Interview' | 'Feedback' | 'JobMatch';

function App() {
  const [active, setActive] = React.useState<Page>('Dashboard');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="grid grid-cols-12">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white">
          <Sidebar active={active as any} onNavigate={(p: any) => setActive(p)} />
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-4 md:p-6">
          {active === 'Dashboard' && <Dashboard onGo={(p: any) => setActive(p)} />}
          {active === 'JobMatch' && <JobMatch />}
          {active === 'Resume' && <ResumePage />}
          {active !== 'Dashboard' && active !== 'JobMatch' && active !== 'Resume' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{active}</h2>
              <p className="text-gray-600">This section will be implemented in later stories.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
