interface PillsProps<T> {
  active: T;
  setActive: (value: T) => void;
  items: T[];
  getLabel?: (value: T) => string;
}

export default function Pills<T>({ active, setActive, items, getLabel }: PillsProps<T>) {
  return (
    <div className="flex flex-row gap-3 mt-3 overflow-x-auto">
      {items.map((current, index) => (
        <button
          key={index}
          className={`capitalize py-2 px-3.5 rounded-3xl border ${
            active === current
              ? 'border-hard-cream border-2 bg-primary text-white'
              : ' border-gray-300'
          }`}
          onClick={() => setActive(current)}
          disabled={active === current}
        >
          {getLabel ? getLabel(current) : `${current}`}
        </button>
      ))}
    </div>
  );
}
