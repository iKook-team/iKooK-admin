import { truncateString } from '../../utils/strings.ts';

export default function IdCell({ id }: { id: string }) {
  return <span className="capitalize text-primary">#{truncateString(id, 6).toUpperCase()}</span>;
}
