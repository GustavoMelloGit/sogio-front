import { useMemo, type FC } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useChangePassword } from '@/modules/auth/service/AuthService.hooks';

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordView: FC = () => {
  const { t } = useTranslation('auth');
  const { changePassword, isChangePasswordLoading } = useChangePassword();

  const changePasswordSchema = useMemo(
    () =>
      z
        .object({
          currentPassword: z
            .string()
            .min(1, t('validation.currentPasswordRequired')),
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

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordFormData): void => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          form.reset();
          // Ancoragem de foco pós-reset: complementa o toast (que não move o
          // foco), dando um ponto de referência para quem usa leitor de tela.
          form.setFocus('currentPassword');
          toast.success(t('changePassword.successToast'));
        },
        onError: error => {
          if (isAxiosError(error) && error.response?.status === 401) {
            form.setError('currentPassword', {
              message: t('changePassword.currentPasswordIncorrect'),
            });
            return;
          }
          toast.error(
            error instanceof Error
              ? error.message
              : t('changePassword.genericError')
          );
        },
      }
    );
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('changePassword.breadcrumbHome'), to: ROUTES.home },
          { label: t('changePassword.breadcrumbSecurity') },
        ]}
      />
      <Page.Header
        title={t('changePassword.pageTitle')}
        description={t('changePassword.pageDescription')}
      />
      <Page.Content>
        <Card className='max-w-lg'>
          <CardHeader>
            <h2 className='leading-none font-semibold'>
              {t('changePassword.cardTitle')}
            </h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='currentPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('changePassword.currentPasswordLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            disabled={isChangePasswordLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <Link
                          to={ROUTES.forgotPassword}
                          className='inline-block text-sm text-blue-600 hover:text-blue-500'
                        >
                          {t('changePassword.forgotCurrentPasswordLink')}
                        </Link>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('changePassword.newPasswordLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            disabled={isChangePasswordLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('changePassword.passwordRequirementHint')}
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
                          {t('changePassword.confirmPasswordLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            disabled={isChangePasswordLoading}
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
                  className='w-full md:w-auto'
                  isLoading={isChangePasswordLoading}
                >
                  {t('changePassword.submitButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Page.Content>
    </Page.Container>
  );
};

export default ChangePasswordView;
