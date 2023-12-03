import type { OperatorId } from "@/types/AKOperator";
import type { VoiceLangId } from "@/types/AKVoice";

declare const charword_table: {
  charWords: Record<string, VoiceLine>;
  voiceLangDict: Record<string, VoiceActors>;
};

interface VoiceLine {
  charWordId: string;
  wordKey: OperatorId;
  charId: OperatorId;
  voiceId: string;
  voiceText: string;
  voiceTitle: string;
  voiceIndex: number;
  unlockType: "DIRECT" | "AWAKE" | "FAVOR";
  unlockParam: { valueInt: number }[];
}

interface VoiceActors {
  charId: OperatorId;
  dict: Record<VoiceLangId, VoiceActor>;
}

interface VoiceActor {
  wordkey: OperatorId;
  voiceLangType: VoiceLangId;
  cvName: string[];
}

export default charword_table;
