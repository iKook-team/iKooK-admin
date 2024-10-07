interface VerificationStatusProps {
  title: string;
  circleColor: string;
  textColor: string;
}

export default function VerificationStatus({
  title,
  circleColor,
  textColor
}: VerificationStatusProps) {
  return (
    <div className="flex flex-row gap-1 items-center">
      <span className={`w-1.5 aspect-square rounded-full ${circleColor}`} />
      <span className={textColor}>{title}</span>
    </div>
  );
}
