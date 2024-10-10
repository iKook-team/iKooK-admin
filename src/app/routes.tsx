import { useRoutes } from 'react-router-dom';
import { AuthType } from '../features/auth/domain/types.ts';
import NotFound from './components/not-found.tsx';
import ScrollToTop from './components/scroll-to-top.tsx';
import AuthScreen from '../features/auth/AuthScreen.tsx';
import { isAuthenticated } from '../features/auth/domain/slice.ts';
import NavigationShell from './components/NavigationShell.tsx';
import UsersScreen from '../features/users/UsersScreen.tsx';
import { UserType } from '../features/users/domain/types.ts';
import MenusScreen from '../features/menus/MenusScreen.tsx';
import { useAppSelector } from './services/store/hooks.ts';
import UserScreen from '../features/users/UserScreen.tsx';

export default function Routes() {
  const authenticated = useAppSelector(isAuthenticated);

  const routes = useRoutes(
    authenticated
      ? [
          {
            path: '/',
            element: <NavigationShell />,
            children: [
              ...Object.values(UserType).flatMap((type) => [
                {
                  path: `${type}s`,
                  element: <UsersScreen type={type} />
                },
                {
                  path: `${type}s/:id`,
                  element: <UserScreen />
                }
              ]),
              { path: 'menus', element: <MenusScreen /> },
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
