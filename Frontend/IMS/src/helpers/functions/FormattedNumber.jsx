export function FormattedNumber(input) {
  // Try to coerce the input into a valid number
  const number = parseFloat(input);

  // If the input cannot be converted to a number, default to 0
  if (isNaN(number)) {
    return "0";
  }

  // Use toLocaleString to format the number with commas
  return Math.floor(number).toLocaleString("en-US");
}
