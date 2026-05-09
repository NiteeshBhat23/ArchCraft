import type { Section } from '../../types';
import MarkdownSection from '../content/MarkdownSection';
import DiagramSection from '../content/DiagramSection';
import CalloutSection from '../content/CalloutSection';
import QuizSection from '../content/QuizSection';
import ComparisonTable from '../content/ComparisonTable';

interface Props {
  sections: Section[];
  topicId: string;
}

export default function ContentRenderer({ sections, topicId }: Props) {
  let quizIndex = 0;

  return (
    <div>
      {sections.map((section, i) => {
        switch (section.type) {
          case 'markdown':
            return <MarkdownSection key={i} section={section} />;
          case 'diagram':
            return <DiagramSection key={i} section={section} />;
          case 'callout':
            return <CalloutSection key={i} section={section} />;
          case 'quiz': {
            const qi = quizIndex++;
            return <QuizSection key={i} section={section} topicId={topicId} quizIndex={qi} />;
          }
          case 'comparison':
            return <ComparisonTable key={i} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
