export const createProgress = (setProgress) => {
  let percent = 0;
  let interval = setInterval(() => {
    if (percent < 72) {
      percent = Math.min(72, percent + Math.round(Math.random() * 7));
      setProgress(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(92, percent + 1);
        setProgress(percent);
        if (percent >= 92) clearInterval(interval);
      }, 180);
    }
  }, 90);

  return {
    stop() {
      clearInterval(interval);
    },
    loaded() {
      return new Promise((resolve) => {
        if (percent >= 100) {
          setProgress(100);
          resolve();
          return;
        }
        clearInterval(interval);
        interval = setInterval(() => {
          percent += 2;
          if (percent >= 100) {
            percent = 100;
            setProgress(100);
            clearInterval(interval);
            resolve();
          } else {
            setProgress(percent);
          }
        }, 16);
      });
    },
  };
};
