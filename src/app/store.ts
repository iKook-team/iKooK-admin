import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import { resetStore } from '../features/auth/domain/usecase.ts';
import localStorage from 'redux-persist/es/storage';
import { isDev } from './environment.ts';
import { authSlice } from '../features/auth/domain/slice.ts';

const rootPersistConfig = {
  key: 'root',
  blacklist: [authSlice.reducerPath],
  storage: localStorage
  // stateReconciler: hardSet,
};

const authPersistConfig = {
  key: authSlice.reducerPath,
  // storage: createSecureStore(),
  storage: localStorage
};

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.reducerPath]: persistReducer(authPersistConfig, authSlice.reducer)
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === resetStore.type) {
    location.replace(`${location.origin}/login`);
    void Promise.all([
      localStorage.removeItem('persist:' + authSlice.reducerPath),
      localStorage.removeItem('persist:root')
    ]);
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  devTools: isDev(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware)
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
