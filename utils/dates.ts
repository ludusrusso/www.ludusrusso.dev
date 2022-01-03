export const datePlusSeconds = (secs: number, date = new Date()) => {
  return new Date(date.getTime() + secs * 1000);
};

export const datePlusMinutes = (mins: number, date = new Date()) => {
  return datePlusSeconds(mins * 60, date);
};

export const datePlusHours = (hours: number, date = new Date()) => {
  return datePlusSeconds(hours * 60 * 60, date);
};

export const datePlusDays = (days: number, date = new Date()) => {
  return datePlusSeconds(days * 24 * 60 * 60, date);
};
