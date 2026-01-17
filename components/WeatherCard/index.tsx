"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WeatherData = {
  location: string;
  temperature: number | string;
  feelsLike?: number | string;
  humidity?: number | string;
  condition?: string;
  windSpeed?: number | string;
};

export function WeatherCard({
  data,
  className,
}: {
  data: WeatherData;
  className?: string;
}) {
  if (!data) return null;
  return (
    <Card className={cn("p-4 space-y-2 bg-sky-50 border-sky-100", className)}>
      <div className="text-sm font-semibold text-sky-700">Weather</div>
      <div className="text-xl font-bold text-sky-900 capitalize">
        {data.location}
      </div>
      <div className="text-3xl font-semibold text-sky-800">
        {data.temperature}°{typeof data.temperature === "number" ? "C" : ""}
      </div>
      {data.condition && (
        <p className="text-sky-700 capitalize">{data.condition}</p>
      )}
      <div className="grid grid-cols-2 gap-2 text-xs text-sky-700">
        {data.feelsLike !== undefined && (
          <div>Feels like: {data.feelsLike}°C</div>
        )}
        {data.humidity !== undefined && <div>Humidity: {data.humidity}%</div>}
        {data.windSpeed !== undefined && <div>Wind: {data.windSpeed} km/h</div>}
      </div>
    </Card>
  );
}
