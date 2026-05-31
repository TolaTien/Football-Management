import { defineConfig } from '@umijs/max';

export default defineConfig({
  publicPath: '/',
  hash: true,
  history: { type: 'browser' },
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  antd: false,
  tailwindcss: { checkTimeout: 20000 },
  access: {},
  request: {},
  mfsu: false,
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
      component: '@/app/layouts/UserLayout',
      routes: [
        { path: '/user/dashboard', component: './user/dashboard' },
        { path: '/user/activity', component: './user/activity' },
        { path: '/user/rules', component: './user/rules' },
        { path: '/user/profile', component: './user/profile' },
        { path: '/user/support', component: './user/support' },
        { path: '/booking/availability', component: './user/booking/availability' },
        { path: '/matchmaking/feed', component: './user/matchmaking/feed' },
      ],
    },
    // Admin routes sharing AdminLayout
    {
      path: '/admin',
      component: '@/app/layouts/AdminLayout',
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
          name: 'Pricing',
          path: '/admin/pricing',
          component: './admin/pricing',
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

