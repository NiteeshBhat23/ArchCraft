import { Link, useParams, Navigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import contentIndex from '../content/index.json';

const levelColors: Record<string, string> = {
  intermediate: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  advanced: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  architect: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const trackAccent: Record<string, string> = {
  java: 'from-orange-500 to-orange-600',
  'spring-boot': 'from-emerald-500 to-emerald-600',
  'system-design': 'from-blue-500 to-blue-600',
  'distributed-systems': 'from-purple-500 to-purple-600',
  'architecture-patterns': 'from-indigo-500 to-indigo-600',
  'platform-engineering': 'from-teal-500 to-teal-600',
};

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { completed, toggleBookmark, bookmarks } = useProgressStore();

  const track = contentIndex.tracks.find((t) => t.id === trackId);
  if (!track) return <Navigate to="/" replace />;

  const done = track.topics.filter((tp) => completed[tp.id]).length;
  const pct = Math.round((done / track.topics.length) * 100);
  const accent = trackAccent[track.id] ?? 'from-indigo-500 to-indigo-600';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All tracks
      </Link>

      <div className={`bg-gradient-to-r ${accent} rounded-2xl p-7 text-white mb-8`}>
        <div className="text-4xl mb-3">{track.icon}</div>
        <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
        <p className="text-white/80 text-sm mb-5">{track.description}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-white/80">
            <span>{done} of {track.topics.length} topics completed</span>
            <span className="font-bold">{pct}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {track.topics.map((tp, idx) => {
          const isCompleted = !!completed[tp.id];
          const isBookmarked = !!bookmarks[tp.id];

          return (
            <div
              key={tp.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm'
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-bold">
                {isCompleted ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>

              <Link to={`/topic/${tp.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tp.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[tp.level]}`}>
                    {tp.level}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                  <span>⏱ {tp.readTime} min</span>
                  {tp.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>

              <button
                onClick={(e) => { e.preventDefault(); toggleBookmark(tp.id); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                }`}
                aria-label="Bookmark"
              >
                <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <Link
                to={`/topic/${tp.id}`}
                className="flex-shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {isCompleted ? 'Review' : 'Study'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
