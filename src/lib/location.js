export const getLocationString = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location.trim();
  if (typeof location === "object") {
    return (
      location.formatted_address ||
      location.label ||
      location.name ||
      location.value ||
      ""
    )
      .toString()
      .trim();
  }
  return String(location).trim();
};

export const getStandardLocation = (location) => {
  const rawLocation = getLocationString(location);
  if (!rawLocation) return "";
  const cleaned = rawLocation
    .replace(/[{}[\]"]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+-\s+/g, ", ")
    .trim();
  const segments = cleaned
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (!segments.length) return "";
  if (segments.length === 1) return segments[0];
  const city = segments[0];
  const country = segments[segments.length - 1];
  if (city.toLowerCase() === country.toLowerCase()) return city;
  return `${city}, ${country}`;
};
