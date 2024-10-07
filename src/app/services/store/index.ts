import { combineReducers, configureStore } from '@reduxjs/toolkit';
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
import localStorage from 'redux-persist/es/storage';
import { isDev } from '../../environment.ts';
import { authSlice } from '../../../features/auth/domain/slice.ts';

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
  [authSlice.reducerPath]: persistReducer(authPersistConfig, authSlice.reducer)
});

export const rootReducer: typeof appReducer = (state, action) => {
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
    })
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
