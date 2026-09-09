import { TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "@/components/admin/Sparkline";

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  changePct,
  sparkline,
  sparklineColor,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  changePct: number | null;
  sparkline: number[];
  sparklineColor: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-0.5 text-xl font-bold text-navy">{value}</p>
      <div className="mt-2 flex items-center justify-between">
        {changePct !== null ? (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              changePct >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {changePct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {changePct >= 0 ? "+" : ""}
            {changePct.toFixed(1)}%
          </span>
        ) : (
          <span className="text-xs text-neutral-300">—</span>
        )}
        <div className="w-20">
          <Sparkline data={sparkline} color={sparklineColor} />
        </div>
      </div>
    </div>
  );
}
