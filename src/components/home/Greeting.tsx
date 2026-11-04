"use client";

import { useSyncExternalStore } from "react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const subscribe = () => () => {};

export default function Greeting() {
  const text = useSyncExternalStore(
    subscribe,
    getGreeting,
    () => "Welcome back",
  );

  return (
    <div className="mb-5 flex items-center justify-between">
      <h1 className="text-[28px] font-bold leading-10 tracking-tight text-white sm:text-[32px]">
        {text}
      </h1>
      <span className="font-mono text-xs text-[#6B7A75]">Quick Access</span>
    </div>
  );
}
