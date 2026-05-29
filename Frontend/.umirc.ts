import { defineConfig } from '@umijs/max';

export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  antd: {},
  tailwindcss: { checkTimeout: 20000 },
  access: {},
  request: {},
  layout: false, // Disable the built-in Pro Layout globally, we manage our own
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    // Auth pages
    {
      path: '/auth/login',
      component: './auth/login',
    },
    {
      path: '/auth/signup',
      component: './auth/signup',
    },
    // User routes sharing UserLayout
    {
      path: '/',
      component: '@/layouts/UserLayout',
      routes: [
        { path: '/user/dashboard', component: './user/dashboard' },
        { path: '/user/activity', component: './user/activity' },
        { path: '/user/rules', component: './user/rules' },
        { path: '/user/profile', component: './user/profile' },
        { path: '/booking/availability', component: './user/booking/availability' },
        { path: '/matchmaking/feed', component: './user/matchmaking/feed' },
      ],
    },
    // Admin routes sharing AdminLayout
    {
      path: '/admin',
      component: '@/layouts/AdminLayout',
      routes: [
        {
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
        {
          name: 'Services',
          path: '/admin/services',
          component: './admin/services',
        },
        {
          name: 'Forum',
          path: '/admin/forum',
          component: './admin/forum',
        },
      ],
    },
  ],
  alias: {
    '@': __dirname + '/src',
    '@shared': __dirname + '/src/shared',
    '@entities': __dirname + '/src/entities',
    '@features': __dirname + '/src/features',
    '@widgets': __dirname + '/src/widgets',
    '@pages': __dirname + '/src/pages',
    '@app': __dirname + '/src/app',
  },
  npmClient: 'npm',
  esbuildMinifyIIFE: true,
});
