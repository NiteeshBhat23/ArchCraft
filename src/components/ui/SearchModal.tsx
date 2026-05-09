import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import contentIndex from '../../content/index.json';

interface FlatTopic {
  id: string;
  title: string;
  track: string;
  trackId: string;
  level: string;
  tags: string[];
}

const allTopics: FlatTopic[] = contentIndex.tracks.flatMap((t) =>
  t.topics.map((tp) => ({
    id: tp.id,
    title: tp.title,
    track: t.title,
    trackId: t.id,
    level: tp.level,
    tags: tp.tags,
  }))
);

const fuse = new Fuse(allTopics, {
  keys: ['title', 'tags', 'track'],
  threshold: 0.35,
  minMatchCharLength: 2,
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const trackColors: Record<string, string> = {
  java: 'text-orange-600 dark:text-orange-400',
  'spring-boot': 'text-emerald-600 dark:text-emerald-400',
  'system-design': 'text-blue-600 dark:text-blue-400',
  'distributed-systems': 'text-purple-600 dark:text-purple-400',
  'architecture-patterns': 'text-indigo-600 dark:text-indigo-400',
  'platform-engineering': 'text-teal-600 dark:text-teal-400',
};

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FlatTopic[]>([]);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(allTopics.slice(0, 8));
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(allTopics.slice(0, 8));
    } else {
      setResults(fuse.search(query).map((r) => r.item).slice(0, 10));
    }
    setCursor(0);
  }, [query]);

  const handleSelect = (topic: FlatTopic) => {
    navigate(`/topic/${topic.id}`);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && results[cursor]) {
      handleSelect(results[cursor]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search topics, tags, tracks..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
          />
          <kbd className="text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No results found
            </li>
          ) : (
            results.map((topic, i) => (
              <li key={topic.id}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === cursor
                      ? 'bg-indigo-50 dark:bg-indigo-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleSelect(topic)}
                  onMouseEnter={() => setCursor(i)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {topic.title}
                    </p>
                    <p className={`text-xs ${trackColors[topic.trackId] ?? 'text-gray-500'}`}>
                      {topic.track}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                    {topic.level}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span><kbd className="bg-gray-100 dark:bg-gray-800 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 rounded px-1">↵</kbd> open</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
