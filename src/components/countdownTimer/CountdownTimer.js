import React, { useState, useEffect } from "react";

const CountdownTimer = ({
  initialMinutes = 5,
  initialSeconds = 0,
  isSessionEnded,
}) => {
  const [time, setTime] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const { minutes, seconds } = time;

      if (seconds > 0) {
        setTime({ minutes, seconds: seconds - 1 });
      } else if (minutes > 0) {
        setTime({ minutes: minutes - 1, seconds: 59 });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    if (time.seconds === 0 && time.minutes === 0) {
      isSessionEnded();
    }
    return () => clearInterval(timer); // Cleanup on component unmount
  }, [time]);

  return (
    <div>
      <h1>
        {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
        {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
      </h1>
    </div>
  );
};

export default CountdownTimer;
