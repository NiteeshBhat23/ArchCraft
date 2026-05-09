import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import SearchModal from './components/ui/SearchModal';
import HomePage from './pages/HomePage';
import TrackPage from './pages/TrackPage';
import TopicPage from './pages/TopicPage';
import { useProgressStore } from './store/progressStore';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { darkMode } = useProgressStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header onSearchOpen={() => setSearchOpen(true)} />

      <div className="flex relative">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-20 lg:hidden p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-3.5rem)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/track/:trackId" element={<TrackPage />} />
            <Route path="/topic/:topicId" element={<TopicPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
