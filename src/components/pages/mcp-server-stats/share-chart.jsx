'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

import { pointRadiusAt } from './share-series';
import { formatWeekShort } from './weeks';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AXIS_COLOR = '#797d86';
const GRID_COLOR = 'rgba(255, 255, 255, 0.08)';

const ShareChart = ({ weeks, series }) => {
  const data = {
    labels: weeks.map(formatWeekShort),
    datasets: series.map(({ label, color, data: values }) => ({
      label,
      data: values,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 2,
      pointRadius: (context) => pointRadiusAt(values, context.dataIndex),
      pointHoverRadius: 4,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: AXIS_COLOR, maxRotation: 0, autoSkipPadding: 16 },
      },
      y: {
        min: 0,
        grid: { color: GRID_COLOR },
        border: { display: false },
        ticks: { color: AXIS_COLOR, callback: (value) => `${value}%` },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#c9cbcf', boxWidth: 10, boxHeight: 10, padding: 16 },
      },
      tooltip: {
        itemSort: (a, b) => (b.raw ?? -1) - (a.raw ?? -1),
        callbacks: {
          title: (items) => `Week of ${items[0].label}`,
          label: (item) =>
            item.raw === null
              ? ` ${item.dataset.label}: not published`
              : ` ${item.dataset.label}: ${item.raw.toFixed(1)}%`,
        },
      },
    },
  };

  return (
    <div className="h-[440px] md:h-[360px]">
      <Line
        data={data}
        options={options}
        aria-label="Weekly share of active Neon MCP server users by client"
        role="img"
      />
    </div>
  );
};

ShareChart.propTypes = {
  weeks: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired, // null for unpublished weeks
    })
  ).isRequired,
};

export default ShareChart;
