import { useMemo, type FC } from 'react';
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
import { useTranslation } from '@/i18n/useTranslation';
import { useSignin } from '../service/AuthService.hooks';

type SigninFormData = {
  email: string;
  password: string;
};

type InlineSigninFormProps = {
  onSuccess: () => void;
};

/**
 * Formulário de login embutido, usado quando uma página que não pode
 * navegar para `/login` (perderia estado da URL, como `?request_id=`)
 * precisa exigir autenticação sem sair da rota atual.
 */
export const InlineSigninForm: FC<InlineSigninFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation('auth');
  const { signin, isSigninLoading, signinError } = useSignin();

  const signinSchema = useMemo(
    () =>
      z.object({
        email: z
          .email(t('validation.emailInvalid'))
          .min(1, t('validation.emailRequired')),
        password: z.string().min(8, t('validation.passwordMin')),
      }),
    [t]
  );

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = (data: SigninFormData): void => {
    signin(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inlineSigninForm.emailLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder={t('inlineSigninForm.emailPlaceholder')}
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
              <FormLabel>{t('inlineSigninForm.passwordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder={t('inlineSigninForm.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {signinError && (
          <Alert
            role='alert'
            variant='destructive'
            message={
              signinError instanceof Error
                ? signinError.message
                : t('inlineSigninForm.genericError')
            }
          />
        )}

        <Button
          type='submit'
          size='lg'
          className='w-full'
          isLoading={isSigninLoading}
        >
          {t('inlineSigninForm.submitButton')}
        </Button>
      </form>
    </Form>
  );
};
