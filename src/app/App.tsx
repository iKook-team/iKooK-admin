import { BrowserRouter } from 'react-router-dom';
import Routes from './routes.tsx';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './services/api';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';

export default function App() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
