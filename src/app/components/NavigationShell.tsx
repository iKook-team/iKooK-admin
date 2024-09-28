import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { RiMenu5Line } from 'react-icons/ri';
import logo from '../assets/icons/logo.svg';
import { getImageUrl } from '../../utils/getImageUrl.ts';
import { useAppSelector } from '../../hooks';
import { getCurrentUser } from '../../features/auth/domain/slice.ts';
import { FaSearch } from 'react-icons/fa';
import InputField from './InputField.tsx';

export interface NavigationShellOutlet {
  setQuery: (query: string) => void;
}

export default function NavigationShell() {
  const { pathname } = useLocation();
  const [query, setQuery] = useState<string>();

  return (
    <main className="h-screen drawer lg:drawer-open lg:grid-cols-[2fr_8fr]">
      <input id="navigation-bar-drawer" type="checkbox" className="drawer-toggle" />

      {/* Content */}
      <div className="drawer-content flex flex-col">
        {/* Top Bar */}
        <nav className="navbar flex items-center justify-between px-5 py-4 gap-2">
          {/* Mobile Navigation Icon */}
          <label htmlFor="navigation-bar-drawer" className="drawer-button block lg:hidden">
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
        <div className="flex-1 py-6 px-5">
          <Outlet context={{ setQuery } satisfies NavigationShellOutlet} />
        </div>
        {/* Footer */}
        <footer className="p-5 text-xs border-t">
          Copyright © {new Date().getFullYear()} iKooK, All Rights Reserved
        </footer>
      </div>

      {/* Side Bar */}
      <nav className="drawer-side">
        <label
          htmlFor="navigation-bar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="h-full bg-white flex flex-col py-10 border-r items-center overflow-y-scroll">
          <img src={logo} alt="iKooK" className="w-20" />
          <div className="flex flex-col flex-1 mt-12 w-full">
            {sidebarItems.map((item) => (
              <Link
                to={item.route}
                key={item.route}
                className={`w-full flex flex-row font-normal text-sm btn ${pathname.startsWith(item.route) ? 'bg-primary' : 'btn-ghost'} rounded-none`}
              >
                <img
                  src={getImageUrl(`icons/${item.icon}.svg`)}
                  alt={item.title}
                  className="w-4 h-4"
                />
                <span className="flex-1 text-start overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </main>
  );
}

function LoggedInUser() {
  const user = useAppSelector(getCurrentUser);
  return (
    <div className="flex flex-col items-start border border-primary px-5 py-2">
      <p className="capitalize font-semibold">{user.role}</p>
      <p className="capitalize text-xs">{user.first_name}</p>
    </div>
  );
}

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },
  {
    title: 'Users',
    icon: 'users',
    route: '/users'
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
    route: '/calendars'
  },
  {
    title: 'Support Tickets',
    icon: 'support',
    route: '/support'
  },
  {
    title: 'Addons Services',
    icon: 'addon',
    route: '/addons'
  },
  {
    title: 'Withdrawal',
    icon: 'withdrawal',
    route: '/withdrawal'
  },
  {
    title: 'Gift Experience',
    icon: 'gift',
    route: '/gift'
  },
  {
    title: 'Discounts',
    icon: 'discount',
    route: '/discounts'
  },
  {
    title: 'Blog',
    icon: 'blog',
    route: '/blog'
  },
  {
    title: 'Insights',
    icon: 'insight',
    route: '/insights'
  },
  {
    title: 'Report',
    icon: 'report',
    route: '/reports'
  },
  {
    title: 'Settings',
    icon: 'settings',
    route: '/settings'
  }
];
