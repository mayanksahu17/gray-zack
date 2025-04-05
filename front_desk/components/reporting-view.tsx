"use client"

import { useState } from "react"
import { Download, Filter, Printer, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReportingView() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 2, 1),
    to: new Date(2025, 2, 10),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <Label>Date Range</Label>
          <DatePickerWithRange className="w-full max-w-sm" />
        </div>
        <div className="flex gap-2">
          <div>
            <Label htmlFor="report-type" className="sr-only">
              Report Type
            </Label>
            <Select defaultValue="occupancy">
              <SelectTrigger id="report-type" className="w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupancy">Occupancy</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="adr">ADR</SelectItem>
                <SelectItem value="revpar">RevPAR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76.4%</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      grid: {
                        x: {
                          show: false,
                        },
                        y: {
                          show: false,
                        },
                      },
                      xAxis: {
                        type: "category",
                        show: false,
                      },
                      yAxis: {
                        show: false,
                        min: 0,
                        max: 100,
                      },
                      tooltip: {
                        show: false,
                      },
                    }}
                    series={[
                      {
                        type: "line",
                        data: [65, 68, 70, 72, 69, 74, 76],
                        smooth: true,
                        areaStyle: {},
                        lineStyle: {
                          color: "hsl(var(--primary))",
                          width: 2,
                        },
                        itemStyle: {
                          color: "hsl(var(--primary))",
                        },
                        areaStyle: {
                          color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                              {
                                offset: 0,
                                color: "hsla(var(--primary), 0.3)",
                              },
                              {
                                offset: 1,
                                color: "hsla(var(--primary), 0)",
                              },
                            ],
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$189.50</div>
                <p className="text-xs text-muted-foreground">+$12.40 from last month</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      grid: {
                        x: {
                          show: false,
                        },
                        y: {
                          show: false,
                        },
                      },
                      xAxis: {
                        type: "category",
                        show: false,
                      },
                      yAxis: {
                        show: false,
                      },
                      tooltip: {
                        show: false,
                      },
                    }}
                    series={[
                      {
                        type: "line",
                        data: [165, 170, 175, 180, 185, 187, 189.5],
                        smooth: true,
                        lineStyle: {
                          color: "hsl(var(--primary))",
                          width: 2,
                        },
                        itemStyle: {
                          color: "hsl(var(--primary))",
                        },
                        areaStyle: {
                          color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                              {
                                offset: 0,
                                color: "hsla(var(--primary), 0.3)",
                              },
                              {
                                offset: 1,
                                color: "hsla(var(--primary), 0)",
                              },
                            ],
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$144.78</div>
                <p className="text-xs text-muted-foreground">+$18.32 from last month</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      grid: {
                        x: {
                          show: false,
                        },
                        y: {
                          show: false,
                        },
                      },
                      xAxis: {
                        type: "category",
                        show: false,
                      },
                      yAxis: {
                        show: false,
                      },
                      tooltip: {
                        show: false,
                      },
                    }}
                    series={[
                      {
                        type: "line",
                        data: [110, 115, 125, 130, 135, 140, 144.78],
                        smooth: true,
                        lineStyle: {
                          color: "hsl(var(--primary))",
                          width: 2,
                        },
                        itemStyle: {
                          color: "hsl(var(--primary))",
                        },
                        areaStyle: {
                          color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                              {
                                offset: 0,
                                color: "hsla(var(--primary), 0.3)",
                              },
                              {
                                offset: 1,
                                color: "hsla(var(--primary), 0)",
                              },
                            ],
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42,856</div>
                <p className="text-xs text-muted-foreground">+$4,320 from last month</p>
                <div className="mt-4 h-[80px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      grid: {
                        x: {
                          show: false,
                        },
                        y: {
                          show: false,
                        },
                      },
                      xAxis: {
                        type: "category",
                        show: false,
                      },
                      yAxis: {
                        show: false,
                      },
                      tooltip: {
                        show: false,
                      },
                    }}
                    series={[
                      {
                        type: "line",
                        data: [32000, 34500, 36000, 38500, 40000, 41500, 42856],
                        smooth: true,
                        lineStyle: {
                          color: "hsl(var(--primary))",
                          width: 2,
                        },
                        itemStyle: {
                          color: "hsl(var(--primary))",
                        },
                        areaStyle: {
                          color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                              {
                                offset: 0,
                                color: "hsla(var(--primary), 0.3)",
                              },
                              {
                                offset: 1,
                                color: "hsla(var(--primary), 0)",
                              },
                            ],
                          },
                        },
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Occupancy by Room Type</CardTitle>
                <CardDescription>March 1-10, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      tooltip: {
                        trigger: "item",
                      },
                      legend: {
                        orient: "vertical",
                        right: 10,
                        top: "center",
                      },
                    }}
                    series={[
                      {
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                          borderRadius: 10,
                          borderColor: "#fff",
                          borderWidth: 2,
                        },
                        label: {
                          show: false,
                          position: "center",
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: "bold",
                          },
                        },
                        labelLine: {
                          show: false,
                        },
                        data: [
                          { value: 42, name: "Standard Rooms" },
                          { value: 28, name: "Deluxe Rooms" },
                          { value: 18, name: "Junior Suites" },
                          { value: 8, name: "Executive Suites" },
                          { value: 4, name: "Presidential Suites" },
                        ],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>March 1-10, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      tooltip: {
                        trigger: "axis",
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                      legend: {
                        data: ["Room Revenue", "F&B Revenue", "Other Revenue"],
                      },
                      grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true,
                      },
                      xAxis: {
                        type: "value",
                      },
                      yAxis: {
                        type: "category",
                        data: ["Presidential", "Executive", "Junior", "Deluxe", "Standard"],
                      },
                    }}
                    series={[
                      {
                        name: "Room Revenue",
                        type: "bar",
                        stack: "total",
                        label: {
                          show: false,
                        },
                        emphasis: {
                          focus: "series",
                        },
                        data: [4200, 6800, 9500, 12500, 15000],
                      },
                      {
                        name: "F&B Revenue",
                        type: "bar",
                        stack: "total",
                        label: {
                          show: false,
                        },
                        emphasis: {
                          focus: "series",
                        },
                        data: [1800, 2200, 3500, 4200, 5500],
                      },
                      {
                        name: "Other Revenue",
                        type: "bar",
                        stack: "total",
                        label: {
                          show: false,
                        },
                        emphasis: {
                          focus: "series",
                        },
                        data: [800, 1200, 1500, 1800, 2200],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Occupancy & Revenue</CardTitle>
              <CardDescription>March 1-10, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  className="h-full w-full"
                  config={{
                    tooltip: {
                      trigger: "axis",
                      axisPointer: {
                        type: "cross",
                        crossStyle: {
                          color: "#999",
                        },
                      },
                    },
                    legend: {
                      data: ["Occupancy Rate", "ADR", "Revenue"],
                    },
                    xAxis: [
                      {
                        type: "category",
                        data: [
                          "Mar 1",
                          "Mar 2",
                          "Mar 3",
                          "Mar 4",
                          "Mar 5",
                          "Mar 6",
                          "Mar 7",
                          "Mar 8",
                          "Mar 9",
                          "Mar 10",
                        ],
                        axisPointer: {
                          type: "shadow",
                        },
                      },
                    ],
                    yAxis: [
                      {
                        type: "value",
                        name: "Occupancy",
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                          formatter: "{value}%",
                        },
                      },
                      {
                        type: "value",
                        name: "Revenue",
                        min: 0,
                        max: 10000,
                        interval: 2000,
                        axisLabel: {
                          formatter: "${value}",
                        },
                      },
                    ],
                  }}
                  series={[
                    {
                      name: "Occupancy Rate",
                      type: "bar",
                      data: [65, 70, 75, 72, 68, 74, 80, 85, 82, 78],
                    },
                    {
                      name: "ADR",
                      type: "line",
                      yAxisIndex: 1,
                      data: [180, 185, 190, 188, 182, 185, 195, 200, 198, 192],
                    },
                    {
                      name: "Revenue",
                      type: "line",
                      yAxisIndex: 1,
                      data: [4500, 4800, 5200, 4900, 4600, 5000, 5500, 6000, 5800, 5400],
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="occupancy" className="mt-4">
          {/* Occupancy specific reports would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Reports</CardTitle>
              <CardDescription>Detailed occupancy analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select specific occupancy reports from the filters above.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="mt-4">
          {/* Revenue specific reports would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Reports</CardTitle>
              <CardDescription>Detailed revenue analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select specific revenue reports from the filters above.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guests" className="mt-4">
          {/* Guest specific reports would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Reports</CardTitle>
              <CardDescription>Detailed guest analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select specific guest reports from the filters above.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

