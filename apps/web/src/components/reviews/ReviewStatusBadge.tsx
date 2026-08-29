import { ReviewStatus } from '@wafizo/shared';

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  [ReviewStatus.NEW]: {
    label: 'Nouveau',
    className: 'bg-blue-100 text-blue-700',
  },
  [ReviewStatus.REPLIED]: {
    label: 'Répondu',
    className: 'bg-green-100 text-green-700',
  },
  [ReviewStatus.IGNORED]: {
    label: 'Ignoré',
    className: 'bg-gray-100 text-gray-600',
  },
};

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default ReviewStatusBadge;
