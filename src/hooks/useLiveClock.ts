import { useState, useEffect } from 'react';
import { getDynamicDateInfo, DynamicDateInfo } from '../utils/dateUtils';

export function useLiveClock(): DynamicDateInfo {
  const [dateInfo, setDateInfo] = useState<DynamicDateInfo>(() => getDynamicDateInfo());

  useEffect(() => {
    // Tick every second to ensure live time and date roll over automatically
    const interval = setInterval(() => {
      setDateInfo(getDynamicDateInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return dateInfo;
}
