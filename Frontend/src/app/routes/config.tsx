import {type  ReactNode } from 'react';
import { UserRole } from '../../shared/lib/rbac';

export interface RouteConfig {
    path: string;
    element: ReactNode;
    roles: UserRole[];
}

export const adminRoutes: RouteConfig[] = [
    { path: '/admin/dashboard', element: 'Admin Dashboard Placeholder', roles: [UserRole.ADMIN] },
    { path: '/admin/pitches', element: 'Pitch Management Placeholder', roles: [UserRole.ADMIN] },
    { path: '/admin/orders', element: 'Order Approval Placeholder', roles: [UserRole.ADMIN] },
];

export const userRoutes: RouteConfig[] = [
    { path: '/', element: 'Home Placeholder', roles: [UserRole.GUEST, UserRole.USER] },
    { path: '/pitches', element: 'Pitch Search Placeholder', roles: [UserRole.GUEST, UserRole.USER] },
    { path: '/booking/:id', element: 'Booking Placeholder', roles: [UserRole.USER] },
    { path: '/matchmaking', element: 'Matchmaking Feed Placeholder', roles: [UserRole.USER] },
];
