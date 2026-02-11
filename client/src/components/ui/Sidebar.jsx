import React from 'react';

export default function Sidebar({
  items = [],
  title,
  collapsed = false,
}) {
  return (
    <aside className={`ui-sidebar ${collapsed ? 'ui-sidebar--collapsed' : 'ui-sidebar--expanded'}`}>
      {title && <div className="ui-sidebar__header">{!collapsed && title}</div>}
      <nav className="ui-sidebar__nav">
        {items.map((item, i) => (
          <button
            key={i}
            className={`ui-sidebar__item ${item.active ? 'ui-sidebar__item--active' : ''}`}
            onClick={item.onClick}
          >
            {item.icon && <span className="ui-sidebar__icon">{item.icon}</span>}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
