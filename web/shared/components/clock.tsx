"use client";

import { useRealTime } from "@/shared/hooks/useTime";

export default function Clock() {
  const { dateString, timeString } = useRealTime();

  return (
    <div className="flex flex-col items-end text-[10px] text-muted-foreground leading-tight">
      <span className="font-medium text-foreground capitalize">
        {dateString}
      </span>
      <span>{timeString}</span>
    </div>
  );
}
