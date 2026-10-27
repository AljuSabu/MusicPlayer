"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center gap-4 text-black">
      <button
        onClick={() => setCount(count - 1)}
        className="rounded-full bg-yellow-500 px-4 py-2 hover:bg-yellow-400"
      >
        -
      </button>

      <span className="text-white">count - {count}</span>

      <button
        onClick={() => setCount(count + 1)}
        className="rounded-full bg-green-500 px-4 py-2 hover:bg-green-400"
      >
        +
      </button>
    </div>
  );
}
