import { useState } from 'react';
import { useAuthStore } from '@/store/auth.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, PencilOff, LogOut, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema } from '@/schema/profile.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';

export const Profile = () => {
  const { t } = useTranslation('profile');
  const { logout } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: '',
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

  // const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // make a file upload logic here and update the user photo :)
  //   }
  // };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="relative flex flex-col items-center bg-castled-primary p-4 rounded-lg">
        <Avatar className="flex justify-center self-center w-full max-w-md h-full mb-5">
          <AvatarImage
            className="border-on rounded-full w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64"
            src={isEditing ? 'src/assets/icons/react.svg' : 'src/assets/icons/profile_picture.jpg'}
          />
        </Avatar>
        <Pencil className="absolute bottom-0 right-0 bg-transparent text-castled-btn-primary -translate-y-6" />
      </div>

      <Card className="w-full max-w-md p-4">
        <h1 className="text-castled-accent text-4xl my-8 mx-14 text-center">Username</h1>
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
                      <Input autoComplete="email" placeholder={t('email')} {...field} />
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

            {isEditing && (
              <Button
                type="button"
                className="w-full sm:w-auto flex justify-center mt-4 bg-castled-gray hover:bg-castled-btn-orange"
                onClick={form.handleSubmit(onSubmit)}
              >
                {t('Save')}
              </Button>
            )}
          </Form>

          <div className="flex flex-col sm:flex-row justify-between mt-8 text-white">
            <Button
              type="button"
              className="w-full sm:w-auto bg-castled-gray hover:bg-castled-btn-orange flex flex-col items-center gap-0"
              onClick={handleEditToggle}
            >
              {isEditing ? <PencilOff /> : <Pencil />}
              {isEditing ? t('Cancel') : t('Modify')}
            </Button>

            <Button
              type="button"
              className="w-full sm:w-auto bg-castled-gray hover:bg-castled-btn-purple flex flex-col items-center gap-0"
              onClick={handleLogout}
            >
              <LogOut />
              {t('Logout')}
            </Button>

            <Button
              type="button"
              className="w-full sm:w-auto bg-castled-gray hover:bg-castled-btn-red flex flex-col items-center gap-0"
            >
              <Trash />
              {t('Delete')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
