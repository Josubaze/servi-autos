"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { increment } from "src/redux/features/couterSlice";
import { fetchProductsRedux } from 'src/redux/features/productSlice';
function Home() {
  const count = useAppSelector((state) => state.counter.counter);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.list);
  const status = useAppSelector((state) => state.products.status);
  const error = useAppSelector((state) => state.products.error);
 
  useEffect(() => {
      dispatch(fetchProductsRedux());
  }, []);

  return (
    <>
      <div>
        <h1>Counter App</h1>
        <h4 style={{ marginBottom: 16 }}>{count}</h4>
        <button onClick={() => dispatch(increment())}>increment</button>
      </div>
      <div>
      <h1>Product List</h1>
      { status === "loading" ? (
            <div style={{ padding: 8 , color: "red"}} >estado de la lista: {status} </div>
      ) : (
        <ul>
        { status === "idle" }
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      )}
      </div>
    </>
  );
}

export default Home;