import { type FC, useMemo } from 'react';
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
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslateFn } from '@/i18n/useTranslation';

const createBookStayFormSchema = (t: TranslateFn) =>
  z.object({
    check_in: z.string().min(1, t('bookStayForm.validation.checkInRequired')),
    check_out: z.string().min(1, t('bookStayForm.validation.checkOutRequired')),
    entrance_code: z.string().min(
      ENTRANCE_CODE_LENGTH,
      t('bookStayForm.validation.entranceCodeMin', {
        length: ENTRANCE_CODE_LENGTH,
      })
    ),
    tenant_name: z
      .string()
      .min(1, t('bookStayForm.validation.tenantNameRequired')),
    tenant_phone: z.string().refine(value => Phone.isValid(value), {
      message: t('bookStayForm.validation.tenantPhoneInvalid'),
    }),
    tenant_sex: z.enum(['MALE', 'FEMALE', 'OTHER'], {
      message: t('bookStayForm.validation.tenantSexRequired'),
    }),
    guests: z.int().positive().min(1, t('bookStayForm.validation.guestsMin')),
    price: z
      .number()
      .positive()
      .min(0, t('bookStayForm.validation.priceRequired')),
  });

export type BookStayFormData = z.infer<
  ReturnType<typeof createBookStayFormSchema>
>;

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
  const { t } = useTranslation(['property']);
  const bookStayFormSchema = useMemo(() => createBookStayFormSchema(t), [t]);

  const form = useForm<BookStayFormData>({
    resolver: zodResolver(bookStayFormSchema),
    defaultValues,
  });

  return (
    <>
      {errorMessage && (
        <Alert
          variant='destructive'
          title={t('bookStayForm.errorTitle')}
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
                <FormLabel>{t('bookStayForm.checkInLabel')}</FormLabel>
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
                <FormLabel>{t('bookStayForm.checkOutLabel')}</FormLabel>
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
                <FormLabel>{t('bookStayForm.tenantNameLabel')}</FormLabel>
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
                <FormLabel>{t('bookStayForm.tenantPhoneLabel')}</FormLabel>
                <FormControl ref={withMask(Phone.MASK)}>
                  <Input
                    placeholder={t('bookStayForm.tenantPhonePlaceholder')}
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
                <FormLabel>{t('bookStayForm.entranceCodeLabel')}</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-2'>
                    <Input
                      placeholder={t('bookStayForm.entranceCodePlaceholder')}
                      inputMode='numeric'
                      maxLength={ENTRANCE_CODE_LENGTH}
                      minLength={ENTRANCE_CODE_LENGTH}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      aria-label={t('bookStayForm.generateCodeAriaLabel')}
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
                <FormLabel>{t('bookStayForm.tenantSexLabel')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t('bookStayForm.tenantSexPlaceholder')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='MALE'>
                      {t('bookStayForm.sexOptions.male')}
                    </SelectItem>
                    <SelectItem value='FEMALE'>
                      {t('bookStayForm.sexOptions.female')}
                    </SelectItem>
                    <SelectItem value='OTHER'>
                      {t('bookStayForm.sexOptions.other')}
                    </SelectItem>
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
                <FormLabel>{t('bookStayForm.guestsLabel')}</FormLabel>
                <FormControl>
                  <NumberInput
                    decimalPlaces={0}
                    placeholder={t('bookStayForm.guestsPlaceholder')}
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
                <FormLabel>{t('bookStayForm.priceLabel')}</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    decimalPlaces={2}
                    placeholder={t('bookStayForm.pricePlaceholder')}
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
