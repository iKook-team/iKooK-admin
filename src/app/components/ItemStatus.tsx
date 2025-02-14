interface ItemStatusProps {
  title: string;
  circleColor: string;
  textColor: string;
}

export default function ItemStatus({ title, circleColor, textColor }: ItemStatusProps) {
  return (
    <div className="flex flex-row gap-1 items-center capitalize">
      <span className={`w-1.5 aspect-square rounded-full ${circleColor}`} />
      <span className={textColor}>{title}</span>
    </div>
  );
}
