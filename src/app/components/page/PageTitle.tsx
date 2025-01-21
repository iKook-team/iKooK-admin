export default function PageTitle({ title, className }: { title: string; className?: string }) {
  return <h1 className={`font-medium text-xl ${className ? className : ''}`}>{title}</h1>;
}
