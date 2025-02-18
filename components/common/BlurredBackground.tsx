import React from "react";
import { cn } from "@/lib/utils";

interface BlurredBackgroundProps {
  image: string;
  className?: string;
}

export default function BlurredBackground({
  image,
  className,
}: BlurredBackgroundProps) {
  return (
    <div className="absolute max-md:hidden inset-0 overflow-hidden">
      <div
        className={cn(
          "absolute inset-[-1%] bg-cover transition-all duration-300 bg-center bg-no-repeat blur-[20px]",
          className
        )}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
}
