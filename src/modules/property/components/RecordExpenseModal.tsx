import { type FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Alert } from '@/components/Alert';
import { useRecordExpense } from '@/modules/finance/service/FinanceService.hooks';
import { queryClient } from '@/lib/query-client';
import { Currency } from '@/lib/currency';
import { Minus } from 'lucide-react';
import z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslateFn } from '@/i18n/useTranslation';

const expenseCategoryValues = [
  'MANUTENÇÃO',
  'ESTADIA',
  'AQUISIÇÕES',
  'FINANCIAMENTO',
  'GASTOS_FIXOS',
  'OUTROS',
] as const;

const getExpenseCategories = (
  t: TranslateFn
): Array<{ value: string; label: string }> => [
  {
    value: 'MANUTENÇÃO',
    label: t('recordExpenseModal.categories.maintenance'),
  },
  { value: 'ESTADIA', label: t('recordExpenseModal.categories.stay') },
  {
    value: 'AQUISIÇÕES',
    label: t('recordExpenseModal.categories.acquisitions'),
  },
  {
    value: 'FINANCIAMENTO',
    label: t('recordExpenseModal.categories.financing'),
  },
  {
    value: 'GASTOS_FIXOS',
    label: t('recordExpenseModal.categories.fixedExpenses'),
  },
  { value: 'OUTROS', label: t('recordExpenseModal.categories.other') },
];

const createFormSchema = (t: TranslateFn) =>
  z.object({
    amount: z
      .number()
      .positive(t('recordExpenseModal.validation.amountPositive')),
    description: z.string().optional(),
    category: z.enum(expenseCategoryValues, {
      message: t('recordExpenseModal.validation.categoryRequired'),
    }),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const defaultValues: Partial<FormData> = {
  amount: 0,
  description: '',
};

type Props = {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const RecordExpenseModal: FC<Props> = ({
  propertyId,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['property']);
  const expenseCategories = useMemo(() => getExpenseCategories(t), [t]);
  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const { mutate, isLoading, error } = useRecordExpense({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['finance-movements', propertyId],
      });
      onClose();
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = (): void => {
    form.reset(defaultValues);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const handleSubmit = (data: FormData): void => {
    mutate({
      property_id: propertyId,
      amount: Currency.toCents(data.amount),
      description: data.description || null,
      category: data.category.toUpperCase(),
    });
    handleClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Minus className='h-5 w-5' />
            {t('recordExpenseModal.title')}
          </SheetTitle>
          <SheetDescription>
            {t('recordExpenseModal.description')}
          </SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {error && (
            <Alert
              variant='destructive'
              title={t('recordExpenseModal.errorTitle')}
              message={error.message}
              className='mb-4'
            />
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='amount'
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>{t('recordExpenseModal.amountLabel')}</FormLabel>
                    <FormControl>
                      <NumberInput
                        decimalPlaces={2}
                        inputMode='decimal'
                        placeholder={t('recordExpenseModal.amountPlaceholder')}
                        onValueChange={onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      {t('recordExpenseModal.categoryLabel')}
                    </FormLabel>
                    <Select onValueChange={onChange} defaultValue={value}>
                      <FormControl>
                        <SelectTrigger className='w-full' {...field}>
                          <SelectValue
                            placeholder={t(
                              'recordExpenseModal.categoryPlaceholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map(category => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('recordExpenseModal.descriptionLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'recordExpenseModal.descriptionPlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  className='flex-1'
                >
                  {t('recordExpenseModal.cancel')}
                </Button>
                <Button type='submit' isLoading={isLoading} className='flex-1'>
                  {t('recordExpenseModal.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
