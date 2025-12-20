'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import DATA from './data';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

const AutoscalingChart = ({
  datasetKey = 'predictable_fluctuation',
  autoscalingOnly = false,
  autoscalingRate = 0.106,
  overprovision = 25,
  showStats = true,
  fixedRate = 0.085,
  title = null,
  width = 'full',
}) => {
  const chartRef = useRef(null);
  const [autoscalingCost, setAutoscalingCost] = useState(autoscalingRate);
  const [fixedCost, setFixedCost] = useState(fixedRate);
  const [overprovisionPercent, setOverprovisionPercent] = useState(overprovision);
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    autoscalingCUHours: 0,
    autoscalingCostTotal: 0,
    fixedCUHours: 0,
    fixedCostTotal: 0,
    cuMultiplier: 0,
    costMultiplier: 0,
    monthlySavings: 0,
    cheaper: 'Autoscaling',
  });

  // Get dataset
  const dataset = DATA[datasetKey] || DATA[Object.keys(DATA)[0]];
  const displayTitle = title || dataset.name || 'Database Autoscaling';

  // Convert dataset to chart data format
  const convertDatasetToChartData = useCallback((ds) => {
    const data = [];
    const startTime = new Date(ds.startTime);
    const intervalMs = ds.intervalMinutes * 60 * 1000;

    for (let i = 0; i < ds.values.length; i += 1) {
      const value = ds.values[i];
      if (value !== null) {
        data.push({
          x: new Date(startTime.getTime() + i * intervalMs),
          y: value,
        });
      }
    }

    return data;
  }, []);

  // Calculate stats
  const calculateStats = useCallback(
    (data) => {
      const values = data.map((d) => d.y).filter((v) => !Number.isNaN(v));

      if (values.length === 0) return;

      const max = Math.max(...values);

      // Calculate autoscaling cost and CU-hours
      let totalAutoscalingCost = 0;
      let autoscalingCUMinutes = 0;
      for (let i = 0; i < values.length; i += 1) {
        totalAutoscalingCost += (values[i] * autoscalingCost) / 60;
        autoscalingCUMinutes += values[i];
      }
      const autoscalingCUHours = autoscalingCUMinutes / 60;

      // Calculate Provisioned cost and CU-hours
      const fixedCU = max * (1 + overprovisionPercent / 100);
      const durationHours = (dataset.values.length * dataset.intervalMinutes) / 60;
      const totalFixedCost = fixedCU * durationHours * fixedCost;
      const fixedCUHours = fixedCU * durationHours;

      // Calculate savings
      const cheaper = totalAutoscalingCost < totalFixedCost ? 'Autoscaling' : 'Provisioned';

      // Calculate multipliers (how many times more the expensive option uses)
      const cuMultiplier =
        Math.max(autoscalingCUHours, fixedCUHours) / Math.min(autoscalingCUHours, fixedCUHours);
      const costMultiplier =
        Math.max(totalAutoscalingCost, totalFixedCost) /
        Math.min(totalAutoscalingCost, totalFixedCost);

      const costDifference = Math.abs(totalAutoscalingCost - totalFixedCost);

      // Monthly savings
      const monthlyHours = 30 * 24;
      const monthlySavings = (costDifference / durationHours) * monthlyHours;

      setStats({
        autoscalingCUHours: autoscalingCUHours.toFixed(0),
        autoscalingCostTotal: totalAutoscalingCost.toFixed(2),
        fixedCUHours: fixedCUHours.toFixed(0),
        fixedCostTotal: totalFixedCost.toFixed(2),
        cuMultiplier: cuMultiplier.toFixed(1),
        costMultiplier: costMultiplier.toFixed(1),
        monthlySavings: monthlySavings.toFixed(2),
        cheaper,
      });
    },
    [autoscalingCost, fixedCost, overprovisionPercent, dataset]
  );

  // Initialize chart data
  useEffect(() => {
    const data = convertDatasetToChartData(dataset);

    if (data.length === 0) return;

    const values = data.map((d) => d.y).filter((v) => !Number.isNaN(v));
    const max = Math.max(...values);
    const fixedCU = max * (1 + overprovisionPercent / 100);

    const firstDate = data[0].x;
    const lastDate = data[data.length - 1].x;
    const oneWeekAgo = new Date(lastDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const datasets = [];

    if (!autoscalingOnly) {
      datasets.push({
        label: 'Provisioned Allocation',
        data: [
          { x: firstDate, y: fixedCU },
          { x: lastDate, y: fixedCU },
        ],
        borderColor: '#e8912d',
        backgroundColor: 'rgba(232, 145, 45, 0.1)',
        borderWidth: 1.5,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        borderDash: [5, 5],
      });
    }

    datasets.push({
      label: 'Autoscaling',
      data,
      borderColor: '#73bf69',
      backgroundColor: 'rgba(36, 45, 43, 0.9)',
      borderWidth: 1.5,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0,
    });

    setChartData({
      datasets,
      allData: data,
      minDate: oneWeekAgo.getTime(),
      maxDate: lastDate.getTime(),
      fullMinDate: firstDate.getTime(),
      fullMaxDate: lastDate.getTime(),
    });

    calculateStats(data);
  }, [dataset, convertDatasetToChartData, calculateStats, overprovisionPercent, autoscalingOnly]);

  // Recalculate when costs change
  useEffect(() => {
    if (chartData?.allData) {
      calculateStats(chartData.allData);
    }
  }, [autoscalingCost, fixedCost, overprovisionPercent, chartData?.allData, calculateStats]);

  // Update fixed resource line when overprovision changes
  useEffect(() => {
    if (!chartRef.current || !chartData || autoscalingOnly) return;

    const values = chartData.allData.map((d) => d.y).filter((v) => !Number.isNaN(v));
    const max = Math.max(...values);
    const fixedCU = max * (1 + overprovisionPercent / 100);

    const firstDate = chartData.allData[0].x;
    const lastDate = chartData.allData[chartData.allData.length - 1].x;

    chartRef.current.data.datasets[0].data = [
      { x: firstDate, y: fixedCU },
      { x: lastDate, y: fixedCU },
    ];

    chartRef.current.update('none');
  }, [overprovisionPercent, chartData, autoscalingOnly]);

  const handleOverprovisionChange = (e) => {
    setOverprovisionPercent(parseFloat(e.target.value));
  };

  if (!chartData) {
    return <div className="text-gray-400 w-full p-10 text-center text-lg">Loading...</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: !autoscalingOnly,
        position: 'top',
        align: 'end',
        labels: {
          color: '#d8d9da',
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        min: chartData.minDate,
        max: chartData.maxDate,
        time: {
          unit: 'day',
          displayFormats: {
            hour: 'MMM d HH:mm',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
          },
        },
        grid: {
          color: '#2d3139',
          drawBorder: false,
        },
        ticks: {
          color: '#9fa0a3',
          maxRotation: 0,
          autoSkipPadding: 20,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#2d3139',
          drawBorder: false,
        },
        ticks: {
          color: '#9fa0a3',
          callback(value) {
            return `${value} CU`;
          },
        },
      },
    },
  };

  return (
    <div
      className={clsx(
        'text-gray-200 p-2 py-4',
        width === 'window'
          ? 'relative left-[50%] z-10 w-[90vw] -translate-x-1/2 bg-black-pure'
          : 'w-full'
      )}
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h1 className={clsx('font-medium text-white', width === 'window' ? 'text-2xl' : 'text-xl')}>
          {displayTitle}
        </h1>
        {!autoscalingOnly && (
          <div className="flex items-center gap-2.5">
            <select
              value={overprovisionPercent}
              className="border-gray-700 bg-gray-800 text-gray-200 hover:border-gray-600 hover:bg-gray-700 rounded border px-4 py-2 text-sm transition-all focus:border-[#73bf69] focus:outline-none"
              onChange={handleOverprovisionChange}
            >
              <option value="0">Zero Over-Provisioning</option>
              <option value="25">25% Over-Provisioning (recommended)</option>
              <option value="-25">Under-provision</option>
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="mb-5 h-[500px] rounded border border-gray-new-10 bg-black-new p-5">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Stats */}
      {showStats && (
        <div className="flex flex-wrap gap-5">
          {/* Autoscaling Stats */}
          <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#73bf69] px-5 py-4">
            <div className="text-gray-400 mb-1.5 text-xs">Autoscaling CU-hours</div>
            <div className="text-2xl font-medium text-white">
              {stats.autoscalingCUHours}
              <span className="text-gray-400 ml-1.5 text-sm">CU-hr</span>
            </div>
          </div>

          <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#73bf69] px-5 py-4">
            <div className="text-gray-400 mb-1.5 text-xs">Autoscaling Rate</div>
            <div className="flex items-baseline text-2xl font-medium text-white">
              $
              <input
                type="number"
                value={autoscalingCost}
                step="0.001"
                min="0"
                className="border-gray-700 w-20 border-b bg-transparent p-0 text-left text-2xl font-medium text-white focus:border-[#73bf69] focus:outline-none"
                onChange={(e) => setAutoscalingCost(parseFloat(e.target.value))}
              />
              <span className="text-gray-400 ml-1.5 text-sm">per CU-hr</span>
            </div>
          </div>

          <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#73bf69] px-5 py-4">
            <div className="text-gray-400 mb-1.5 text-xs">Autoscaling Cost</div>
            <div className="text-2xl font-medium text-white">${stats.autoscalingCostTotal}</div>
          </div>

          {/* Provisioned Stats */}
          {!autoscalingOnly && (
            <>
              <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#e8912d] px-5 py-4">
                <div className="text-gray-400 mb-1.5 text-xs">Provisioned CU-hours</div>
                <div className="text-2xl font-medium text-white">
                  {stats.fixedCUHours}
                  <span className="text-gray-400 ml-1.5 text-sm">CU-hr</span>
                </div>
              </div>

              <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#e8912d] px-5 py-4">
                <div className="text-gray-400 mb-1.5 text-xs">Provisioned Rate</div>
                <div className="flex items-baseline text-2xl font-medium text-white">
                  $
                  <input
                    type="number"
                    value={fixedCost}
                    step="0.001"
                    min="0"
                    className="border-gray-700 w-20 border-b bg-transparent p-0 text-left text-2xl font-medium text-white focus:border-[#73bf69] focus:outline-none"
                    onChange={(e) => setFixedCost(parseFloat(e.target.value))}
                  />
                  <span className="text-gray-400 ml-1.5 text-sm">per CU-hr</span>
                </div>
              </div>

              <div className="border-gray-700 bg-gray-800 min-w-[150px] rounded border border-l-[3px] border-l-[#e8912d] px-5 py-4">
                <div className="text-gray-400 mb-1.5 text-xs">Provisioned Cost</div>
                <div className="text-2xl font-medium text-white">${stats.fixedCostTotal}</div>
              </div>

              {/* Savings Summary */}
              <div className="border-gray-700 border-t-blue-500 bg-gray-800 min-w-[150px] rounded border border-t-[3px] px-5 py-4">
                <div className="text-gray-400 mb-1.5 text-xs">Savings Summary</div>
                <div className="flex flex-col gap-2.5">
                  <div className="text-sm">
                    {stats.cheaper} uses{' '}
                    <span className="text-lg text-white">{stats.cuMultiplier}x</span> less compute
                  </div>
                  <div className="text-sm">
                    {stats.cheaper} costs{' '}
                    <span className="text-lg text-white">{stats.costMultiplier}x</span> less.
                    Monthly savings:{' '}
                    <span className="text-lg text-white">${stats.monthlySavings}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

AutoscalingChart.propTypes = {
  datasetKey: PropTypes.oneOf(Object.keys(DATA)),
  autoscalingOnly: PropTypes.bool,
  autoscalingRate: PropTypes.number,
  showStats: PropTypes.bool,
  overprovision: PropTypes.number,
  fixedRate: PropTypes.number,
  title: PropTypes.string,
  width: PropTypes.oneOf(['full', 'window']),
};

export default AutoscalingChart;
