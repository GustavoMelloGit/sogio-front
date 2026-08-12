import { useMemo, useRef, useState, type FC } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { INTL_LOCALES } from '@/i18n/locale-maps';
import { useDisconnectApp } from '../service/OAuthService.hooks';
import type { ConnectedApp } from '../types/OAuthTypes';

type ConnectedAppCardProps = {
  app: ConnectedApp;
};

export const ConnectedAppCard: FC<ConnectedAppCardProps> = ({ app }) => {
  const { t, language } = useTranslation('auth');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { disconnect, isLoading, error, reset } = useDisconnectApp();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(INTL_LOCALES[language], {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    [language]
  );

  const handleOpenChange = (open: boolean): void => {
    if (isLoading) return;
    setIsDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  const handleConfirm = (): void => {
    disconnect(app.consent_id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        toast.success(
          t('connectedAppCard.disconnectSuccessToast', {
            name: app.app_display_name,
          })
        );
      },
    });
  };

  return (
    <li>
      <Card>
        <CardContent className='space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='font-semibold'>{app.app_display_name}</span>
            {!app.app_display_name_verified && (
              <Badge variant='outline'>
                {t('connectedAppCard.notVerifiedBadge')}
              </Badge>
            )}
          </div>

          <div className='space-y-1'>
            <p className='text-xs font-medium text-muted-foreground'>
              {t('connectedAppCard.authorizedDomainsLabel')}
            </p>
            <div className='flex flex-wrap gap-1'>
              {app.redirect_hosts.map(host => (
                <Badge key={host} variant='outline' className='font-mono'>
                  {host}
                </Badge>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
            <div>
              <p className='text-xs text-muted-foreground'>
                {t('connectedAppCard.grantedAtLabel')}
              </p>
              <p>{dateFormatter.format(app.granted_at)}</p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>
                {t('connectedAppCard.lastUsedLabel')}
              </p>
              <p>{dateFormatter.format(app.last_used_at)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button
            variant='outline'
            size='sm'
            aria-label={t('connectedAppCard.disconnectAriaLabel', {
              name: app.app_display_name,
            })}
            onClick={() => setIsDialogOpen(true)}
          >
            {t('connectedAppCard.disconnectButton')}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          onOpenAutoFocus={event => {
            event.preventDefault();
            cancelButtonRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {t('connectedAppCard.disconnectDialogTitle', {
                name: app.app_display_name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('connectedAppCard.disconnectDialogDescription')}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert
              role='alert'
              variant='destructive'
              message={
                error instanceof Error
                  ? error.message
                  : t('connectedAppCard.disconnectFallbackMessage')
              }
            />
          )}

          <DialogFooter>
            <Button
              ref={cancelButtonRef}
              type='button'
              variant='outline'
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
            >
              {t('connectedAppCard.cancelButton')}
            </Button>
            <Button
              type='button'
              variant='destructive'
              isLoading={isLoading}
              onClick={handleConfirm}
            >
              {t('connectedAppCard.confirmDisconnectButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
