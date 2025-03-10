import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schema/auth.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { login } from '@/api/auth.ts';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { track } from '@vercel/analytics';
import { useDeviceData } from 'react-device-detect';
import { SmoothCorners } from 'react-smooth-corners';
import { Label } from '@/components/ui/label.tsx';
// import lichessIcon from '@/assets/icons/lichess.svg?url';
// import chessComIcon from '@/assets/icons/chesscom.svg?url';

/**
 * The `Login` component renders a login form for users to authenticate.
 * It uses `react-hook-form` for form handling and validation with a schema defined using `zod`.
 * The component also integrates with `react-i18next` for internationalization and `react-router-dom` for navigation.
 *
 * @component
 * @example
 * // Usage example:
 * // <Login />
 *
 * @returns {JSX.Element} The rendered login form component.
 *
 * @remarks
 * - The form includes fields for email and password, with validation and error handling.
 * - On successful login, the user is navigated to the home page.
 * - If login fails, error messages are displayed for the email and password fields.
 * - The component also provides links for password recovery and registration.
 * - Social login buttons for Lichess and Chess.com are included but not yet functional.
 *
 * @handler
 * - `onSubmit`: Handles form submission for user login.
 * - `navigate`: Navigates to the home page on successful login.
 *
 * @dependencies
 * - `react-hook-form`: For form state management and validation.
 * - `zod`: For schema-based validation.
 * - `@hookform/resolvers/zod`: To integrate `zod` with `react-hook-form`.
 * - `react-router-dom`: For navigation.
 * - `react-i18next`: For internationalization.
 * - Custom UI components: `Form`, `FormControl`, `FormField`, `FormItem`, `FormMessage`, `Input`, `Button`.
 * - Custom API function: `login`.
 * - Assets: `lichessIcon`, `chessComIcon`.
 */

export const Login = () => {
  const { t } = useTranslation('login');
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const { browser, cpu, engine, os, ua } = useDeviceData(window.navigator.userAgent);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      await login(data);

      track('Signin', {
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
      console.error('Failed to login:', error);

      form.setError('email', { message: error.response.data.message });
      form.setError('password', { message: error.response.data.message });
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

            <p>Sign-in and start analysing your chess games</p>
          </div>
        </SmoothCorners>

        <div className="w-full xl:w-1/2 flex md:py-20 py-10 flex-col gap-14 items-center">
          <span className="text-center space-y-3">
            <h1 className="text-3xl">{t('login')}</h1>
            <p className="text-foreground/70">Sign in to an existing account</p>
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

              <Button
                type="submit"
                className="h-14 bg-foreground hover:bg-foreground/90 text-background text-lg font-semibold"
              >
                {t('login')}
              </Button>

              <div className="text-sm w-full text-center">
                {t('noAccount')}{' '}
                <Link to="/register" className="underline hover:text-[#EC9E67]">
                  {t('register')}
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="flex justify-center lg:items-center bg-background h-full lg:py-20">
  //     <div className="flex flex-col w-full px-4 lg:px-0 lg:w-96">
  //       <h1 className="text-4xl my-8">{t('login')}</h1>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
  //           <FormField
  //             control={form.control}
  //             name="email"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormControl>
  //                   <Input autoComplete="email" placeholder={t('email')} {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //
  //           <FormField
  //             control={form.control}
  //             name="password"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormControl>
  //                   <Input type="password" autoComplete="current-password" placeholder={t('password')} {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //
  //           <div className="flex justify-between gap-6 items-center">
  //             <a className="text-white text-sm underline" href="/">
  //               {t('forgotPassword')}{' '}
  //             </a>
  //             <Button type="submit">{t('login')}</Button>
  //           </div>
  //         </form>
  //       </Form>
  //
  //       <div className="mt-10 text-sm w-full">
  //         {t('noAccount')}{' '}
  //         <Link to="/register" className="underline hover:text-[#EC9E67]">
  //           {t('register')}
  //         </Link>
  //       </div>
  //
  //       {/*<div className="flex mt-4 space-x-4 w-full">*/}
  //       {/*  <Button variant="secondary" className="w-full">*/}
  //       {/*    <img src={lichessIcon} alt="Lichess" className="h-6" />*/}
  //       {/*    <span>Lichess</span>*/}
  //       {/*  </Button>*/}
  //
  //       {/*  <Button variant="secondary" className="w-full">*/}
  //       {/*    <img src={chessComIcon} alt="Chess.com" className="h-6" />*/}
  //       {/*  </Button>*/}
  //       {/*</div>*/}
  //     </div>
  //   </div>
  // );
};
