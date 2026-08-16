import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
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
import { Alert } from '@/components/Alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useRequestPasswordReset } from '@/modules/auth/service/AuthService.hooks';

type ForgotPasswordFormData = {
  email: string;
};

/**
 * Foca o `<h1>` do novo estado a cada troca de conteúdo do Card, exceto na
 * primeira renderização (a página já chega focada pelo navegador).
 */
const useFocusHeadingOnChange = (dependency: unknown) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [dependency]);

  return headingRef;
};

const ForgotPasswordView: FC = () => {
  const { t } = useTranslation('auth');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const headingRef = useFocusHeadingOnChange(isSubmitted);

  const {
    requestPasswordReset,
    isRequestPasswordResetLoading,
    requestPasswordResetError,
  } = useRequestPasswordReset();

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z
          .email(t('validation.emailInvalid'))
          .min(1, t('validation.emailRequired')),
      }),
    [t]
  );

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData): void => {
    requestPasswordReset(data, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  const handleUseAnotherEmail = (): void => {
    form.reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <main className='min-h-dvh flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
        <Card className='max-w-sm w-full'>
          <CardHeader>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className='text-lg leading-none font-semibold outline-none rounded-xs focus-visible:ring-ring/50 focus-visible:ring-[3px]'
            >
              {t('forgotPassword.successTitle')}
            </h1>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div role='status' className='space-y-2'>
              <p className='text-sm'>{t('forgotPassword.successMessage')}</p>
              <p className='text-sm text-muted-foreground'>
                {t('forgotPassword.successHint')}
              </p>
            </div>

            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleUseAnotherEmail}
            >
              {t('forgotPassword.useAnotherEmailButton')}
            </Button>

            <div className='text-center'>
              <Link
                to={ROUTES.login}
                className='text-sm text-blue-600 hover:text-blue-500'
              >
                {t('forgotPassword.backToLoginLink')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className='min-h-dvh flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='max-w-sm w-full'>
        <CardHeader>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className='text-lg leading-none font-semibold outline-none rounded-xs focus-visible:ring-ring/50 focus-visible:ring-[3px]'
          >
            {t('forgotPassword.title')}
          </h1>
          <CardDescription>{t('forgotPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forgotPassword.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder={t('forgotPassword.emailPlaceholder')}
                        disabled={isRequestPasswordResetLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requestPasswordResetError && (
                <Alert
                  role='alert'
                  variant='destructive'
                  message={
                    requestPasswordResetError instanceof Error
                      ? requestPasswordResetError.message
                      : t('forgotPassword.genericError')
                  }
                />
              )}

              <Button
                type='submit'
                className='w-full'
                isLoading={isRequestPasswordResetLoading}
              >
                {t('forgotPassword.submitButton')}
              </Button>

              <div className='text-center'>
                <Link
                  to={ROUTES.login}
                  className='text-sm text-blue-600 hover:text-blue-500'
                >
                  {t('forgotPassword.backToLoginLink')}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPasswordView;
