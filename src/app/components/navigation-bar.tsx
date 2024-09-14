import { Link } from 'react-router-dom';
import { createRef, ReactNode, useCallback, useMemo, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import logo from '../../app/assets/images/logo.svg';
import useBreakpoint from '../../hooks/use-breakpoint.ts';

export const NavigationBarRef = createRef<HTMLElement>();

export default function NavigationBar() {
  const showMobileNav = useBreakpoint('md').isBelowMd;

  const [visible, setVisible] = useState(false);

  const dropdown = useMemo(
    () => [
      {
        title: 'Games',
        items: [
          {
            name: 'Play now',
            link: '/games/play'
          },
          {
            name: 'Available Games',
            link: '/games'
          },
          {
            name: 'Game History',
            link: '/games/history'
          }
          // {
          //   name: 'Pending Games',
          //   link: '/games/history?status=pending'
          // }
        ]
      },
      {
        title: 'Funding',
        items: [
          {
            name: 'Add Funds',
            link: '/funding/deposit'
          },
          // {
          //   name: 'Add Bank Details',
          //   link: '/funding/details/add'
          // },
          {
            name: 'Withdraw to Bank',
            link: '/funding/withdraw'
          }
        ]
      },
      {
        title: 'Profile',
        items: [
          {
            name: 'View Profile',
            link: '/profile'
          }
          // {
          //   name: 'Edit Password',
          //   link: '/profile/password'
          // }
        ]
      }
    ],
    []
  );

  const buttons = useMemo(
    () => [
      <Link className="btn btn-primary text-white" to="/info/how-to-play" key="how-to-play">
        How to Play
      </Link>
      // <Link className="btn text-primary" to="/contact-us" key="contact">
      //   Contact Us
      // </Link>
    ],
    []
  );

  const toggleVisibility = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  return (
    <nav
      ref={NavigationBarRef}
      className={`shadow rounded-[0] ${showMobileNav ? 'collapse' : ''} ${visible ? 'collapse-open' : ''}`}
    >
      <div className="navbar container collapse-title flex items-center justify-between text-sm font-medium py-4 px-small m-auto">
        {/* Logo */}
        <Link to="/" className="text-neutral-900">
          <img src={logo} alt="iKooK Admin" className="w-[3.5rem]" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-4 menu menu-horizontal px-1">
          {dropdown.map((item) => (
            <li key={item.title}>
              <details className="dropdown">
                <summary>{item.title}</summary>
                <ul className="p-2 bg-base-100 rounded-t-none w-52">
                  {item.items.map(({ name, link }) => (
                    <li key={name}>
                      <NavLink link={link} className="text-neutral-900">
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex gap-2">{buttons}</div>

        {/* Mobile Navigation Icon */}
        <div onClick={toggleVisibility} className="block md:hidden">
          {visible ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <ul className="flex flex-col md:hidden collapse-content gap-4">
        {dropdown.map((item) => (
          <div className="collapse bg-base-200" key={item.title}>
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-primary peer-checked:bg-primary peer-checked:text-primary-content">
              {item.title}
            </div>
            <ul className="collapse-content bg-secondary text-primary peer-checked:bg-primary peer-checked:text-primary-content">
              {item.items.map(({ name, link }) => (
                <li key={name}>
                  <NavLink link={link}>{name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex gap-6 justify-center">{buttons}</div>
      </ul>
    </nav>
  );
}

function NavLink({
  link,
  className,
  children
}: {
  link: string;
  className?: string;
  children?: ReactNode;
}) {
  return link === '/games/play' ? (
    <button className={className}>{children}</button>
  ) : (
    <Link to={link} className={className}>
      {children}
    </Link>
  );
}
