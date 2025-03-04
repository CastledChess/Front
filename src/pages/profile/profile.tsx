import { useState } from 'react';
import { useAuthStore } from '@/store/auth.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, PencilOff, SquarePen, LogOut, Trash, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema } from '@/schema/profile.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';

/**
 * Profile component renders the user's profile page.
 * It includes functionalities for viewing and editing user details,
 * uploading a profile picture, and logging out.
 *
 * @component
 * @example
 * return (
 *   <Profile />
 * )
 *
 * @returns {JSX.Element} The rendered profile page component.
 *
 * @remarks
 * This component uses the following hooks:
 * - `useTranslation` from 'react-i18next' for internationalization.
 * - `useAuthStore` from 'zustand' for authentication state management.
 * - `useNavigate` from 'react-router-dom' for navigation.
 * - `useState` from 'react' for managing local state.
 * - `useForm` from 'react-hook-form' for form handling.
 *
 * The component also uses the following components:
 * - `Avatar`, `AvatarImage` from 'some-avatar-library' for displaying the user's profile picture.
 * - `Card` from 'some-card-library' for displaying the profile information.
 * - `Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage` from 'some-form-library' for form handling.
 * - `Button` from 'some-button-library' for rendering buttons.
 *
 * The component handles the following actions:
 * - `onSubmit`: Handles form submission for updating user details.
 * - `handleLogout`: Logs out the user and navigates to the login page.
 * - `handleEditToggle`: Toggles the edit mode for the form.
 * - `handlePhotoChange`: Handles the change event for the profile picture input.
 *
 * @dependencies
 * - `react`
 * - `react-i18next`
 * - `zustand`
 * - `react-router-dom`
 * - `react-hook-form`
 * - `zod`
 * - `some-avatar-library`
 * - `some-card-library`
 * - `some-form-library`
 * - `some-button-library`
 */
export const Profile = () => {
  const { t } = useTranslation('profile');
  const { logout, user } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: user?.email,
      password: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    console.log(data);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // make a file upload logic here and update the user photo :)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="relative flex flex-col items-center p-4 rounded-lg">
        <Avatar className="flex justify-center self-center w-full max-w-md h-full mb-5 relative">
          <AvatarImage
            className="border-on rounded-full w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64"
            src="src/assets/icons/profile_picture.jpg"
          />
          <label
            htmlFor="fileInput"
            className="absolute bottom-0 right-0 bg-transparent text-castled-btn-primary cursor-pointer"
          >
            <SquarePen />
          </label>
          <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </Avatar>
      </div>

      <Card className="w-full max-w-md p-4">
        <h1 className="text-primary text-4xl my-8 mx-14 text-center">{user?.username}</h1>
        <div className="my-4 mx-14">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
              <FormField
                control={form.control}
                name="email"
                disabled={!isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input autoComplete="email" placeholder={user?.email} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <>
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder={t('Current Password')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder={t('New Password')}
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
                            placeholder={t('Confirm New Password')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>

          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 text-white space-y-2 sm:space-y-0 sm:space-x-8">
            <Button
              type="button"
              className="w-full sm:w-24 h-12 bg-castled-gray hover:bg-castled-btn-orange flex flex-col items-center gap-0"
              onClick={handleEditToggle}
            >
              {isEditing ? <PencilOff /> : <Pencil />}
              {isEditing ? t('Cancel') : t('Modify')}
            </Button>

            {isEditing && (
              <Button
                type="button"
                className="w-full sm:w-24 h-12 bg-castled-gray hover:bg-castled-btn-orange flex flex-col items-center gap-0"
                onClick={form.handleSubmit(onSubmit)}
              >
                <Save />
                {t('Save')}
              </Button>
            )}

            {!isEditing && (
              <>
                <Button
                  type="button"
                  className="w-full sm:w-24 h-12 bg-castled-gray hover:bg-castled-btn-purple flex flex-col items-center gap-0"
                  onClick={handleLogout}
                >
                  <LogOut />
                  {t('Logout')}
                </Button>

                <Button
                  type="button"
                  className="w-full sm:w-24 h-12 bg-castled-gray hover:bg-castled-btn-red flex flex-col items-center gap-0"
                >
                  <Trash />
                  {t('Delete')}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
