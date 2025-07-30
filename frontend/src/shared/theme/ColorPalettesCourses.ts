export type TColorPalette = {
  brand: string;
  surface: string;
  text: string;
  accent: string;
};

export type TPaletteNames =
  | "vibrantLearning"
  | "calmFocus"
  | "modernTech"
  | "warmEngagement"
  | "creativeEnergy"
  | "classicAcademy"
  | "greenGrowth"
  | "playfulKnowledge"
  | "earthyStability"
  | "freshClarity";

/* En TypeScript, Record es un tipo genérico utilitario que te permite definir un objeto donde:
Las claves (keys) son de un tipo específico (por ejemplo, un string o un conjunto de literales).
Los valores (values) tienen todos el mismo tipo. */
export const educationalPalettes: Record<TPaletteNames, TColorPalette> = {
  vibrantLearning: {
    brand: "#3B82F6",
    surface: "#F3F4F6",
    text: "#111827",
    accent: "#F59E0B",
  },
  calmFocus: {
    brand: "#2563EB",
    surface: "#E5E7EB",
    text: "#1F2937",
    accent: "#10B981",
  },
  modernTech: {
    brand: "#0EA5E9",
    surface: "#F8FAFC",
    text: "#111827",
    accent: "#6366F1",
  },
  warmEngagement: {
    brand: "#EF4444",
    surface: "#FFF7ED",
    text: "#1E293B",
    accent: "#F97316",
  },
  creativeEnergy: {
    brand: "#A855F7",
    surface: "#FDF4FF",
    text: "#312E81",
    accent: "#22D3EE",
  },
  classicAcademy: {
    brand: "#1D4ED8",
    surface: "#F1F5F9",
    text: "#0F172A",
    accent: "#FBBF24",
  },
  greenGrowth: {
    brand: "#22C55E",
    surface: "#F0FDF4",
    text: "#064E3B",
    accent: "#14B8A6",
  },
  playfulKnowledge: {
    brand: "#EC4899",
    surface: "#FFF0F5",
    text: "#1F2937",
    accent: "#8B5CF6",
  },
  earthyStability: {
    brand: "#92400E",
    surface: "#FEF3C7",
    text: "#1C1917",
    accent: "#D97706",
  },
  freshClarity: {
    brand: "#0D9488",
    surface: "#ECFDF5",
    text: "#134E4A",
    accent: "#06B6D4",
  },
};
