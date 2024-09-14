import { BrowserRouter } from 'react-router-dom';
import Routes from './routes.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './store.ts';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
