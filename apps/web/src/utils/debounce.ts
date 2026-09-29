/* eslint-disable @typescript-eslint/no-explicit-any */
function debounce(callback: (...args: any) => void, delay: number) {
  let timer: NodeJS.Timeout | null;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
}

export default debounce;
