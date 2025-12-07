export interface MonthData {
  id: number;
  name: string;
  hindiName: string;
  imageUrl: string;
  backImageUrl?: string;
}

// Month names template
const MONTH_NAMES = [
  { id: 1, name: "January", hindiName: "जनवरी", short: "jan" },
  { id: 2, name: "February", hindiName: "फरवरी", short: "feb" },
  { id: 3, name: "March", hindiName: "मार्च", short: "march" },
  { id: 4, name: "April", hindiName: "अप्रैल", short: "april" },
  { id: 5, name: "May", hindiName: "मई", short: "may" },
  { id: 6, name: "June", hindiName: "जून", short: "june" },
  { id: 7, name: "July", hindiName: "जुलाई", short: "july" },
  { id: 8, name: "August", hindiName: "अगस्त", short: "aug" },
  { id: 9, name: "September", hindiName: "सितंबर", short: "sep" },
  { id: 10, name: "October", hindiName: "अक्टूबर", short: "oct" },
  { id: 11, name: "November", hindiName: "नवंबर", short: "nov" },
  { id: 12, name: "December", hindiName: "दिसंबर", short: "dec" },
  { id: 13, name: "Tithi Darpan", hindiName: "तिथि दर्पण", short: "tithi-darpan" },
];

// Helper to get image URL with fallback to placeholder
function getImageUrl(baseUrl: string, filename: string, usePlaceholder: boolean = false): string {
  if (usePlaceholder) {
    return `https://via.placeholder.com/800x1200/FEF3C7/D97706?text=${encodeURIComponent(filename)}`;
  }
  return `${baseUrl}/${filename}`;
}

// Helper to get Tithi Darpan image URL (special case - no front/back)
function getTithiDarpanUrl(baseUrl: string, year: number): string {
  return `${baseUrl}/tithi-darpan-${year}.jpg`;
}

// Get months for a specific year
export function getMonthsForYear(year: number): MonthData[] {
  const yearStr = year.toString();
  
  switch (year) {
    case 2021:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calander-2021";
        // Tithi Darpan has special URL format
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2021),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2021-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2021-back.jpg`),
        };
      });
    
    case 2022:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calander-2022";
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2022),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2022-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2022-back.jpg`),
        };
      });
    
    case 2023:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calander-2023";
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2023),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2023-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2023-back.jpg`),
        };
      });
    
    case 2024:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calender-2024";
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2024),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2024-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2024-back.jpg`),
        };
      });
    
    case 2025:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calender-2025";
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2025),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2025-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2025-back.jpg`),
        };
      });
    
    case 2026:
      return MONTH_NAMES.map((month) => {
        const baseUrl = "https://ik.imagekit.io/amargranthalya/calender-2026";
        if (month.id === 13) {
          return {
            ...month,
            imageUrl: getTithiDarpanUrl(baseUrl, 2026),
            backImageUrl: undefined,
          };
        }
        return {
          ...month,
          imageUrl: getImageUrl(baseUrl, `${month.short}-2026-front.jpg`),
          backImageUrl: getImageUrl(baseUrl, `${month.short}-2026-back.jpg`),
        };
      });
    
    default:
      // Placeholder images for other years
      return MONTH_NAMES.map((month) => ({
        ...month,
        imageUrl: getImageUrl(
          "",
          `${month.name} ${year} Front`,
          true
        ),
        backImageUrl: month.id <= 12 ? getImageUrl(
          "",
          `${month.name} ${year} Back`,
          true
        ) : undefined,
      }));
  }
}

// Available years (2021-2026)
export const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

// Export MONTHS for backward compatibility
const currentYear = new Date().getFullYear();
export const MONTHS = getMonthsForYear(
  YEARS.includes(currentYear) ? currentYear : 2026
);

export function getCurrentMonthIndex(): number {
  return new Date().getMonth();
}
