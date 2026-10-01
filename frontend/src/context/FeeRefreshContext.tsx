import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type FeeRefreshContextValue = {
  refreshToken: number;
  notifyFeeDataChanged: () => void;
};

const FeeRefreshContext = createContext<FeeRefreshContextValue | undefined>(undefined);

export function FeeRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshToken, setRefreshToken] = useState(0);

  const notifyFeeDataChanged = useCallback(() => {
    setRefreshToken((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({
      refreshToken,
      notifyFeeDataChanged,
    }),
    [refreshToken, notifyFeeDataChanged],
  );

  return <FeeRefreshContext.Provider value={value}>{children}</FeeRefreshContext.Provider>;
}

export function useFeeRefresh(): FeeRefreshContextValue {
  const context = useContext(FeeRefreshContext);
  if (!context) {
    throw new Error('useFeeRefresh must be used within FeeRefreshProvider');
  }
  return context;
}
