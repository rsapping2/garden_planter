import React, { useState, useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  position = 'bottom-right',
  showIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    const baseStyles = "fixed z-50 max-w-sm w-full mx-4 mb-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
    
    const positionStyles = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const typeStyles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white'
    };

    const animationStyles = isExiting 
      ? 'translate-y-full opacity-0' 
      : 'translate-y-0 opacity-100';

    return `${baseStyles} ${positionStyles[position]} ${typeStyles[type]} ${animationStyles}`;
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  if (!isVisible) return null;

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          {showIcon && <span className="text-lg mt-0.5">{getIcon()}</span>}
          <div className="text-sm font-medium whitespace-pre-line">{message}</div>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
