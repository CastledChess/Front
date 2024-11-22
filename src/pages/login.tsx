import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import Card from '@/components/ui/card';
import { login } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    await login(data);

    navigate('/dashboard');
  };

  return (




    <div className="flex justify-center items-center h-full">
      <Card>
        <h1 className='text-castled-accent text-4xl my-8 mx-14'>Connexion</h1>
        <div className='mx-14'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                        type="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-6 items-center">
                <a className='text-white text-sm'>Mot de passe oublié ?</a>
                <Button type="submit" className="ml-auto h-8 text-md px-6 bg-castled-accent hover:bg-castled-btn-orange">
                  Connexion
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-10 text-center text-sm text-white">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-white underline hover:text-[#EC9E67]">
              Inscription
            </Link>
          </div>
        </div>


        <div className="flex items-center justify-center mt-6">
          <div className="flex-grow border-t border-castled-gray"></div>
          <span className="text-castled-gray text-sm mx-4">ou avec</span>
          <div className="flex-grow border-t border-castled-gray"></div>
        </div>

        <div className="flex justify-center mt-4 space-x-4 text-white p-4">
          <Button className="w-44 h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
            <img src="src/assets/icons/lichess.png" alt="Lichess" className="h-9 aspect-square" />
            <span className="text-white pl-5">Lichess</span>
          </Button>

          <Button className="w-44 h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
            <img src="src/assets/icons/chess_logo.png" alt="Chess.com" className="h-9 aspect-square" />
            <span className="text-lime-600 pl-2">chess.com</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
