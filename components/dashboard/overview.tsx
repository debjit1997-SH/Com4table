"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2300,
  },
  {
    name: "Mar",
    total: 3200,
  },
  {
    name: "Apr",
    total: 4500,
  },
  {
    name: "May",
    total: 4200,
  },
  {
    name: "Jun",
    total: 5800,
  },
  {
    name: "Jul",
    total: 6100,
  },
  {
    name: "Aug",
    total: 5900,
  },
  {
    name: "Sep",
    total: 7200,
  },
  {
    name: "Oct",
    total: 8100,
  },
  {
    name: "Nov",
    total: 9000,
  },
  {
    name: "Dec",
    total: 10200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical="false" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          contentStyle={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
          itemStyle={{ color: "var(--primary)" }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

