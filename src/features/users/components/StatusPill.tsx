interface StatusPillProps {
  status: string;
  type: 'active' | 'inactive' | 'pending';
}

export default function StatusPill({ status, type }: StatusPillProps) {
  const className =
    type === 'active'
      ? 'bg-green/10 text-green'
      : type === 'inactive'
        ? 'bg-red/10 text-red'
        : 'bg-yellow/10 text-yellow';
  return <span className={`px-3 py-1 rounded-full capitalize ${className}`}>{status}</span>;
}
