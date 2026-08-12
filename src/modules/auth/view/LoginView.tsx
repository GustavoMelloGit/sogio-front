import React, { useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSignin } from '@/modules/auth/service/AuthService.hooks';
import { Alert } from '@/components/Alert';
import { ROUTES } from '@/routes/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';

type LoginFormData = {
  email: string;
  password: string;
};

/**
 * Página de login do usuário
 * Permite que usuários existentes façam login na aplicação
 */
const LoginView: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, isSigninLoading, signinError } = useSignin();

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .email(t('validation.emailInvalid'))
          .min(1, t('validation.emailRequired')),
        password: z.string().min(8, t('validation.passwordMin')),
      }),
    [t]
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Manipula o envio do formulário
   */
  const onSubmit = (data: LoginFormData): void => {
    signin(data, {
      onSuccess: () => {
        const from = location.state?.from?.pathname || ROUTES.home;
        navigate(from, { replace: true });
      },
      onError: error => {
        console.error(t('login.consoleErrorPrefix'), error);
      },
    });
  };

  return (
    <main className='min-h-dvh flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='max-w-sm w-full'>
        <CardHeader>
          <CardTitle>{t('login.title')}</CardTitle>
          <CardDescription>{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login.emailLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder={t('login.emailPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login.passwordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={t('login.passwordPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {signinError && (
                <Alert
                  variant='destructive'
                  message={
                    signinError instanceof Error
                      ? signinError.message
                      : t('login.genericError')
                  }
                />
              )}

              <div>
                <Button
                  type='submit'
                  className='w-full'
                  isLoading={isSigninLoading}
                >
                  {t('login.submitButton')}
                </Button>
              </div>

              <div className='text-center'>
                <span className='text-sm text-muted-foreground'>
                  {t('login.noAccountText')}{' '}
                  <Link
                    to='/signup'
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    {t('login.signupLink')}
                  </Link>
                </span>
              </div>

              <div className='text-right'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-blue-600 hover:text-blue-500'
                >
                  {t('login.forgotPasswordLink')}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginView;
