import { MdArrowBack } from 'react-icons/md';

export default function PageBackButton() {
  return (
    <button className="flex flex-row items-center gap-1.5" onClick={() => window.history.back()}>
      <MdArrowBack size={30} />
      <span className="text-xl font-medium">Back</span>
    </button>
  );
}
