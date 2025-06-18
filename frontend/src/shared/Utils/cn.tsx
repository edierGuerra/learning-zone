// src/shared/Utils/cn.ts

// Función utilitaria para combinar múltiples clases CSS en un solo string.
// Acepta cualquier cantidad de argumentos (strings, false, null o undefined).
export function cn(...classes: (string | false | null | undefined)[]) {
  // Filtra los valores "falsy" (false, null, undefined, "") y une el resto con espacios.
  // Esto permite usar condiciones para agregar clases de forma limpia.
  return classes.filter(Boolean).join(" ");
}
