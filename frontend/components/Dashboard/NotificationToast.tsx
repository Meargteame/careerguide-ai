import React from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { Notification } from './useNotifications';

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={18} className="text-rose-500 shrink-0" />,
  info: <Info size={18} className="text-blue-500 shrink-0" />,
};

const borders = {
  success: 'border-l-emerald-500',
  error: 'border-l-rose-500',
  info: 'border-l-blue-500',
};

const NotificationToast: React.FC<Props> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 max-w-sm w-full">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 ${borders[n.type]} rounded-2xl px-5 py-4 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in slide-in-from-right-4 duration-300`}
        >
          {icons[n.type]}
          <p className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">{n.message}</p>
          <button
            onClick={() => onDismiss(n.id)}
            className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
