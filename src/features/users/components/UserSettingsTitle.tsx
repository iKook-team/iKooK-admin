
export default function UserSettingsTitle({
  title,
  loading,
  onSave
}: {
  title: string;
  loading?: boolean;
  onSave: ( ) => void;
}) {
  return (
    <div className="w-full flex flex-row justify-between items-center border-b pb-4 mb-6">
      <span className="text-xl">{title}</span>
      <button type='button' disabled={loading} onClick={onSave} className="btn btn-primary">
        Save Changes
      </button>
    </div>
  );
}
