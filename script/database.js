// database.js
const groupsData = {
    bts: [
        {
            album: "2 COOL 4 SKOOL",
            year: "2013",
            versions: [
                {
                    subname: "Standard",
                    members: [
                        { id: "2c4s_group", name: "Group", img: "./assets/bts/2_cool_4_skool/standard/group.jpg" }
                        // Nota: El debut no traía PCs individuales, solo una postal/grupal. 
                    ]
                }
            ]
        },
        {
            album: "O!RUL8,2?",
            year: "2013",
            versions: [
                {
                    subname: "Standard",
                    members: [
                        { id: "orul_rm", name: "RM", img: "./assets/bts/orul82/standard/rm.jpg" },
                        { id: "orul_jin", name: "Jin", img: "./assets/bts/orul82/standard/jin.jpg" },
                        { id: "orul_suga", name: "Suga", img: "./assets/bts/orul82/standard/suga.jpg" },
                        { id: "orul_jhope", name: "J-Hope", img: "./assets/bts/orul82/standard/jhope.jpg" },
                        { id: "orul_jimin", name: "Jimin", img: "./assets/bts/orul82/standard/jimin.jpg" },
                        { id: "orul_v", name: "V", img: "./assets/bts/orul82/standard/v.jpg" },
                        { id: "orul_jk", name: "JK", img: "./assets/bts/orul82/standard/jk.jpg" },
                        { id: "orul_group", name: "Group", img: "./assets/bts/orul82/standard/group.jpg" }
                    ]
                }
            ]
        },
        {
            album: "SKOOL LUV AFFAIR",
            year: "2014",
            versions: [
                {
                    subname: "Standard",
                    members: [
                        { id: "sla_rm", name: "RM", img: "./assets/bts/skool_luv_affair/standard/rm.jpg" },
                        { id: "sla_jin", name: "Jin", img: "./assets/bts/skool_luv_affair/standard/jin.jpg" },
                        { id: "sla_suga", name: "Suga", img: "./assets/bts/skool_luv_affair/standard/suga.jpg" },
                        { id: "sla_jhope", name: "J-Hope", img: "./assets/bts/skool_luv_affair/standard/jhope.jpg" },
                        { id: "sla_jimin", name: "Jimin", img: "./assets/bts/skool_luv_affair/standard/jimin.jpg" },
                        { id: "sla_v", name: "V", img: "./assets/bts/skool_luv_affair/standard/v.jpg" },
                        { id: "sla_jk", name: "JK", img: "./assets/bts/skool_luv_affair/standard/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "SKOOL LUV AFFAIR SPECIAL ADDITION",
            year: "2014",
            versions: [
                {
                    subname: "Special Addition",
                    is_pob: true, // Lo marcamos como POB/Especial
                    members: [
                        { id: "sla_sp_rm", name: "RM", img: "./assets/bts/skool_luv_affair_special/standard/rm.jpg" },
                        { id: "sla_sp_jin", name: "Jin", img: "./assets/bts/skool_luv_affair_special/standard/jin.jpg" },
                        { id: "sla_sp_suga", name: "Suga", img: "./assets/bts/skool_luv_affair_special/standard/suga.jpg" },
                        { id: "sla_sp_jhope", name: "J-Hope", img: "./assets/bts/skool_luv_affair_special/standard/jhope.jpg" },
                        { id: "sla_sp_jimin", name: "Jimin", img: "./assets/bts/skool_luv_affair_special/standard/jimin.jpg" },
                        { id: "sla_sp_v", name: "V", img: "./assets/bts/skool_luv_affair_special/standard/v.jpg" },
                        { id: "sla_sp_jk", name: "JK", img: "./assets/bts/skool_luv_affair_special/standard/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "DARK & WILD",
            year: "2014",
            versions: [
                {
                    subname: "Standard",
                    members: [
                        { id: "dw_rm", name: "RM", img: "./assets/bts/dark_and_wild/standard/rm.jpg" },
                        { id: "dw_jin", name: "Jin", img: "./assets/bts/dark_and_wild/standard/jin.jpg" },
                        { id: "dw_suga", name: "Suga", img: "./assets/bts/dark_and_wild/standard/suga.jpg" },
                        { id: "dw_jhope", name: "J-Hope", img: "./assets/bts/dark_and_wild/standard/jhope.jpg" },
                        { id: "dw_jimin", name: "Jimin", img: "./assets/bts/dark_and_wild/standard/jimin.jpg" },
                        { id: "dw_v", name: "V", img: "./assets/bts/dark_and_wild/standard/v.jpg" },
                        { id: "dw_jk", name: "JK", img: "./assets/bts/dark_and_wild/standard/jk.jpg" },
                        { id: "dw_group", name: "Group", img: "./assets/bts/dark_and_wild/standard/group.jpg" }
                    ]
                }
            ]
        },
        {
            album: "THE MOST BEAUTIFUL MOMENT IN LIFE PT.1",
            year: "2015",
            versions: [
                {
                    subname: "Pink",
                    members: [
                        { id: "hyyh1_p_rm", name: "RM", img: "./assets/bts/hyyh_pt1/pink/rm.jpg" },
                        { id: "hyyh1_p_jin", name: "Jin", img: "./assets/bts/hyyh_pt1/pink/jin.jpg" },
                        { id: "hyyh1_p_suga", name: "Suga", img: "./assets/bts/hyyh_pt1/pink/suga.jpg" },
                        { id: "hyyh1_p_jhope", name: "J-Hope", img: "./assets/bts/hyyh_pt1/pink/jhope.jpg" },
                        { id: "hyyh1_p_jimin", name: "Jimin", img: "./assets/bts/hyyh_pt1/pink/jimin.jpg" },
                        { id: "hyyh1_p_v", name: "V", img: "./assets/bts/hyyh_pt1/pink/v.jpg" },
                        { id: "hyyh1_p_jk", name: "JK", img: "./assets/bts/hyyh_pt1/pink/jk.jpg" }
                    ]
                },
                {
                    subname: "White",
                    members: [
                        { id: "hyyh1_w_rm", name: "RM", img: "./assets/bts/hyyh_pt1/white/rm.jpg" },
                        { id: "hyyh1_w_jin", name: "Jin", img: "./assets/bts/hyyh_pt1/white/jin.jpg" },
                        { id: "hyyh1_w_suga", name: "Suga", img: "./assets/bts/hyyh_pt1/white/suga.jpg" },
                        { id: "hyyh1_w_jhope", name: "J-Hope", img: "./assets/bts/hyyh_pt1/white/jhope.jpg" },
                        { id: "hyyh1_w_jimin", name: "Jimin", img: "./assets/bts/hyyh_pt1/white/jimin.jpg" },
                        { id: "hyyh1_w_v", name: "V", img: "./assets/bts/hyyh_pt1/white/v.jpg" },
                        { id: "hyyh1_w_jk", name: "JK", img: "./assets/bts/hyyh_pt1/white/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "THE MOST BEAUTIFUL MOMENT IN LIFE PT.2",
            year: "2015",
            versions: [
                {
                    subname: "Blue",
                    members: [
                        { id: "hyyh2_b_rm", name: "RM", img: "./assets/bts/hyyh_pt2/blue/rm.jpg" },
                        { id: "hyyh2_b_jin", name: "Jin", img: "./assets/bts/hyyh_pt2/blue/jin.jpg" },
                        { id: "hyyh2_b_suga", name: "Suga", img: "./assets/bts/hyyh_pt2/blue/suga.jpg" },
                        { id: "hyyh2_b_jhope", name: "J-Hope", img: "./assets/bts/hyyh_pt2/blue/jhope.jpg" },
                        { id: "hyyh2_b_jimin", name: "Jimin", img: "./assets/bts/hyyh_pt2/blue/jimin.jpg" },
                        { id: "hyyh2_b_v", name: "V", img: "./assets/bts/hyyh_pt2/blue/v.jpg" },
                        { id: "hyyh2_b_jk", name: "JK", img: "./assets/bts/hyyh_pt2/blue/jk.jpg" }
                    ]
                },
                {
                    subname: "Peach",
                    members: [
                        { id: "hyyh2_p_rm", name: "RM", img: "./assets/bts/hyyh_pt2/peach/rm.jpg" },
                        { id: "hyyh2_p_jin", name: "Jin", img: "./assets/bts/hyyh_pt2/peach/jin.jpg" },
                        { id: "hyyh2_p_suga", name: "Suga", img: "./assets/bts/hyyh_pt2/peach/suga.jpg" },
                        { id: "hyyh2_p_jhope", name: "J-Hope", img: "./assets/bts/hyyh_pt2/peach/jhope.jpg" },
                        { id: "hyyh2_p_jimin", name: "Jimin", img: "./assets/bts/hyyh_pt2/peach/jimin.jpg" },
                        { id: "hyyh2_p_v", name: "V", img: "./assets/bts/hyyh_pt2/peach/v.jpg" },
                        { id: "hyyh2_p_jk", name: "JK", img: "./assets/bts/hyyh_pt2/peach/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "THE MOST BEAUTIFUL MOMENT IN LIFE: YOUNG FOREVER",
            year: "2016",
            versions: [
                {
                    subname: "Day",
                    members: [
                        { id: "yf_d_rm", name: "RM", img: "./assets/bts/young_forever/day/rm.jpg" },
                        { id: "yf_d_jin", name: "Jin", img: "./assets/bts/young_forever/day/jin.jpg" },
                        { id: "yf_d_suga", name: "Suga", img: "./assets/bts/young_forever/day/suga.jpg" },
                        { id: "yf_d_jhope", name: "J-Hope", img: "./assets/bts/young_forever/day/jhope.jpg" },
                        { id: "yf_d_jimin", name: "Jimin", img: "./assets/bts/young_forever/day/jimin.jpg" },
                        { id: "yf_d_v", name: "V", img: "./assets/bts/young_forever/day/v.jpg" },
                        { id: "yf_d_jk", name: "JK", img: "./assets/bts/young_forever/day/jk.jpg" }
                    ]
                },
                {
                    subname: "Night",
                    members: [
                        { id: "yf_n_rm", name: "RM", img: "./assets/bts/young_forever/night/rm.jpg" },
                        { id: "yf_n_jin", name: "Jin", img: "./assets/bts/young_forever/night/jin.jpg" },
                        { id: "yf_n_suga", name: "Suga", img: "./assets/bts/young_forever/night/suga.jpg" },
                        { id: "yf_n_jhope", name: "J-Hope", img: "./assets/bts/young_forever/night/jhope.jpg" },
                        { id: "yf_n_jimin", name: "Jimin", img: "./assets/bts/young_forever/night/jimin.jpg" },
                        { id: "yf_n_v", name: "V", img: "./assets/bts/young_forever/night/v.jpg" },
                        { id: "yf_n_jk", name: "JK", img: "./assets/bts/young_forever/night/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "WINGS",
            year: "2016",
            versions: ["W", "I", "N", "G"].map(ver => ({
                subname: ver,
                members: [
                    { id: `wings_${ver.toLowerCase()}_rm`, name: "RM", img: `./assets/bts/wings/${ver.toLowerCase()}/rm.jpg` },
                    { id: `wings_${ver.toLowerCase()}_jin`, name: "Jin", img: `./assets/bts/wings/${ver.toLowerCase()}/jin.jpg` },
                    { id: `wings_${ver.toLowerCase()}_suga`, name: "Suga", img: `./assets/bts/wings/${ver.toLowerCase()}/suga.jpg` },
                    { id: `wings_${ver.toLowerCase()}_jhope`, name: "J-Hope", img: `./assets/bts/wings/${ver.toLowerCase()}/jhope.jpg` },
                    { id: `wings_${ver.toLowerCase()}_jimin`, name: "Jimin", img: `./assets/bts/wings/${ver.toLowerCase()}/jimin.jpg` },
                    { id: `wings_${ver.toLowerCase()}_v`, name: "V", img: `./assets/bts/wings/${ver.toLowerCase()}/v.jpg` },
                    { id: `wings_${ver.toLowerCase()}_jk`, name: "JK", img: `./assets/bts/wings/${ver.toLowerCase()}/jk.jpg` }
                ]
            }))
        },
        {
            album: "LOVE YOURSELF 承 'HER'",
            year: "2017",
            versions: ["L", "O", "V", "E"].map(ver => ({
                subname: ver,
                members: [
                    { id: `lyh_${ver.toLowerCase()}_rm`, name: "RM", img: `./assets/bts/ly_her/${ver.toLowerCase()}/rm.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_jin`, name: "Jin", img: `./assets/bts/ly_her/${ver.toLowerCase()}/jin.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_suga`, name: "Suga", img: `./assets/bts/ly_her/${ver.toLowerCase()}/suga.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_jhope`, name: "J-Hope", img: `./assets/bts/ly_her/${ver.toLowerCase()}/jhope.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_jimin`, name: "Jimin", img: `./assets/bts/ly_her/${ver.toLowerCase()}/jimin.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_v`, name: "V", img: `./assets/bts/ly_her/${ver.toLowerCase()}/v.jpg` },
                    { id: `lyh_${ver.toLowerCase()}_jk`, name: "JK", img: `./assets/bts/ly_her/${ver.toLowerCase()}/jk.jpg` }
                ]
            }))
        },
        {
            album: "LOVE YOURSELF 轉 'TEAR'",
            year: "2018",
            versions: ["Y", "O", "U", "R"].map(ver => ({
                subname: ver,
                members: [
                    { id: `lyt_${ver.toLowerCase()}_rm`, name: "RM", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/rm.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_jin`, name: "Jin", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/jin.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_suga`, name: "Suga", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/suga.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_jhope`, name: "J-Hope", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/jhope.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_jimin`, name: "Jimin", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/jimin.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_v`, name: "V", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/v.jpg` },
                    { id: `lyt_${ver.toLowerCase()}_jk`, name: "JK", img: `./assets/bts/ly_tear/${ver.toLowerCase()}/jk.jpg` }
                ]
            }))
        },
        {
            album: "LOVE YOURSELF 結 'ANSWER'",
            year: "2018",
            versions: ["S", "E", "L", "F"].map(ver => ({
                subname: ver,
                members: [
                    { id: `lya_${ver.toLowerCase()}_rm`, name: "RM", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/rm.jpg` },
                    { id: `lya_${ver.toLowerCase()}_jin`, name: "Jin", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/jin.jpg` },
                    { id: `lya_${ver.toLowerCase()}_suga`, name: "Suga", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/suga.jpg` },
                    { id: `lya_${ver.toLowerCase()}_jhope`, name: "J-Hope", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/jhope.jpg` },
                    { id: `lya_${ver.toLowerCase()}_jimin`, name: "Jimin", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/jimin.jpg` },
                    { id: `lya_${ver.toLowerCase()}_v`, name: "V", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/v.jpg` },
                    { id: `lya_${ver.toLowerCase()}_jk`, name: "JK", img: `./assets/bts/ly_answer/${ver.toLowerCase()}/jk.jpg` }
                ]
            }))
        },
        {
            album: "MAP OF THE SOUL: PERSONA",
            year: "2019",
            versions: ["1", "2", "3", "4"].map(ver => ({
                subname: `Version ${ver}`,
                members: [
                    { id: `mots_p${ver}_rm`, name: "RM", img: `./assets/bts/mots_persona/v${ver}/rm.jpg` },
                    { id: `mots_p${ver}_jin`, name: "Jin", img: `./assets/bts/mots_persona/v${ver}/jin.jpg` },
                    { id: `mots_p${ver}_suga`, name: "Suga", img: `./assets/bts/mots_persona/v${ver}/suga.jpg` },
                    { id: `mots_p${ver}_jhope`, name: "J-Hope", img: `./assets/bts/mots_persona/v${ver}/jhope.jpg` },
                    { id: `mots_p${ver}_jimin`, name: "Jimin", img: `./assets/bts/mots_persona/v${ver}/jimin.jpg` },
                    { id: `mots_p${ver}_v`, name: "V", img: `./assets/bts/mots_persona/v${ver}/v.jpg` },
                    { id: `mots_p${ver}_jk`, name: "JK", img: `./assets/bts/mots_persona/v${ver}/jk.jpg` }
                ]
            }))
        },
        {
            album: "MAP OF THE SOUL: 7",
            year: "2020",
            versions: ["1", "2", "3", "4"].map(ver => ({
                subname: `Version ${ver}`,
                members: [
                    { id: `mots7_v${ver}_rm`, name: "RM", img: `./assets/bts/mots_7/v${ver}/rm.jpg` },
                    { id: `mots7_v${ver}_jin`, name: "Jin", img: `./assets/bts/mots_7/v${ver}/jin.jpg` },
                    { id: `mots7_v${ver}_suga`, name: "Suga", img: `./assets/bts/mots_7/v${ver}/suga.jpg` },
                    { id: `mots7_v${ver}_jhope`, name: "J-Hope", img: `./assets/bts/mots_7/v${ver}/jhope.jpg` },
                    { id: `mots7_v${ver}_jimin`, name: "Jimin", img: `./assets/bts/mots_7/v${ver}/jimin.jpg` },
                    { id: `mots7_v${ver}_v`, name: "V", img: `./assets/bts/mots_7/v${ver}/v.jpg` },
                    { id: `mots7_v${ver}_jk`, name: "JK", img: `./assets/bts/mots_7/v${ver}/jk.jpg` }
                ]
            }))
        },
        {
            album: "BE",
            year: "2020",
            versions: [
                {
                    subname: "Essential",
                    members: [
                        { id: "be_rm", name: "RM", img: "./assets/bts/be/essential/rm.jpg" },
                        { id: "be_jin", name: "Jin", img: "./assets/bts/be/essential/jin.jpg" },
                        { id: "be_suga", name: "Suga", img: "./assets/bts/be/essential/suga.jpg" },
                        { id: "be_jhope", name: "J-Hope", img: "./assets/bts/be/essential/jhope.jpg" },
                        { id: "be_jimin", name: "Jimin", img: "./assets/bts/be/essential/jimin.jpg" },
                        { id: "be_v", name: "V", img: "./assets/bts/be/essential/v.jpg" },
                        { id: "be_jk", name: "JK", img: "./assets/bts/be/essential/jk.jpg" }
                    ]
                },
                {
                    subname: "Essential V2",
                    members: [
                        { id: "be_rm", name: "RM", img: "./assets/bts/be/essentialv2/rm.jpg" },
                        { id: "be_jin", name: "Jin", img: "./assets/bts/be/essentialv2/jin.jpg" },
                        { id: "be_suga", name: "Suga", img: "./assets/bts/be/essentialv2/suga.jpg" },
                        { id: "be_jhope", name: "J-Hope", img: "./assets/bts/be/essentialv2/jhope.jpg" },
                        { id: "be_jimin", name: "Jimin", img: "./assets/bts/be/essentialv2/jimin.jpg" },
                        { id: "be_v", name: "V", img: "./assets/bts/be/essentialv2/v.jpg" },
                        { id: "be_jk", name: "JK", img: "./assets/bts/be/essentialv2/jk.jpg" }
                    ]
                }
            ]
        },
        {
            album: "BUTTER",
            year: "2021",
            versions: [
                {
                    subname: "Cream",
                    members: ["RM", "Jin", "Suga", "JHope", "Jimin", "V", "JK"].map(m => ({
                        id: `butter_c_${m.toLowerCase()}`, name: m, img: `./assets/bts/butter/cream/${m.toLowerCase()}.jpg`
                    }))
                },
                {
                    subname: "Peaches",
                    members: ["RM", "Jin", "Suga", "JHope", "Jimin", "V", "JK"].map(m => ({
                        id: `butter_p_${m.toLowerCase()}`, name: m, img: `./assets/bts/butter/peaches/${m.toLowerCase()}.jpg`
                    }))
                }
            ]
        },
        {
            album: "PROOF",
            year: "2022",
            versions: [
                {
                    subname: "Standard",
                    members: ["RM", "Jin", "Suga", "JHope", "Jimin", "V", "JK"].map(m => ({
                        id: `proof_st_${m.toLowerCase()}`, name: m, img: `./assets/bts/proof/standard/${m.toLowerCase()}.jpg`
                    }))
                },
                {
                    subname: "Compact",
                    members: ["RM", "Jin", "Suga", "JHope", "Jimin", "V", "JK"].map(m => ({
                        id: `proof_cp_${m.toLowerCase()}`, name: m, img: `./assets/bts/proof/compact/${m.toLowerCase()}.jpg`
                    }))
                }
            ]
        },
        {
            album: "ARIRANG",
            year: "2026",
            versions: [
                {
                    subname: "Rooted in Korea",
                    members: [
                        { id: "arirang_rik_rm", name: "RM", img: "./assets/bts/arirang/rooted_in_korea/rm.jpg" },
                        { id: "arirang_rik_jin", name: "Jin", img: "./assets/bts/arirang/rooted_in_korea/jin.jpg" },
                        { id: "arirang_rik_suga", name: "Suga", img: "./assets/bts/arirang/rooted_in_korea/suga.jpg" },
                        { id: "arirang_rik_jhope", name: "J-Hope", img: "./assets/bts/arirang/rooted_in_korea/jhope.jpg" },
                        { id: "arirang_rik_jimin", name: "Jimin", img: "./assets/bts/arirang/rooted_in_korea/jimin.jpg" },
                        { id: "arirang_rik_v", name: "V", img: "./assets/bts/arirang/rooted_in_korea/v.jpg" },
                        { id: "arirang_rik_jk", name: "JK", img: "./assets/bts/arirang/rooted_in_korea/jk.jpg" }
                    ]
                },
                {
                    subname: "Rooted in Korea (Target Exclusive)",
                    members: [
                        { id: "arirang_rikt_rm", name: "RM", img: "./assets/bts/arirang/rooted_in_korea_target/rm.jpg" },
                        { id: "arirang_rikt_jin", name: "Jin", img: "./assets/bts/arirang/rooted_in_korea_target/jin.jpg" },
                        { id: "arirang_rikt_suga", name: "Suga", img: "./assets/bts/arirang/rooted_in_korea_target/suga.jpg" },
                        { id: "arirang_rikt_jhope", name: "J-Hope", img: "./assets/bts/arirang/rooted_in_korea_target/jhope.jpg" },
                        { id: "arirang_rikt_jimin", name: "Jimin", img: "./assets/bts/arirang/rooted_in_korea_target/jimin.jpg" },
                        { id: "arirang_rikt_v", name: "V", img: "./assets/bts/arirang/rooted_in_korea_target/v.jpg" },
                        { id: "arirang_rikt_jk", name: "JK", img: "./assets/bts/arirang/rooted_in_korea_target/jk.jpg" }
                    ]
                },
                {
                    subname: "Rooted in Music",
                    members: [
                        { id: "arirang_rim_rm", name: "RM", img: "./assets/bts/arirang/rooted_in_music/rm.jpg" },
                        { id: "arirang_rim_jin", name: "Jin", img: "./assets/bts/arirang/rooted_in_music/jin.jpg" },
                        { id: "arirang_rim_suga", name: "Suga", img: "./assets/bts/arirang/rooted_in_music/suga.jpg" },
                        { id: "arirang_rim_jhope", name: "J-Hope", img: "./assets/bts/arirang/rooted_in_music/jhope.jpg" },
                        { id: "arirang_rim_jimin", name: "Jimin", img: "./assets/bts/arirang/rooted_in_music/jimin.jpg" },
                        { id: "arirang_rim_v", name: "V", img: "./assets/bts/arirang/rooted_in_music/v.jpg" },
                        { id: "arirang_rim_jk", name: "JK", img: "./assets/bts/arirang/rooted_in_music/jk.jpg" }
                    ]
                },
                {
                    subname: "Rooted in Music (Target Exclusive)",
                    members: [
                        { id: "arirang_rimt_rm", name: "RM", img: "./assets/bts/arirang/rooted_in_music_target/rm.jpg" },
                        { id: "arirang_rimt_jin", name: "Jin", img: "./assets/bts/arirang/rooted_in_music_target/jin.jpg" },
                        { id: "arirang_rimt_suga", name: "Suga", img: "./assets/bts/arirang/rooted_in_music_target/suga.jpg" },
                        { id: "arirang_rimt_jhope", name: "J-Hope", img: "./assets/bts/arirang/rooted_in_music_target/jhope.jpg" },
                        { id: "arirang_rimt_jimin", name: "Jimin", img: "./assets/bts/arirang/rooted_in_music_target/jimin.jpg" },
                        { id: "arirang_rimt_v", name: "V", img: "./assets/bts/arirang/rooted_in_music_target/v.jpg" },
                        { id: "arirang_rimt_jk", name: "JK", img: "./assets/bts/arirang/rooted_in_music_target/jk.jpg" }
                    ]
                },
                {
                    subname: "Living Legend",
                    members: [
                        { id: "arirang_ll_rm", name: "RM", img: "./assets/bts/arirang/living_legend/rm.jpg" },
                        { id: "arirang_ll_jin", name: "Jin", img: "./assets/bts/arirang/living_legend/jin.jpg" },
                        { id: "arirang_ll_suga", name: "Suga", img: "./assets/bts/arirang/living_legend/suga.jpg" },
                        { id: "arirang_ll_jhope", name: "J-Hope", img: "./assets/bts/arirang/living_legend/jhope.jpg" },
                        { id: "arirang_ll_jimin", name: "Jimin", img: "./assets/bts/arirang/living_legend/jimin.jpg" },
                        { id: "arirang_ll_v", name: "V", img: "./assets/bts/arirang/living_legend/v.jpg" },
                        { id: "arirang_ll_jk", name: "JK", img: "./assets/bts/arirang/living_legend/jk.jpg" }
                    ]
                },
                {
                    subname: "Deluxe Vinyl",
                    members: [
                        { id: "arirang_vinyl_rm", name: "RM", img: "./assets/bts/arirang/deluxe_vinyl/rm.jpg" },
                        { id: "arirang_vinyl_jin", name: "Jin", img: "./assets/bts/arirang/deluxe_vinyl/jin.jpg" },
                        { id: "arirang_vinyl_suga", name: "Suga", img: "./assets/bts/arirang/deluxe_vinyl/suga.jpg" },
                        { id: "arirang_vinyl_jhope", name: "J-Hope", img: "./assets/bts/arirang/deluxe_vinyl/jhope.jpg" },
                        { id: "arirang_vinyl_jimin", name: "Jimin", img: "./assets/bts/arirang/deluxe_vinyl/jimin.jpg" },
                        { id: "arirang_vinyl_v", name: "V", img: "./assets/bts/arirang/deluxe_vinyl/v.jpg" },
                        { id: "arirang_vinyl_jk", name: "JK", img: "./assets/bts/arirang/deluxe_vinyl/jk.jpg" }
                    ]
                },
                {
                    subname: "Weverse Albums Version",
                    members: [
                        { id: "arirang_wev_rm", name: "RM", img: "./assets/bts/arirang/weverse/rm.jpg" },
                        { id: "arirang_wev_jin", name: "Jin", img: "./assets/bts/arirang/weverse/jin.jpg" },
                        { id: "arirang_wev_suga", name: "Suga", img: "./assets/bts/arirang/weverse/suga.jpg" },
                        { id: "arirang_wev_jhope", name: "J-Hope", img: "./assets/bts/arirang/weverse/jhope.jpg" },
                        { id: "arirang_wev_jimin", name: "Jimin", img: "./assets/bts/arirang/weverse/jimin.jpg" },
                        { id: "arirang_wev_v", name: "V", img: "./assets/bts/arirang/weverse/v.jpg" },
                        { id: "arirang_wev_jk", name: "JK", img: "./assets/bts/arirang/weverse/jk.jpg" },
                        { id: "arirang_wev_unit1", name: "Unit 1", img: "./assets/bts/arirang/weverse/unit1.jpg" },
                        { id: "arirang_wev_unit2", name: "Unit 2", img: "./assets/bts/arirang/weverse/unit2.jpg" }
                    ]
                }
            ]
        }
    ],
    twice: [
        { 
            album: "READY TO BE", 
            year: "2023", 
            versions: [
                {
                    subname: "Album Version",
                    members: [
                        { id: "nayeon_rtb", name: "Nayeon", img: "assets/twice/rtb/nayeon.jpg" },
                        { id: "momo_rtb", name: "Momo", img: "assets/twice/rtb/momo.jpg" }
                    ] 
                }
            ]
        }
    ]
};