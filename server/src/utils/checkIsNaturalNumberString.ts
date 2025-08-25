export default function isNaturalNumberString(value: string): boolean {
  const num = Number(value);
  return /^\d+$/.test(value) && Number.isInteger(num) && num > 0;
}
