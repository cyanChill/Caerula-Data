import type { OperatorId } from "@/data/types/AKCharacter";
import type { VoiceActor, VoiceLine } from "@/data/types/AKVoice";

declare const voiceTable: {
  actorTable: Record<string, VoiceActor[]>;
  voiceLineTable: Record<string, VoiceLine[]>;
  opVoiceMap: Record<OperatorId, string[]>;
};

export default voiceTable;
