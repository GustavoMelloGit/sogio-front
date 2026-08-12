import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useTranslation } from '@/i18n/useTranslation';

const stayFormSchema = z.object({
  check_in: z.string(),
  check_out: z.string(),
  guests: z.int().positive(),
  price: z.number().positive(),
});

export type StayFormData = z.infer<typeof stayFormSchema>;

type Props = {
  defaultValues: StayFormData;
  onSubmit: (data: StayFormData) => Promise<void>;
  submitButtonText: string;
};

export const StayForm: FC<Props> = ({
  defaultValues,
  onSubmit,
  submitButtonText,
}) => {
  const { t } = useTranslation(['stay', 'common']);
  const form = useForm<StayFormData>({
    resolver: zodResolver(stayFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: StayFormData): Promise<void> => {
    return onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='check_in'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('stayForm.checkInLabel')}</FormLabel>
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
              <FormLabel>{t('stayForm.checkOutLabel')}</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='guests'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('stayForm.guestsLabel')}</FormLabel>
              <FormControl>
                <NumberInput
                  decimalPlaces={0}
                  inputMode='numeric'
                  placeholder={t('stayForm.guestsPlaceholder')}
                  {...field}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('stayForm.priceLabel')}</FormLabel>
              <FormControl>
                <NumberInput
                  decimalPlaces={2}
                  inputMode='decimal'
                  placeholder={t('stayForm.pricePlaceholder')}
                  {...field}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full'
          isLoading={form.formState.isSubmitting}
        >
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};
