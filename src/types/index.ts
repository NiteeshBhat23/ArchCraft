export type Level = 'intermediate' | 'advanced' | 'architect';

export type SectionType = 'markdown' | 'diagram' | 'callout' | 'quiz' | 'comparison';

export interface MarkdownSection {
  type: 'markdown';
  content: string;
}

export interface DiagramSection {
  type: 'diagram';
  title?: string;
  content: string;
}

export interface CalloutSection {
  type: 'callout';
  variant: 'tip' | 'warning' | 'info' | 'danger';
  title?: string;
  content: string;
}

export interface QuizOption {
  text: string;
}

export interface QuizSection {
  type: 'quiz';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ComparisonRow {
  aspect: string;
  [key: string]: string;
}

export interface ComparisonSection {
  type: 'comparison';
  title?: string;
  columns: string[];
  rows: ComparisonRow[];
}

export type Section =
  | MarkdownSection
  | DiagramSection
  | CalloutSection
  | QuizSection
  | ComparisonSection;

export interface TopicMeta {
  id: string;
  title: string;
  level: Level;
  readTime: number;
  tags: string[];
  prerequisites: string[];
}

export interface Topic extends TopicMeta {
  track: string;
  summary: string;
  sections: Section[];
}

export interface TrackMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: TopicMeta[];
}

export interface ContentIndex {
  tracks: TrackMeta[];
}
