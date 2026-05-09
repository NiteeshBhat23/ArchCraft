import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import type { DiagramSection as DiagramSectionType } from '../../types';

let mermaidInitialized = false;

function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    securityLevel: 'loose',
    themeVariables: {
      darkMode: false,
      primaryColor: '#6366f1',
      primaryTextColor: '#1f2937',
      primaryBorderColor: '#4f46e5',
      secondaryColor: '#e0e7ff',
      tertiaryColor: '#f3f4f6',
      background: '#ffffff',
      mainBkg: '#ffffff',
      secondBkg: '#f9fafb',
      lineColor: '#374151',
      border1: '#d1d5db',
      border2: '#9ca3af',
      arrowheadColor: '#374151',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      nodeBorder: '#6366f1',
      clusterBkg: '#eff6ff',
      clusterBorder: '#93c5fd',
      defaultLinkColor: '#6b7280',
      titleColor: '#111827',
      edgeLabelBackground: '#ffffff',
      nodeTextColor: '#111827',
    },
  });
  mermaidInitialized = true;
}

interface Props {
  section: DiagramSectionType;
}

export default function DiagramSection({ section }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!mermaidInitialized) initMermaid();

    const render = async () => {
      if (!ref.current) return;
      try {
        const { svg: rendered } = await mermaid.render(idRef.current, section.content);
        if (ref.current) {
          ref.current.innerHTML = rendered;
        }
        setError(null);
      } catch (e) {
        setError('Diagram rendering failed');
        console.error(e);
      }
    };
    render();
  }, [section.content]);

  useEffect(() => {
    if (!zoomed) { 
      setScale(1); 
      return; 
    }

    // Copy the SVG from main view to modal
    setTimeout(() => {
      const sourceSvg = ref.current?.querySelector('svg');
      if (sourceSvg && modalRef.current) {
        // Clear modal first
        modalRef.current.innerHTML = '';
        
        // Clone and append the SVG
        const svgClone = sourceSvg.cloneNode(true) as SVGElement;
        
        // Force SVG to be visible with explicit styles
        svgClone.removeAttribute('height');
        svgClone.setAttribute('width', '100%');
        svgClone.style.cssText = `
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
          min-height: 200px !important;
        `;
        
        modalRef.current.appendChild(svgClone);
      }
    }, 100);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false);
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === '0') setScale(1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(Math.max(s - e.deltaY * 0.001, 0.5), 4));
  }, []);

  return (
    <>
      <div className="my-8 diagram-fade-in">
        {section.title && (
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 text-center uppercase tracking-widest">
            {section.title}
          </p>
        )}
        <div
          className="group relative bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 overflow-x-auto cursor-zoom-in hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200"
          onClick={() => !error && setZoomed(true)}
          title="Click to zoom"
        >
          {error ? (
            <div className="text-red-500 text-sm p-4 text-center">{error}</div>
          ) : (
            <>
              <div ref={ref} className="mermaid-wrapper flex justify-center" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-500 dark:text-gray-400 shadow-sm pointer-events-none select-none">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Click to zoom
              </div>
            </>
          )}
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setZoomed(false); }}
        >
          <div className="relative w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900/95 border-b border-gray-700 shrink-0">
              {section.title && (
                <span className="text-sm font-medium text-gray-200">{section.title}</span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-400 mr-2">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm font-mono leading-none"
                  title="Zoom out (−)"
                >−</button>
                <button
                  onClick={() => setScale(1)}
                  className="px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-xs"
                  title="Reset zoom (0)"
                >Reset</button>
                <button
                  onClick={() => setScale((s) => Math.min(s + 0.25, 4))}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm font-mono leading-none"
                  title="Zoom in (+)"
                >+</button>
                <button
                  onClick={() => setZoomed(false)}
                  className="ml-2 p-1.5 rounded-lg bg-gray-700 hover:bg-red-700 text-gray-200 transition-colors"
                  title="Close (Esc)"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-auto flex items-center justify-center p-8 bg-gray-950"
              onWheel={handleWheel}
              data-component-name="DiagramSection"
            >
              <div
                className="transition-transform duration-150 origin-center bg-white rounded-2xl p-8 shadow-2xl max-w-[95vw] max-h-[90vh] overflow-auto"
                style={{ transform: `scale(${scale})` }}
              >
                <div ref={modalRef} className="flex justify-center" />
              </div>
            </div>

            <div className="px-5 py-2 bg-gray-900/95 border-t border-gray-700 shrink-0 text-center">
              <span className="text-xs text-gray-500">Scroll to zoom · +/− keys · Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
