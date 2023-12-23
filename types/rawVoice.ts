type Language =
  | "JP"
  | "CN_MANDARIN"
  | "EN"
  | "KR"
  | "CN_TOPOLECT"
  | "LINKAGE"
  | "ITA";

export interface RawCharWords {
  charWordId: string;
  wordKey: string;
  charId: string;
  voiceId: string;
  voiceText: string;
  voiceTitle: string;
  voiceIndex: number;
  voiceType: "ENUM" | "ONLY_TEXT";
  unlockType: "AWAKE" | "DIRECT" | "FAVOR";
  // FIXME: `unlockParam` is currently in this format - may change in the future
  unlockParam: { valueStr: null; valueInt: number }[];
  lockDescription: null;
  // FIXME: `placeType` has many enum values
  //  - Look at https://github.com/MooncellWiki/OpenArknightsFBS/blob/main/FBS/charword_table.fbs
  placeType: string;
  voiceAsset: string;
}

export interface RawVoiceLangDict {
  wordkeys: string[];
  charId: string;
  dict: Record<Language, VoiceActor>;
}

interface VoiceActor {
  wordkey: string;
  voiceLangType: Language;
  cvName: string[];
  voicePath: string | null;
}
