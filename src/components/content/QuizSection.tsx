import { useState } from 'react';
import type { QuizSection as QuizSectionType } from '../../types';
import { useProgressStore } from '../../store/progressStore';

interface Props {
  section: QuizSectionType;
  topicId: string;
  quizIndex: number;
}

export default function QuizSection({ section, topicId, quizIndex }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const setQuizScore = useProgressStore((s) => s.setQuizScore);

  const isCorrect = selected === section.answer;

  const handleSubmit = () => {
    if (selected === null) return;
    setRevealed(true);
    if (isCorrect) {
      setQuizScore(`${topicId}-q${quizIndex}`, 1);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="my-6 border border-indigo-200 dark:border-indigo-800 rounded-xl overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/50 px-5 py-3 border-b border-indigo-200 dark:border-indigo-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Knowledge Check
        </span>
        <p className="mt-1 font-medium text-gray-900 dark:text-white">{section.question}</p>
      </div>
      <div className="p-5 space-y-2 bg-white dark:bg-gray-900">
        {section.options.map((opt, i) => {
          let cls =
            'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ';
          if (!revealed) {
            cls +=
              selected === i
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300';
          } else {
            if (i === section.answer) {
              cls += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
            } else if (i === selected && selected !== section.answer) {
              cls += 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300';
            } else {
              cls += 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600';
            }
          }

          return (
            <button
              key={i}
              className={cls + ' w-full text-left'}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
              {revealed && i === section.answer && <span className="ml-auto">✓</span>}
              {revealed && i === selected && selected !== section.answer && (
                <span className="ml-auto">✗</span>
              )}
            </button>
          );
        })}

        <div className="pt-2 flex items-center gap-3">
          {!revealed ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {revealed && (
          <div
            className={`mt-3 p-3 rounded-lg text-sm ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <span className="font-semibold">{isCorrect ? '✓ Correct! ' : '✗ Not quite. '}</span>
            {section.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
