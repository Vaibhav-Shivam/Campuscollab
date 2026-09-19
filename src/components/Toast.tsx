'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success' || !t.type;
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20]'
                : isError
                ? 'bg-[#FFEBEE] border-[#C62828] text-[#B71C1C]'
                : 'bg-[#E3F2FD] border-[#1565C0] text-[#0D47A1]'
            }`}
          >
            <div className="mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#C62828]" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#1565C0]" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{t.title}</p>
              {t.description && <p className="text-xs opacity-90 mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-current opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
