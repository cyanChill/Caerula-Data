import { createEnemiesJSON } from "@/scripts/mutateEnemies";
import { createItemsJSON } from "@/scripts/mutateItems";
import { createRangeTableJSON } from "@/scripts/mutateRange";
import { createSkillsJSON } from "@/scripts/mutateSkills";
import { generateOperatorDetails } from "@/scripts/operator/mutateProfile";
import { generateOperatorStatsAndSlugs } from "@/scripts/operator/mutateOperators";
import { generateVoiceData } from "@/scripts/operator/mutateVoice";

/* General Data Mutations */
createItemsJSON();
createRangeTableJSON();
createSkillsJSON();
/* Enemy Data Mutations */
createEnemiesJSON();
/* Operator Data Mutations */
generateOperatorStatsAndSlugs();
generateOperatorDetails();
generateVoiceData();
