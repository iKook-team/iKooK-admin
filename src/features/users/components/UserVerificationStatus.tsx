export default function UserVerificationStatus({ isVerified }: { isVerified: boolean }) {
  return (
    <div className="flex flex-row gap-1 items-center">
      <span className={`w-1.5 aspect-square rounded-full ${isVerified ? 'bg-green' : 'bg-red'}`} />
      <span className={`${isVerified ? 'text-green' : 'text-red'}`}>
        {isVerified ? 'Verified' : 'Not verified'}
      </span>
    </div>
  );
}
