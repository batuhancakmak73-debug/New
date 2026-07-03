import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ToastKind = 'success' | 'error' | 'info';
interface ToastItem { id: number; kind: ToastKind; title: string; description?: string }

const ToastContext = createContext<{ toast: (kind: ToastKind, title: string, description?: string) => void } | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((kind: ToastKind, title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, kind, title, description }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const colors = { success: 'text-sp-success', error: 'text-sp-danger', info: 'text-sp-info' };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.kind];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                className="pointer-events-auto flex items-start gap-3 rounded-lg border border-sp-active/60 bg-sp-elevated p-4 shadow-xl"
              >
                <Icon size={18} className={cn('mt-0.5 shrink-0', colors[t.kind])} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-sp-text">{t.title}</div>
                  {t.description && <div className="mt-0.5 text-xs text-sp-text-secondary">{t.description}</div>}
                </div>
                <button
                  onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
                  className="text-sp-text-muted hover:text-sp-text"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
