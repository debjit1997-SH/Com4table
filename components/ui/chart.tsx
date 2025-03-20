export const Bar = ({ dataKey, fill, radius, className, ...props }) => {
  return <rect className={className} fill={fill} {...props} />
}

export const BarChart = ({ data, children, ...props }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 300" {...props}>
      {children}
    </svg>
  )
}

export const CartesianGrid = ({ strokeDasharray, ...props }) => {
  return <g strokeDasharray={strokeDasharray} {...props} />
}

export const ResponsiveContainer = ({ children, width, height, ...props }) => {
  return (
    <div style={{ width: width || "100%", height: height || "300px" }} {...props}>
      {children}
    </div>
  )
}

export const XAxis = ({ dataKey, stroke, fontSize, tickLine, axisLine, ...props }) => {
  return <g stroke={stroke} fontSize={fontSize} {...props} />
}

export const YAxis = ({ stroke, fontSize, tickLine, axisLine, ...props }) => {
  return <g stroke={stroke} fontSize={fontSize} {...props} />
}

export const Tooltip = ({ contentStyle, labelStyle, itemStyle, ...props }) => {
  return <div style={contentStyle} {...props} />
}

export const Legend = (props) => {
  return <div {...props} />
}

export const Line = (props) => {
  return <path {...props} />
}

export const LineChart = ({ data, children, ...props }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 300" {...props}>
      {children}
    </svg>
  )
}

