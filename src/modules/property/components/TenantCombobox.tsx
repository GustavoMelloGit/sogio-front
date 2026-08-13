import type { FC } from 'react';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSearchTenants } from '@/modules/stay/service/TenantService.hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { Phone } from '@/lib/phone';
import { useTranslation } from '@/i18n/useTranslation';

type Props = {
  value: string;
  onInputChange: (value: string) => void;
  onTenantSelect: (tenant: {
    name: string;
    phone: string;
    sex: 'MALE' | 'FEMALE' | 'OTHER';
  }) => void;
  placeholder?: string;
};

const TenantCombobox: FC<Props> = ({
  value,
  onInputChange,
  onTenantSelect,
  placeholder,
}) => {
  const { t } = useTranslation(['property']);
  const resolvedPlaceholder =
    placeholder ?? t('tenantCombobox.defaultPlaceholder');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const debouncedSearch = useDebounce(search, 500);
  const { tenants, isLoading } = useSearchTenants(debouncedSearch);

  const handleInputChange = (inputValue: string) => {
    setSearch(inputValue);
    onInputChange(inputValue);
  };

  const handleSelect = (tenant: {
    name: string;
    phone: string;
    sex: 'MALE' | 'FEMALE' | 'OTHER';
  }) => {
    onTenantSelect(tenant);
    setSearch(tenant.name);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          <span className='truncate text-left'>
            {value || (
              <span className='text-muted-foreground'>
                {resolvedPlaceholder}
              </span>
            )}
          </span>
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={resolvedPlaceholder}
            value={search}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {isLoading && debouncedSearch.trim().length >= 2 ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                {t('tenantCombobox.searching')}
              </div>
            ) : (
              <>
                <CommandEmpty>{t('tenantCombobox.noResults')}</CommandEmpty>
                {tenants.length > 0 && (
                  <CommandGroup>
                    {tenants.map(tenant => (
                      <CommandItem
                        key={tenant.id}
                        value={tenant.id}
                        onSelect={() =>
                          handleSelect({
                            name: tenant.name,
                            phone: tenant.phone,
                            sex: tenant.sex,
                          })
                        }
                      >
                        <div className='flex flex-col'>
                          <span>{tenant.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            {Phone.toHumanReadable(tenant.phone)}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TenantCombobox;
