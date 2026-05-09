import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import ContentRenderer from '../components/layout/ContentRenderer';
import contentIndex from '../content/index.json';
import type { Topic } from '../types';

const levelColors: Record<string, string> = {
  intermediate: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  advanced: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  architect: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const trackAccent: Record<string, string> = {
  java: 'text-orange-600 dark:text-orange-400',
  'spring-boot': 'text-emerald-600 dark:text-emerald-400',
  'system-design': 'text-blue-600 dark:text-blue-400',
  'distributed-systems': 'text-purple-600 dark:text-purple-400',
  'architecture-patterns': 'text-indigo-600 dark:text-indigo-400',
  'platform-engineering': 'text-teal-600 dark:text-teal-400',
};

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { completed, markComplete, markIncomplete, toggleBookmark, bookmarks } = useProgressStore();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allTopics = contentIndex.tracks.flatMap((t) =>
    t.topics.map((tp) => ({ ...tp, trackId: t.id, trackTitle: t.title }))
  );
  const currentIdx = allTopics.findIndex((t) => t.id === topicId);
  const meta = currentIdx >= 0 ? allTopics[currentIdx] : null;
  const prev = currentIdx > 0 ? allTopics[currentIdx - 1] : null;
  const next = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    setError(false);

    const trackId = meta?.trackId;
    if (!trackId) { setError(true); setLoading(false); return; }

    import(`../content/topics/${trackId}/${topicId}.json`)
      .then((mod) => {
        setTopic({ ...mod.default, track: trackId });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [topicId]);

  if (!meta) return <Navigate to="/" replace />;

  const isCompleted = !!completed[topicId!];
  const isBookmarked = !!bookmarks[topicId!];
  const accentColor = trackAccent[meta.trackId] ?? 'text-indigo-600 dark:text-indigo-400';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Link to="/" className="text-sm text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <Link to={`/track/${meta.trackId}`} className={`text-sm font-medium ${accentColor} hover:underline`}>
          {meta.trackTitle}
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{meta.title}</span>
      </div>

      <div className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[meta.level]}`}>
            {meta.level}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">⏱ {meta.readTime} min read</span>
          {meta.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight leading-tight">{meta.title}</h1>

        {meta.prerequisites.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Prerequisites:</span>
            {meta.prerequisites.map((preId) => {
              const pre = allTopics.find((t) => t.id === preId);
              return pre ? (
                <Link
                  key={preId}
                  to={`/topic/${preId}`}
                  className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full hover:underline"
                >
                  {pre.title}
                </Link>
              ) : null;
            })}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => isCompleted ? markIncomplete(topicId!) : markComplete(topicId!)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>

          <button
            onClick={() => toggleBookmark(topicId!)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500'
                : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-yellow-400 hover:text-yellow-500'
            }`}
            aria-label="Bookmark"
          >
            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-h-64 animate-slideUp">
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className={`h-4 bg-gray-200 dark:bg-gray-800 rounded ${i === 0 ? 'w-1/3' : i === 4 ? 'w-2/3' : 'w-full'}`} />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium">Content coming soon</p>
            <p className="text-sm mt-1">This topic is being authored.</p>
          </div>
        )}
        {!loading && !error && topic && (
          <ContentRenderer sections={topic.sections} topicId={topicId!} />
        )}
      </div>

      <div className="mt-14 border-t border-gray-200 dark:border-gray-800 pt-8 grid grid-cols-2 gap-4">
        <div>
          {prev && (
            <Link
              to={`/topic/${prev.id}`}
              className="group flex flex-col gap-0.5 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Previous
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {prev.title}
              </span>
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link
              to={`/topic/${next.id}`}
              className="group flex flex-col gap-0.5 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:shadow-sm transition-all duration-200 text-right"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1">
                Next
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
