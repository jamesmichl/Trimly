export const BUSINESS_TIME_ZONE = "Asia/Jakarta";

function getBusinessDateTimeParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!year || !month || !day || !hour || !minute) {
    throw new Error("Unable to determine business date and time.");
  }

  return {
    year,
    month,
    day,
    hour,
    minute,
  };
}

export function getBusinessDate() {
  const { year, month, day } = getBusinessDateTimeParts();

  return `${year}-${month}-${day}`;
}

export function getBusinessTime() {
  const { hour, minute } = getBusinessDateTimeParts();

  return `${hour}:${minute}`;
}

export function parseBookingDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);

  const bookingDate = new Date(
    Date.UTC(year, month - 1, day),
  );

  if (
    bookingDate.getUTCFullYear() !== year ||
    bookingDate.getUTCMonth() !== month - 1 ||
    bookingDate.getUTCDate() !== day
  ) {
    return null;
  }

  return bookingDate;
}