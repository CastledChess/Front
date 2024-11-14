import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { login } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';
import lichessLogo from '@/assets/icons/lichess.png?url';
import chessLogo from '@/assets/icons/chess_logo.png?url';

export const Login = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      await login(data);

      navigate('/');
    } catch (error) {
      console.error('Failed to login:', error);

      form.setError('email', { message: 'Invalid Credentials' });
      form.setError('password', { message: 'Invalid Credentials' });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: '#343639' }}>
        <h2 className="text-center mb-8 font-bold" style={{ color: '#EC9E67', fontSize: '36px' }}>
          Login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-[#494A4C] h-12 rounded-[10px] border-none"
                      autoComplete="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-[#494A4C] h-12 rounded-[10px] border-none"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-6 items-center">
              <Button type="submit" className="ml-auto bg-[#EC9E67] hover:bg-[#EC9E67]/90">
                Login
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-white underline hover:text-[#EC9E67]">
            Register
          </Link>
        </div>

        <div className="flex items-center justify-center mt-6">
          <div className="flex-grow border-t border-white/15"></div>
          <span className="text-white/60 mx-4">Or with</span>
          <div className="flex-grow border-t border-white/15"></div>
        </div>

        <div className="flex justify-center mt-4 space-x-4 text-white p-4">
          <Button className="w-[178px] h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
            <img src={lichessLogo} alt="Lichess" className="h-9 aspect-square" />
            <span className="text-white">Lichess</span>
          </Button>

          <Button className="w-[178px] h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
            <img src={chessLogo} alt="Chess.com" className="h-9 aspect-square" />
            <span className="text-lime-600">chess.com</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
