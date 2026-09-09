"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Point = { label: string; total: number };

export default function SalesEvolutionChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003B7A" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#003B7A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
        />
        <Tooltip
          formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Ventes"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#003B7A"
          strokeWidth={2.5}
          fill="url(#salesFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
