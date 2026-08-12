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
import { useSignup } from '@/modules/auth/service/AuthService.hooks';
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

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * Página de cadastro de usuário
 * Permite que novos usuários se registrem na aplicação
 */
const SignupView: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isSignupLoading, signupError } = useSignup();

  const signupSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t('validation.nameMin')),
          email: z
            .email(t('validation.emailInvalid'))
            .min(1, t('validation.emailRequired')),
          password: z.string().min(8, t('validation.passwordMin')),
          confirmPassword: z
            .string()
            .min(1, t('validation.confirmPasswordRequired')),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: t('validation.passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  );

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Manipula o envio do formulário
   */
  const onSubmit = (data: SignupFormData): void => {
    // Remove confirmPassword antes de enviar
    const { confirmPassword: _confirmPassword, ...signupData } = data;

    signup(signupData, {
      onSuccess: () => {
        const from = location.state?.from?.pathname || ROUTES.home;
        navigate(from, { replace: true });
      },
      onError: error => {
        console.error(t('signup.consoleErrorPrefix'), error);
      },
    });
  };

  return (
    <main className='min-h-dvh flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='max-w-md w-full'>
        <CardHeader>
          <CardTitle>{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.nameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder={t('signup.namePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.emailLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder={t('signup.emailPlaceholder')}
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
                      <FormLabel>{t('signup.passwordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={t('signup.passwordPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('signup.confirmPasswordLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={t('signup.confirmPasswordPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {signupError && (
                <Alert
                  variant='destructive'
                  message={
                    signupError instanceof Error
                      ? signupError.message
                      : t('signup.genericError')
                  }
                />
              )}

              <div>
                <Button
                  type='submit'
                  className='w-full'
                  isLoading={isSignupLoading}
                >
                  {t('signup.submitButton')}
                </Button>
              </div>

              <div className='text-center'>
                <span className='text-sm text-muted-foreground'>
                  {t('signup.alreadyHaveAccountText')}{' '}
                  <Link
                    to='/login'
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    {t('signup.loginLink')}
                  </Link>
                </span>
              </div>

              <div className='text-xs text-muted-foreground'>
                {t('signup.termsText')}{' '}
                <Link to='/terms' className='text-blue-600 hover:text-blue-500'>
                  {t('signup.termsLink')}
                </Link>{' '}
                {t('signup.andConnector')}{' '}
                <Link
                  to='/privacy'
                  className='text-blue-600 hover:text-blue-500'
                >
                  {t('signup.privacyLink')}
                </Link>
                .
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignupView;
