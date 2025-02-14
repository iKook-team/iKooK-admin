import { Link, Outlet, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { RiMenu5Line } from 'react-icons/ri';
import logo from '../assets/icons/logo.svg';
import { getImageUrl } from '../../utils/getImageUrl.ts';
import { FaSearch } from 'react-icons/fa';
import InputField from './InputField.tsx';
import resetStore from '../../features/auth/domain/resetStore.ts';
import useAuthStore from '../../features/auth/domain/store.ts';

export interface NavigationShellOutlet {
  setQuery: (query: string) => void;
}

export default function NavigationShell() {
  const location = useLocation();
  const [query, setQuery] = useState<string>();

  const pathname = useMemo(() => {
    // extract only the root path
    return location.pathname.split('/')[1];
  }, [location]);

  return (
    <div className="h-screen drawer md:drawer-open md:grid-cols-[2fr_8fr]">
      <input id="navigation-bar-drawer" type="checkbox" className="drawer-toggle" />

      {/* Content */}
      <div className="drawer-content flex flex-col">
        {/* Top Bar */}
        <nav className="navbar flex items-center justify-between px-5 py-4 gap-2 border-b">
          {/* Mobile Navigation Icon */}
          <label htmlFor="navigation-bar-drawer" className="drawer-button block md:hidden">
            <RiMenu5Line size={48} />
          </label>

          <InputField
            className="flex-1 max-w-96"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            trailing={<FaSearch />}
          />

          <LoggedInUser />
        </nav>
        <main className="flex-1 flex flex-col py-6 px-5">
          <Outlet context={{ setQuery } satisfies NavigationShellOutlet} />
        </main>
        {/* Footer */}
        <footer className="p-5 text-xs border-t">
          Copyright © {new Date().getFullYear()} iKooK, All Rights Reserved
        </footer>
      </div>

      {/* Side Bar */}
      <nav className="drawer-side justify-items-stretch">
        <label
          htmlFor="navigation-bar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="h-full w-fit md:w-full bg-white flex flex-col py-10 border-r items-center overflow-y-scroll">
          <img src={logo} alt="iKooK" className="w-20" />
          <div className="flex flex-col flex-1 mt-12 w-full">
            {sidebarItems.map((item) => {
              const selected = pathname.replace('/', '') === item.route.replace('/', '');
              return (
                <Link
                  to={item.route}
                  key={item.route}
                  className={`w-full flex flex-row font-normal text-sm btn ${selected ? 'bg-primary' : 'btn-ghost'} rounded-none`}
                  target={item.route.startsWith('http') ? '_blank' : undefined}
                >
                  <img
                    src={getImageUrl(`icons/${item.icon}.svg`)}
                    alt={item.title}
                    className="w-4 h-4"
                  />
                  <span className="flex-1 text-start truncate">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

function LoggedInUser() {
  const user = useAuthStore((state) => state.user);
  return (
    <details className="dropdown">
      <summary className="flex flex-row items-center gap-10 border border-primary px-5 py-2 rounded-xl">
        <div className="flex flex-col items-start">
          <p className="capitalize font-semibold">{user?.role}</p>
          <p className="capitalize text-xs">{user?.first_name}</p>
        </div>
        <img src={getImageUrl(`icons/arrow-down.svg`)} alt="Dropdown" />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] min-w-36 p-2 shadow">
        <li>
          <button onClick={resetStore}>Logout</button>
        </li>
      </ul>
    </details>
  );
}

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/'
  },
  {
    title: 'Users',
    icon: 'users',
    route: '/hosts'
  },
  {
    title: 'Chefs',
    icon: 'chefs',
    route: '/chefs'
  },
  {
    title: 'Bookings Management',
    icon: 'booking',
    route: '/bookings'
  },
  {
    title: 'Menus',
    icon: 'menu',
    route: '/menus'
  },
  {
    title: 'Services',
    icon: 'service',
    route: '/services'
  },
  {
    title: 'Revenue',
    icon: 'revenue',
    route: '/revenue'
  },
  {
    title: 'Calendar',
    icon: 'calendar',
    route: '/calendar'
  },
  {
    title: 'Support Tickets',
    icon: 'support',
    route: '/support'
  },
  // {
  //   title: 'Addons Services',
  //   icon: 'addon',
  //   route: '/addons'
  // },
  {
    title: 'Withdrawal',
    icon: 'withdrawal',
    route: '/withdrawal'
  },
  {
    title: 'Gift Experience',
    icon: 'gift',
    route: '/promotions'
  },
  // {
  //   title: 'Discounts',
  //   icon: 'discount',
  //   route: '/discounts'
  // },
  {
    title: 'Blog',
    icon: 'blog',
    route: 'https://ikook.info'
  },
  {
    title: 'Insights',
    icon: 'insight',
    route: '/insights'
  },
  {
    title: 'Reports',
    icon: 'report',
    route: '/reports'
  }
  // {
  //   title: 'Settings',
  //   icon: 'settings',
  //   route: '/settings'
  // }
];
