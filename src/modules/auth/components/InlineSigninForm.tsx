import type { FC } from 'react';
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
import { useSignin } from '../service/AuthService.hooks';

const signinSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type SigninFormData = z.infer<typeof signinSchema>;

type InlineSigninFormProps = {
  onSuccess: () => void;
};

/**
 * Formulário de login embutido, usado quando uma página que não pode
 * navegar para `/login` (perderia estado da URL, como `?request_id=`)
 * precisa exigir autenticação sem sair da rota atual.
 */
export const InlineSigninForm: FC<InlineSigninFormProps> = ({ onSuccess }) => {
  const { signin, isSigninLoading, signinError } = useSignin();

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='seu@email.com' {...field} />
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Sua senha' {...field} />
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
                : 'Erro ao entrar. Verifique suas credenciais.'
            }
          />
        )}

        <Button
          type='submit'
          size='lg'
          className='w-full'
          isLoading={isSigninLoading}
        >
          Entrar
        </Button>
      </form>
    </Form>
  );
};
