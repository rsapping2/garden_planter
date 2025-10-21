import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      ...toast,
      onClose: () => removeToast(id)
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'success',
      duration: 10000, // Increased to 10 seconds
      showIcon: options.showIcon !== false, // Default to true, but allow override
      ...options
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'error',
      duration: 5000,
      ...options
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'warning',
      duration: 4000,
      ...options
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      message,
      type: 'info',
      duration: 3000,
      ...options
    });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="absolute"
            style={{
              bottom: `${20 + (index * 100)}px`, // Increased spacing from 80px to 100px
              right: '20px',
              zIndex: 1000 + index
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
