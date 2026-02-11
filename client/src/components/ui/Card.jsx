import React from 'react';

export default function Card({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  padding = 'md',
}) {
  return (
    <div className={`ui-card ui-card--${variant}`}>
      {(title || subtitle) && (
        <div className="ui-card__header">
          {title && <h3 className="ui-card__title">{title}</h3>}
          {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className={`ui-card__body--${padding}`}>
        {children}
      </div>
      {footer && <div className="ui-card__footer">{footer}</div>}
    </div>
  );
}
