"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type F1Data = {
  raceName: string;
  round?: string;
  season?: string;
  date?: string;
  time?: string;
  circuit?: {
    name?: string;
    location?: string;
    country?: string;
  };
  location?: string;
  url?: string;
};

export function F1Card({
  data,
  className,
}: {
  data: F1Data;
  className?: string;
}) {
  if (!data) return null;
  return (
    <Card
      className={cn("p-4 space-y-2 bg-amber-50 border-amber-100", className)}
    >
      <div className="text-sm font-semibold text-amber-700">Next F1 Race</div>
      <div className="text-xl font-bold text-amber-900">{data.raceName}</div>
      <div className="text-sm text-amber-800">
        {data.season && <>Season {data.season} · </>}
        {data.round && <>Round {data.round}</>}
      </div>
      <div className="text-sm text-amber-800">{data.date}</div>
      {(data.circuit?.name || data.location || data.circuit?.country) && (
        <div className="text-sm text-amber-800">
          {data.circuit?.name || data.location}{" "}
          {data.circuit?.country && `· ${data.circuit.country}`}
        </div>
      )}
      {data.url && (
        <a
          className="text-xs text-amber-700 underline"
          href={data.url}
          target="_blank"
          rel="noreferrer"
        >
          View details
        </a>
      )}
    </Card>
  );
}
