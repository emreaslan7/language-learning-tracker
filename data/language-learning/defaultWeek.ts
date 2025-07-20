import { DayActivity } from "./types";
import { getWeeklyAITopics } from "./aiTopics";

export const generateDefaultWeekDays = (
  weekNumber: number,
  weekFocusTopics?: string[]
): DayActivity[] => {
  const days = [];
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // If specific focus topics are provided, use them, otherwise use default topics
  const focuses = weekFocusTopics || [
    "Grammar & Vocabulary",
    "Listening & Reading",
    "Writing & Practice",
    "Speaking & AI",
    "Listening & Culture",
    "Vocabulary Reinforcement",
    "General Review",
  ];

  // Writing plan: 4 times per week (Monday=comprehensive, Tuesday/Thursday/Saturday=note taking)
  const writingDays = [1, 2, 4, 6]; // Monday, Tuesday, Thursday, Saturday
  const writingTypes = [
    "Comprehensive Essay",
    "Daily Notes",
    "Daily Notes",
    "Daily Notes",
  ];

  // AI Conversation Topics - Different 7 topics for each week
  const aiTopics = getWeeklyAITopics(weekNumber);

  for (let i = 1; i <= 7; i++) {
    const isWritingDay = writingDays.includes(i);
    const writingIndex = writingDays.indexOf(i);
    const writingType = writingIndex !== -1 ? writingTypes[writingIndex] : null;

    days.push({
      day: i,
      dayName: dayNames[i - 1],
      focus: focuses[i - 1] || `Day ${i} Focus Topic`,
      activities: {
        warmUp: `Previous Day Review: Review the main topic and words you learned yesterday`,
        mainFocus: `Main Topic Study: ${
          focuses[i - 1] || "Today's main topic"
        }`,
        practice: `AI English Practice: ${aiTopics[i - 1]}${
          isWritingDay ? ` + Writing: ${writingType}` : ""
        }`,
        review: `New Words: Learn and record 5-10 new words\nEvaluation: Analyze today's performance`,
      },
      resources: [
        "Relevant Raymond Murphy grammar book section",
        "Weekly vocabulary list",
        "AI conversation practice platform (ChatGPT, Claude etc.)",
        isWritingDay
          ? "Writing template and rubric"
          : "Listening/reading materials",
        "Online practice resources",
      ],
      timeBreakdown: [
        {
          activity: "Previous Day Review",
          duration: "10 min",
          description: "Reinforcing main topic and vocabulary",
        },
        {
          activity: "Main Topic Study",
          duration: "25 min",
          description: "Detailed study of today's main topic",
        },
        {
          activity: "AI English Practice",
          duration: isWritingDay ? "20 min" : "30 min",
          description: `Speaking practice: ${aiTopics[i - 1]}`,
        },
        ...(isWritingDay
          ? [
              {
                activity: `Writing: ${writingType}`,
                duration:
                  writingType === "Comprehensive Essay" ? "25 min" : "15 min",
                description:
                  writingType === "Comprehensive Essay"
                    ? "Detailed planning and writing"
                    : "Daily note-taking style writing",
              },
            ]
          : []),
        {
          activity: "New Words",
          duration: "10 min",
          description: "Learning and recording 5-10 new words",
        },
        {
          activity: "Evaluation",
          duration: "10 min",
          description: "Evaluating today's performance and note-taking",
        },
      ],
    });
  }

  return days as DayActivity[];
};
