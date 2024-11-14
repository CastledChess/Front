import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { register } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from "@/components/ui/card.tsx";

export const Register = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      username: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    await register(data);

    navigate('/dashboard');
  };

  return (
    // Ici c'est la card qui contient le formulaire
    <div className="flex items-center justify-center h-full">
      <Card> 
        <h1 className='text-castled-accent text-4xl my-8 mx-14'>Inscription</h1>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        placeholder="Username"
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
                        autoComplete="new-password"
                        placeholder="Password"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <div className="flex justify-between gap-6 items-center">
                  <a className='text-white text-sm'>Mot de passe oublie ?</a>
                  <Button type="submit" className="ml-auto bg-castled-accent hover:bg-castled-btn-orange">
                    Register
                  </Button>
                </div>
            </form>
          </Form>

        <p >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui deleniti voluptatibus nihil beatae odio sed, aliquam error. Vitae quas, deleniti unde velit iure, voluptatum vero at nisi quam perspiciatis aliquid.</p>
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
        <Button className="w-[178px] h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
          <img src="src/assets/icons/lichess.png" alt="Lichess" className="h-9 aspect-square" />
          <span className="text-white pl-6">Lichess</span>
        </Button>

        <Button className="w-[178px] h-8 py-2 px-0 rounded-full bg-[#494A4C] hover:bg-gray-600 flex justify-start items-center space-x-2">
          <img src="src/assets/icons/chess.com.png" alt="Chess.com" className="h-9 aspect-circle" />
          <span className="text-lime-600 pl-2">chess.com</span>
        </Button>
      </div> 
      </Card>
    </div>
  );
};
