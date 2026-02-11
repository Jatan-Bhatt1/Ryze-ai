import React from 'react';

export default function Table({
  columns = [],
  data = [],
  striped = false,
  hoverable = true,
  compact = false,
}) {
  const tableClasses = [
    'ui-table',
    striped ? 'ui-table--striped' : '',
    hoverable ? 'ui-table--hoverable' : '',
    compact ? 'ui-table--compact' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-table-wrapper">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
