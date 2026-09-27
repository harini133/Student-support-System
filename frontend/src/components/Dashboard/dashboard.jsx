import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummary } from "../../redux/dashboardSlice";

const STATUS_COLORS = ["#2563eb", "#8b5cf6", "#f59e0b", "#06b6d4", "#10b981", "#64748b"];
const PRIORITY_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

function StatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const segments = data.map((item, index) => {
    const start = cursor;
    cursor += total ? (item.value / total) * 100 : 0;
    return `${STATUS_COLORS[index]} ${start}% ${cursor}%`;
  });
  const background = total ? `conic-gradient(${segments.join(", ")})` : "#e5e7eb";

  return (
    <div className="status-chart-content">
      <div className="status-donut" style={{ background }} role="img" aria-label={`Ticket status distribution, ${total} tickets`}>
        <div className="status-donut-center">
          <strong>{total}</strong>
          <span>Tickets</span>
        </div>
      </div>
      <ul className="chart-legend">
        {data.map((item, index) => (
          <li key={item.label}>
            <span className="legend-swatch" style={{ backgroundColor: STATUS_COLORS[index] }} />
            <span>{item.label}</span><strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriorityChart({ data }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="priority-chart">
      {data.map((item, index) => (
        <div className="priority-row" key={item.label}>
          <div className="priority-row-heading"><span>{item.label}</span><strong>{item.value}</strong></div>
          <div className="priority-track">
            <span style={{ width: `${(item.value / max) * 100}%`, backgroundColor: PRIORITY_COLORS[index] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyChart({ data }) {
  const width = 600;
  const height = 220;
  const padding = { top: 18, right: 20, bottom: 38, left: 34 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const max = Math.max(1, ...data.map((item) => item.value));
  const points = data.map((item, index) => ({
    ...item,
    x: padding.left + (data.length > 1 ? (index / (data.length - 1)) * plotWidth : plotWidth / 2),
    y: padding.top + plotHeight - (item.value / max) * plotHeight,
  }));
  const line = points.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <div className="monthly-chart-wrap">
      <svg className="monthly-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Tickets created per month over the past six months">
        {[0, 0.5, 1].map((fraction) => {
          const y = padding.top + fraction * plotHeight;
          return <line key={fraction} x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid-line" />;
        })}
        <polyline points={line} className="monthly-chart-line" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" className="monthly-chart-point" />
            <text x={point.x} y={height - 12} textAnchor="middle" className="monthly-chart-label">{point.label.split(" ")[0]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  if (loading && !data) return <p className="dashboard-message">Loading dashboard...</p>;
  if (error && !data) return <p className="dashboard-message dashboard-error">{typeof error === "string" ? error : JSON.stringify(error)}</p>;
  if (!data) return null;

  const cards = [
    ["Total Tickets", data.cards.total, "#2563eb"],
    ["Open Tickets", data.cards.open, "#0ea5e9"],
    ["In Progress", data.cards.in_progress, "#8b5cf6"],
    ["Resolved", data.cards.resolved, "#10b981"],
    ["Pending Tickets", data.cards.pending, "#f59e0b"],
    ["Overdue Tickets", data.cards.overdue, "#ef4444"],
  ];

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Student Support System</p>
        </div>
        {loading && <span className="dashboard-refreshing">Refreshing...</span>}
      </div>

      <section className="dashboard-cards" aria-label="Ticket summary">
        {cards.map(([label, value, color]) => (
          <article className="dashboard-card" key={label} style={{ "--card-accent": color }}>
            <h2>{label}</h2>
            <p>{value}</p>
          </article>
        ))}
      </section>

      {error && <p className="dashboard-inline-error">Dashboard refresh failed. Showing the last loaded data.</p>}

      <section className="dashboard-charts" aria-label="Ticket analytics">
        <article className="dashboard-chart-card">
          <h2>Tickets by Status</h2>
          <p className="chart-subtitle">Current ticket distribution</p>
          <StatusChart data={data.charts.by_status} />
        </article>
        <article className="dashboard-chart-card">
          <h2>Tickets by Priority</h2>
          <p className="chart-subtitle">Workload across priority levels</p>
          <PriorityChart data={data.charts.by_priority} />
        </article>
        <article className="dashboard-chart-card dashboard-trend-card">
          <h2>Ticket Creation Trend</h2>
          <p className="chart-subtitle">New tickets over the past six months</p>
          <MonthlyChart data={data.charts.monthly_created} />
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
