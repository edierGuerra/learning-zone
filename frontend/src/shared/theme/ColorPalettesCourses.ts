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
  | "freshClarity"
  | "sunriseMotivation"
  | "deepOcean"
  | "brightFuture"
  | "mindfulStudy"
  | "techSavvy"
  | "passionateDrive"
  | "retroClass"
  | "forestWisdom"
  | "youthfulSpirit"
  | "sandstoneCalm"
  | "aquaVision"
  | "nightScholar"
  | "autumnFocus"
  | "solarInspiration"
  | "coolInnovation"
  | "berryKnowledge"
  | "goldenAchievement"
  | "skyHigh"
  | "copperMind"
  | "emeraldInsight"
  | "lavenderLogic"
  | "rubyDetermination"
  | "mintRefresh"
  | "charcoalDiscipline"
  | "peachHarmony"
  | "crimsonChallenge"
  | "steelResolve"
  | "turquoiseClarity"
  | "amberFocus";

export const educationalPalettes: Record<TPaletteNames, TColorPalette> = {
  vibrantLearning: { brand: "#3B82F6", surface: "#F3F4F6", text: "#111827", accent: "#F59E0B" },
  calmFocus: { brand: "#2563EB", surface: "#E5E7EB", text: "#1F2937", accent: "#10B981" },
  modernTech: { brand: "#0EA5E9", surface: "#F8FAFC", text: "#111827", accent: "#6366F1" },
  warmEngagement: { brand: "#EF4444", surface: "#FFF7ED", text: "#1E293B", accent: "#F97316" },
  creativeEnergy: { brand: "#A855F7", surface: "#FDF4FF", text: "#312E81", accent: "#22D3EE" },
  classicAcademy: { brand: "#1D4ED8", surface: "#F1F5F9", text: "#0F172A", accent: "#FBBF24" },
  greenGrowth: { brand: "#22C55E", surface: "#F0FDF4", text: "#064E3B", accent: "#14B8A6" },
  playfulKnowledge: { brand: "#EC4899", surface: "#FFF0F5", text: "#1F2937", accent: "#8B5CF6" },
  earthyStability: { brand: "#92400E", surface: "#FEF3C7", text: "#1C1917", accent: "#D97706" },
  freshClarity: { brand: "#0D9488", surface: "#ECFDF5", text: "#134E4A", accent: "#06B6D4" },

  sunriseMotivation: { brand: "#F97316", surface: "#FFF7ED", text: "#7C2D12", accent: "#FBBF24" },
  deepOcean: { brand: "#1E40AF", surface: "#E0F2FE", text: "#0C4A6E", accent: "#0369A1" },
  brightFuture: { brand: "#EAB308", surface: "#FEFCE8", text: "#78350F", accent: "#FACC15" },
  mindfulStudy: { brand: "#64748B", surface: "#F1F5F9", text: "#1E293B", accent: "#94A3B8" },
  techSavvy: { brand: "#0F172A", surface: "#F8FAFC", text: "#1E293B", accent: "#38BDF8" },
  passionateDrive: { brand: "#B91C1C", surface: "#FEF2F2", text: "#450A0A", accent: "#F87171" },
  retroClass: { brand: "#FBBF24", surface: "#FFFBEB", text: "#78350F", accent: "#F59E0B" },
  forestWisdom: { brand: "#166534", surface: "#F0FDF4", text: "#052E16", accent: "#22C55E" },
  youthfulSpirit: { brand: "#F43F5E", surface: "#FFF1F2", text: "#881337", accent: "#FB7185" },
  sandstoneCalm: { brand: "#D97706", surface: "#FFFBEB", text: "#78350F", accent: "#F59E0B" },

  aquaVision: { brand: "#0284C7", surface: "#F0F9FF", text: "#0C4A6E", accent: "#38BDF8" },
  nightScholar: { brand: "#1E293B", surface: "#F8FAFC", text: "#0F172A", accent: "#475569" },
  autumnFocus: { brand: "#EA580C", surface: "#FFF7ED", text: "#7C2D12", accent: "#F97316" },
  solarInspiration: { brand: "#F59E0B", surface: "#FFFBEB", text: "#78350F", accent: "#FBBF24" },
  coolInnovation: { brand: "#06B6D4", surface: "#ECFEFF", text: "#083344", accent: "#0EA5E9" },
  berryKnowledge: { brand: "#9333EA", surface: "#F3E8FF", text: "#4C1D95", accent: "#A855F7" },
  goldenAchievement: { brand: "#CA8A04", surface: "#FEFCE8", text: "#713F12", accent: "#EAB308" },
  skyHigh: { brand: "#38BDF8", surface: "#F0F9FF", text: "#0C4A6E", accent: "#0EA5E9" },
  copperMind: { brand: "#B45309", surface: "#FFFBEB", text: "#78350F", accent: "#D97706" },
  emeraldInsight: { brand: "#059669", surface: "#ECFDF5", text: "#064E3B", accent: "#10B981" },

  lavenderLogic: { brand: "#8B5CF6", surface: "#F5F3FF", text: "#312E81", accent: "#A78BFA" },
  rubyDetermination: { brand: "#BE123C", surface: "#FFF1F2", text: "#881337", accent: "#E11D48" },
  mintRefresh: { brand: "#14B8A6", surface: "#F0FDFA", text: "#134E4A", accent: "#2DD4BF" },
  charcoalDiscipline: { brand: "#374151", surface: "#F9FAFB", text: "#111827", accent: "#6B7280" },
  peachHarmony: { brand: "#F97316", surface: "#FFF7ED", text: "#7C2D12", accent: "#FDBA74" },
  crimsonChallenge: { brand: "#DC2626", surface: "#FEF2F2", text: "#7F1D1D", accent: "#F87171" },
  steelResolve: { brand: "#4B5563", surface: "#F3F4F6", text: "#1F2937", accent: "#9CA3AF" },
  turquoiseClarity: { brand: "#0D9488", surface: "#ECFDF5", text: "#115E59", accent: "#2DD4BF" },
  amberFocus: { brand: "#D97706", surface: "#FFF7ED", text: "#78350F", accent: "#FBBF24" }
};
