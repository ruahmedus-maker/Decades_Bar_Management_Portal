'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, show, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show) return null;

  return (
    <div className="toast show">
      {message}
    </div>
  );
}