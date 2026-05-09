import { Link, useParams } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import contentIndex from '../../content/index.json';

interface Props {
  onSearchOpen: () => void;
}

export default function Header({ onSearchOpen }: Props) {
  const { trackId, topicId } = useParams<{ trackId?: string; topicId?: string }>();
  const { darkMode, toggleDarkMode } = useProgressStore();

  const track = trackId ? contentIndex.tracks.find((t) => t.id === trackId) : null;
  const topic = topicId
    ? contentIndex.tracks
        .flatMap((t) => t.topics.map((tp) => ({ ...tp, trackId: t.id, trackTitle: t.title })))
        .find((tp) => tp.id === topicId)
    : null;

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3">
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white shrink-0">
        <span className="text-xl">🏛️</span>
        <span className="hidden sm:block text-sm font-semibold">ArchCraft</span>
      </Link>

      {(track || topic) && (
        <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 min-w-0">
          <span>/</span>
          {track || topic ? (
            <Link
              to={`/track/${topic?.trackId ?? trackId}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
            >
              {topic?.trackTitle ?? track?.title}
            </Link>
          ) : null}
          {topic && (
            <>
              <span>/</span>
              <span className="text-gray-800 dark:text-gray-200 truncate font-medium">
                {topic.title}
              </span>
            </>
          )}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:block">Search</span>
          <kbd className="hidden sm:block text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5">⌘K</kbd>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71m12.02 0l-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
