import { UserRole } from '../../../shared/lib/rbac';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    avatar?: string;
}

export interface UserState {
    data: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}
