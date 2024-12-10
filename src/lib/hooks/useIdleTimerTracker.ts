import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const useIdleTimerTracker = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const { getElapsedTime, reset } = useIdleTimer({
    throttle: 500,
    eventsThrottle: 500,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.ceil(getElapsedTime() / 1000));
    }, 1000);

    // If the elapsed time is greater than or equal to 3 mins, set isIdle to true
    if (elapsedTime >= 60 * 3) {
      setIsIdle(true);
    } else if (elapsedTime < 60 * 3) {
      setIsIdle(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [elapsedTime]);

  return { isIdle, setIsIdle, reset };
};

export default useIdleTimerTracker;
