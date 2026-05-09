import { RunTimeLayoutConfig } from '@umijs/max';

export const getInitialState = async (): Promise<{ name: string }> => {
  return { name: 'Admin' };
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    title: 'Arena Manager',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg', // Placeholder logo for Arena Manager
    menu: {
      locale: false,
    },
    layout: 'mix',
    splitMenus: false,
    siderWidth: 256,
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
    token: {
      sider: {
        colorMenuBackground: '#ffffff',
        colorMenuItemDivider: 'transparent',
        colorTextMenu: '#6b7280',
        colorTextMenuSelected: '#ffffff',
        colorBgMenuItemSelected: '#00a67d',
      },
      pageContainer: {
        colorBgPageContainer: '#f4f7f6',
      }
    },
    // Right top header avatar
    rightContentRender: () => null, // Will use custom right content in pages if needed
  };
};
