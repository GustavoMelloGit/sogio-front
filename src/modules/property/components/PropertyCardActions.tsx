import type { FC } from 'react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import type { Property } from '../types/Property';
import { DeletePropertyDialog } from './DeletePropertyDialog';

type PropertyCardActionsProps = {
  property: Property;
  className?: string;
};

export const PropertyCardActions: FC<PropertyCardActionsProps> = ({
  property,
  className,
}) => {
  const { t } = useTranslation('property');
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='secondary'
            size='icon'
            aria-label={t('propertyList.actionsAriaLabel', {
              name: property.name,
            })}
            className={cn(
              'size-11 rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background pointer-fine:size-8',
              className
            )}
          >
            <EllipsisVertical aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem variant='destructive' onSelect={open}>
            <Trash2 aria-hidden='true' />
            {t('propertyList.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePropertyDialog
        property={property}
        isOpen={isOpen}
        onClose={close}
      />
    </>
  );
};
