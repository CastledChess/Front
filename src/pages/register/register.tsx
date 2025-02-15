import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { register } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import lichessIcon from '@/assets/icons/lichess.svg?url';
import chessComIcon from '@/assets/icons/chesscom.svg?url';

export const Register = () => {
  const { t } = useTranslation('register');
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
        error,
        // error.response.data.message.map((e: any) => e.constraints),
      );

      // TODO: implement error display -> need types

      // const errors: { property: string; value: string; constraints: Record<string, string> }[] =
      //   error.response.data.message;
      //
      // errors.forEach(({ property, constraints }) => {
      //   form.setError(property as keyof typeof data, {
      //     type: 'server',
      //     message: constraints[Object.keys(constraints)[0]],
      //   });
      // });
    }
  };

  return (
    <div className="flex justify-center items-center bg-background h-full py-20">
      <div className="flex flex-col w-96">
        <h1 className="text-4xl my-8">{t('register')}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input autoComplete="email" placeholder={t('email')} {...field} />
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
                    <Input autoComplete="username" placeholder={t('username')} {...field} />
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
                    <Input type="password" autoComplete="new-password" placeholder={t('password')} {...field} />
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
                    <Input type="password" autoComplete="new-password" placeholder={t('confirmPassword')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm w-full">
                {t('haveAnAccount')}{' '}
                <Link to="/login" className="underline hover:text-[#EC9E67]">
                  {t('login')}
                </Link>
              </div>
              <div className="flex justify-end gap-6 items-center ">
                <Button type="submit">{t('register')}</Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex mt-10 space-x-4 w-full">
          <Button variant="secondary" className="w-full">
            <img src={lichessIcon} alt="Lichess" className="h-6" />
            <span>Lichess</span>
          </Button>

          <Button variant="secondary" className="w-full">
            <img src={chessComIcon} alt="Chess.com" className="h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
