export type StatusPillType = 'active' | 'inactive' | 'deleting' | 'pending';

type StatusPillProps = {
  status: string;
  type: StatusPillType;
};

export default function StatusPill({ status, type }: StatusPillProps) {
  const className =
    type === 'active'
      ? 'bg-green/10 text-green'
      : type === 'pending'
        ? 'bg-yellow-500/10 text-yellow-500'
        : 'bg-red/10 text-red';
  return <span className={`px-3 py-1 rounded-full capitalize ${className}`}>{status}</span>;
}
