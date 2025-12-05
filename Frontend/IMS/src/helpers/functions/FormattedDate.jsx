export default function FormattedDate(dateString) {
  // If empty, null, undefined, or invalid special cases
  if (!dateString || dateString === "0000:00:00") return "N/A";

  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
