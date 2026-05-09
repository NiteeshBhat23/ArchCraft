import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import contentIndex from '../content/index.json';

const trackColors: Record<string, { bg: string; border: string; icon: string; bar: string; badge: string }> = {
  java: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
  'spring-boot': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  'system-design': {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  'distributed-systems': {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    bar: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
  'architecture-patterns': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    icon: 'text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
  'platform-engineering': {
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    border: 'border-teal-200 dark:border-teal-800',
    icon: 'text-teal-600 dark:text-teal-400',
    bar: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  },
};

export default function HomePage() {
  const { completed } = useProgressStore();
  const totalTopics = contentIndex.tracks.reduce((a, t) => a + t.topics.length, 0);
  const totalCompleted = Object.values(completed).filter(Boolean).length;
  const overallPct = Math.round((totalCompleted / totalTopics) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 mb-5">
          <span>🏛️</span> Architect-Level Learning Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Master Senior &amp; Architect<br />
          <span className="text-indigo-600 dark:text-indigo-400">Engineering Concepts</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Deep-dive into JVM internals, distributed systems, DDD, platform engineering and more — all with rich visual diagrams and interactive quizzes.
        </p>

        {totalCompleted > 0 && (
          <div className="mt-8 max-w-sm mx-auto">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{overallPct}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              {totalCompleted} of {totalTopics} topics completed
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {contentIndex.tracks.map((track) => {
          const c = trackColors[track.id] ?? trackColors['java'];
          const done = track.topics.filter((tp) => completed[tp.id]).length;
          const pct = Math.round((done / track.topics.length) * 100);
          const architectCount = track.topics.filter((tp) => tp.level === 'architect').length;

          return (
            <Link
              key={track.id}
              to={`/track/${track.id}`}
              className={`group block rounded-2xl border ${c.border} ${c.bg} p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{track.icon}</span>
                {architectCount > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                    {architectCount} architect
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {track.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {track.description}
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{track.topics.length} topics</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Start with Architecture Patterns</h2>
        <p className="text-indigo-100 mb-5 text-sm">
          DDD, Hexagonal Architecture, Event-Driven, CQRS, API Gateway, Data Mesh — the essential toolkit for senior architects
        </p>
        <Link
          to="/track/architecture-patterns"
          className="inline-block bg-white text-indigo-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Explore Architecture Patterns →
        </Link>
      </div>
    </div>
  );
}
