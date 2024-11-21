export const getCurrentUnixTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const addSeconds = (date: Date, seconds: number) => {
  const newDate = new Date(date.getTime()); // Create a new Date object to avoid mutating the original date
  newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
};
