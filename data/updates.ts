export interface Update {
  id: string;
  date: string;
  content: string;
}

// Month-level dates from the original portfolio; no publication day is inferred.
export const updates: Update[] = [
  {
    id: "distance-de-fee",
    date: "2025-04",
    content: "Distance de Fée — recording, mixing and mastering for the DMU313 final project, with Yolanda Tapia on piano and Roan Ma on violin.",
  },
  {
    id: "improvisation-in-a-flat",
    date: "2025-02",
    content: "Improvisation in A-Flat — a recording of Shawn Boulet’s piano performance, mixed and mastered by Echo.",
  },
  {
    id: "5gw-tsticks",
    date: "2024-08",
    content: "Summer work on 5GW T-Sticks at McGill’s Input Devices and Music Interaction Laboratory, May–August 2024.",
  },
];

export function formatUpdateDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return day ? `${months[month - 1]} ${day}, ${year}` : `${months[month - 1]} ${year}`;
}
