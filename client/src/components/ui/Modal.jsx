import React, { useEffect } from 'react';

export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className={`ui-modal ui-modal--${size}`} onClick={e => e.stopPropagation()}>
        <div className="ui-modal__header">
          <h2 className="ui-modal__title">{title}</h2>
          <button className="ui-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ui-modal__body">
          {children}
        </div>
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
