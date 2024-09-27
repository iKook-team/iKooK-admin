import { useRoutes } from 'react-router-dom';
import { AuthType } from '../features/auth/domain/types.ts';
import NotFound from './components/not-found.tsx';
import ScrollToTop from './components/scroll-to-top.tsx';
import AuthScreen from '../features/auth/AuthScreen.tsx';
import { useAppSelector } from '../hooks';
import { isAuthenticated } from '../features/auth/domain/slice.ts';

export default function Routes() {
  const authenticated = useAppSelector(isAuthenticated);
  console.log(authenticated);

  const routes = useRoutes([
    {
      path: '/',
      element: authenticated ? <NotFound /> : <AuthScreen type={AuthType.login} />
    },
    { path: '*', element: <NotFound /> }
  ]);

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}
