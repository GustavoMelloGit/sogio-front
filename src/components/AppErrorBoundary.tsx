import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { AppErrorView } from '@/modules/error/view/AppErrorView';
import { isStaleChunkError, reloadForStaleChunk } from '@/lib/stale-chunk';

type Status = 'ready' | 'recovering' | 'failed';

type State = { status: Status };

/**
 * Catches render failures and offers a way back to the dashboard instead of a
 * blank screen. A stale chunk — the usual cause right after a deploy — is
 * recovered from with a reload, and only falls through to the error screen
 * when that reload does not help.
 */
export class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { status: 'ready' };

  static getDerivedStateFromError(error: Error): State {
    return { status: isStaleChunkError(error) ? 'recovering' : 'failed' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.state.status === 'recovering' && reloadForStaleChunk()) return;

    console.error('Unhandled render error', error, errorInfo.componentStack);

    this.setState({ status: 'failed' });
  }

  render() {
    switch (this.state.status) {
      // The reload is already on its way; a spinner reads better than an
      // error screen that is about to be replaced.
      case 'recovering':
        return (
          <div className='min-h-dvh flex items-center justify-center bg-background'>
            <div
              className='size-8 animate-spin rounded-full border-2 border-muted border-t-foreground'
              aria-hidden='true'
            />
          </div>
        );
      case 'failed':
        return <AppErrorView />;
      default:
        return this.props.children;
    }
  }
}
