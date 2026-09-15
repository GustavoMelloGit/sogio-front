import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { canAnimate } from '../../lib/motion';
import { buildDemoActs, flattenActs, tabForIndex } from './chatScript';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

const TYPING_MS = 1200;
const PAUSE_AFTER_USER_MS = 1400;
const PAUSE_AFTER_SOGIO_MS = 2600;
const PAUSE_BETWEEN_LOOPS_MS = 3400;

interface ChatDemoProps {
  onWatched?: () => void;
}

export const ChatDemo = ({ onWatched }: ChatDemoProps) => {
  const { t } = useTranslation('landing');
  // Começa estática, com a conversa inteira: é o que o HTML do servidor mostra
  // e o que buscadores e crawlers de IA leem. Só depois de hidratar, e se o
  // navegador permitir, a animação assume.
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (canAnimate()) setAnimated(true);
  }, []);

  const acts = useMemo(() => buildDemoActs(t), [t]);
  const messages = useMemo(() => flattenActs(acts), [acts]);

  const [visible, setVisible] = useState(messages.length);
  const [typing, setTyping] = useState(false);
  const [runId, setRunId] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const watchedRef = useRef(false);

  useEffect(() => {
    if (!animated) return;

    const timers: number[] = [];
    let cancelled = false;

    // Um `setTimeout` cancelado nunca resolve, então limpar os timers no
    // cleanup também interrompe o laço no meio de um `await`.
    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const play = async () => {
      while (!cancelled) {
        setVisible(1);
        setTyping(false);
        await wait(PAUSE_AFTER_USER_MS);

        for (let index = 1; index < messages.length; index += 1) {
          const message = messages[index];

          if (message.from === 'sogio') {
            setTyping(true);
            await wait(TYPING_MS);
            setTyping(false);
          }

          setVisible(index + 1);
          await wait(
            message.from === 'sogio'
              ? PAUSE_AFTER_SOGIO_MS
              : PAUSE_AFTER_USER_MS
          );
        }

        if (!watchedRef.current) {
          watchedRef.current = true;
          onWatched?.();
        }

        await wait(PAUSE_BETWEEN_LOOPS_MS);
      }
    };

    void play();

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [animated, messages, runId, onWatched]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [visible, typing]);

  const activeTab = tabForIndex(acts, Math.max(visible - 1, 0));

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2' aria-hidden>
        {acts.map(act => (
          <span
            key={act.tab}
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition-colors md:text-base',
              activeTab === act.tab && animated
                ? 'border-lp-brand bg-lp-brand-soft text-lp-text'
                : 'border-lp-border text-lp-muted'
            )}
          >
            {t(`demo.tabs.${act.tab}`)}
          </span>
        ))}
      </div>

      <div className='border-lp-border bg-lp-surface overflow-hidden rounded-3xl border shadow-[0_32px_80px_-40px_var(--lp-glow)]'>
        <div className='border-lp-border bg-lp-elevated flex items-center gap-3 border-b px-4 py-3'>
          <img
            src='/favicon.svg'
            alt=''
            width={40}
            height={40}
            className='size-10 shrink-0 rounded-xl'
          />
          <span className='flex flex-col leading-tight'>
            <span className='text-lp-text text-base font-semibold'>
              {t('demo.chatName')}
            </span>
            {/* A cor de marca em 14px não alcança 7:1 sobre esta superfície.
                O ponto carrega o sinal visual e a palavra carrega o
                significado, então nada depende só da cor. */}
            <span className='text-lp-text flex items-center gap-1.5 text-sm'>
              <span className='bg-lp-brand size-2 rounded-full' aria-hidden />
              {t('demo.chatStatus')}
            </span>
          </span>
          <button
            type='button'
            onClick={() => setRunId(id => id + 1)}
            className='border-lp-border text-lp-muted hover:text-lp-text ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors'
          >
            <RotateCcw className='size-4' aria-hidden />
            {t('demo.replay')}
          </button>
        </div>

        <p className='sr-only'>{t('demo.srDescription')}</p>

        <div
          ref={scrollRef}
          className='flex h-[26rem] flex-col gap-3 overflow-y-auto p-4 md:h-[30rem] md:p-5'
        >
          {messages.slice(0, visible).map(message => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {typing ? <TypingIndicator /> : null}
        </div>

        <div className='border-lp-border bg-lp-elevated border-t px-4 py-3'>
          <p className='border-lp-border text-lp-text rounded-full border px-4 py-2.5 text-sm'>
            {t('demo.inputPlaceholder')}
          </p>
        </div>
      </div>
    </div>
  );
};
