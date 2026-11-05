export type ButtonVariant = "primary" | "secondary" | "danger";

const BASE =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-laranja text-fundo hover:brightness-110",
  secondary: "border border-borda text-texto hover:border-verde hover:text-verde",
  danger: "border border-perigo text-perigo hover:bg-perigo hover:text-fundo",
};

export function buttonStyles(variant: ButtonVariant = "primary", className = "") {
  return `${BASE} ${VARIANTS[variant]} ${className}`.trim();
}
