import { useRef, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert } from '@/components/Alert';
import { useTranslation } from '@/i18n/useTranslation';
import { ROUTES } from '@/routes/routes';
import { useDeleteProperty } from '../service/PropertyService.hooks';
import type { Property } from '../types/Property';

type DeletePropertyDialogProps = {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
};

export const DeletePropertyDialog: FC<DeletePropertyDialogProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('property');
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { deleteProperty, isDeleting, error, reset } = useDeleteProperty();

  const handleOpenChange = (open: boolean): void => {
    if (open || isDeleting) return;
    reset();
    onClose();
  };

  const handleConfirm = (): void => {
    deleteProperty(property.id, {
      onSuccess: ({ canceled_stays }) => {
        toast.success(
          canceled_stays > 0
            ? t('deleteProperty.successWithCanceledStays', {
                name: property.name,
                count: canceled_stays,
              })
            : t('deleteProperty.success', { name: property.name })
        );
        router.replace(ROUTES.properties);
      },
    });
  };

  const errorMessage = (deleteError: Error): string =>
    isAxiosError(deleteError) && deleteError.response?.status === 409
      ? t('deleteProperty.guestCheckedIn')
      : deleteError.message;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={event => {
          event.preventDefault();
          cancelButtonRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {t('deleteProperty.title', { name: property.name })}
          </DialogTitle>
          <DialogDescription>
            {t('deleteProperty.description')}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            role='alert'
            variant='destructive'
            message={errorMessage(error)}
          />
        )}

        <DialogFooter>
          <Button
            ref={cancelButtonRef}
            type='button'
            variant='outline'
            disabled={isDeleting}
            onClick={() => handleOpenChange(false)}
          >
            {t('deleteProperty.cancel')}
          </Button>
          <Button
            type='button'
            variant='destructive'
            isLoading={isDeleting}
            onClick={handleConfirm}
          >
            {t('deleteProperty.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
