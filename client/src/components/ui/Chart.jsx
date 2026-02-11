import React from 'react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#f97316'];

function BarChart({ data, height = 200 }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.min(40, (300 / data.length) - 8);
  const chartWidth = data.length * (barWidth + 8) + 40;

  return (
    <svg className="ui-chart__svg" viewBox={`0 0 ${chartWidth} ${height + 40}`} height={height + 40}>
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * height;
        const x = 30 + i * (barWidth + 8);
        const y = height - barH;
        return (
          <g key={i}>
            <rect
              className="ui-chart__bar"
              x={x} y={y}
              width={barWidth} height={barH}
              rx={4}
              fill={COLORS[i % COLORS.length]}
            />
            <text className="ui-chart__axis-label" x={x + barWidth / 2} y={height + 16} textAnchor="middle">
              {d.label}
            </text>
            <text className="ui-chart__axis-label" x={x + barWidth / 2} y={y - 6} textAnchor="middle">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, height = 200 }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const step = 300 / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => ({
    x: 30 + i * step,
    y: height - (d.value / maxVal) * height + 10,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg className="ui-chart__svg" viewBox={`0 0 ${30 + data.length * step + 20} ${height + 40}`} height={height + 40}>
      <path className="ui-chart__line" d={pathD} stroke={COLORS[0]} />
      {points.map((p, i) => (
        <g key={i}>
          <circle className="ui-chart__dot" cx={p.x} cy={p.y} r={4} fill={COLORS[0]} />
          <text className="ui-chart__axis-label" x={p.x} y={height + 28} textAnchor="middle">
            {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ data, height = 200 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 150, cy = height / 2, r = Math.min(cx, cy) - 10;
  let cumAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = startAngle + angle / 2;
    const labelX = cx + (r * 0.65) * Math.cos(midAngle);
    const labelY = cy + (r * 0.65) * Math.sin(midAngle);

    return (
      <g key={i}>
        <path
          className="ui-chart__slice"
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={COLORS[i % COLORS.length]}
        />
        {angle > 0.3 && (
          <text className="ui-chart__pie-label" x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle">
            {Math.round((d.value / total) * 100)}%
          </text>
        )}
      </g>
    );
  });

  return (
    <svg className="ui-chart__svg" viewBox={`0 0 300 ${height}`} height={height}>
      {slices}
    </svg>
  );
}

export default function Chart({
  type = 'bar',
  data = [],
  title,
  height = 200,
}) {
  const renderChart = () => {
    switch (type) {
      case 'line': return <LineChart data={data} height={height} />;
      case 'pie':
      case 'doughnut': return <PieChart data={data} height={height} />;
      case 'bar':
      default: return <BarChart data={data} height={height} />;
    }
  };

  return (
    <div className="ui-chart">
      {title && <h4 className="ui-chart__title">{title}</h4>}
      {renderChart()}
      <div className="ui-chart__legend">
        {data.map((d, i) => (
          <div key={i} className="ui-chart__legend-item">
            <span className="ui-chart__legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
