export const nowPlusSeconds = (secs: number) => {
  return new Date(new Date().getTime() + secs * 1000);
};

export const nowPlusMinutes = (mins: number) => {
  return nowPlusSeconds(mins * 60);
};

export const nowPlusHours = (hours: number) => {
  return nowPlusSeconds(hours * 60 * 60);
};

export const nowPlusDays = (days: number) => {
  return nowPlusSeconds(days * 24 * 60 * 60);
};
