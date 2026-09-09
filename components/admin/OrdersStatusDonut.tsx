"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Slice = { status: string; label: string; count: number; color: string };

export default function OrdersStatusDonut({
  data,
  total,
}: {
  data: Slice[];
  total: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((slice) => (
                <Cell key={slice.status} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-navy">{total}</span>
          <span className="text-xs text-neutral-400">commandes</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        {data.map((slice) => (
          <div key={slice.status} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-neutral-600">{slice.label}</span>
            </div>
            <span className="font-medium text-navy">
              {slice.count} ({total > 0 ? Math.round((slice.count / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
