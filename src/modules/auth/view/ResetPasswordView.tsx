import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert } from '@/components/Alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useResetPassword } from '@/modules/auth/service/AuthService.hooks';

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

type SubmitState = 'form' | 'error' | 'success';

const PageShell: FC<PropsWithChildren> = ({ children }) => (
  <main className='min-h-dvh flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
    <Card className='max-w-sm w-full'>{children}</Card>
  </main>
);

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

const ResetPasswordView: FC = () => {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [submitState, setSubmitState] = useState<SubmitState>('form');
  const headingRef = useFocusHeadingOnChange(submitState);

  const { resetPassword, isResetPasswordLoading } = useResetPassword();

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          newPassword: z
            .string()
            .min(8, t('validation.passwordMin'))
            .max(128, t('validation.passwordMax')),
          confirmPassword: z
            .string()
            .min(1, t('validation.confirmPasswordRequired')),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: t('validation.passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  );

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordFormData): void => {
    if (!token) return;
    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => setSubmitState('success'),
        onError: () => setSubmitState('error'),
      }
    );
  };

  // (a) Token ausente/vazio na URL: nunca renderiza o formulário.
  if (!token) {
    return (
      <PageShell>
        <CardHeader>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className='text-lg leading-none font-semibold outline-none'
          >
            {t('resetPassword.invalidLinkTitle')}
          </h1>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Alert
            role='alert'
            variant='destructive'
            message={t('resetPassword.invalidLinkMessage')}
          />

          <Link
            to={ROUTES.forgotPassword}
            className={buttonVariants({ className: 'w-full' })}
          >
            {t('resetPassword.requestNewLinkButton')}
          </Link>

          <div className='text-center'>
            <Link
              to={ROUTES.login}
              className='text-sm text-blue-600 hover:text-blue-500'
            >
              {t('resetPassword.backToLoginLink')}
            </Link>
          </div>
        </CardContent>
      </PageShell>
    );
  }

  // (c) Erro tardio no submit (401): a senha não foi alterada.
  if (submitState === 'error') {
    return (
      <PageShell>
        <CardHeader>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className='text-lg leading-none font-semibold outline-none'
          >
            {t('resetPassword.errorTitle')}
          </h1>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Alert
            role='alert'
            variant='destructive'
            message={t('resetPassword.errorMessage')}
          />

          <Link
            to={ROUTES.forgotPassword}
            className={buttonVariants({ className: 'w-full' })}
          >
            {t('resetPassword.requestNewLinkButton')}
          </Link>

          <div className='text-center'>
            <Link
              to={ROUTES.login}
              className='text-sm text-blue-600 hover:text-blue-500'
            >
              {t('resetPassword.backToLoginLink')}
            </Link>
          </div>
        </CardContent>
      </PageShell>
    );
  }

  // (d) Sucesso.
  if (submitState === 'success') {
    return (
      <PageShell>
        <CardHeader>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className='text-lg leading-none font-semibold outline-none'
          >
            {t('resetPassword.successTitle')}
          </h1>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p role='status' className='text-sm'>
            {t('resetPassword.successMessage')}
          </p>

          <Link
            to={ROUTES.login}
            className={buttonVariants({ className: 'w-full' })}
          >
            {t('resetPassword.goToLoginButton')}
          </Link>

          <p className='text-xs text-muted-foreground'>
            {t('resetPassword.connectedAppsHint')}{' '}
            <Link to={ROUTES.connectedApps} className='underline'>
              {t('resetPassword.connectedAppsLink')}
            </Link>
          </p>
        </CardContent>
      </PageShell>
    );
  }

  // (b) Formulário normal.
  return (
    <PageShell>
      <CardHeader>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className='text-lg leading-none font-semibold outline-none'
        >
          {t('resetPassword.title')}
        </h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('resetPassword.newPasswordLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        disabled={isResetPasswordLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('resetPassword.passwordRequirementHint')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('resetPassword.confirmPasswordLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        disabled={isResetPasswordLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              isLoading={isResetPasswordLoading}
            >
              {t('resetPassword.submitButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </PageShell>
  );
};

export default ResetPasswordView;
