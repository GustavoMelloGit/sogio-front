'use client';

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  useId,
  useMemo,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type FieldPathByValue,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withMask } from 'use-mask-input';
import z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslateFn } from '@/i18n/useTranslation';
import { Page } from '@/components/layout/Page';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { ZipCode } from '@/lib/zip-code';
import { createPropertyRequestSchema } from '../types/Property';
import { useCreateProperty } from '../service/PropertyService.hooks';
import { useZipCodeLookup } from '../service/AddressService.hooks';
import type { ZipCodeAddress } from '../service/AddressService';
import { queryClient } from '@/lib/query-client';

const ADDRESS_COUNTRY = 'Brasil';
const ZIP_CODE_FILLED_FIELDS = [
  'street',
  'neighborhood',
  'city',
  'state',
] as const;

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

type TextFieldProps = Omit<ComponentProps<typeof Input>, 'name'> & {
  name: FieldPathByValue<FormData, string | undefined>;
  label: string;
};

const TextField: FC<TextFieldProps> = ({
  name,
  label,
  className,
  ...inputProps
}) => {
  const { control } = useFormContext<FormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormSectionProps = PropsWithChildren<{ title: string }>;

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className='space-y-4 rounded-xl border bg-card p-4 sm:p-6'
    >
      <h2 id={titleId} className='text-base font-semibold text-card-foreground'>
        {title}
      </h2>
      <div className='grid grid-cols-6 items-start gap-4 xl:grid-cols-12'>
        {children}
      </div>
    </section>
  );
};

const CreatePropertyView: FC = () => {
  const { t } = useTranslation(['property']);
  const router = useRouter();

  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const { mutate, isLoading, error } = useCreateProperty({
    onSuccess: property => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      router.push(ROUTES.property(property.id));
    },
  });

  const { lookUpZipCode, resetZipCodeLookup, lookedUpZipCode } =
    useZipCodeLookup();

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
        country: ADDRESS_COUNTRY,
      },
    },
  });

  const images = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const fillAddress = (address: ZipCodeAddress): void => {
    for (const key of ZIP_CODE_FILLED_FIELDS) {
      if (address[key]) {
        form.setValue(`address.${key}`, address[key], { shouldValidate: true });
      }
    }
    form.setFocus(address.street ? 'address.number' : 'address.street');
  };

  const handleZipCodeChange = (zipCode: string): void => {
    if (!ZipCode.isComplete(zipCode)) {
      resetZipCodeLookup();
      return;
    }

    const digits = ZipCode.digits(zipCode);
    if (digits === lookedUpZipCode) return;

    lookUpZipCode(digits, {
      onSuccess: address => {
        if (address) fillAddress(address);
      },
    });
  };

  const handleSubmit = (data: FormData): void => {
    mutate({
      ...data,
      capacity: Number(data.capacity),
      images: data.images.map(image => image.url),
    });
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('propertyList.title'), to: ROUTES.properties },
          { label: t('createProperty.breadcrumb') },
        ]}
      />
      <Page.Header
        title={t('createProperty.title')}
        description={t('createProperty.description')}
      />
      <Page.Content>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {error && (
              <Alert
                variant='destructive'
                title={t('createProperty.errorTitle')}
                message={error.message}
              />
            )}

            <FormSection title={t('createProperty.aboutTitle')}>
              <TextField
                name='name'
                label={t('createProperty.nameLabel')}
                placeholder={t('createProperty.namePlaceholder')}
                className='col-span-6 sm:col-span-4 xl:col-span-9'
              />
              <TextField
                name='capacity'
                label={t('createProperty.capacityLabel')}
                placeholder={t('createProperty.capacityPlaceholder')}
                type='number'
                min={1}
                step={1}
                inputMode='numeric'
                className='col-span-6 sm:col-span-2 xl:col-span-3'
              />
            </FormSection>

            <FormSection title={t('createProperty.imagesTitle')}>
              {images.fields.map((image, index) => (
                <FormField
                  key={image.id}
                  control={form.control}
                  name={`images.${index}.url`}
                  render={({ field }) => (
                    <FormItem className='col-span-6 xl:col-span-12'>
                      <FormLabel>
                        {t('createProperty.imageUrlLabel', {
                          index: index + 1,
                        })}
                      </FormLabel>
                      <div className='flex gap-2'>
                        <FormControl>
                          <Input
                            inputMode='url'
                            placeholder={t(
                              'createProperty.imageUrlPlaceholder'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {images.fields.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            aria-label={t('createProperty.removeImage', {
                              index: index + 1,
                            })}
                            onClick={() => images.remove(index)}
                          >
                            <Trash2 aria-hidden='true' />
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
                className='col-span-6 justify-self-start xl:col-span-12'
                onClick={() => images.append({ url: '' })}
              >
                <Plus aria-hidden='true' />
                {t('createProperty.addImage')}
              </Button>
            </FormSection>

            <FormSection title={t('createProperty.addressTitle')}>
              <FormField
                control={form.control}
                name='address.zip_code'
                render={({ field }) => (
                  <FormItem className='col-span-6 sm:col-span-3'>
                    <FormLabel>{t('createProperty.zipCodeLabel')}</FormLabel>
                    <FormControl ref={withMask(ZipCode.MASK)}>
                      <Input
                        placeholder={t('createProperty.zipCodePlaceholder')}
                        inputMode='numeric'
                        {...field}
                        onChange={event => {
                          field.onChange(event);
                          handleZipCodeChange(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextField
                name='address.street'
                label={t('createProperty.streetLabel')}
                placeholder={t('createProperty.streetPlaceholder')}
                className='col-span-6 sm:col-span-4 xl:col-span-7'
              />
              <TextField
                name='address.number'
                label={t('createProperty.numberLabel')}
                placeholder={t('createProperty.numberPlaceholder')}
                className='col-span-2'
              />
              <TextField
                name='address.complement'
                label={t('createProperty.complementLabel')}
                placeholder={t('createProperty.complementPlaceholder')}
                className='col-span-4 sm:col-span-3 xl:col-span-3'
              />
              <TextField
                name='address.neighborhood'
                label={t('createProperty.neighborhoodLabel')}
                placeholder={t('createProperty.neighborhoodPlaceholder')}
                className='col-span-6 sm:col-span-3 xl:col-span-4'
              />
              <TextField
                name='address.city'
                label={t('createProperty.cityLabel')}
                placeholder={t('createProperty.cityPlaceholder')}
                className='col-span-4 xl:col-span-3'
              />
              <TextField
                name='address.state'
                label={t('createProperty.stateLabel')}
                placeholder={t('createProperty.statePlaceholder')}
                className='col-span-2'
              />
            </FormSection>

            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Link
                href={ROUTES.properties}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-11 sm:h-9',
                })}
              >
                {t('createProperty.cancel')}
              </Link>
              <Button
                type='submit'
                className='h-11 sm:h-9'
                isLoading={isLoading}
              >
                {t('createProperty.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </Page.Content>
    </Page.Container>
  );
};

export default CreatePropertyView;
