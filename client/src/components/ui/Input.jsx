import React from 'react';

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  icon,
}) {
  const containerClasses = [
    'ui-input-container',
    error ? 'ui-input-container--error' : '',
    disabled ? 'ui-input-container--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-input-wrapper">
      {label && <label className="ui-input-label">{label}</label>}
      <div className={containerClasses}>
        {icon && <span className="ui-input-icon">{icon}</span>}
        <input
          className="ui-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <span className="ui-input-error">{error}</span>}
      {!error && helperText && <span className="ui-input-helper">{helperText}</span>}
    </div>
  );
}
