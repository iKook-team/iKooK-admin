interface ImageStackProps {
  images: string[];
  includeRing: boolean;
  maxImages: number;
  className?: string;
  moreClassName?: string;
  size?: number;
}

export default function ImageStack({
  images,
  includeRing,
  maxImages,
  className,
  moreClassName,
  ...props
}: ImageStackProps) {
  if (images.length === 0 || maxImages === 0) return null;

  const size = (props.size ?? 20) / 16 + 'rem';

  return (
    <div
      className={`flex relative ${className ?? ''}`}
      style={{
        height: size
      }}
    >
      {images.slice(0, maxImages).map((image, index) => (
        <img
          key={index}
          src={image}
          alt="User"
          className={`rounded-full absolute z-${index + 25} ${includeRing ? 'ring-1 ring-white' : ''}`}
          style={{ left: `${index * 10}px`, width: size, height: size }}
        />
      ))}
      {images.length > maxImages && (
        <div
          className={`flex rounded-full absolute z-${maxImages + 25} items-center justify-center ${includeRing ? 'ring-1 ring-white' : ''} ${moreClassName ?? ''}`}
          style={{ left: `${maxImages * 10}px`, width: size, height: size }}
        >
          <h2 className="text-black-base text-[0.5rem] font-medium">{`+${images.length - maxImages}`}</h2>
        </div>
      )}
    </div>
  );
}
