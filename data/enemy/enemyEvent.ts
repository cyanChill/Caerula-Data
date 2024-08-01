import type { EnemyId } from "@/data/types/AKEnemy";

/** @description Links enemies to the events they first appeared in. */
export const EnemyEventTable: Record<
  string,
  { name: string; enemies: EnemyId[] }
> = {
  /* Main Story */
  e5: {
    name: "Episode 5: Necessary Solutions",
    enemies: [
      "enemy_1036_amraoe",
      "enemy_1037_lunsbr",
      "enemy_1038_lunmag",
      "enemy_1038_lunmag_2",
      "enemy_1039_breakr",
      "enemy_1039_breakr_2",
      "enemy_1040_bombd",
      "enemy_1040_bombd_2",
      "enemy_1041_lazerd",
      "enemy_1041_lazerd_2",
      "enemy_1042_frostd",
      "enemy_1043_zomsbr",
      "enemy_1043_zomsbr_2",
      "enemy_1044_zomstr",
      "enemy_1044_zomstr_2",
      "enemy_1045_hammer",
      "enemy_1045_hammer_2",
      "enemy_1507_mephi",
      "enemy_1508_faust",
    ],
  },
  e6: {
    name: "Episode 6: Partial Necrosis",
    enemies: [
      "enemy_1061_zomshd",
      "enemy_1061_zomshd_2",
      "enemy_1062_rager",
      "enemy_1062_rager_2",
      "enemy_1063_rageth",
      "enemy_1063_rageth_2",
      "enemy_1064_snsbr",
      "enemy_1065_snwolf",
      "enemy_1065_snwolf_2",
      "enemy_1066_snbow",
      "enemy_1066_snbow_2",
      "enemy_1067_snslime",
      "enemy_1067_snslime_2",
      "enemy_1068_snmage",
      "enemy_1068_snmage_2",
      "enemy_1069_icebrk",
      "enemy_1069_icebrk_2",
      "enemy_1070_iced",
      "enemy_1510_frstar2",
    ],
  },
  e7: {
    name: "Episode 7: The Birth of Tragedy",
    enemies: [
      "enemy_1077_sotihd",
      "enemy_1077_sotihd_2",
      "enemy_1078_sotisc",
      "enemy_1078_sotisc_2",
      "enemy_1079_sotisp",
      "enemy_1079_sotisp_2",
      "enemy_1080_sotidp",
      "enemy_1080_sotidp_2",
      "enemy_1081_sotisd",
      "enemy_1081_sotisd_2",
      "enemy_1082_soticn",
      "enemy_1082_soticn_2",
      "enemy_1083_sotiab",
      "enemy_1083_sotiab_2",
      "enemy_1084_sotidm",
      "enemy_1084_sotidm_2",
      "enemy_1084_sotidm_3",
      "enemy_1085_sotiwz",
      "enemy_1085_sotiwz_2",
      "enemy_1085_sotiwz_3",
      "enemy_1506_patrt",
    ],
  },
  e8: {
    name: "Episode 8: Roaring Flare",
    enemies: [
      "enemy_1107_uoffcr",
      "enemy_1107_uoffcr_2",
      "enemy_1108_uterer",
      "enemy_1108_uterer_2",
      "enemy_1109_uabone",
      "enemy_1109_uabone_2",
      "enemy_1110_uamord",
      "enemy_1110_uamord_2",
      "enemy_1111_ucommd",
      "enemy_1111_ucommd_2",
      "enemy_1112_emppnt",
      "enemy_1112_emppnt_2",
      "enemy_1113_empace",
      "enemy_1113_empace_2",
      "enemy_1114_rgrdmn",
      "enemy_1114_rgrdmn_2",
      "enemy_1115_embald",
      "enemy_3001_upeopl",
      "enemy_3002_ftrtal",
      "enemy_1514_smephi",
      "enemy_1515_bsnake",
    ],
  },
  e9: {
    name: "Episode 9: Stormwatch",
    enemies: [
      "enemy_1165_duhond",
      "enemy_1165_duhond_2",
      "enemy_1166_dusbr",
      "enemy_1166_dusbr_2",
      "enemy_1167_dubow",
      "enemy_1167_dubow_2",
      "enemy_1168_dumage",
      "enemy_1168_dumage_2",
      "enemy_1169_duphlx",
      "enemy_1169_duphlx_2",
      "enemy_1170_dushld",
      "enemy_1170_dushld_2",
      "enemy_1171_durokt",
      "enemy_1171_durokt_2",
      "enemy_1172_dugago",
      "enemy_1172_dugago_2",
      "enemy_1173_duspfr",
      "enemy_1173_duspfr_2",
      "enemy_1174_duholy",
      "enemy_1174_duholy_2",
      "enemy_1175_dushdo",
      "enemy_1175_dushdo_2",
      "enemy_1176_dusocr",
      "enemy_1176_dusocr_2",
      "enemy_1523_mandra",
    ],
  },
  e10: {
    name: "Episode 10: Shatterpoint",
    enemies: [
      "enemy_1220_dzoms",
      "enemy_1220_dzoms_2",
      "enemy_1221_dzomg",
      "enemy_1221_dzomg_2",
      "enemy_1222_dpvt",
      "enemy_1222_dpvt_2",
      "enemy_1223_dmech",
      "enemy_1223_dmech_2",
      "enemy_1224_dsuply",
      "enemy_1224_dsuply_2",
      "enemy_1225_dkmage",
      "enemy_1225_dkmage_2",
      "enemy_1226_dklord",
      "enemy_1226_dklord_2",
      "enemy_1227_dair",
      "enemy_1227_dair_2",
      "enemy_1228_dslime",
      "enemy_1228_dslime_2",
      "enemy_1229_darmy",
      "enemy_1229_darmy_2",
      "enemy_1528_manfri",
    ],
  },
  e11: {
    name: "Episode 11: Return to Mist",
    enemies: [
      "enemy_1266_nhapos",
      "enemy_1267_nhpbr",
      "enemy_1267_nhpbr_2",
      "enemy_1268_nhnrs",
      "enemy_1268_nhnrs_2",
      "enemy_1269_nhfly",
      "enemy_1269_nhfly_2",
      "enemy_1270_nhstlk",
      "enemy_1270_nhstlk_2",
      "enemy_1271_nhkodo",
      "enemy_1271_nhkodo_2",
      "enemy_1272_nhtank",
      "enemy_1272_nhtank_2",
      "enemy_1273_stmgun",
      "enemy_1273_stmgun_2",
      "enemy_1274_stmram",
      "enemy_1274_stmram_2",
      "enemy_1275_dwlock",
      "enemy_1275_dwlock_2",
      "enemy_1276_telex",
      "enemy_1533_stmkgt",
    ],
  },
  e12: {
    name: "Episode 12: All Quiet Under the Thunder",
    enemies: [
      "enemy_1313_wdfmr",
      "enemy_1313_wdfmr_2",
      "enemy_1314_wdnjd",
      "enemy_1314_wdnjd_2",
      "enemy_1315_wdyjd",
      "enemy_1315_wdyjd_2",
      "enemy_1316_wdpjd",
      "enemy_1316_wdpjd_2",
      "enemy_1317_wdexg",
      "enemy_1317_wdexg_2",
      "enemy_1318_wdsmgc",
      "enemy_1318_wdsmgc_2",
      "enemy_1320_wdrrl",
      "enemy_1320_wdrrl_2",
      "enemy_1319_wdfmpm",
      "enemy_1319_wdfmpm_2",
      "enemy_1321_wdarft",
      "enemy_1321_wdarft_2",
      "enemy_1322_wdgyht",
      "enemy_1322_wdgyht_2",
      "enemy_1323_wdbshd",
      "enemy_1540_wdncr",
      "enemy_1541_wdslms",
      "enemy_1542_wdslm",
    ],
  },
  e13: {
    name: "Episode 13: The Whirlpool that is Passion",
    enemies: [
      "enemy_1360_dfello",
      "enemy_1361_dthrow",
      "enemy_1361_dthrow_2",
      "enemy_1362_dfat",
      "enemy_1362_dfat_2",
      "enemy_1363_spnshd",
      "enemy_1363_spnshd_2",
      "enemy_1364_spnaxe",
      "enemy_1364_spnaxe_2",
      "enemy_1365_spnwiz",
      "enemy_1365_spnwiz_2",
      "enemy_1366_dcolle",
      "enemy_1366_dcolle_2",
      "enemy_1367_dseed",
      "enemy_1368_spilot",
      "enemy_1369_bmbcar1",
      "enemy_1547_blord",
    ],
  },
  /* Events */
  of: {
    name: "Heart of Surging Flame",
    enemies: [
      "enemy_1046_agent",
      "enemy_1046_agent_2",
      "enemy_1047_sagent",
      "enemy_1047_sagent_2",
      "enemy_1048_hirman",
      "enemy_1048_hirman_2",
      "enemy_1049_eagent",
      "enemy_1049_eagent_2",
      "enemy_1051_norwiz",
      "enemy_1051_norwiz_2",
      "enemy_1052_noramr",
      "enemy_1052_noramr_2",
      "enemy_1053_norgst",
      "enemy_1053_norgst_2",
      "enemy_1054_norshd",
      "enemy_1054_norshd_2",
      "enemy_1050_lslime",
    ],
  },
  cb: {
    name: "Code of Brawl",
    enemies: [
      "enemy_1055_ganman",
      "enemy_1055_ganman_2",
      "enemy_1056_ganwar",
      "enemy_1056_ganwar_2",
      "enemy_1057_gansho",
      "enemy_1057_gansho_2",
      "enemy_1058_traink",
      "enemy_1058_traink_2",
      "enemy_1059_buster",
      "enemy_1059_buster_2",
      "enemy_1060_emouse",
      "enemy_1060_emouse_2",
      "enemy_1509_mousek",
    ],
  },
  dm: {
    name: "Darknights Memoir",
    enemies: [
      "enemy_1071_dftman",
      "enemy_1071_dftman_2",
      "enemy_1072_dlancer",
      "enemy_1072_dlancer_2",
      "enemy_1073_dscout",
      "enemy_1073_dscout_2",
      "enemy_1074_dbskar",
      "enemy_1074_dbskar_2",
      "enemy_1075_dmgswd",
      "enemy_1075_dmgswd_2",
      "enemy_1076_bsthmr",
      "enemy_1076_bsthmr_2",
    ],
  },
  tw: {
    name: "Twilight of Wolumonde",
    enemies: [
      "enemy_1086_ltsodr",
      "enemy_1086_ltsodr_2",
      "enemy_1087_ltwolf",
      "enemy_1087_ltwolf_2",
      "enemy_1088_ltsmer",
      "enemy_1088_ltsmer_2",
      "enemy_1089_ltlntc",
      "enemy_1089_ltlntc_2",
      "enemy_1090_mdsnpr",
      "enemy_1090_mdsnpr_2",
      "enemy_1091_mdhmmr",
      "enemy_1091_mdhmmr_2",
      "enemy_1092_mdgint",
      "enemy_1092_mdgint_2",
      "enemy_1511_mdrock",
    ],
  },
  ri: {
    name: "The Great Chief Returns",
    enemies: [
      "enemy_1093_ccsbr",
      "enemy_1093_ccsbr_2",
      "enemy_1094_ccspm",
      "enemy_1094_ccspm_2",
      "enemy_1095_ccripr",
      "enemy_1095_ccripr_2",
      "enemy_1096_ccwitch",
      "enemy_1096_ccwitch_2",
      "enemy_1097_cclmbjk",
      "enemy_1097_cclmbjk_2",
      "enemy_1098_cchmpn",
      "enemy_1098_cchmpn_2",
      "enemy_1512_mcmstr",
    ],
  },
  mn: {
    name: "Maria Nearl",
    enemies: [
      "enemy_1099_nbkght",
      "enemy_1099_nbkght_2",
      "enemy_1100_scorpn",
      "enemy_1100_scorpn_2",
      "enemy_1101_plkght",
      "enemy_1101_plkght_2",
      "enemy_1101_plkght_3",
      "enemy_1102_sdkght",
      "enemy_1102_sdkght_2",
      "enemy_1103_wdkght",
      "enemy_1103_wdkght_2",
      "enemy_1103_wdkght_3",
      "enemy_1104_lfkght",
      "enemy_1104_lfkght_2",
      "enemy_1104_lfkght_3",
      "enemy_1105_tyokai",
      "enemy_1105_tyokai_2",
      "enemy_1106_byokai",
      "enemy_1513_dekght",
      "enemy_1513_dekght_2",
    ],
  },
  mb: {
    name: "Mansfield Break",
    enemies: [
      "enemy_1116_liprr",
      "enemy_1116_liprr_2",
      "enemy_1117_liiprr",
      "enemy_1117_liiprr_2",
      "enemy_1118_lidbox",
      "enemy_1118_lidbox_2",
      "enemy_1119_vofsd",
      "enemy_1119_vofsd_2",
      "enemy_1120_vofwiz",
      "enemy_1120_vofwiz_2",
      "enemy_1121_lifbos",
      "enemy_1121_lifbos_2",
      "enemy_1516_jakill",
    ],
  },
  wr: {
    name: "Who is Real",
    enemies: [
      "enemy_1122_sphond",
      "enemy_1122_sphond_2",
      "enemy_1123_spsbr",
      "enemy_1123_spsbr_2",
      "enemy_1124_spbow",
      "enemy_1124_spbow_2",
      "enemy_1125_spshld",
      "enemy_1125_spshld_2",
      "enemy_1126_spslme",
      "enemy_1126_spslme_2",
      "enemy_1127_sptrkg",
      "enemy_1127_sptrkg_2",
      "enemy_1128_spmage",
      "enemy_1128_spmage_2",
      "enemy_1129_spklr",
      "enemy_1129_spklr_2",
      "enemy_1517_xi",
    ],
  },
  od: {
    name: "Operation Originium Dust",
    enemies: [
      "enemy_1130_infstr",
      "enemy_1131_sbeast",
      "enemy_1131_sbeast_2",
      "enemy_1132_sarchn",
      "enemy_1132_sarchn_2",
      "enemy_1133_harchn",
      "enemy_1133_harchn_2",
      "enemy_1134_diamd",
      "enemy_1134_diamd_2",
      "enemy_1135_redman",
      "enemy_1135_redman_2",
      "enemy_1136_redace",
      "enemy_1136_redace_2",
      "enemy_1137_plasm",
      "enemy_1138_tumor",
      "enemy_1139_hologc",
      "enemy_1139_hologc_2",
      "enemy_1519_bgball",
    ],
  },
  wd: {
    name: "A Walk in the Dust",
    enemies: [
      "enemy_1140_merhd",
      "enemy_1140_merhd_2",
      "enemy_1141_merbow",
      "enemy_1141_merbow_2",
      "enemy_1142_mershd",
      "enemy_1142_mershd_2",
      "enemy_1143_merrpg",
      "enemy_1143_merrpg_2",
      "enemy_1144_merlgd",
      "enemy_1144_merlgd_2",
      "enemy_1145_atkspd",
      "enemy_1145_atkspd_2",
      "enemy_1146_defspd",
      "enemy_1146_defspd_2",
      "enemy_1520_empgrd",
    ],
  },
  sv: {
    name: "Under Tides",
    enemies: [
      "enemy_1147_dshond",
      "enemy_1147_dshond_2",
      "enemy_1148_dssbr",
      "enemy_1148_dssbr_2",
      "enemy_1149_dsbow",
      "enemy_1149_dsbow_2",
      "enemy_1150_dsjely",
      "enemy_1150_dsjely_2",
      "enemy_1151_dslntc",
      "enemy_1151_dslntc_2",
      "enemy_1152_dsurch",
      "enemy_1152_dsurch_2",
      "enemy_1153_dsexcu",
      "enemy_1153_dsexcu_2",
      "enemy_1154_dsmant",
      "enemy_1155_dsrobt",
      "enemy_1521_dslily",
    ],
  },
  dh: {
    name: "Dossoles Holiday",
    enemies: [
      "enemy_1158_divman",
      "enemy_1158_divman_2",
      "enemy_1159_swfmob",
      "enemy_1159_swfmob_2",
      "enemy_1160_hvyslr",
      "enemy_1160_hvyslr_2",
      "enemy_1161_tidmag",
      "enemy_1161_tidmag_2",
      "enemy_1162_magmot",
      "enemy_1162_magmot_2",
      "enemy_1163_hvymot",
      "enemy_1163_hvymot_2",
      "enemy_1164_bmbmot",
      "enemy_1164_bmbmot_2",
      "enemy_1164_bmbmot_3",
      "enemy_3003_alymot",
      "enemy_1522_captan",
    ],
  },
  nl: {
    name: "Near Light",
    enemies: [
      "enemy_1178_dscorp",
      "enemy_1178_dscorp_2",
      "enemy_1179_aruarw",
      "enemy_1179_aruarw_2",
      "enemy_1180_aruass",
      "enemy_1180_aruass_2",
      "enemy_1181_napkgt",
      "enemy_1181_napkgt_2",
      "enemy_1182_flasrt",
      "enemy_1182_flasrt_2",
      "enemy_1182_flasrt_3",
      "enemy_1183_mlasrt",
      "enemy_1183_mlasrt_2",
      "enemy_1183_mlasrt_3",
      "enemy_1184_cadkgt",
      "enemy_1184_cadkgt_2",
      "enemy_1184_cadkgt_3",
      "enemy_1185_nmekgt",
      "enemy_1185_nmekgt_2",
      "enemy_1185_nmekgt_3",
      "enemy_1186_bldbld",
      "enemy_1524_bldkgt",
    ],
  },
  bi: {
    name: "Break the Ice",
    enemies: [
      "enemy_1187_krghd",
      "enemy_1187_krghd_2",
      "enemy_1188_krgdrn",
      "enemy_1188_krgdrn_2",
      "enemy_1189_krgaxe",
      "enemy_1189_krgaxe_2",
      "enemy_1190_krgbow",
      "enemy_1190_krgbow_2",
      "enemy_1191_krgrg",
      "enemy_1191_krgrg_2",
      "enemy_1192_krgscr",
      "enemy_1192_krgscr_2",
      "enemy_1193_krgbsk",
      "enemy_1193_krgbsk_2",
      "enemy_1194_krgmtr",
      "enemy_1194_krgmtr_2",
      "enemy_1525_blkswb",
    ],
  },
  iw: {
    name: "Invitation to Wine",
    enemies: [
      "enemy_1195_sfyin",
      "enemy_1195_sfyin_2",
      "enemy_1196_msfyin",
      "enemy_1196_msfyin_2",
      "enemy_1197_sfshu",
      "enemy_1197_sfshu_2",
      "enemy_1198_msfshu",
      "enemy_1198_msfshu_2",
      "enemy_1199_sfjin",
      "enemy_1199_sfjin_2",
      "enemy_1200_msfjin",
      "enemy_1200_msfjin_2",
      "enemy_1201_sfzhi",
      "enemy_1201_sfzhi_2",
      "enemy_1202_msfzhi",
      "enemy_1202_msfzhi_2",
      "enemy_1203_sfhu",
      "enemy_1203_sfhu_2",
      "enemy_1204_msfhu",
      "enemy_1204_msfhu_2",
      "enemy_1205_sfpin",
      "enemy_1205_sfpin_2",
      "enemy_1206_msfpin",
      "enemy_1206_msfpin_2",
      "enemy_1207_sfji",
      "enemy_1207_sfji_2",
      "enemy_1208_msfji",
      "enemy_1208_msfji_2",
      "enemy_1209_sfden",
      "enemy_1209_sfden_2",
      "enemy_1210_msfden",
      "enemy_1210_msfden_2",
      "enemy_1211_msfsui",
      "enemy_1526_sfsui",
    ],
  },
  ga: {
    name: "Guide Ahead",
    enemies: [
      "enemy_1212_mtrfol",
      "enemy_1212_mtrfol_2",
      "enemy_1213_mtrsnp",
      "enemy_1213_mtrsnp_2",
      "enemy_1214_mtrmgc",
      "enemy_1214_mtrmgc_2",
      "enemy_1215_ptrarc",
      "enemy_1215_ptrarc_2",
      "enemy_1216_cansld",
      "enemy_1216_cansld_2",
      "enemy_1217_rescar",
      "enemy_1217_rescar_2",
      "enemy_1218_bomscr",
      "enemy_1218_bomscr_2",
      "enemy_1219_mtrbty",
      "enemy_1219_mtrbty_2",
      "enemy_1527_martyr",
    ],
  },
  sn: {
    name: "Stultifera Navis",
    enemies: [
      "enemy_1230_dsbudr",
      "enemy_1230_dsbudr_2",
      "enemy_1230_dsbudr_4",
      "enemy_1231_dsrunr",
      "enemy_1231_dsrunr_2",
      "enemy_1231_dsrunr_4",
      "enemy_1232_dssalr",
      "enemy_1232_dssalr_2",
      "enemy_1232_dssalr_4",
      "enemy_1233_dsshtr",
      "enemy_1233_dsshtr_2",
      "enemy_1233_dsshtr_4",
      "enemy_1234_dsubrl",
      "enemy_1234_dsubrl_2",
      "enemy_1234_dsubrl_4",
      "enemy_1235_dsbskr",
      "enemy_1235_dsbskr_2",
      "enemy_1235_dsbskr_4",
      "enemy_1529_dsdevr",
    ],
  },
  le: {
    name: "Lingering Echoes",
    enemies: [
      "enemy_1238_ltmob",
      "enemy_1238_ltmob_2",
      "enemy_1239_ltbow",
      "enemy_1239_ltbow_2",
      "enemy_1240_ltgint",
      "enemy_1240_ltgint_2",
      "enemy_1241_ltmage",
      "enemy_1241_ltmage_2",
      "enemy_1242_ltsmag",
      "enemy_1242_ltsmag_2",
      "enemy_1243_ltswar",
      "enemy_1243_ltswar_2",
      "enemy_1244_ltssch",
      "enemy_1244_ltssch_2",
      "enemy_1246_aslime",
      "enemy_1246_aslime_2",
      "enemy_1247_ltgtld",
      "enemy_1530_white",
    ],
  },
  dv: {
    name: "Dorothy's Vision",
    enemies: [
      "enemy_1249_lysdb",
      "enemy_1249_lysdb_2",
      "enemy_1250_lyengs",
      "enemy_1250_lyengs_2",
      "enemy_1251_lysyta",
      "enemy_1251_lysyta_2",
      "enemy_1252_lysytb",
      "enemy_1252_lysytb_2",
      "enemy_1253_lysytc",
      "enemy_1253_lysytc_2",
      "enemy_1254_lypa",
      "enemy_1254_lypa_2",
      "enemy_1255_lybgpa",
      "enemy_1255_lybgpa_2",
      "enemy_1256_lyacpa",
      "enemy_1256_lyacpa_2",
      "enemy_1257_lydrty",
      "enemy_1531_bbrain",
    ],
  },
  ic: {
    name: "Ideal City: Endless Carnival",
    enemies: [
      "enemy_1258_durman",
      "enemy_1258_durman_2",
      "enemy_1259_durwar",
      "enemy_1259_durwar_2",
      "enemy_1260_durmag",
      "enemy_1260_durmag_2",
      "enemy_1261_dursho",
      "enemy_1261_dursho_2",
      "enemy_1262_durplc",
      "enemy_1262_durplc_2",
      "enemy_1263_durbus",
      "enemy_1263_durbus_2",
      "enemy_1264_durgrd",
      "enemy_1264_durgrd_2",
      "enemy_1532_minima",
    ],
  },
  is: {
    name: "Il Siracusano",
    enemies: [
      "enemy_1277_sgman",
      "enemy_1277_sgman_2",
      "enemy_1278_sgbow",
      "enemy_1278_sgbow_2",
      "enemy_1279_sgbdg",
      "enemy_1279_sgbdg_2",
      "enemy_1280_sgmag",
      "enemy_1280_sgmag_2",
      "enemy_1281_sgcar",
      "enemy_1281_sgcar_2",
      "enemy_1282_sgelder",
      "enemy_1282_sgelder_2",
      "enemy_1283_sgkill",
      "enemy_1283_sgkill_2",
      "enemy_1284_sgprst",
      "enemy_1285_sgwlf",
      "enemy_3004_speople",
      "enemy_1535_wlfmster",
    ],
  },
  fc: {
    name: "What the Firelight Casts",
    enemies: [
      "enemy_1286_dumcy",
      "enemy_1286_dumcy_2",
      "enemy_1287_ducrb",
      "enemy_1287_ducrb_2",
      "enemy_1288_duskls",
      "enemy_1288_duskls_2",
      "enemy_1289_dubmb",
      "enemy_1289_dubmb_2",
      "enemy_1290_duflm",
      "enemy_1290_duflm_2",
      "enemy_1291_dusrch",
      "enemy_1291_dusrch_2",
      "enemy_1292_duskld",
      "enemy_1292_duskld_2",
      "enemy_1293_duswrd",
      "enemy_1293_duswrd_2",
      "enemy_1293_duswrd_3",
      "enemy_1536_ncrmcr",
    ],
  },
  wb: {
    name: "Where Vernal Winds Will Never Blow",
    enemies: [
      "enemy_1295_ymph",
      "enemy_1295_ymph_2",
      "enemy_1296_ymknif",
      "enemy_1296_ymknif_2",
      "enemy_1297_ymflag",
      "enemy_1297_ymflag_2",
      "enemy_1298_ymmonk",
      "enemy_1298_ymmonk_2",
      "enemy_1299_ymkilr",
      "enemy_1299_ymkilr_2",
      "enemy_1300_ymmir",
      "enemy_1300_ymmir_2",
      "enemy_1301_ymcnon",
      "enemy_1301_ymcnon_2",
      "enemy_1302_ymtro",
      "enemy_1302_ymtro_2",
      "enemy_1538_ymmons",
    ],
  },
  cf: {
    name: "A Flurry to the Flame",
    enemies: [
      "enemy_1303_mhshep",
      "enemy_1303_mhshep_2",
      "enemy_1304_mhwolf",
      "enemy_1304_mhwolf_2",
      "enemy_1305_mhslim",
      "enemy_1305_mhslim_2",
      "enemy_1306_mhtrtl",
      "enemy_1306_mhtrtl_2",
      "enemy_1307_mhrhcr",
      "enemy_1307_mhrhcr_2",
      "enemy_1308_mheagl",
      "enemy_1308_mheagl_2",
      "enemy_1309_mhboar",
      "enemy_1309_mhboar_2",
      "enemy_1310_mhprpn",
      "enemy_1310_mhprpn_2",
      "enemy_1311_mhkryk",
      "enemy_1311_mhkryk_2",
      "enemy_1537_mhrors",
    ],
  },
  cw: {
    name: "Lone Trail",
    enemies: [
      "enemy_1325_cbgpro",
      "enemy_1325_cbgpro_2",
      "enemy_1326_cbagen",
      "enemy_1326_cbagen_2",
      "enemy_1327_cbrokt",
      "enemy_1327_cbrokt_2",
      "enemy_1328_cbjedi",
      "enemy_1328_cbjedi_2",
      "enemy_1329_cbshld",
      "enemy_1329_cbshld_2",
      "enemy_1330_cbrush",
      "enemy_1330_cbrush_2",
      "enemy_1331_cbsisy",
      "enemy_1331_cbsisy_2",
      "enemy_1332_cbterm",
      "enemy_1332_cbterm_2",
      "enemy_1333_cbbgen",
      "enemy_1333_cbbgen_2",
      "enemy_1543_cstlrs",
    ],
  },
  he: {
    name: "Hortus de Escapismo",
    enemies: [
      "enemy_1335_bldrat",
      "enemy_1335_bldrat_2",
      "enemy_1336_bldbat",
      "enemy_1336_bldbat_2",
      "enemy_1337_bhrknf",
      "enemy_1337_bhrknf_2",
      "enemy_1338_bhrjst",
      "enemy_1338_bhrjst_2",
      "enemy_1339_bhrgrd",
      "enemy_1339_bhrgrd_2",
      "enemy_1340_bthtbw",
      "enemy_1340_bthtbw_2",
      "enemy_1341_bthtms",
      "enemy_1341_bthtms_2",
      "enemy_1342_frtuna",
      "enemy_3005_lpeopl",
      "enemy_1544_cledub",
    ],
  },
  sl: {
    name: "So Long, Adele: Home Away From Home",
    enemies: [
      "enemy_1344_ddlamb",
      "enemy_1344_ddlamb_2",
      "enemy_1345_tplamb",
      "enemy_1345_tplamb_2",
      "enemy_1346_ynshp",
      "enemy_1346_ynshp_2",
      "enemy_1347_fyshp",
      "enemy_1347_fyshp_2",
      "enemy_1348_rllamb",
      "enemy_1348_rllamb_2",
      "enemy_1349_rckshp",
      "enemy_1349_rckshp_2",
      "enemy_1350_mgcshp",
      "enemy_1350_mgcshp_2",
      "enemy_1351_yhhshp",
      "enemy_1545_shpkg",
    ],
  },
  cv: {
    name: "Come Catastrophes or Wakes of Vultures",
    enemies: [
      "enemy_1352_eslime",
      "enemy_1352_eslime_2",
      "enemy_1353_esabr",
      "enemy_1353_esabr_2",
      "enemy_1354_eghost",
      "enemy_1354_eghost_2",
      "enemy_1355_mrfly",
      "enemy_1355_mrfly_2",
      "enemy_1356_egun",
      "enemy_1356_egun_2",
      "enemy_1357_erob",
      "enemy_1357_erob_2",
      "enemy_1358_esheld",
      "enemy_1358_esheld_2",
      "enemy_1359_ekulsr",
      "enemy_1359_ekulsr_2",
      "enemy_1546_cliff",
    ],
  },
  zt: {
    name: "Zwillingstürme im Herbst",
    enemies: [
      "enemy_1371_ltnflu",
      "enemy_1371_ltnflu_2",
      "enemy_1372_ltntpt",
      "enemy_1372_ltntpt_2",
      "enemy_1373_ltnhor",
      "enemy_1373_ltnhor_2",
      "enemy_1374_ltnhap",
      "enemy_1374_ltnhap_2",
      "enemy_1375_ltnclr",
      "enemy_1375_ltnclr_2",
      "enemy_1376_ltndru",
      "enemy_1376_ltndru_2",
      "enemy_1377_ltnclo",
      "enemy_1377_ltnclo_2",
      "enemy_1378_ltnmst",
      "enemy_1378_ltnmst_2",
      "enemy_1379_ltncdt",
      "enemy_1379_ltncdt_2",
      "enemy_1548_ltniak",
    ],
  },
  rs: {
    name: "The Rides to Lake Silberneherze",
    enemies: [
      "enemy_1381_winman",
      "enemy_1381_winman_2",
      "enemy_1382_winbal",
      "enemy_1382_winbal_2",
      "enemy_1383_windog",
      "enemy_1383_windog_2",
      "enemy_1384_winfrz",
      "enemy_1384_winfrz_2",
      "enemy_1385_winbom",
      "enemy_1385_winbom_2",
      "enemy_1386_winmag",
      "enemy_1386_winmag_2",
      "enemy_1387_winshd",
      "enemy_1387_winshd_2",
      "enemy_1388_wingnt",
      "enemy_1388_wingnt_2",
      "enemy_1389_winbab",
      "enemy_1389_winbab_2",
      "enemy_1549_windoc",
    ],
  },
  hs: {
    name: "Here A People Sows",
    enemies: [
      "enemy_1390_dhsbr",
      "enemy_1390_dhsbr_2",
      "enemy_1391_dhbow",
      "enemy_1391_dhbow_2",
      "enemy_1392_dhshld",
      "enemy_1392_dhshld_2",
      "enemy_1393_dhele",
      "enemy_1393_dhele_2",
      "enemy_1394_dhzts",
      "enemy_1394_dhzts_2",
      "enemy_1395_dhxts",
      "enemy_1395_dhxts_2",
      "enemy_1396_dhdts",
      "enemy_1396_dhdts_2",
      "enemy_1397_dhtsxt",
      "enemy_1397_dhtsxt_2",
      "enemy_1398_dhdcr",
      "enemy_1398_dhdcr_2",
      "enemy_1399_dhtb",
      "enemy_1399_dhtb_2",
      "enemy_1550_dhnzzh",
    ],
  },
  /* Interlocking Competition */
  ichw: {
    name: "Interlocking Competition: Hymnoi Wisdom",
    enemies: ["enemy_1156_hymhr", "enemy_1157_hymwr"],
  },
  /* Multivariate Cooperation Defence Protocols */
  coop: {
    name: "Multivariate Cooperation Defence Protocols",
    enemies: [
      "enemy_4001_toxcar",
      "enemy_4001_toxcar_2",
      "enemy_4002_syokai",
      "enemy_4002_syokai_2",
      "enemy_4003_pbank",
    ],
  },
  /* Contingency Contract */
  cc: {
    name: "Contingency Contract (CC)",
    enemies: ["enemy_1539_reid"],
  },
  /* Integrated Strategies */
  is1: {
    name: "Ceobe's Fungimist (IS1)",
    enemies: [
      "enemy_2001_duckmi",
      "enemy_2002_bearmi",
      "enemy_2003_rockman",
      "enemy_2004_balloon",
      "enemy_2005_axetro",
      "enemy_2006_flsnip",
      "enemy_2007_flwitch",
      "enemy_2008_flking",
    ],
  },
  is2: {
    name: "Phantom & Crimson Solitaire (IS2)",
    enemies: [
      "enemy_2009_csaudc",
      "enemy_2010_csdcr",
      "enemy_2011_csppt",
      "enemy_2012_csbln",
      "enemy_2017_csphts",
      "enemy_2013_csbot",
      "enemy_2014_csicer",
      "enemy_2015_csicem",
      "enemy_2016_csphtm",
      "enemy_2018_csdoll",
      "enemy_2019_cshost",
      "enemy_2020_cswrtr",
    ],
  },
  is3: {
    name: "Mizuki & Caerula Arbor (IS3)",
    enemies: [
      "enemy_2034_sythef",
      "enemy_2021_syfish",
      "enemy_2022_syzeni",
      "enemy_2023_sypult",
      "enemy_2024_synut",
      "enemy_2025_syufo",
      "enemy_2033_syboys",
      "enemy_2040_syrott",
      "enemy_2041_syjely",
      "enemy_2035_sybox",
      "enemy_2026_syudg",
      "enemy_2027_syudg2",
      "enemy_2028_syevil",
      "enemy_2029_symon",
      "enemy_2030_symon2",
      "enemy_2031_syboy",
      "enemy_2032_syboy2",
      "enemy_2037_sygirl",
      "enemy_2038_sydonq",
      "enemy_2039_syskad",
      "enemy_2042_syboss",
      "enemy_2036_syshop",
    ],
  },
  is4: {
    name: "Expeditioner's Jǫklumarkar (IS4)",
    enemies: [
      "enemy_2043_smsbr",
      "enemy_2044_smwiz",
      "enemy_2045_smdrn",
      "enemy_2046_smwar",
      "enemy_2059_smbox",
      "enemy_2048_smgrd",
      "enemy_2049_smgrd2",
      "enemy_2050_smsha",
      "enemy_2051_smsha2",
      "enemy_2052_smgia",
      "enemy_2053_smgia2",
      "enemy_2054_smdeer",
      "enemy_2055_smlead",
      "enemy_2056_smedzi",
      "enemy_2060_smshdw",
      "enemy_2061_smhond",
      "enemy_2057_smkght",
      "enemy_2058_smlion",
    ],
  },
  /* Stationary Security Service */
  sss: {
    name: "Stationary Security Service (SSS)",
    enemies: [
      "enemy_6001_trsgst",
      "enemy_6002_trswlf",
      "enemy_6003_trsslm",
      "enemy_6004_pleslm",
      "enemy_6005_llstone",
      "enemy_6006_fystone",
      "enemy_6007_mtslm",
      "enemy_6008_mtslms",
      "enemy_6009_nlkgtbs",
      "enemy_6010_boxing",
      "enemy_6011_planty",
      "enemy_6012_plants",
      "enemy_6013_smith",
      "enemy_6014_crzgas",
      "enemy_6015_ictruck",
      "enemy_6016_splash",
      "enemy_6017_icdrone",
      "enemy_6018_carrier",
      "enemy_6019_escort",
      "enemy_6020_orang",
      "enemy_6021_cask",
    ],
  },
  /* Reclamation Algorithm */
  ra1: {
    name: "Fire Within the Sand",
    enemies: [
      "enemy_7001_blwzad",
      "enemy_7001_blwzad_2",
      "enemy_7002_veingd",
      "enemy_7002_veingd_2",
      "enemy_7003_catapt",
      "enemy_7003_catapt_2",
      "enemy_7004_xbdeer",
      "enemy_7004_xbdeer_2",
      "enemy_7005_xbbull",
      "enemy_7005_xbbull_2",
      "enemy_7006_xbcrab",
      "enemy_7006_xbcrab_2",
      "enemy_7015_xbcrab2",
      "enemy_7007_xbbird",
      "enemy_7009_mtmoun",
      "enemy_7010_bldrgn",
      "enemy_7011_paki",
      "enemy_7012_wilder",
      "enemy_7013_slwazd",
      "enemy_7014_dva",
    ],
  },
  ra2: {
    name: "Tales Within the Sand",
    enemies: [
      "enemy_7016_shushu",
      "enemy_7017_miner",
      "enemy_7018_scarab",
      "enemy_7019_thief",
      "enemy_7020_xbtor",
      "enemy_7021_xbmoth",
      "enemy_7022_gatgod",
      "enemy_7023_gatbb",
      "enemy_7024_clking",
      "enemy_7025_clbb",
      "enemy_7026_xbele",
      "enemy_7027_xbbtl",
      "enemy_7028_xbscp",
      "enemy_7029_pilot",
      "enemy_7030_skodo",
      "enemy_7031_ghking",
      "enemy_7034_xbmsn",
    ],
  },
  /* Design of Strife */
  dos: {
    name: "Design of Strife",
    enemies: ["enemy_8006_flmgd", "enemy_8001_flmlod_3"],
  },
};
