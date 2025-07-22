export interface TimeSlot {
  starttime: string;
  endtime: string;
}

export interface DayAvailability {
  day: string;
  isAvailable: boolean;
  allDay: boolean;
  timeSlots: TimeSlot[];
}

export interface TutorAvailabilitySettings {
  weeklySchedule: DayAvailability[];
  disabledDates: string[]; // ISO date strings
}
