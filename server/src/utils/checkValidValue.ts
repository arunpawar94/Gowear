export default function checkValidValue(
  arrayGet: string[],
  arrayValid: string[]
) {
  const isValid = arrayGet.every((item) => arrayValid.includes(item));
  return isValid;
}
