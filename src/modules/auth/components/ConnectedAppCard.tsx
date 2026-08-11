import { useRef, useState, type FC } from 'react';
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
import { useDisconnectApp } from '../service/OAuthService.hooks';
import type { ConnectedApp } from '../types/OAuthTypes';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const DISCONNECT_FALLBACK_MESSAGE =
  'Não foi possível desconectar este aplicativo. Tente novamente.';

type ConnectedAppCardProps = {
  app: ConnectedApp;
};

export const ConnectedAppCard: FC<ConnectedAppCardProps> = ({ app }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { disconnect, isLoading, error, reset } = useDisconnectApp();

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
        toast.success(`${app.app_display_name} foi desconectado.`);
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
              <Badge variant='outline'>Não verificado</Badge>
            )}
          </div>

          <div className='space-y-1'>
            <p className='text-xs font-medium text-muted-foreground'>
              Domínios autorizados
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
              <p className='text-xs text-muted-foreground'>Concedido em</p>
              <p>{dateFormatter.format(app.granted_at)}</p>
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>
                Usado pela última vez em
              </p>
              <p>{dateFormatter.format(app.last_used_at)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button
            variant='outline'
            size='sm'
            aria-label={`Desconectar ${app.app_display_name}`}
            onClick={() => setIsDialogOpen(true)}
          >
            Desconectar
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
            <DialogTitle>Desconectar {app.app_display_name}?</DialogTitle>
            <DialogDescription>
              Este aplicativo perderá acesso à sua conta imediatamente. Você
              pode reconectar depois pedindo ao aplicativo para autorizar
              novamente.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert
              role='alert'
              variant='destructive'
              message={
                error instanceof Error
                  ? error.message
                  : DISCONNECT_FALLBACK_MESSAGE
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
              Cancelar
            </Button>
            <Button
              type='button'
              variant='destructive'
              isLoading={isLoading}
              onClick={handleConfirm}
            >
              Desconectar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
