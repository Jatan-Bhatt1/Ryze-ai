import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  fullWidth = false,
  icon,
}) {
  const classes = [
    'ui-btn',
    `ui-btn--${size}`,
    `ui-btn--${variant}`,
    fullWidth ? 'ui-btn--full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {icon && <span className="ui-btn__icon">{icon}</span>}
      {children}
    </button>
  );
}
