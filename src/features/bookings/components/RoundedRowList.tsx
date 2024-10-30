type RowListProps = {
  title: string;
  list: string[];
};

type ListTileProps = {
    title : string;
    subtitle : string;
}

export function RowList({ title, list }: RowListProps): JSX.Element {
  return (
    <div className="w-[65%]">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <div className="flex flex-wrap gap-3 h-max my-2">
        {list.map((each, index) => (
          <div
            key={index}
            className="flex bg-soft-cream items-center justify-center p-2 rounded-3xl border border-hard-cream h-min whitespace-nowrap font-medium capitalize"
          >
            {each}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListTile({title, subtitle} : ListTileProps) : JSX.Element {
  return (
    <div className="flex flex-col gap-1 ">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <h1>{subtitle}</h1>
    </div>
  );
}
