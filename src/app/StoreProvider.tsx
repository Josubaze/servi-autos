'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from 'src/redux/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Reutiliza la misma tienda entre renders
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
