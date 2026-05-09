import type { ComparisonSection } from '../../types';

interface Props {
  section: ComparisonSection;
}

export default function ComparisonTable({ section }: Props) {
  return (
    <div className="my-6">
      {section.title && (
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {section.title}
        </h4>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {section.columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
                }`}
              >
                {section.columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {row[col] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
