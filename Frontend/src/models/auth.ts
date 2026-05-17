import { useCallback, useEffect, useState } from 'react';
import { authApi } from '@/shared/api/modules';
import type { User } from '@/shared/types/domain';

export default function useAuthModel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.data);
      localStorage.setItem('pitchhub_user', JSON.stringify(response.data.data));
    } catch {
      setUser(null);
      localStorage.removeItem('pitchhub_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  return { user, setUser, loading, reload: loadMe };
}
