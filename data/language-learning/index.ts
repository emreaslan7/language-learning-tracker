import { WeekData } from "./types";
import { dailyFocusTopics } from "./dailyFocus";
import { generateDefaultWeekDays } from "./defaultWeek";

// Hafta başlıkları ve odak alanları
const weekTitles: { [key: number]: string } = {
  // AŞAMA 1: B1 PEKİŞTİRME VE B2 TEMELLERİ (1-16. haftalar)
  1: "B1 Temelleri ve Günlük Rutinler",
  2: "Geçmiş Zamanlar ve Seyahat",
  3: "Gelecek Zamanlar ve Planlar",
  4: "Modal Fiiller - Yetenek ve İzin",
  5: "Present Perfect - Deneyimler",
  6: "Present Perfect Continuous",
  7: "Pasif Çatı Temelleri",
  8: "Edatlar (Prepositions)",
  9: "Sıfatlar ve Zarflar",
  10: "Koşullu Cümleler (Conditionals)",
  11: "Relative Clauses",
  12: "Reported Speech",
  13: "Phrasal Verbs",
  14: "B1-B2 Genel Tekrar",
  15: "Kelime Dağarcığı Genişletme",
  16: "IELTS Formatı Tanıtımı",

  // AŞAMA 2: B2 USTALIK VE C1'E GİRİŞ (17-32. haftalar)
  17: "İleri Koşullu Cümleler",
  18: "Reported Speech İleri",
  19: "Pasif Çatı İleri",
  20: "Inversion (Devrik Cümle)",
  21: "Cleft Sentences (Vurgulu Cümleler)",
  22: "İleri Bağlaçlar (Connectors)",
  23: "Paraphrasing (Yeniden İfade)",
  24: "IELTS Listening Part 3&4",
  25: "IELTS Reading T/F/NG",
  26: "IELTS Reading Matching",
  27: "IELTS Writing Task 1",
  28: "IELTS Writing Task 2 Structure",
  29: "IELTS Speaking Part 2",
  30: "IELTS Speaking Part 3",
  31: "B2 Genel Tekrar",
  32: "Transition to C1",

  // AŞAMA 3: C1 GELİŞTİRME VE IELTS ODAKLI HAZIRLIK (33-48. haftalar)
  33: "C1 Karmaşık Yapılar",
  34: "C1 Deyimler ve Collocations",
  35: "IELTS Writing Sophistication",
  36: "IELTS Speaking Fluency",
  37: "IELTS Listening Mastery",
  38: "IELTS Reading Advanced",
  39: "IELTS Strategy Refinement",
  40: "Performance Analysis",
  41: "Listening & Reading Focus",
  42: "Writing & Speaking Focus",
  43: "IELTS Writing Speed",
  44: "IELTS Speaking Polish",
  45: "Practice Marathon 1",
  46: "Practice Marathon 2",
  47: "Comprehensive Review",
  48: "Pre-Exam Preparation",

  // AŞAMA 4: C1 PEKİŞTİRME VE SINAV ÖNCESİ SON HAZIRLIK (49-52. haftalar)
  49: "Comprehensive Review",
  50: "Strategy Automation",
  51: "Final Assessment",
  52: "Exam Week Preparation",
};

export const getWeekData = (weekNumber: number): WeekData => {
  if (weekNumber < 1 || weekNumber > 52) {
    throw new Error("Hafta numarası 1-52 arasında olmalıdır");
  }

  // Her hafta için 7 günlük ana odak konularını al
  const startDay = (weekNumber - 1) * 7;
  const weekFocusTopics = dailyFocusTopics.slice(startDay, startDay + 7);
  // Aşama belirleme
  let level: "B1-B2" | "B2-C1" | "C1-IELTS" | "C1-FINAL";

  if (weekNumber <= 16) {
    level = "B1-B2";
  } else if (weekNumber <= 32) {
    level = "B2-C1";
  } else if (weekNumber <= 48) {
    level = "C1-IELTS";
  } else {
    level = "C1-FINAL";
  }

  // Hafta odak özeti oluştur
  const weekFocus = weekFocusTopics.slice(0, 3).join(", ");

  return {
    title: weekTitles[weekNumber] || `Hafta ${weekNumber}`,
    focus: weekFocus,
    phase: level,
    days: generateDefaultWeekDays(weekNumber, weekFocusTopics),
  };
};
