import type { CalloutSection as CalloutSectionType } from '../../types';

interface Props {
  section: CalloutSectionType;
}

const variants = {
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-400 dark:border-emerald-600',
    icon: '💡',
    titleColor: 'text-emerald-700 dark:text-emerald-400',
    textColor: 'text-emerald-900 dark:text-emerald-200',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-400 dark:border-blue-600',
    icon: 'ℹ️',
    titleColor: 'text-blue-700 dark:text-blue-400',
    textColor: 'text-blue-900 dark:text-blue-200',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-400 dark:border-amber-600',
    icon: '⚠️',
    titleColor: 'text-amber-700 dark:text-amber-400',
    textColor: 'text-amber-900 dark:text-amber-200',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-400 dark:border-red-600',
    icon: '🚨',
    titleColor: 'text-red-700 dark:text-red-400',
    textColor: 'text-red-900 dark:text-red-200',
  },
};

export default function CalloutSection({ section }: Props) {
  const v = variants[section.variant];
  const title = section.title ?? section.variant.charAt(0).toUpperCase() + section.variant.slice(1);

  return (
    <div className={`my-6 border-l-4 ${v.border} ${v.bg} rounded-r-2xl px-5 py-4 shadow-sm`}>
      <div className={`flex items-center gap-2 font-semibold mb-1.5 ${v.titleColor}`}>
        <span className="text-base">{v.icon}</span>
        <span className="text-sm">{title}</span>
      </div>
      <p className={`text-sm leading-[1.75] ${v.textColor}`}>{section.content}</p>
    </div>
  );
}
