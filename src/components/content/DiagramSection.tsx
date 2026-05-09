import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { DiagramSection as DiagramSectionType } from '../../types';

let mermaidInitialized = false;

function initMermaid(dark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'default',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    securityLevel: 'loose',
  });
  mermaidInitialized = true;
}

interface Props {
  section: DiagramSectionType;
}

export default function DiagramSection({ section }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    if (!mermaidInitialized) initMermaid(dark);

    const render = async () => {
      if (!ref.current) return;
      try {
        const { svg } = await mermaid.render(idRef.current, section.content);
        if (ref.current) ref.current.innerHTML = svg;
        setError(null);
      } catch (e) {
        setError('Diagram rendering failed');
        console.error(e);
      }
    };
    render();
  }, [section.content]);

  return (
    <div className="my-6">
      {section.title && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">
          {section.title}
        </p>
      )}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
        {error ? (
          <div className="text-red-500 text-sm p-4">{error}</div>
        ) : (
          <div ref={ref} className="mermaid-wrapper flex justify-center" />
        )}
      </div>
    </div>
  );
}
