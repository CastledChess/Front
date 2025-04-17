import { useAuthStore } from '@/store/auth';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Oauth = () => {
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();
  const navigate = useNavigate();

  function getCookie(key: string) {
    var b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }

  useEffect(() => {
    const access = getCookie('lichess_access_token') as string;
    const refresh = getCookie('lichess_refresh_token') as string;
    const user = getCookie('lichess_user') as string;

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
