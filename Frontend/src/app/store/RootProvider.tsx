import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
