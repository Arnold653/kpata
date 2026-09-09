"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
