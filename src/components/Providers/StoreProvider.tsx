'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function StoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: any;
}) {
  const isHydrating = useRef(true);

  useEffect(() => {
    if (isHydrating.current && initialState?.success) {
      useAppStore.getState().setHydratedState(initialState.data);
      isHydrating.current = false;
    }
  }, [initialState]);

  return <>{children}</>;
}
