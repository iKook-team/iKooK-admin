import { useRoutes } from 'react-router-dom';
import AuthScreen from '../features/auth';
import { AuthType } from '../features/auth/domain/types.ts';
import NotFound from './components/not-found.tsx';
import ScrollToTop from './components/scroll-to-top.tsx';

export default function Routes() {
  const routes = useRoutes([
    { path: '/login', element: <AuthScreen type={AuthType.login} /> },
    { path: '*', element: <NotFound /> }
  ]);

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}
