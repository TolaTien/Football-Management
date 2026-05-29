import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { store } from './store';

const themeConfig = {
  token: {
    colorPrimary: '#059669',
    colorSuccess: '#059669',
    colorWarning: '#d97706',
    colorError: '#ba1a1a',
    fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    borderRadius: 8,
  },
  components: {
    Button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
    },
  },
};

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={themeConfig} locale={viVN}>
        {children}
      </ConfigProvider>
    </Provider>
  );
};
