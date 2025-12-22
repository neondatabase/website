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
    lessCompute: 'Autoscaling',
    performanceDegradations: 0,
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

      // Count performance degradations (times autoscaling exceeds provisioned allocation)
      let performanceDegradations = 0;
      for (let i = 0; i < data.length; i += 1) {
        const current = data[i];
        const prev = i > 0 ? data[i - 1] : null;
        // Count when we transition from below to above threshold
        if (current.y > fixedCU && (!prev || prev.y <= fixedCU)) {
          performanceDegradations += 1;
        }
      }

      // Calculate savings
      const cheaper = totalAutoscalingCost < totalFixedCost ? 'Autoscaling' : 'Provisioned';
      const lessCompute = autoscalingCUHours < fixedCUHours ? 'Autoscaling' : 'Provisioned';

      // Calculate multipliers (how many times more the expensive option uses)
      const cuMultiplier =
        Math.max(autoscalingCUHours, fixedCUHours) / Math.min(autoscalingCUHours, fixedCUHours);
      const costMultiplier =
        Math.max(totalAutoscalingCost, totalFixedCost) /
        Math.min(totalAutoscalingCost, totalFixedCost);

      const costDifference = Math.abs(totalAutoscalingCost - totalFixedCost);

      // Extrapolate to monthly values
      const monthlyHours = 30 * 24;
      const monthlyAutoscalingCUHours = (autoscalingCUHours / durationHours) * monthlyHours;
      const monthlyAutoscalingCost = (totalAutoscalingCost / durationHours) * monthlyHours;
      const monthlyFixedCUHours = (fixedCUHours / durationHours) * monthlyHours;
      const monthlyFixedCost = (totalFixedCost / durationHours) * monthlyHours;
      const monthlySavings = (costDifference / durationHours) * monthlyHours;
      const monthlyPerformanceDegradations =
        (performanceDegradations / durationHours) * monthlyHours;

      setStats({
        autoscalingCUHours: monthlyAutoscalingCUHours.toFixed(0),
        autoscalingCostTotal: monthlyAutoscalingCost.toFixed(2),
        fixedCUHours: monthlyFixedCUHours.toFixed(0),
        fixedCostTotal: monthlyFixedCost.toFixed(2),
        cuMultiplier: cuMultiplier.toFixed(1),
        costMultiplier: costMultiplier.toFixed(1),
        monthlySavings: monthlySavings.toFixed(2),
        cheaper,
        lessCompute,
        performanceDegradations: Math.round(monthlyPerformanceDegradations),
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

    // Add red "overflow" dataset when under-provisioning to show performance degradation
    if (!autoscalingOnly && overprovisionPercent < 0) {
      // Calculate interval from the data
      const intervalMs = data.length > 1 ? data[1].x.getTime() - data[0].x.getTime() : 60000;

      // Create dataset with boundary transition points
      const overflowData = [];
      for (let i = 0; i < data.length; i += 1) {
        const current = data[i];
        const prev = i > 0 ? data[i - 1] : null;
        const next = i < data.length - 1 ? data[i + 1] : null;

        // Case 1: current is below but next is above - entering overflow zone
        if (current.y < fixedCU && next && next.y > fixedCU) {
          // Add null point for previous interval
          overflowData.push({
            x: new Date(current.x.getTime() - intervalMs),
            y: null,
          });
          // Add fixedCU point for current interval
          overflowData.push({
            x: current.x,
            y: fixedCU,
          });
        }
        // Case 2: current is above - in overflow zone
        else if (current.y > fixedCU) {
          overflowData.push(current);
        }
        // Case 3: current is below but previous was above - exiting overflow zone
        else if (current.y < fixedCU && prev && prev.y > fixedCU) {
          // Add fixedCU point for current timestamp
          overflowData.push({
            x: current.x,
            y: fixedCU,
          });
          // Add null point for next interval
          overflowData.push({
            x: new Date(current.x.getTime() + intervalMs),
            y: null,
          });
        }
      }

      // Add red overflow area that fills from the baseline
      datasets.push({
        label: 'Performance Degradation',
        data: overflowData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 2,
        fill: false, // Fill to the previous dataset (the baseline)
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        spanGaps: false,
      });
    }

    datasets.push({
      label: 'Autoscaling',
      data,
      borderColor: '#73bf69',
      backgroundColor: '#73bf69',
      borderWidth: 1.5,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0,
    });

    if (!autoscalingOnly) {
      datasets.push({
        label: 'Provisioned Allocation',
        data: [
          { x: firstDate, y: fixedCU },
          { x: lastDate, y: fixedCU },
        ],
        borderColor: '#e8912d',
        backgroundColor: 'rgba(232, 145, 45, 0.5)',
        borderWidth: 1.5,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        borderDash: [5, 5],
      });
    }

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

  // Update fixed resource line and performance degradation when overprovision changes
  useEffect(() => {
    if (!chartRef.current || !chartData || autoscalingOnly) return;

    const values = chartData.allData.map((d) => d.y).filter((v) => !Number.isNaN(v));
    const max = Math.max(...values);
    const fixedCU = max * (1 + overprovisionPercent / 100);

    const firstDate = chartData.allData[0].x;
    const lastDate = chartData.allData[chartData.allData.length - 1].x;

    // Find the Performance Degradation dataset index (if it exists)
    const perfDegradationIndex = chartRef.current.data.datasets.findIndex(
      (ds) => ds.label === 'Performance Degradation'
    );

    // Find the Provisioned Allocation dataset index
    const provisionedIndex = chartRef.current.data.datasets.findIndex(
      (ds) => ds.label === 'Provisioned Allocation'
    );

    // Update Provisioned Allocation line
    if (provisionedIndex !== -1) {
      chartRef.current.data.datasets[provisionedIndex].data = [
        { x: firstDate, y: fixedCU },
        { x: lastDate, y: fixedCU },
      ];
    }

    // Handle Performance Degradation dataset
    if (overprovisionPercent < 0) {
      // Calculate interval from the data
      const intervalMs =
        chartData.allData.length > 1
          ? chartData.allData[1].x.getTime() - chartData.allData[0].x.getTime()
          : 60000;

      // Create dataset with boundary transition points
      const overflowData = [];
      for (let i = 0; i < chartData.allData.length; i += 1) {
        const current = chartData.allData[i];
        const prev = i > 0 ? chartData.allData[i - 1] : null;
        const next = i < chartData.allData.length - 1 ? chartData.allData[i + 1] : null;

        // Case 1: current is below but next is above - entering overflow zone
        if (current.y < fixedCU && next && next.y > fixedCU) {
          // Add null point for previous interval
          overflowData.push({
            x: new Date(current.x.getTime() - intervalMs),
            y: null,
          });
          // Add fixedCU point for current interval
          overflowData.push({
            x: current.x,
            y: fixedCU,
          });
        }
        // Case 2: current is above - in overflow zone
        else if (current.y > fixedCU) {
          overflowData.push(current);
        }
        // Case 3: current is below but previous was above - exiting overflow zone
        else if (current.y < fixedCU && prev && prev.y > fixedCU) {
          // Add fixedCU point for current timestamp
          overflowData.push({
            x: current.x,
            y: fixedCU,
          });
          // Add null point for next interval
          overflowData.push({
            x: new Date(current.x.getTime() + intervalMs),
            y: null,
          });
        }
      }

      if (perfDegradationIndex !== -1) {
        // Update existing Performance Degradation dataset
        chartRef.current.data.datasets[perfDegradationIndex].data = overflowData;
      } else {
        // Add new Performance Degradation dataset at the beginning (so it renders first)
        chartRef.current.data.datasets.unshift({
          label: 'Performance Degradation',
          data: overflowData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          spanGaps: false,
        });
      }
    } else if (perfDegradationIndex !== -1) {
      // Remove Performance Degradation dataset if overprovision is not negative
      chartRef.current.data.datasets.splice(perfDegradationIndex, 1);
    }

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
        <h1 className={clsx('font-medium text-white', width === 'window' ? 'text-xl' : 'text-xl')}>
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
              <option value="25">25% Over-Provisioning (AWS recommended)</option>
              <option value="-25">25% Under-provision</option>
              <option value="-50">50% Under-provision</option>
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
        <div className="flex flex-wrap items-start justify-center gap-4">
          {/* Autoscaling Stats - Combined Panel */}
          <div className="border-gray-700 bg-gray-800 rounded border border-l-[3px] border-l-[#73bf69] bg-gray-1 px-5 py-4">
            <h3 className="mb-3 mt-0 text-xs font-medium uppercase tracking-wide text-[#73bf69]">
              Autoscaling
            </h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-gray-400 text-sm">Compute</span>
                <div className="text-right">
                  <span className="text-xl font-light tabular-nums text-white">
                    {stats.autoscalingCUHours}
                    <span className="text-gray-500 ml-2 text-xs font-normal">CU-hrs/mon</span>
                  </span>
                  <div className="text-gray-500 text-xs">&nbsp;</div>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-gray-400 text-sm">Rate</span>
                <div className="flex items-baseline">
                  <span className="text-xl font-light text-white">$</span>
                  <input
                    type="number"
                    value={autoscalingCost}
                    step="0.001"
                    min="0"
                    className="border-gray-700 w-20 border-b bg-gray-3/40 text-right text-xl font-light tabular-nums text-white focus:border-[#73bf69] focus:outline-none"
                    onChange={(e) => setAutoscalingCost(parseFloat(e.target.value))}
                  />
                  <span className="text-gray-500 ml-2 text-xs font-normal">/CU-hr</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-gray-300 text-sm font-medium">Monthly Cost</span>
                <span className="text-2xl font-light tabular-nums text-white">
                  ${stats.autoscalingCostTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Provisioned Stats - Combined Panel */}
          {!autoscalingOnly && (
            <>
              <div className="border-gray-700 bg-gray-800 flex flex-col gap-2 rounded border border-l-[3px] border-l-[#e8912d] bg-gray-1 px-5 py-4">
                <div>
                  <h3 className="mb-3 mt-0 text-xs font-medium uppercase tracking-wide text-[#e8912d]">
                    Provisioned Equivalent
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-gray-400 text-sm">Compute</span>
                      <div className="text-right">
                        <div className="text-xl font-light tabular-nums text-white">
                          {(stats.fixedCUHours / 720).toFixed(1)} vCPU /{' '}
                          {((stats.fixedCUHours / 720) * 4).toFixed(0)} GB
                        </div>
                        <div className="text-gray-500 text-xs">
                          ({stats.fixedCUHours} CU-hrs/mon)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-gray-400 text-sm">Equivalent Rate</span>
                      <div className="flex items-baseline">
                        <span className="text-xl font-light text-white">$</span>
                        <input
                          type="number"
                          value={fixedCost}
                          step="0.001"
                          min="0"
                          className="border-gray-700 w-20 border-b bg-gray-3/40 text-right text-xl font-light tabular-nums text-white focus:border-[#73bf69] focus:outline-none"
                          onChange={(e) => setFixedCost(parseFloat(e.target.value))}
                        />
                        <span className="text-gray-500 ml-2 text-xs font-normal">/CU-hr</span>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-gray-300 text-sm font-medium">Monthly Cost</span>
                      <span className="text-2xl font-light tabular-nums text-white">
                        ${stats.fixedCostTotal}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Performance Degradations Warning */}
                {stats.performanceDegradations > 0 && (
                  <div className="max-w-64 rounded border border-code-red-1 bg-code-red-1/10 p-2 text-xs">
                    <strong>Under-provisioned:</strong> <br />
                    Workload will experience degraded performance or outages{' '}
                    {stats.performanceDegradations} times/month.
                  </div>
                )}
              </div>

              {/* Comparison Summary - Redesigned */}
              <div className="border-gray-700 border-t-blue-500 bg-gray-800 rounded border border-t-[3px] bg-gray-1 px-5 py-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Compute Winner */}
                  <div className="text-center">
                    <div className="text-gray-400 mb-2 text-xs uppercase tracking-wide">
                      Compute Winner
                    </div>
                    <div
                      className={clsx(
                        'font-bold',
                        stats.lessCompute === 'Autoscaling' ? 'text-[#73bf69]' : 'text-[#e8912d]'
                      )}
                    >
                      {stats.lessCompute}
                    </div>
                    <div
                      className={clsx(
                        'text-5xl font-bold tabular-nums',
                        stats.lessCompute === 'Autoscaling' ? 'text-[#73bf69]' : 'text-[#e8912d]'
                      )}
                    >
                      {stats.cuMultiplier}×
                    </div>
                    <div className="text-gray-400 text-sm">less compute used</div>
                  </div>

                  {/* Cost Winner */}
                  <div className="border-gray-700 border-l border-r text-center">
                    <div className="text-gray-400 mb-2 text-xs uppercase tracking-wide">
                      Cost Winner
                    </div>
                    <div
                      className={clsx(
                        'font-bold',
                        stats.cheaper === 'Autoscaling' ? 'text-[#73bf69]' : 'text-[#e8912d]'
                      )}
                    >
                      {stats.cheaper}
                    </div>
                    <div
                      className={`text-5xl font-bold tabular-nums ${
                        stats.cheaper === 'Autoscaling' ? 'text-[#73bf69]' : 'text-[#e8912d]'
                      }`}
                    >
                      {stats.costMultiplier}×
                    </div>
                    <div className="text-gray-400 text-sm">cheaper</div>
                  </div>

                  {/* Monthly Savings */}
                  <div className="text-center">
                    <div className="text-gray-400 mb-2 text-xs uppercase tracking-wide">
                      Monthly Savings
                    </div>
                    <div>{stats.cheaper} saves</div>
                    <div className="text-blue-400 text-5xl font-bold tabular-nums">
                      ${Math.round(stats.monthlySavings)}
                    </div>
                    <div className="text-gray-400 text-sm">per month</div>
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
