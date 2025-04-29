import { useRoutes } from 'react-router-dom';
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
import BookingEditScreen from '../features/bookings/BookingEditScreen.tsx';
import PromotionsScreen from '../features/promotions/PromotionsScreen.tsx';
import CreateGiftScreen from '../features/promotions/CreateGiftScreen.tsx';
import CreatePromoScreen from '../features/promotions/CreatePromoScreen.tsx';
import SupportScreen from '../features/support/SupportScreen.tsx';
import SendGiftScreen from '../features/promotions/SendGiftScreen.tsx';
import WithdrawalScreen from '../features/withdrawal/WithdrawalScreen.tsx';
import RevenueOverviewScreen from '../features/revenue/RevenueOverviewScreen.tsx';
import PaymentsScreen from '../features/revenue/PaymentsScreen.tsx';
import DashboardScreen from '../features/dashboard/DashboardScreen.tsx';
import CalendarScreen from '../features/calendar/CalendarScreen.tsx';
import ReportsScreen from '../features/reports/ReportsScreen.tsx';
import NewUserScreen from '../features/users/NewUserScreen.tsx';
import SettingsScreen from '../features/settings/SettingsScreen.tsx';
import CreateMenuScreen from '../features/menus/CreateMenuScreen.tsx';
import AddonsScreen from '../features/addons/AddonsScreen.tsx';
import { AddonType } from '../features/addons/domain/type.ts';
import NewAddonScreen from '../features/addons/NewAddonScreen.tsx';

export default function Routes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const routes = useRoutes(
    isAuthenticated
      ? [
          {
            path: '/',
            element: <NavigationShell />,
            children: [
              {
                path: '',
                element: <DashboardScreen />
              },
              ...Object.values(UserType).flatMap((type) => [
                ...(type === UserType.admin
                  ? []
                  : [
                      {
                        path: `${type}s`,
                        element: <UsersScreen key={type} type={type} />
                      },
                      {
                        path: `${type}s/:id`,
                        element: <UserScreen />
                      }
                    ]),
                {
                  path: `${type}s/new`,
                  element: <NewUserScreen />
                }
              ]),
              { path: 'menus', element: <MenusScreen /> },
              { path: 'menus/new', element: <CreateMenuScreen /> },
              { path: 'bookings', element: <BookingsScreen /> },
              {
                path: `bookings/:id`,
                element: <BookingEditScreen />
              },
              {
                path: 'promotions',
                element: <PromotionsScreen />
              },
              {
                path: 'promotions/gifts/new',
                element: <CreateGiftScreen />
              },
              {
                path: 'promotions/gifts/send',
                element: <SendGiftScreen />
              },
              {
                path: 'promotions/new',
                element: <CreatePromoScreen />
              },
              {
                path: 'support',
                element: <SupportScreen />
              },
              {
                path: 'addons',
                element: <AddonsScreen />
              },
              ...Object.values(AddonType).flatMap((type) => [
                {
                  path: `addons/${type}s/new`,
                  element: <NewAddonScreen type={type} />
                }
              ]),
              {
                path: 'withdrawal',
                element: <WithdrawalScreen />
              },
              {
                path: 'revenue',
                element: <RevenueOverviewScreen />
              },
              {
                path: 'revenue/payments',
                element: <PaymentsScreen />
              },
              {
                path: 'services',
                element: <UsersScreen type={UserType.chef} isServices={true} />
              },
              {
                path: 'calendar',
                element: <CalendarScreen />
              },
              {
                path: 'reports',
                element: <ReportsScreen />
              },
              {
                path: 'settings',
                element: <SettingsScreen />
              },
              { path: '*', element: <NotFound /> }
            ]
          }
        ]
      : [{ path: '*', element: <AuthScreen /> }]
  );

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}
