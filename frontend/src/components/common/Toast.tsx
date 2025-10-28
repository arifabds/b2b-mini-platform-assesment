import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    barClass: 'bg-green-500',
    iconClass: 'text-green-500',
  },
  error: {
    icon: XCircle,
    barClass: 'bg-red-500',
    iconClass: 'text-red-500',
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  const toastContent = (
    <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
      <div className="flex items-center bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-transparent dark:border-gray-700 max-w-sm">
        <div className={`w-1.5 h-full ${config.barClass}`} />
        <div className="p-4 flex items-center gap-3">
          <Icon className={`h-6 w-6 ${config.iconClass} flex-shrink-0`} />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{message}</p>
          <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
  
  const portalRoot = document.getElementById('modal-root');
  return portalRoot ? ReactDOM.createPortal(toastContent, portalRoot) : null;
}