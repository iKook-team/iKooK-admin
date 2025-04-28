import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';

interface UserSettingsTitleProps {
  title: string;
  loading?: boolean;
  onSave?: () => void;
  className?: string;
}

export default function UserSettingsTitle({
  title,
  loading,
  onSave,
  className
}: UserSettingsTitleProps) {
  return (
    <div
      className={`w-full flex flex-row justify-between items-center border-b pb-4 mb-6 ${className || ''}`}
    >
      <span className="text-xl capitalize">{title}</span>
      {onSave && (
        <button type="button" disabled={loading} onClick={onSave} className="btn btn-primary">
          <LoadingSpinner isLoading={loading ?? false}>Save Changes</LoadingSpinner>
        </button>
      )}
    </div>
  );
}
