import { useRoutes } from 'react-router-dom';
import { AuthType } from '../features/auth/domain/types.ts';
import NotFound from './components/not-found.tsx';
import ScrollToTop from './components/scroll-to-top.tsx';
import AuthScreen from '../features/auth/AuthScreen.tsx';
import NavigationShell from './components/NavigationShell.tsx';
import UsersScreen from '../features/users/UsersScreen.tsx';
import { UserType } from '../features/users/domain/types.ts';
import MenusScreen from '../features/menus/MenusScreen.tsx';
import UserScreen from '../features/users/UserScreen.tsx';
import BookingsScreen from '../features/bookings/BookingsScreen.tsx';
import useAuthStore from '../features/auth/domain/store.ts';
import { BookingType } from '../features/bookings/domain/types.ts';
import BookingEditScreen from '../features/bookings/BookingEditScreen.tsx';
import PromotionsScreen from '../features/promotions/PromotionsScreen.tsx';
import NewUser from '../features/users/pages/NewUserPage.tsx';
import CreateGiftScreen from '../features/promotions/CreateGiftScreen.tsx';
import CreatePromoScreen from '../features/promotions/CreatePromoScreen.tsx';
import SupportScreen from '../features/support/SupportScreen.tsx';

export default function Routes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const routes = useRoutes(
    isAuthenticated
      ? [
          {
            path: '/',
            element: <NavigationShell />,
            children: [
              ...Object.values(UserType).flatMap((type) => [
                {
                  path: `${type}s`,
                  element: <UsersScreen key={type} type={type} />
                },
                {
                  path: `${type}s/:id`,
                  element: <UserScreen />
                },
                {
                  path: `${type}s/new`,
                  element: <NewUser />
                }
              ]),
              ...Object.values(BookingType).flatMap((type) => [
                {
                  path: `bookings/${type}s/:id`,
                  element: <BookingEditScreen key={type} />
                }
              ]),

              { path: 'menus', element: <MenusScreen /> },
              { path: 'bookings', element: <BookingsScreen /> },
              {
                path: 'promotions',
                element: <PromotionsScreen />
              },
              {
                path: 'promotions/gifts/new',
                element: <CreateGiftScreen />
              },
              {
                path: 'promotions/new',
                element: <CreatePromoScreen />
              },
              {
                path: 'support',
                element: <SupportScreen />
              },
              { path: '*', element: <NotFound /> }
            ]
          }
        ]
      : [{ path: '*', element: <AuthScreen type={AuthType.login} /> }]
  );

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}
