export interface DayActivity {
  day: number;
  dayName: string;
  focus: string;
  activities: {
    warmUp: string;
    mainFocus: string;
    practice: string;
    review: string;
  };
  resources: string[];
  timeBreakdown: {
    activity: string;
    duration: string;
    description: string;
  }[];
}

export interface WeekData {
  title: string;
  focus: string;
  phase: "B1-B2" | "B2-C1" | "C1-IELTS" | "C1-FINAL";
  days: DayActivity[];
}
