import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { MarkdownSection as MarkdownSectionType } from '../../types';

interface Props {
  section: MarkdownSectionType;
}

export default function MarkdownSection({ section }: Props) {
  return (
    <div className="prose-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {section.content}
      </ReactMarkdown>
    </div>
  );
}
