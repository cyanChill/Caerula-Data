/** @description How some values of the Arknight game data JSON file is structured. */
export type DefineValObj<T> = { m_defined: boolean; m_value: T };

/** @description A subset of the "attributes" property. */
export type Immunities = {
  stunImmune: DefineValObj<boolean>;
  silenceImmune: DefineValObj<boolean>;
  sleepImmune: DefineValObj<boolean>;
  frozenImmune: DefineValObj<boolean>;
  levitateImmune: DefineValObj<boolean>;
};
