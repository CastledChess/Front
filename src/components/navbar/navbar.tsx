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
import logo from '@/assets/logo/castled-white-logo.png';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';

const documentation: { title: string; href: string; description: string }[] = [
  {
    title: 'documentation-dropdown.start.title',
    href: '/docs/getting-started',
    description: 'documentation-dropdown.start.description',
  },
  {
    title: 'documentation-dropdown.engine.title',
    href: '/docs/engines',
    description: 'documentation-dropdown.engine.description',
  },
  {
    title: 'documentation-dropdown.variations.title',
    href: '/docs/variations',
    description: 'documentation-dropdown.variations.description',
  },
  {
    title: 'documentation-dropdown.evaluation.title',
    href: '/docs/evaluation',
    description: 'documentation-dropdown.evaluation.description',
  },
];

export const Navbar = () => {
  const { user, logout } = useAuthStore((state) => state);
  const { t, i18n } = useTranslation('navbar');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="w-full h-16 px-6 gap-6 flex justify-between items-center shadow-lg bg-castled-secondary text-castled-gray">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Castled Logo" className="h-30 w-30" />
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {location.pathname === '/' ? (
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/dashboard" className="hover:no-underline  text-castled-accent">
                  {t('navbar.dashboard')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/dashboard" className="hover:no-underline hover:text-castled-accent">
                  {t('navbar.dashboard')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              {location.pathname === '/start-analysis' ? (
                <Link to="/start-analysis" className="hover:no-underline text-castled-accent">
                  {t('navbar.analysis')}
                </Link>
              ) : (
                <Link to="/start-analysis" className="hover:no-underline  hover:text-castled-accent">
                  {t('navbar.analysis')}
                </Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:no-underline hover:text-castled-accent">
              {t('navbar.documentation')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {documentation.map((component) => {
                  const title = t(component.title);
                  const description = t(component.description);

                  return (
                    <ListItem
                      className="hover:text-castled-accent"
                      key={component.href}
                      title={title}
                      href={component.href}
                    >
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

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback className="bg-castled-secondary hover:text-castled-accent">
                    {user.username.toUpperCase()[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem className="focus:text-castled-accent ">
                  <Link to="/profile">{t('account-dropdown.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:text-castled-accent ">
                  <Link to="/theme">{t('account-dropdown.theme')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:text-castled-accent">
                  {t('account-dropdown.support')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:text-castled-accent" onClick={handleLogout}>
                  {t('account-dropdown.logout')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="flex flex-row gap-6 justify-center mx-3">
                  <Flag country="FR" role="button" size={18} onClick={() => changeLanguage('fr')} />
                  <Flag country="GB" role="button" size={18} onClick={() => changeLanguage('en')} />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
