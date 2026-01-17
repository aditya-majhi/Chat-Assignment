"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StockData = {
  symbol: string;
  price?: string | number;
  volume?: string | number;
  latestTradingDay?: string;
};

export function StockCard({
  data,
  className,
}: {
  data: StockData;
  className?: string;
}) {
  if (!data) return null;
  return (
    <Card
      className={cn(
        "p-4 space-y-2 bg-emerald-50 border-emerald-100",
        className
      )}
    >
      <div className="text-sm font-semibold text-emerald-700">Stock</div>
      <div className="text-xl font-bold text-emerald-900">{data.symbol}</div>
      <div className="text-3xl font-semibold text-emerald-800">
        {data.price}
      </div>
      <div className="text-xs text-emerald-700 space-y-1">
        {data.volume && <div>Vol: {data.volume}</div>}
        {data.latestTradingDay && <div>As of: {data.latestTradingDay}</div>}
      </div>
    </Card>
  );
}
