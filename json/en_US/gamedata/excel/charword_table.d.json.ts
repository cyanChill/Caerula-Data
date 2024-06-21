import type { RawCharWords, RawVoiceLangDict } from "@/types/rawVoice";

declare const charword_table: {
  charWords: Record<string, RawCharWords>;
  voiceLangDict: Record<string, RawVoiceLangDict>;
  voiceLangTypeDict: Record<string, { name: string; groupType: string }>;
};

export default charword_table;
