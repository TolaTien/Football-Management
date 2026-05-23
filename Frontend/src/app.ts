import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

export const getInitialState = async (): Promise<{ name: string }> => {
  return { name: 'Football Management Admin' };
};

export function rootContainer(container: React.ReactNode) {
  return React.createElement(Provider, { store, children: container });
}
