"use client";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { increment } from "src/redux/features/couterSlice";

// solo para probar el redux
function Home() {
  const count = useAppSelector((state) => state.counter.counter);
  const dispatch = useAppDispatch();
  return (
      <div>
        <h1>Counter App</h1>
        <h4 style={{ marginBottom: 16 }}>{count}</h4>
        <button onClick={() => dispatch(increment())}>increment</button>
      </div>
  );
}

export default Home;