import type { OperatorId } from "@/data/types/AKCharacter";
import type { VoiceActor } from "@/data/types/AKVoice";

declare const voiceActors: Record<OperatorId, VoiceActor[]>;

export default voiceActors;
