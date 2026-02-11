import React from 'react';

export default function Navbar({
  brand,
  items = [],
  actions,
}) {
  return (
    <nav className="ui-navbar">
      <div className="ui-navbar__brand">{brand}</div>
      {items.length > 0 && (
        <ul className="ui-navbar__nav">
          {items.map((item, i) => (
            <li key={i}>
              <a
                className={`ui-navbar__link ${item.active ? 'ui-navbar__link--active' : ''}`}
                href={item.href || '#'}
                onClick={item.onClick}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      {actions && <div className="ui-navbar__actions">{actions}</div>}
    </nav>
  );
}
