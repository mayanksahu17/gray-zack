import type React from "react"

export const Chart = () => {
  return <div>Chart</div>
}

export const ChartArea = () => {
  return <div>ChartArea</div>
}

export const ChartAxisOptions = () => {
  return <div>ChartAxisOptions</div>
}

export const ChartBar = () => {
  return <div>ChartBar</div>
}

export const ChartContainer = ({
  children,
  config,
  className,
}: { children: React.ReactNode; config?: any; className?: string }) => {
  return <div className={className}>{children}</div>
}

export const ChartGrid = () => {
  return <div>ChartGrid</div>
}

export const ChartLine = () => {
  return <div>ChartLine</div>
}

export const ChartLineSeries = () => {
  return <div>ChartLineSeries</div>
}

export const ChartPie = () => {
  return <div>ChartPie</div>
}

export const ChartTooltip = () => {
  return <div>ChartTooltip</div>
}

export const ChartTooltipContent = () => {
  return <div>ChartTooltipContent</div>
}

export const ChartXAxis = () => {
  return <div>ChartXAxis</div>
}

export const ChartYAxis = () => {
  return <div>ChartYAxis</div>
}

