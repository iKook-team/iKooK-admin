import classNames from 'classnames';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div
      onClick={onToggle}
      className={classNames(
        'flex w-20 h-10 bg-dark-charcoal/10 rounded-full my-3 border border-slate-50 cursor-pointer',
        { 'bg-yellow-400 border border-yellow-400': isOn }
      )}
    >
      <span
        className={classNames('h-10 w-10 bg-white rounded-full p-1 transition-all duration-500', {
          'ml-10': isOn
        })}
      />
    </div>
  );
}

interface ToggleCardProps {
  title: string;
  isOn: boolean;
  onToggle: () => void;
  underline: boolean;
}

export function ToggleCard({ title, isOn, onToggle, underline }: ToggleCardProps) {
  return (
    <div className={`flex justify-between items-center ${underline && 'border-b'}`}>
      <div className="flex-1">
        <h1 className=" font-medium">{title}</h1>
      </div>
      <div className="flex-1">
        <ToggleSwitch onToggle={onToggle} isOn={isOn} />
      </div>
    </div>
  );
}
