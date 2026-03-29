export function normalizePhone(phone: string): string {
  phone = phone.trim();

  if (phone.startsWith('0')) {
    return '+84' + phone.slice(1);
  }

  if (phone.startsWith('+84')) {
    return phone;
  }

  throw new Error('Invalid phone format');
}
