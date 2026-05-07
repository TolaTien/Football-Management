import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Football Management',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Home',
      path: '/home',
      component: './home',
    },
    {
      name: 'Pitches',
      path: '/pitches',
      component: './pitches',
    },
    {
      name: 'Admin',
      path: '/admin',
      routes: [
        {
          name: 'Dashboard',
          path: '/admin/dashboard',
          component: './admin/dashboard',
        },
      ],
    },
  ],
  alias: {
    '@': '/src',
    '@shared': '/src/shared',
    '@entities': '/src/entities',
    '@features': '/src/features',
    '@widgets': '/src/widgets',
    '@pages': '/src/pages',
    '@app': '/src/app',
  },
  npmClient: 'npm',
});
