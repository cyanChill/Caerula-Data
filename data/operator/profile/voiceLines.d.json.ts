import type { OperatorId } from "@/data/types/AKCharacter";
import type { VoiceLine } from "@/data/types/AKVoice";

declare const voiceLines: Record<OperatorId, VoiceLine[]>;

export default voiceLines;
