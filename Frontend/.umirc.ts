import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  tailwindcss: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    { path: '/', redirect: '/auth/login' },
    { path: '/auth/login', component: './auth/login' },
    { path: '/auth/signup', component: './auth/signup' },
    {
      path: '/',
      component: '@/layouts/UserLayout',
      routes: [
        { path: '/user/dashboard', component: './user/dashboard' },
        { path: '/user/profile', component: './user/profile' },
        { path: '/user/bookings', component: './user/bookings' },
        { path: '/user/notifications', component: './user/notifications' },
        { path: '/pitches', component: './pitches' },
        { path: '/booking/availability', component: './booking/availability' },
      ],
    },
    {
      path: '/admin',
      component: '@/layouts/AdminLayout',
      routes: [
        { path: '/admin/dashboard', component: './admin/dashboard' },
        { path: '/admin/requests', component: './admin/requests' },
        { path: '/admin/pitches', component: './admin/pitches' },
        { path: '/admin/pricing', component: './admin/pricing' },
        { path: '/admin/customers', component: './admin/customers' },
        { path: '/admin/finance', component: './admin/finance' },
        { path: '/admin/services', component: './admin/services' },
        { path: '/admin/notifications', component: './admin/notifications' },
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
