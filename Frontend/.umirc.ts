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
        {
          name: 'Schedule',
          path: '/admin/schedule',
          component: './admin/schedule',
        },
        {
          name: 'Pitches',
          path: '/admin/pitches',
          component: './admin/pitches',
        },
        {
          name: 'Customers',
          path: '/admin/customers',
          component: './admin/customers',
        },
        {
          name: 'Finance',
          path: '/admin/finance',
          component: './admin/finance',
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
  esbuildMinifyIIFE: true,
});
