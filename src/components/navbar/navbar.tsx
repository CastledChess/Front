import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { useAuthStore } from '@/store/auth.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Flag from 'react-flagkit';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button.tsx';
import { BrowserView, MobileView } from 'react-device-detect';
import { Menu } from 'lucide-react';
import { useTheme } from '@/components/theme-provider.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';

const documentation: { title: string; href: string; description: string }[] = [
  {
    title: 'documentation-dropdown.start.title',
    href: 'https://castled.app/docs',
    description: 'documentation-dropdown.start.description',
  },
  {
    title: 'documentation-dropdown.controls.title',
    href: 'https://castled.app/docs/analysis/controls',
    description: 'documentation-dropdown.controls.description',
  },
  {
    title: 'documentation-dropdown.database.title',
    href: 'https://castled.app/docs/analysis/database',
    description: 'documentation-dropdown.database.description',
  },
  {
    title: 'documentation-dropdown.evaluation.title',
    href: 'https://castled.app/docs/analysis/evaluation',
    description: 'documentation-dropdown.evaluation.description',
  },
];

export const Navbar = () => {
  const { user, logout } = useAuthStore((state) => state);
  const { t, i18n } = useTranslation('navbar');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="w-full h-12 px-4 gap-6 flex justify-between items-center border-b bg-background text-castled-gray">
      <Link to="/" className="h-full flex gap-2 font-bold items-center">
        <img src={theme === 'light' ? 'logo-light.svg' : '/logo.svg'} alt="Castled Logo" className="h-6" />
        Castled
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="flex gap-2">
          <BrowserView className="flex gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/" className="hover:no-underline">
                  {t('navbar.dashboard')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/start-analysis" className="hover:no-underline">
                  {t('navbar.analysis')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hover:no-underline hover:text-primary">
                {t('navbar.documentation')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {documentation.map((component) => {
                    const title = t(component.title);
                    const description = t(component.description);

                    return (
                      <ListItem className="hover:text-primary" key={component.href} title={title} href={component.href}>
                        {description}
                      </ListItem>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {!user && (
              <>
                <NavigationMenuItem>
                  {location.pathname === '/login' ? (
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to="/register" className="hover:no-underline">
                        {t('navbar.register')}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to="/login" className="hover:no-underline">
                        {t('navbar.login')}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              </>
            )}
          </BrowserView>

          <DropdownMenu>
            <DropdownMenuTrigger>
              {user && (
                <BrowserView>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary-bg hover:text-primary">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </BrowserView>
              )}

              <MobileView>
                <Menu />
              </MobileView>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user && (
                <>
                  <MobileView>
                    <Link to="/">
                      <DropdownMenuItem className="focus:text-primary">{t('navbar.dashboard')}</DropdownMenuItem>
                    </Link>
                    <Link to="/start-analysis">
                      <DropdownMenuItem className="focus:text-primary">{t('navbar.analysis')}</DropdownMenuItem>
                    </Link>
                  </MobileView>
                  {/*<Link to="/profile">*/}
                  {/*  <DropdownMenuItem className="focus:text-primary">*/}
                  {/*    {t('account-dropdown.profile')}*/}
                  {/*  </DropdownMenuItem>*/}
                  {/*</Link>*/}
                  <Link to="/theme">
                    <DropdownMenuItem className="focus:text-primary">{t('account-dropdown.theme')}</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="focus:text-primary">{t('account-dropdown.support')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="focus:text-primary" onClick={handleLogout}>
                    {t('account-dropdown.logout')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuGroup className="flex p-1 gap-1">
                <Button variant="ghost" className="w-full" onClick={() => changeLanguage('fr')}>
                  <Flag country="FR" role="button" size={18} /> FR
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => changeLanguage('en')}>
                  <Flag country="GB" role="button" size={18} /> UK
                </Button>
              </DropdownMenuGroup>
              <DropdownMenuGroup className="flex p-2 justify-between items-center">
                <Label>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Label>
                <Switch
                  defaultChecked={theme === 'light'}
                  onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            to={href!}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';
