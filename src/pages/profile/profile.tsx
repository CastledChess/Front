import { useState } from 'react';
import { useAuthStore } from '@/store/auth.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, LogOut, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema } from '@/schema/profile.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';

export const Profile = () => {
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // make a file upload logic here and update the user photo :)
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4 sm:p-8">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <div className="text-center mb-8 font-bold text-[24px] sm:text-[36px] text-[#EC9E67] border-on">
          <label className="cursor-pointer">
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                className="border-on rounded-full h-32 w-32 sm:h-52 sm:w-52 object-cover"
                src={isEditing ? 'src/assets/icons/react.svg' : 'src/assets/icons/profile_picture.jpg'}
              />
            </Avatar>
            <input type="file" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>
        <div className="p-4 sm:p-8 rounded-lg shadow-lg w-full bg-[#343639]">
          <div className="w-full mb-8 space-y-3">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-[#494A4C] h-10 sm:h-12 rounded-[10px] border-none font-bold text-[16px] sm:text-[20px]"
                            autoComplete="email"
                            placeholder="Email"
                            {...field}
                          />
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
                                className="bg-[#494A4C] h-10 sm:h-12 rounded-[10px] border-none font-bold text-[16px] sm:text-[20px]"
                                autoComplete="current-password"
                                placeholder="Current Password"
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
                                className="bg-[#494A4C] h-10 sm:h-12 rounded-[10px] border-none font-bold text-[16px] sm:text-[20px]"
                                autoComplete="new-password"
                                placeholder="New Password"
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
                                className="bg-[#494A4C] h-10 sm:h-12 rounded-[10px] border-none font-bold text-[16px] sm:text-[20px]"
                                autoComplete="new-password"
                                placeholder="Confirm New Password"
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
            </div>

            {isEditing && (
              <Button
                type="button"
                className="ml-auto bg-[#EC9E67] hover:bg-[#EC9E67]/90"
                onClick={form.handleSubmit(onSubmit)}
              >
                Save Changes
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-8 gap-6 items-center">
            <Button
              type="button"
              className="w-full sm:w-auto bg-[#EC9E67] hover:bg-[#EC9E67]/90 text-[10px]"
              onClick={handleEditToggle}
            >
              <Pencil></Pencil>
              {isEditing ? 'Cancel' : 'Modify Account'}
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto bg-[#EC9E67] hover:bg-[#EC9E67]/90 text-[10px]"
              onClick={handleLogout}
            >
              <LogOut></LogOut>
              Logout
            </Button>
            <Button type="button" className="w-full sm:w-auto bg-[#EC9E67] hover:bg-[#EC9E67]/90 text-[10px]">
              <Trash></Trash>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
