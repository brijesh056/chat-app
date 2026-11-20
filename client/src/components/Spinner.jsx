export default function Spinner({ size = "md" }) {
  const dim = size === "lg" ? "h-9 w-9 border-[3px]" : size === "sm" ? "h-4 w-4 border-2" : "h-6 w-6 border-2";
  return (
    <span
      className={`inline-block ${dim} rounded-full border-brand-100 border-t-brand-600 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
