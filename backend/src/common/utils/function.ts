export const runWithTimeout = (fun: () => void, timeout: number) => {
  setTimeout(fun, timeout);
};
