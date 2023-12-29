import type { RawEnemyStat } from "@/types/rawEnemy";

declare const enemy_database: {
  enemies: { Key: string; Value: RawEnemyStat[] }[];
};

export default enemy_database;
