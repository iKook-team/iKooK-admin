import { getImageUrl } from '../../../utils/getImageUrl.ts';

export default function MenuImage({
  src,
  onClick,
  onRemove
}: {
  src: string;
  onClick?: (src: string) => void;
  onRemove?: (src: string) => void;
}) {
  return (
    <div
      className="flex-shrink-0 max-w-[9.375rem] aspect-square relative"
      onClick={onClick ? () => onClick(src) : undefined}
    >
      {onRemove && (
        <button
          className="absolute top-2 right-2 z-10"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(src);
          }}
        >
          <img src={getImageUrl('icons/close.svg')} alt="remove" />
        </button>
      )}
      <img src={src} alt="menu" className="w-full h-full rounded-2xl object-cover block" />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-black-base/25 to-black-base/50 rounded-2xl" />
    </div>
  );
}
