import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { withMask } from 'use-mask-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TenantCombobox from './TenantCombobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/Alert';
import z from 'zod';
import { WandSparkles } from 'lucide-react';
import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import { Phone } from '@/lib/phone';
import { NumberInput } from '@/components/ui/number-input';

export const bookStayFormSchema = z.object({
  check_in: z.string().min(1, 'Data e hora de check-in é obrigatória'),
  check_out: z.string().min(1, 'Data e hora de check-out é obrigatória'),
  entrance_code: z
    .string()
    .min(
      ENTRANCE_CODE_LENGTH,
      `O código de entrada deve ter pelo menos ${ENTRANCE_CODE_LENGTH} dígitos`
    ),
  tenant_name: z.string().min(1, 'Nome do hóspede é obrigatório'),
  tenant_phone: z.string().refine(value => Phone.isValid(value), {
    message: 'Telefone do hóspede é inválido',
  }),
  tenant_sex: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Sexo do hóspede é obrigatório',
  }),
  guests: z.int().positive().min(1, 'Número de hóspedes deve ser pelo menos 1'),
  price: z.number().positive().min(0, 'Preço da estadia é obrigatório'),
});

export type BookStayFormData = z.infer<typeof bookStayFormSchema>;

type Props = {
  defaultValues: BookStayFormData;
  onSubmit: (data: BookStayFormData) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  submitButtonText: string;
};

const generateEntranceCode = (): string => {
  const min = Math.pow(10, ENTRANCE_CODE_LENGTH - 1);
  const max = Math.pow(10, ENTRANCE_CODE_LENGTH) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const BookStayForm: FC<Props> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  errorMessage,
  submitButtonText,
}) => {
  const form = useForm<BookStayFormData>({
    resolver: zodResolver(bookStayFormSchema),
    defaultValues,
  });

  return (
    <>
      {errorMessage && (
        <Alert
          variant='destructive'
          title='Erro'
          message={errorMessage}
          className='mb-4'
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='check_in'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in</FormLabel>
                <FormControl>
                  <Input type='datetime-local' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='check_out'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out</FormLabel>
                <FormControl>
                  <Input type='datetime-local' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tenant_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Hóspede</FormLabel>
                <FormControl>
                  <TenantCombobox
                    value={field.value}
                    onInputChange={field.onChange}
                    onTenantSelect={tenant => {
                      form.setValue('tenant_name', tenant.name);
                      form.setValue(
                        'tenant_phone',
                        Phone.toHumanReadable(tenant.phone)
                      );
                      form.setValue('tenant_sex', tenant.sex);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tenant_phone'
            render={({ field: { onBlur, ...field } }) => (
              <FormItem>
                <FormLabel>Telefone do Hóspede</FormLabel>
                <FormControl ref={withMask(Phone.MASK)}>
                  <Input
                    placeholder='Digite o telefone do hóspede'
                    inputMode='numeric'
                    {...field}
                    onBlur={() => {
                      onBlur();
                      const digits = field.value.replace(/\D/g, '');
                      if (Phone.isValid(digits)) {
                        form.setValue(
                          'entrance_code',
                          digits.slice(-ENTRANCE_CODE_LENGTH)
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='entrance_code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Entrada</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-2'>
                    <Input
                      placeholder='Digite o código de entrada'
                      inputMode='numeric'
                      maxLength={ENTRANCE_CODE_LENGTH}
                      minLength={ENTRANCE_CODE_LENGTH}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      aria-label='Gerar código de entrada aleatório'
                      onClick={() => field.onChange(generateEntranceCode())}
                    >
                      <WandSparkles />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tenant_sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo do Hóspede</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione o sexo' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='MALE'>Masculino</SelectItem>
                    <SelectItem value='FEMALE'>Feminino</SelectItem>
                    <SelectItem value='OTHER'>Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='guests'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Número de Hóspedes</FormLabel>
                <FormControl>
                  <NumberInput
                    decimalPlaces={0}
                    placeholder='Digite o número de hóspedes'
                    {...field}
                    onValueChange={onChange}
                    value={value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Preço da Estadia</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    decimalPlaces={2}
                    placeholder='Digite o preço da estadia'
                    inputMode='decimal'
                    {...field}
                    onValueChange={onChange}
                    value={value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' isLoading={isSubmitting}>
            {submitButtonText}
          </Button>
        </form>
      </Form>
    </>
  );
};
