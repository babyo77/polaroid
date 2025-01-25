"use client";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

function Analytics() {
  useEffect(() => {
    Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID as string);
  }, []);
  return null;
}

export default Analytics;
