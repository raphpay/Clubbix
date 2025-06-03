export type Schedule = {
  [day: string]: ScheduleTimeRange[];
};

export type ScheduleTimeRange = {
  open: string;
  close: string;
};
