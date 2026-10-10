/**
 * Oceania — 14 countries.
 *
 * Fields:
 *   id              ISO 3166-1 alpha-2 code (also used for the flag image)
 *   continent       AFR | ASI | EUR | NAM | SAM | OCE
 *   name / capital  { en, fr } display names
 *   aliases         extra names accepted in typed answers (optional)
 *   capitalAliases  extra capital names accepted in typed answers (optional)
 *   mapNames        name(s) of the shape in the world-atlas map file, when different (optional)
 *   markerAt        [lon, lat] for the clickable marker, when the shape is missing or misleading (optional)
 *   history         3–5 sentence recap { en, fr }
 *   keyFacts        exactly 3 short facts { en: [...], fr: [...] }
 */
export default [
  {
    id: "AU",
    continent: "OCE",
    name: { en: "Australia", fr: "Australie" },
    capital: { en: "Canberra", fr: "Canberra" },
    aliases: ["Australie"],
    history: {
      en: "Aboriginal and Torres Strait Islander peoples have lived in Australia for at least 65,000 years, forming the oldest continuous cultures on Earth. The British First Fleet arrived at Sydney Cove in 1788. The six colonies federated into the Commonwealth of Australia on 1 January 1901, and Canberra was built as a compromise capital.",
      fr: "Les peuples aborigènes et insulaires du détroit de Torrès vivent en Australie depuis au moins 65 000 ans, formant les plus anciennes cultures continues du monde. La Première Flotte britannique arrive à Sydney Cove en 1788. Les six colonies se fédèrent dans le Commonwealth d'Australie le 1er janvier 1901, et Canberra est construite comme capitale de compromis.",
    },
    keyFacts: {
      en: ["Population: about 27 million", "Language: English", "The Great Barrier Reef is the largest coral reef system in the world"],
      fr: ["Population : environ 27 millions", "Langue : anglais", "La Grande Barrière de corail est le plus grand système récifal du monde"],
    },
  },
  {
    id: "FJ",
    continent: "OCE",
    name: { en: "Fiji", fr: "Fidji" },
    capital: { en: "Suva", fr: "Suva" },
    aliases: ["Fidji", "Fiji Islands"],
    history: {
      en: "Fiji was settled by seafaring peoples about 3,000 years ago and became a British colony in 1874. Britain brought indentured labourers from India to work on sugar plantations. Fiji gained independence on 10 October 1970 and later experienced several coups.",
      fr: "Les Fidji sont peuplées par des navigateurs il y a environ 3 000 ans et deviennent une colonie britannique en 1874. Les Britanniques font venir des travailleurs engagés indiens pour les plantations de canne à sucre. Les Fidji obtiennent leur indépendance le 10 octobre 1970 puis connaissent plusieurs coups d'État.",
    },
    keyFacts: {
      en: ["Population: about 930,000", "Languages: English, Fijian and Fiji Hindi", "Won Olympic gold in rugby sevens in 2016 and 2021"],
      fr: ["Population : environ 930 000", "Langues : anglais, fidjien et hindi fidjien", "Champion olympique de rugby à sept en 2016 et 2021"],
    },
  },
  {
    id: "KI",
    continent: "OCE",
    name: { en: "Kiribati", fr: "Kiribati" },
    capital: { en: "South Tarawa", fr: "Tarawa-Sud" },
    aliases: ["Gilbert Islands"],
    capitalAliases: ["Tarawa", "Bairiki", "Tarawa Sud"],
    markerAt: [172.98, 1.33],
    history: {
      en: "The islands became the British protectorate of the Gilbert Islands in 1892. Tarawa was the scene of a bloody battle between US and Japanese forces in 1943. Kiribati became independent on 12 July 1979.",
      fr: "Les îles deviennent le protectorat britannique des îles Gilbert en 1892. Tarawa est le théâtre d'une bataille sanglante entre forces américaines et japonaises en 1943. Kiribati devient indépendant le 12 juillet 1979.",
    },
    keyFacts: {
      en: ["Population: about 130,000", "Languages: English and Gilbertese", "The only country located in all four hemispheres, and one of the first to see each new year"],
      fr: ["Population : environ 130 000", "Langues : anglais et gilbertin", "Le seul pays situé dans les quatre hémisphères, et l'un des premiers à voir chaque nouvelle année"],
    },
  },
  {
    id: "MH",
    continent: "OCE",
    name: { en: "Marshall Islands", fr: "Îles Marshall" },
    capital: { en: "Majuro", fr: "Majuro" },
    aliases: ["Iles Marshall", "Marshalls", "Republic of the Marshall Islands"],
    mapNames: ["Marshall Is."],
    history: {
      en: "The islands were ruled by Germany and Japan before coming under US administration after World War II. The United States carried out 67 nuclear tests at Bikini and Enewetak atolls between 1946 and 1958. The Marshall Islands became independent in free association with the US on 21 October 1986.",
      fr: "L'archipel est dominé par l'Allemagne puis le Japon avant de passer sous administration américaine après la Seconde Guerre mondiale. Les États-Unis y mènent 67 essais nucléaires sur les atolls de Bikini et d'Enewetak entre 1946 et 1958. Les îles Marshall deviennent indépendantes en libre association avec les États-Unis le 21 octobre 1986.",
    },
    keyFacts: {
      en: ["Population: about 42,000", "Languages: Marshallese and English", "Made up of 29 coral atolls and 5 islands"],
      fr: ["Population : environ 42 000", "Langues : marshallais et anglais", "Composé de 29 atolls coralliens et de 5 îles"],
    },
  },
  {
    id: "FM",
    continent: "OCE",
    name: { en: "Micronesia", fr: "Micronésie" },
    capital: { en: "Palikir", fr: "Palikir" },
    aliases: ["Federated States of Micronesia", "FSM", "Micronesie", "États fédérés de Micronésie"],
    history: {
      en: "The islands were ruled successively by Spain, Germany and Japan, then administered by the United States after World War II. The Federated States of Micronesia became independent in free association with the US on 3 November 1986. It is made up of four states: Yap, Chuuk, Pohnpei and Kosrae.",
      fr: "L'archipel est successivement dominé par l'Espagne, l'Allemagne et le Japon, puis administré par les États-Unis après la Seconde Guerre mondiale. Les États fédérés de Micronésie deviennent indépendants en libre association avec les États-Unis le 3 novembre 1986. Ils comptent quatre États : Yap, Chuuk, Pohnpei et Kosrae.",
    },
    keyFacts: {
      en: ["Population: about 115,000", "Language: English, plus local languages", "Yap is famous for its giant stone money (rai)"],
      fr: ["Population : environ 115 000", "Langue : anglais, plus des langues locales", "Yap est célèbre pour sa monnaie de pierre géante (rai)"],
    },
  },
  {
    id: "NR",
    continent: "OCE",
    name: { en: "Nauru", fr: "Nauru" },
    capital: { en: "Yaren", fr: "Yaren" },
    history: {
      en: "Nauru was annexed by Germany in 1888 and administered by Australia after World War I. Phosphate mining made it briefly one of the richest countries per person in the 1970s. It gained independence on 31 January 1968.",
      fr: "Nauru est annexée par l'Allemagne en 1888 puis administrée par l'Australie après la Première Guerre mondiale. L'extraction du phosphate en fait brièvement l'un des pays les plus riches par habitant dans les années 1970. L'île obtient son indépendance le 31 janvier 1968.",
    },
    keyFacts: {
      en: ["Population: about 12,000", "Languages: Nauruan and English", "The world's smallest island country (21 km²); it has no official capital — the government sits in Yaren"],
      fr: ["Population : environ 12 000", "Langues : nauruan et anglais", "Le plus petit État insulaire du monde (21 km²) ; sans capitale officielle, le gouvernement siège à Yaren"],
    },
  },
  {
    id: "NZ",
    continent: "OCE",
    name: { en: "New Zealand", fr: "Nouvelle-Zélande" },
    capital: { en: "Wellington", fr: "Wellington" },
    aliases: ["Nouvelle Zelande", "Aotearoa"],
    history: {
      en: "Polynesian ancestors of the Māori settled New Zealand around 1250–1300. The Treaty of Waitangi was signed between Britain and Māori chiefs on 6 February 1840. In 1893 New Zealand became the first self-governing country where women could vote.",
      fr: "Les ancêtres polynésiens des Maoris s'installent en Nouvelle-Zélande vers 1250-1300. Le traité de Waitangi est signé entre la Grande-Bretagne et des chefs maoris le 6 février 1840. En 1893, la Nouvelle-Zélande devient le premier pays autonome à accorder le droit de vote aux femmes.",
    },
    keyFacts: {
      en: ["Population: about 5.3 million", "Languages: English, Māori and NZ Sign Language", "Wellington is the southernmost capital of a sovereign state"],
      fr: ["Population : environ 5,3 millions", "Langues : anglais, maori et langue des signes néo-zélandaise", "Wellington est la capitale d'État souverain la plus australe du monde"],
    },
  },
  {
    id: "PW",
    continent: "OCE",
    name: { en: "Palau", fr: "Palaos" },
    capital: { en: "Ngerulmud", fr: "Ngerulmud" },
    aliases: ["Palaos", "Belau"],
    capitalAliases: ["Melekeok"],
    history: {
      en: "Palau was ruled by Spain, Germany and Japan before US administration after World War II. It became independent in free association with the US on 1 October 1994. In 2009 it created the world's first shark sanctuary.",
      fr: "Les Palaos sont dominées par l'Espagne, l'Allemagne et le Japon avant l'administration américaine après la Seconde Guerre mondiale. Elles deviennent indépendantes en libre association avec les États-Unis le 1er octobre 1994. En 2009, elles créent le premier sanctuaire de requins au monde.",
    },
    keyFacts: {
      en: ["Population: about 18,000", "Languages: Palauan and English", "The Rock Islands Southern Lagoon is a UNESCO World Heritage Site"],
      fr: ["Population : environ 18 000", "Langues : paluan et anglais", "Le lagon sud des îles Chelbacheb est classé au patrimoine mondial"],
    },
  },
  {
    id: "PG",
    continent: "OCE",
    name: { en: "Papua New Guinea", fr: "Papouasie-Nouvelle-Guinée" },
    capital: { en: "Port Moresby", fr: "Port Moresby" },
    aliases: ["PNG", "Papouasie Nouvelle Guinee", "Papua"],
    history: {
      en: "People have lived in New Guinea for at least 50,000 years, and farming developed here independently thousands of years ago. The north was colonised by Germany and the south by Britain, both later administered by Australia. Papua New Guinea became independent on 16 September 1975.",
      fr: "La Nouvelle-Guinée est habitée depuis au moins 50 000 ans, et l'agriculture s'y développe de façon indépendante il y a des milliers d'années. Le nord est colonisé par l'Allemagne et le sud par la Grande-Bretagne, tous deux administrés ensuite par l'Australie. La Papouasie-Nouvelle-Guinée devient indépendante le 16 septembre 1975.",
    },
    keyFacts: {
      en: ["Population: about 10 million (estimates vary)", "Languages: English, Tok Pisin and Hiri Motu", "About 840 languages are spoken — more than in any other country"],
      fr: ["Population : environ 10 millions (estimations variables)", "Langues : anglais, tok pisin et hiri motu", "Environ 840 langues y sont parlées, plus que dans tout autre pays"],
    },
  },
  {
    id: "WS",
    continent: "OCE",
    name: { en: "Samoa", fr: "Samoa" },
    capital: { en: "Apia", fr: "Apia" },
    aliases: ["Western Samoa", "Samoa occidentales"],
    history: {
      en: "The western Samoan islands became a German colony in 1900 and were administered by New Zealand from 1914. Samoa became independent on 1 January 1962, the first Pacific island nation to do so. In 2011 it skipped 30 December to move west of the International Date Line.",
      fr: "Les îles Samoa occidentales deviennent une colonie allemande en 1900, puis sont administrées par la Nouvelle-Zélande à partir de 1914. Les Samoa deviennent indépendantes le 1er janvier 1962, première nation insulaire du Pacifique à le faire. En 2011, elles sautent le 30 décembre pour passer à l'ouest de la ligne de changement de date.",
    },
    keyFacts: {
      en: ["Population: about 220,000", "Languages: Samoan and English", "Writer Robert Louis Stevenson lived and is buried here"],
      fr: ["Population : environ 220 000", "Langues : samoan et anglais", "L'écrivain Robert Louis Stevenson y a vécu et y est enterré"],
    },
  },
  {
    id: "SB",
    continent: "OCE",
    name: { en: "Solomon Islands", fr: "Îles Salomon" },
    capital: { en: "Honiara", fr: "Honiara" },
    aliases: ["Solomons", "Iles Salomon"],
    mapNames: ["Solomon Is."],
    history: {
      en: "Spanish explorer Álvaro de Mendaña reached the islands in 1568. They became a British protectorate in 1893, and Guadalcanal was the scene of major World War II battles in 1942–1943. The Solomon Islands became independent on 7 July 1978.",
      fr: "L'explorateur espagnol Álvaro de Mendaña atteint l'archipel en 1568. Il devient un protectorat britannique en 1893, et Guadalcanal est le théâtre de grandes batailles de la Seconde Guerre mondiale en 1942-1943. Les îles Salomon deviennent indépendantes le 7 juillet 1978.",
    },
    keyFacts: {
      en: ["Population: about 800,000", "Language: English; Solomon Islands Pijin widely spoken", "An archipelago of nearly 1,000 islands"],
      fr: ["Population : environ 800 000", "Langue : anglais ; pidgin des îles Salomon très parlé", "Un archipel de près de 1 000 îles"],
    },
  },
  {
    id: "TO",
    continent: "OCE",
    name: { en: "Tonga", fr: "Tonga" },
    capital: { en: "Nukuʻalofa", fr: "Nukuʻalofa" },
    capitalAliases: ["Nuku'alofa", "Nukualofa"],
    history: {
      en: "The Tuʻi Tonga dynasty built a maritime chiefdom that influenced much of the Pacific. King George Tupou I unified Tonga in 1845 and gave it a constitution in 1875. A British protected state from 1900, it was never fully colonised and became fully independent on 4 June 1970.",
      fr: "La dynastie des Tuʻi Tonga bâtit une chefferie maritime qui influence une grande partie du Pacifique. Le roi George Tupou Ier unifie les Tonga en 1845 et leur donne une constitution en 1875. État protégé britannique à partir de 1900, le pays n'est jamais totalement colonisé et devient pleinement indépendant le 4 juin 1970.",
    },
    keyFacts: {
      en: ["Population: about 100,000", "Languages: Tongan and English", "The only remaining kingdom in the Pacific islands"],
      fr: ["Population : environ 100 000", "Langues : tongien et anglais", "Le seul royaume subsistant des îles du Pacifique"],
    },
  },
  {
    id: "TV",
    continent: "OCE",
    name: { en: "Tuvalu", fr: "Tuvalu" },
    capital: { en: "Funafuti", fr: "Funafuti" },
    aliases: ["Ellice Islands"],
    markerAt: [179.19, -8.52],
    history: {
      en: "Formerly the Ellice Islands, Tuvalu was part of the British colony of the Gilbert and Ellice Islands. It separated in 1975–1976 and became independent on 1 October 1978. Its highest point is only about 4.6 m above sea level, making it very vulnerable to rising seas.",
      fr: "Anciennement les îles Ellice, Tuvalu fait partie de la colonie britannique des îles Gilbert et Ellice. Il s'en sépare en 1975-1976 et devient indépendant le 1er octobre 1978. Son point culminant ne dépasse pas 4,6 m environ, ce qui le rend très vulnérable à la montée des eaux.",
    },
    keyFacts: {
      en: ["Population: about 11,000", "Languages: Tuvaluan and English", "Earns significant income from its internet domain, .tv"],
      fr: ["Population : environ 11 000", "Langues : tuvaluan et anglais", "Tire d'importants revenus de son nom de domaine internet, .tv"],
    },
  },
  {
    id: "VU",
    continent: "OCE",
    name: { en: "Vanuatu", fr: "Vanuatu" },
    capital: { en: "Port Vila", fr: "Port-Vila" },
    aliases: ["New Hebrides", "Nouvelles-Hebrides"],
    capitalAliases: ["Port-Vila"],
    history: {
      en: "The islands, then called the New Hebrides, were jointly ruled by Britain and France as a condominium from 1906. Vanuatu became independent on 30 July 1980. Land diving on Pentecost Island is said to have inspired bungee jumping.",
      fr: "L'archipel, alors appelé Nouvelles-Hébrides, est gouverné conjointement par la Grande-Bretagne et la France sous forme de condominium à partir de 1906. Le Vanuatu devient indépendant le 30 juillet 1980. Le saut du gaul de l'île de Pentecôte aurait inspiré le saut à l'élastique.",
    },
    keyFacts: {
      en: ["Population: about 330,000", "Languages: Bislama, English and French", "Over 100 languages for about 330,000 people — the highest density of languages per person"],
      fr: ["Population : environ 330 000", "Langues : bichelamar, anglais et français", "Plus de 100 langues pour environ 330 000 habitants, record de densité linguistique"],
    },
  },
];
