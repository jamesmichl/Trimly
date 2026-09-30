export function normalizeIndonesianPhoneNumber(
  phoneNumber: string,
) {
  const cleaned = phoneNumber.replace(/[\s\-().]/g, "");

  if (cleaned.startsWith("+62")) {
    return `62${cleaned.slice(3)}`;
  }

  if (cleaned.startsWith("62")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `62${cleaned.slice(1)}`;
  }

  return cleaned;
}

export function isValidIndonesianPhoneNumber(
  phoneNumber: string,
) {
  const normalized =
    normalizeIndonesianPhoneNumber(phoneNumber);

  return /^628\d{8,11}$/.test(normalized);
}