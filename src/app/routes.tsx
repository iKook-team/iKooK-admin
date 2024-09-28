import { useRoutes } from 'react-router-dom';
import { AuthType } from '../features/auth/domain/types.ts';
import NotFound from './components/not-found.tsx';
import ScrollToTop from './components/scroll-to-top.tsx';
import AuthScreen from '../features/auth/AuthScreen.tsx';
import { useAppSelector } from '../hooks';
import { isAuthenticated } from '../features/auth/domain/slice.ts';
import NavigationShell from './components/NavigationShell.tsx';
import UsersScreen from '../features/users/UsersScreen.tsx';
import { UserType } from '../features/users/domain/types.ts';

export default function Routes() {
  const authenticated = useAppSelector(isAuthenticated);

  const routes = useRoutes(
    authenticated
      ? [
          {
            path: '/',
            element: <NavigationShell />,
            children: [
              { path: 'users', element: <UsersScreen type={UserType.host} /> },
              { path: 'chefs', element: <UsersScreen type={UserType.chef} /> },
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
