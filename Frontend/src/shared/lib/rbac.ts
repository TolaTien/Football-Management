export const UserRole = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    GUEST: 'GUEST',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
    if (requiredRoles.includes('GUEST')) return true;
    return requiredRoles.includes(userRole);
};
