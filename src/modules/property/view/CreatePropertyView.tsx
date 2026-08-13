import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslateFn } from '@/i18n/useTranslation';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
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
import { ROUTES } from '@/routes/routes';
import { createPropertyRequestSchema } from '../types/Property';
import { useCreateProperty } from '../service/PropertyService.hooks';
import { queryClient } from '@/lib/query-client';

const createFormSchema = (t: TranslateFn) =>
  createPropertyRequestSchema.extend({
    capacity: z.string().refine(v => Number(v) >= 1, {
      message: t('createProperty.validation.capacityMin'),
    }),
    images: z
      .array(
        z.object({
          url: z
            .string()
            .min(1, t('createProperty.validation.imageUrlRequired')),
        })
      )
      .min(1, t('createProperty.validation.imagesMinOne')),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreatePropertyView: FC = () => {
  const { t } = useTranslation(['property']);
  const navigate = useNavigate();

  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const { mutate, isLoading, error } = useCreateProperty({
    onSuccess: property => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate(ROUTES.property(property.id));
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      capacity: '1',
      images: [{ url: '' }],
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'Brasil',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const handleSubmit = (data: FormData): void => {
    mutate({
      name: data.name,
      capacity: Number(data.capacity),
      images: data.images.map(i => i.url),
      address: data.address,
    });
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('propertyList.title'), to: ROUTES.home },
          { label: t('createProperty.breadcrumb') },
        ]}
      />
      <Page.Header
        title={t('createProperty.title')}
        description={t('createProperty.description')}
      />
      <Page.Content>
        <div className='max-w-2xl'>
          {error && (
            <Alert
              variant='destructive'
              title={t('createProperty.errorTitle')}
              message={error.message}
              className='mb-4'
            />
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>
                  {t('createProperty.basicInfoTitle')}
                </h2>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createProperty.nameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('createProperty.namePlaceholder')}
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
                      <FormLabel>{t('createProperty.capacityLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          step={1}
                          inputMode='numeric'
                          placeholder={t('createProperty.capacityPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>
                  {t('createProperty.imagesTitle')}
                </h2>

                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}.url`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>
                          {t('createProperty.imageUrlLabel', {
                            index: index + 1,
                          })}
                        </FormLabel>
                        <div className='flex gap-2'>
                          <FormControl>
                            <Input
                              placeholder={t(
                                'createProperty.imageUrlPlaceholder'
                              )}
                              {...inputField}
                            />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              onClick={() => remove(index)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ url: '' })}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  {t('createProperty.addImage')}
                </Button>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>
                  {t('createProperty.addressTitle')}
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.zip_code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('createProperty.zipCodeLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('createProperty.zipCodePlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('createProperty.countryLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('createProperty.countryPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address.street'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createProperty.streetLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('createProperty.streetPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('createProperty.numberLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('createProperty.numberPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.complement'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('createProperty.complementLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              'createProperty.complementPlaceholder'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address.neighborhood'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('createProperty.neighborhoodLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'createProperty.neighborhoodPlaceholder'
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('createProperty.cityLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('createProperty.cityPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.state'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('createProperty.stateLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('createProperty.statePlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate(ROUTES.home)}
                  className='flex-1'
                >
                  {t('createProperty.cancel')}
                </Button>
                <Button type='submit' className='flex-1' isLoading={isLoading}>
                  {t('createProperty.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default CreatePropertyView;
