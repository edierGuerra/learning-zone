import type { TStudent } from "../../modules/types/User";

export default function GenerateColorFromName(
  name: TStudent["name"],
  id: TStudent["id"]
): string {
  const paramHexadecimals: string[] = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F"
  ];

  let color = "#";

  for (let index = 0; index < name.length; index++) {
    const char = name[index].toUpperCase();
    if (paramHexadecimals.includes(char)) {
      color += char + '18';
    }else{
        color += String(id).slice(0,2) + id/600
    }
  }

  const paramTwo = (id * name.length) / 100;

  if (paramTwo <= 0) {
    color += "544";
  } else if (paramTwo >= 111) {
    color += "93";
  } else {
    color += "A";
  }

  if (color.length <= 5) {
    color += "33";
  }

  // Asegura que tenga solo 7 caracteres (# + 6 dígitos)
  if (color.length > 7) {
    color = color.slice(0, 7);
  }

  return color;
}
