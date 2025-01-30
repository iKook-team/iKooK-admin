import { MdArrowDropDown } from 'react-icons/md';
import { useMemo } from 'react';

interface CountrySwitcherProps {
  currency: string;
  setCurrency: (country: string) => void;
}

export default function CountrySwitcher({ currency, setCurrency }: CountrySwitcherProps) {
  const country = useMemo(() => countries.find((c) => c.code === currency), [currency]);
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn bg-green/10 border-greeen/10 rounded-md">
        <img src={country?.flag} alt={country?.name} className="w-6 h-6 mr-2 rounded-full" />
        <MdArrowDropDown size={24} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {countries.map((country) => (
          <li key={country.code} className="hover:bg-gray-100">
            <a
              href="#"
              onClick={() => setCurrency(country.code)}
              className="block py-2 px-4 text-sm text-gray-700 hover:text-gray-900 flex items-center"
            >
              {' '}
              {/* Flex for alignment */}
              <img src={country.flag} alt={country.name} className="w-6 h-4 mr-2 rounded-sm" />
              <span>{country.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const countries = [
  { code: 'NGN', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
  {
    code: 'GBP',
    name: 'United Kingdom',
    flag: 'https://flagcdn.com/w40/gb.png'
  },
  { code: 'CAD', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
  { code: 'RAND', name: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' }
];
