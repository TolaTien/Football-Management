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
        { path: '/user/team', component: './user/team' },
        { path: '/user/wallet', component: './user/wallet' },
        { path: '/user/profile', component: './user/profile' },
        { path: '/booking/availability', component: './booking/availability' },
        { path: '/matchmaking/feed', component: './matchmaking/feed' },
        { path: '/matchmaking/messages', component: './matchmaking/messages' },
      ],
    },
    // Admin routes (if they still need the Pro layout, we can re-enable it locally but for now let's keep it simple)
    {
      path: '/admin',
      routes: [
        {
          path: '/admin/dashboard',
          component: './admin/dashboard',
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
});
