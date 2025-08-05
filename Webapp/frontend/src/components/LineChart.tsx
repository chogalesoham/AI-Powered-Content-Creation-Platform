import React from 'react';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
  animate?: boolean;
}

export default function LineChart({ 
  data, 
  title, 
  height = 300, 
  color = '#8B5CF6', 
  showGrid = true, 
  showDots = true,
  animate = true 
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const chartWidth = 800;
  const chartHeight = height - padding * 2;

  // Generate SVG path for the line
  const generatePath = () => {
    if (data.length === 0) return '';
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight + padding;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    if (data.length === 0) return '';
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight + padding;
      return `${x},${y}`;
    });
    
    const firstPoint = points[0].split(',');
    const lastPoint = points[points.length - 1].split(',');
    
    return `M ${firstPoint[0]},${chartHeight + padding} L ${points.join(' L ')} L ${lastPoint[0]},${chartHeight + padding} Z`;
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const gridCount = 5;
    
    // Horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
      const y = (i / gridCount) * chartHeight + padding;
      lines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={chartWidth + padding}
          y2={y}
          stroke="#E5E7EB"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      );
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = (i / 6) * chartWidth + padding;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={chartHeight + padding}
          stroke="#E5E7EB"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      );
    }
    
    return lines;
  };

  // Generate Y-axis labels
  const generateYLabels = () => {
    const labels = [];
    const labelCount = 5;
    
    for (let i = 0; i <= labelCount; i++) {
      const value = minValue + (range * i / labelCount);
      const y = chartHeight - (i / labelCount) * chartHeight + padding;
      
      labels.push(
        <text
          key={`y-${i}`}
          x={padding - 10}
          y={y + 4}
          textAnchor="end"
          className="text-xs fill-gray-500"
        >
          {Math.round(value).toLocaleString()}
        </text>
      );
    }
    
    return labels;
  };

  // Generate X-axis labels
  const generateXLabels = () => {
    const labels = [];
    const labelCount = Math.min(data.length, 7);
    const step = Math.floor(data.length / labelCount);
    
    for (let i = 0; i < labelCount; i++) {
      const dataIndex = i * step;
      if (dataIndex < data.length) {
        const x = (dataIndex / (data.length - 1)) * chartWidth + padding;
        const date = new Date(data[dataIndex].date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        labels.push(
          <text
            key={`x-${i}`}
            x={x}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {formattedDate}
          </text>
        );
      }
    }
    
    return labels;
  };

  // Generate data points
  const generateDataPoints = () => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight + padding;
      
      return (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
            className={animate ? "animate-pulse" : ""}
          />
          {point.label && (
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              {point.label}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="relative">
        <svg
          width={chartWidth + padding * 2}
          height={height}
          className="overflow-visible"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {showGrid && generateGridLines()}
          
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="url(#areaGradient)"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Main line */}
          <path
            d={generatePath()}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animate ? "animate-pulse" : ""}
          />
          
          {/* Data points */}
          {showDots && generateDataPoints()}
          
          {/* Y-axis labels */}
          {generateYLabels()}
          
          {/* X-axis labels */}
          {generateXLabels()}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: color }}
          ></div>
          <span>Engagement</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
          <span>Trend</span>
        </div>
      </div>
    </div>
  );
}
