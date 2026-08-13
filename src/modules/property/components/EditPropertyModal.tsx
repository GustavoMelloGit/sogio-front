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
import { Alert } from '@/components/Alert';
import { addressSchema, type Property } from '../types/Property';
import { useUpdateProperty } from '../service/PropertyService.hooks';
import { queryClient } from '@/lib/query-client';
import { Edit } from 'lucide-react';
import z from 'zod';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslateFn } from '@/i18n/useTranslation';

const createFormSchema = (t: TranslateFn) =>
  z.object({
    name: z.string().min(1, t('editPropertyModal.validation.nameRequired')),
    capacity: z.string().refine(value => Number(value) >= 1, {
      message: t('editPropertyModal.validation.capacityMin'),
    }),
    address: addressSchema,
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

type Props = {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
};

const EditPropertyModal: FC<Props> = ({ property, isOpen, onClose }) => {
  const { t } = useTranslation(['property']);
  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useUpdateProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', property.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property.name,
      capacity: property.capacity.toString(),
      address: property.address,
    },
  });

  const handleSubmit = (data: FormData): void => {
    mutate({
      propertyId: property.id,
      data: {
        name: data.name,
        capacity: Number(data.capacity),
        address: data.address,
      },
    });
  };

  const handleClose = (): void => {
    form.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5' />
            {t('editPropertyModal.title')}
          </SheetTitle>
          <SheetDescription>
            {t('editPropertyModal.description')}
          </SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {error && (
            <Alert
              variant='destructive'
              title={t('editPropertyModal.errorTitle')}
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editPropertyModal.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('editPropertyModal.namePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('editPropertyModal.capacityLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        step={1}
                        inputMode='numeric'
                        placeholder={t('editPropertyModal.capacityPlaceholder')}
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
                  {t('editPropertyModal.cancel')}
                </Button>
                <Button
                  type='submit'
                  className='flex-1'
                  isLoading={isSubmitting}
                >
                  {t('editPropertyModal.save')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditPropertyModal;
