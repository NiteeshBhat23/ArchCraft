import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import contentIndex from '../../content/index.json';

const trackColors: Record<string, string> = {
  java: 'bg-orange-500',
  'spring-boot': 'bg-emerald-500',
  'system-design': 'bg-blue-500',
  'distributed-systems': 'bg-purple-500',
  'architecture-patterns': 'bg-indigo-500',
  'platform-engineering': 'bg-teal-500',
};

const levelBadge: Record<string, string> = {
  intermediate: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  advanced: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  architect: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { topicId } = useParams<{ topicId?: string }>();
  const { completed, bookmarks } = useProgressStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    contentIndex.tracks.forEach((t) => { init[t.id] = true; });
    return init;
  });

  const totalTopics = contentIndex.tracks.reduce((a, t) => a + t.topics.length, 0);
  const totalCompleted = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((totalCompleted / totalTopics) * 100);

  const bookmarkedTopics = contentIndex.tracks
    .flatMap((t) => t.topics.map((tp) => ({ ...tp, trackId: t.id, trackTitle: t.title })))
    .filter((tp) => bookmarks[tp.id]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Overall Progress
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {totalCompleted} / {totalTopics} topics completed
          </p>
        </div>

        {bookmarkedTopics.length > 0 && (
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
              ⭐ Bookmarks
            </p>
            {bookmarkedTopics.map((tp) => (
              <Link
                key={tp.id}
                to={`/topic/${tp.id}`}
                className={`block px-2 py-1.5 rounded-lg text-xs truncate transition-colors ${
                  topicId === tp.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tp.title}
              </Link>
            ))}
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {contentIndex.tracks.map((track) => {
            const trackCompleted = track.topics.filter((tp) => completed[tp.id]).length;
            const trackPct = Math.round((trackCompleted / track.topics.length) * 100);
            const isExpanded = expanded[track.id];

            return (
              <div key={track.id}>
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [track.id]: !e[track.id] }))}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left group transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${trackColors[track.id] ?? 'bg-gray-400'}`} />
                  <span className="flex-1 text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {track.icon} {track.title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {trackCompleted}/{track.topics.length}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-0.5 mb-1">
                    <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${trackColors[track.id] ?? 'bg-indigo-500'}`}
                        style={{ width: `${trackPct}%` }}
                      />
                    </div>
                    {track.topics.map((tp) => (
                      <Link
                        key={tp.id}
                        to={`/topic/${tp.id}`}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors group ${
                          topicId === tp.id
                            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                          {completed[tp.id] ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                          )}
                        </span>
                        <span className="truncate">{tp.title}</span>
                        <span className={`ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${levelBadge[tp.level]}`}>
                          {tp.level === 'architect' ? 'arch' : tp.level}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
