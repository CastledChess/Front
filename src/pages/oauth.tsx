import { useAuthStore } from '@/store/auth';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Oauth = () => {
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const access = searchParams.get('access') as string;
    const refresh = searchParams.get('refresh') as string;
    const user = searchParams.get('user') as string;

    setUser(JSON.parse(decodeURIComponent(user)));
    setAccessToken(access);
    setRefreshToken(refresh);

    navigate('/');
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-xl">Logging you in</h1>
        <Icon icon="line-md:loading-loop" width={40} />
      </div>
    </div>
  );
};
