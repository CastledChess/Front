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
import lichessIcon from '@/assets/icons/lichess.svg?url';
import chessComIcon from '@/assets/icons/chesscom.svg?url';


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
    <div className="flex justify-center items-center bg-background h-full py-20">
      <div className="flex flex-col w-96">
        <h1 className="text-4xl my-8">{t('login')}</h1>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" placeholder={t('password')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-6 items-center">
              <a className="text-white text-sm underline" href="/">
                {t('forgotPassword')}{' '}
              </a>
              <Button type="submit">{t('login')}</Button>
            </div>
          </form>
        </Form>

        <div className="mt-10 text-sm w-full">
          {t('noAccount')}{' '}
          <Link to="/register" className="underline hover:text-[#EC9E67]">
            {t('register')}
          </Link>
        </div>

        <div className="flex mt-4 space-x-4 w-full">
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
