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
import { track } from '@vercel/analytics';
import { useDeviceData } from 'react-device-detect';
import { Label } from '@/components/ui/label.tsx';
import { SmoothCorners } from 'react-smooth-corners';
// import lichessIcon from '@/assets/icons/lichess.svg?url';
// import chessComIcon from '@/assets/icons/chesscom.svg?url';

/**
 * Register component renders a registration form for new users.
 *
 * This component uses the `useForm` hook from `react-hook-form` and `zodResolver`
 * to handle form validation and submission. It also utilizes the `useTranslation`
 * hook from `react-i18next` for internationalization.
 *
 * The form includes fields for email, username, password, and confirm password.
 * On successful registration, the user is navigated to the home page. If registration
 * fails, errors are logged to the console.
 *
 * @component
 * <Register />
 *
 * @example
 * return (
 *  <Register />
 * )
 *
 * @returns {JSX.Element} The rendered registration form component.
 */
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
  const { browser, cpu, engine, os, ua } = useDeviceData(window.navigator.userAgent);

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      await register(data);

      track('Signup', {
        email: data.email,
        browser,
        cpu,
        engine,
        os,
        ua,
      });
      navigate('/');
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error('Failed to register:', error);

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
    <div className="justify-center h-full flex px-10 md:py-10 py-4 items-center">
      <div className="container px-0 sm:px-10 md:px-20 lg:px-40 xl:px-0 flex flex-col lg:flex-row gap-32 h-full max-h-[50rem]">
        {/* @ts-expect-error - SmoothCorners is not typed */}
        <SmoothCorners corners="14" className="xl:flex hidden w-1/2 h-full bg-[url('/grain.svg')] bg-cover bg-center">
          <div className="flex flex-col gap-6 items-center mt-[50%] w-full">
            <span className="text-xl items-center text-center flex gap-2">
              <img src="/logo.svg" alt="castled-logo" className="h-8" />
              <p className="mt-auto leading-[18px]">Castled</p>
            </span>
            <h1 className="text-4xl text-center">Get Started</h1>

            <p>Sign-up and start analysing your chess games</p>
          </div>
        </SmoothCorners>

        <div className="w-full xl:w-1/2 flex md:py-20 py-10 flex-col gap-14 items-center">
          <span className="text-center space-y-3">
            <h1 className="text-3xl">{t('register')}</h1>
            <p className="text-foreground/70">Register a new account to analyse your chess games</p>
          </span>

          {/*<div className="flex mt-10 space-x-4 w-full">*/}
          {/*  <Button variant="secondary" className="w-full">*/}
          {/*    <img src={lichessIcon} alt="Lichess" className="h-6" />*/}
          {/*    <span>Lichess</span>*/}
          {/*  </Button>*/}

          {/*  <Button variant="secondary" className="w-full">*/}
          {/*    <img src={chessComIcon} alt="Chess.com" className="h-6" />*/}
          {/*  </Button>*/}
          {/*</div>*/}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-sm text-foreground">
                      {t('email')}
                    </Label>
                    <FormControl>
                      <Input
                        className="h-14 bg-secondary-bg border-none"
                        autoComplete="email"
                        id={'email'}
                        placeholder={'johndoe@gmail.com'}
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
                    <Label htmlFor="username" className="text-sm text-foreground">
                      {t('username')}
                    </Label>
                    <FormControl>
                      <Input
                        className="h-14 bg-secondary-bg border-none"
                        autoComplete="username"
                        id="username"
                        placeholder={'JohnDoe'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex sm:flex-row flex-col sm:gap-4 gap-6 w-full">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="password" className="text-sm text-foreground">
                        {t('password')}
                      </Label>
                      <FormControl>
                        <Input
                          className="h-14 bg-secondary-bg border-none"
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          placeholder={t('password')}
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
                    <FormItem className="w-full">
                      <Label htmlFor="confirmPassword" className="text-sm text-foreground">
                        {t('confirmPassword')}
                      </Label>
                      <FormControl>
                        <Input
                          className="h-14 bg-secondary-bg border-none"
                          type="password"
                          id="confirmPassword"
                          autoComplete="new-password"
                          placeholder={t('confirmPassword')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="h-14 bg-foreground hover:bg-foreground/90 text-background text-lg font-semibold"
              >
                {t('register')}
              </Button>

              <div className="text-sm w-full text-center">
                {t('haveAnAccount')}{' '}
                <Link to="/login" className="underline hover:text-[#EC9E67]">
                  {t('login')}
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
