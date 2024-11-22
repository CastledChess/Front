import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { register } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card.tsx';

export const Register = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      username: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      await register(data);

      navigate('/');
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(
        'Failed to register:',
        error.response.data.message.map((e: any) => e.constraints),
      );

      // TODO: implement error display

      const errors: { property: string; value: string; constraints: Record<string, string> }[] =
        error.response.data.message;

      errors.forEach(({ property, constraints }) => {
        form.setError(property as keyof typeof data, {
          type: 'server',
          message: constraints[Object.keys(constraints)[0]],
        });
      });
    }
  };

  return (
    // Ici c'est la card qui contient le formulaire
    <div className="flex items-center justify-center py-5">
      <Card>
        <h1 className="text-castled-accent text-4xl my-8 mx-14">Inscription</h1>
        <div className="mx-14 w-72">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input autoComplete="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input autoComplete="username" placeholder="Username" {...field} />
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
                      <Input type="password" autoComplete="new-password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-6 items-center ">
                <a className="text-white text-xs">Mot de passe oublié ?</a>
                <Button type="submit" className="px-8 text-md h-8 bg-castled-accent hover:bg-castled-btn-orange ">
                  Inscription
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-castled-gray text-[0.6rem] mt-10">
            En vous inscrivant, vous acceptez les Conditions d'utilisation et la Politique de confidentialité, notamment
            l'Utilisation des cookies.
          </p>

          <div className="mt-6 text-center text-white text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline hover:text-[#EC9E67]">
              Login
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center mt-6">
          <div className="flex-grow border-t border-castled-gray"></div>
          <span className="text-castled-gray text-sm mx-4">ou avec</span>
          <div className="flex-grow border-t border-castled-gray"></div>
        </div>

        <div className="flex justify-center mt-4 space-x-4 text-white p-4">
          <button className="w-44 h-8 py-2 px-0 rounded-full bg-[#494A4C]  transition hover:bg-white hover:text-black flex justify-start items-center space-x-2">
            <img src="src/assets/icons/lichess.png" alt="Lichess" className="h-8 bg-white rounded-full" />
            <span className="pl-6">Lichess</span>
          </button>

          <button className="w-44 h-8 py-2 px-0 rounded-full bg-castled-input hover:bg-lime-600 transition flex justify-start items-center space-x-2">
            <img src="src/assets/icons/chess_logo.png" alt="Chess.com" className="h-8 rounded-full" />
            <p className="pl-2">chess.com</p>
          </button>
        </div>
      </Card>
    </div>
  );
};
