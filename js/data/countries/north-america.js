/**
 * North America (incl. Central America & the Caribbean) — 23 countries.
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
    id: "AG",
    continent: "NAM",
    name: { en: "Antigua and Barbuda", fr: "Antigua-et-Barbuda" },
    capital: { en: "St. John's", fr: "Saint John's" },
    aliases: ["Antigua", "Antigua et Barbuda", "Antigua & Barbuda"],
    capitalAliases: ["Saint John's", "St Johns"],
    mapNames: ["Antigua and Barb."],
    history: {
      en: "Columbus sighted Antigua in 1493 and named it after a church in Seville. England colonised it in 1632, and sugar plantations were worked by enslaved Africans until emancipation in 1834. The country became independent on 1 November 1981.",
      fr: "Christophe Colomb aperçoit Antigua en 1493 et la nomme d'après une église de Séville. L'Angleterre la colonise en 1632, et les plantations de canne à sucre sont exploitées par des esclaves africains jusqu'à l'émancipation de 1834. Le pays devient indépendant le 1er novembre 1981.",
    },
    keyFacts: {
      en: ["Population: about 94,000", "Language: English", "Famous for having \"365 beaches, one for every day of the year\""],
      fr: ["Population : environ 94 000", "Langue : anglais", "Célèbre pour ses « 365 plages, une pour chaque jour de l'année »"],
    },
  },
  {
    id: "BS",
    continent: "NAM",
    name: { en: "Bahamas", fr: "Bahamas" },
    capital: { en: "Nassau", fr: "Nassau" },
    aliases: ["The Bahamas"],
    history: {
      en: "The Lucayan people lived here when Columbus made his first landfall in the Americas in the Bahamas in 1492. The islands became a British colony and, in the early 18th century, a notorious pirate haven. The Bahamas became independent on 10 July 1973.",
      fr: "Le peuple lucayen vit ici lorsque Christophe Colomb accoste pour la première fois en Amérique, aux Bahamas, en 1492. L'archipel devient une colonie britannique et, au début du XVIIIe siècle, un célèbre repaire de pirates. Les Bahamas deviennent indépendantes le 10 juillet 1973.",
    },
    keyFacts: {
      en: ["Population: about 400,000", "Language: English", "An archipelago of around 700 islands and over 2,000 cays"],
      fr: ["Population : environ 400 000", "Langue : anglais", "Un archipel d'environ 700 îles et plus de 2 000 cayes"],
    },
  },
  {
    id: "BB",
    continent: "NAM",
    name: { en: "Barbados", fr: "Barbade" },
    capital: { en: "Bridgetown", fr: "Bridgetown" },
    aliases: ["Barbade"],
    history: {
      en: "English settlers arrived in 1627 and Barbados became a wealthy sugar colony based on slavery. It gained independence on 30 November 1966. Exactly 55 years later, on 30 November 2021, it became a republic, replacing the British monarch as head of state.",
      fr: "Des colons anglais arrivent en 1627 et la Barbade devient une riche colonie sucrière fondée sur l'esclavage. Elle accède à l'indépendance le 30 novembre 1966. Exactement 55 ans plus tard, le 30 novembre 2021, elle devient une république et cesse d'avoir le monarque britannique comme chef d'État.",
    },
    keyFacts: {
      en: ["Population: about 282,000", "Language: English", "Considered the birthplace of rum"],
      fr: ["Population : environ 282 000", "Langue : anglais", "Considérée comme le berceau du rhum"],
    },
  },
  {
    id: "BZ",
    continent: "NAM",
    name: { en: "Belize", fr: "Belize" },
    capital: { en: "Belmopan", fr: "Belmopan" },
    aliases: ["British Honduras"],
    history: {
      en: "Belize was a heartland of the Maya civilisation, with sites such as Caracol. It became the colony of British Honduras and gained independence on 21 September 1981. Belmopan was built as the new capital after Hurricane Hattie devastated Belize City in 1961.",
      fr: "Le Belize est un cœur de la civilisation maya, avec des sites comme Caracol. Il devient la colonie du Honduras britannique et accède à l'indépendance le 21 septembre 1981. Belmopan est construite comme nouvelle capitale après la dévastation de Belize City par l'ouragan Hattie en 1961.",
    },
    keyFacts: {
      en: ["Population: about 410,000", "Language: English", "Home to the Great Blue Hole and the second-largest barrier reef in the world"],
      fr: ["Population : environ 410 000", "Langue : anglais", "Abrite le Grand Trou bleu et la deuxième plus grande barrière de corail du monde"],
    },
  },
  {
    id: "CA",
    continent: "NAM",
    name: { en: "Canada", fr: "Canada" },
    capital: { en: "Ottawa", fr: "Ottawa" },
    history: {
      en: "Indigenous peoples have lived in Canada for thousands of years. France founded New France, with Quebec City in 1608, but Britain took control in 1763. The Dominion of Canada was created by Confederation on 1 July 1867 and gained full legal independence with the Constitution Act of 1982.",
      fr: "Les peuples autochtones vivent au Canada depuis des millénaires. La France fonde la Nouvelle-France, avec Québec en 1608, mais la Grande-Bretagne en prend le contrôle en 1763. Le Dominion du Canada est créé par la Confédération le 1er juillet 1867 et acquiert sa pleine indépendance juridique avec la Loi constitutionnelle de 1982.",
    },
    keyFacts: {
      en: ["Population: about 41 million", "Languages: English and French", "The second-largest country in the world, with the longest coastline"],
      fr: ["Population : environ 41 millions", "Langues : anglais et français", "Le deuxième plus grand pays du monde, au plus long littoral"],
    },
  },
  {
    id: "CR",
    continent: "NAM",
    name: { en: "Costa Rica", fr: "Costa Rica" },
    capital: { en: "San José", fr: "San José" },
    capitalAliases: ["San Jose"],
    history: {
      en: "Costa Rica was a Spanish colony and gained independence along with Central America on 15 September 1821. In 1948 it abolished its army, a decision written into the 1949 constitution. It is known for its stable democracy and conservation policies.",
      fr: "Le Costa Rica est une colonie espagnole qui obtient son indépendance avec l'Amérique centrale le 15 septembre 1821. En 1948, il abolit son armée, décision inscrite dans la constitution de 1949. Il est connu pour sa démocratie stable et sa politique de protection de la nature.",
    },
    keyFacts: {
      en: ["Population: about 5.2 million", "Language: Spanish", "Holds about 5% of the world's biodiversity on 0.03% of its surface"],
      fr: ["Population : environ 5,2 millions", "Langue : espagnol", "Abrite environ 5 % de la biodiversité mondiale sur 0,03 % de la surface du globe"],
    },
  },
  {
    id: "CU",
    continent: "NAM",
    name: { en: "Cuba", fr: "Cuba" },
    capital: { en: "Havana", fr: "La Havane" },
    capitalAliases: ["La Habana", "Havane"],
    history: {
      en: "Cuba was a Spanish colony from 1492 to 1898 and became formally independent in 1902 after US occupation. Fidel Castro's revolution took power in 1959. The Cuban Missile Crisis of 1962 brought the world close to nuclear war.",
      fr: "Cuba est une colonie espagnole de 1492 à 1898 et devient officiellement indépendante en 1902 après une occupation américaine. La révolution de Fidel Castro prend le pouvoir en 1959. La crise des missiles de 1962 rapproche le monde d'une guerre nucléaire.",
    },
    keyFacts: {
      en: ["Population: about 10 million", "Language: Spanish", "The largest island in the Caribbean"],
      fr: ["Population : environ 10 millions", "Langue : espagnol", "La plus grande île des Caraïbes"],
    },
  },
  {
    id: "DM",
    continent: "NAM",
    name: { en: "Dominica", fr: "Dominique" },
    capital: { en: "Roseau", fr: "Roseau" },
    aliases: ["Dominique", "Commonwealth of Dominica"],
    history: {
      en: "The Kalinago people resisted European settlement here longer than on most Caribbean islands. Dominica changed hands between France and Britain before becoming British in 1763. It gained independence on 3 November 1978.",
      fr: "Le peuple kalinago résiste ici à la colonisation européenne plus longtemps que sur la plupart des îles des Caraïbes. La Dominique passe de la France à la Grande-Bretagne avant de devenir britannique en 1763. Elle accède à l'indépendance le 3 novembre 1978.",
    },
    keyFacts: {
      en: ["Population: about 70,000", "Language: English; Antillean Creole (French-based) widely spoken", "Nicknamed \"the Nature Isle\"; its flag shows the rare sisserou parrot"],
      fr: ["Population : environ 70 000", "Langue : anglais ; créole antillais très parlé", "Surnommée « l'île nature » ; son drapeau montre le rare perroquet sisserou"],
    },
  },
  {
    id: "DO",
    continent: "NAM",
    name: { en: "Dominican Republic", fr: "République dominicaine" },
    capital: { en: "Santo Domingo", fr: "Saint-Domingue" },
    aliases: ["Republique dominicaine", "Dominican Rep"],
    capitalAliases: ["Saint Domingue"],
    mapNames: ["Dominican Rep."],
    history: {
      en: "Santo Domingo, founded by the Spanish in 1496, is the oldest continuously inhabited European city in the Americas. After Spanish rule and a period of Haitian control, the country declared independence on 27 February 1844. Rafael Trujillo ruled as dictator from 1930 to 1961.",
      fr: "Saint-Domingue, fondée par les Espagnols en 1496, est la plus ancienne ville européenne habitée en continu des Amériques. Après la domination espagnole et une période sous contrôle haïtien, le pays proclame son indépendance le 27 février 1844. Rafael Trujillo y règne en dictateur de 1930 à 1961.",
    },
    keyFacts: {
      en: ["Population: about 11.4 million", "Language: Spanish", "Shares the island of Hispaniola with Haiti"],
      fr: ["Population : environ 11,4 millions", "Langue : espagnol", "Partage l'île d'Hispaniola avec Haïti"],
    },
  },
  {
    id: "SV",
    continent: "NAM",
    name: { en: "El Salvador", fr: "Salvador" },
    capital: { en: "San Salvador", fr: "San Salvador" },
    aliases: ["Salvador"],
    history: {
      en: "The Pipil people's land of Cuzcatlán was conquered by Spain in the 16th century. El Salvador gained independence with Central America in 1821. A civil war lasted from 1980 to 1992.",
      fr: "Le territoire de Cuzcatlán, peuplé par les Pipils, est conquis par l'Espagne au XVIe siècle. Le Salvador obtient son indépendance avec l'Amérique centrale en 1821. Une guerre civile dure de 1980 à 1992.",
    },
    keyFacts: {
      en: ["Population: about 6.3 million", "Language: Spanish", "The smallest and most densely populated country in Central America"],
      fr: ["Population : environ 6,3 millions", "Langue : espagnol", "Le plus petit et le plus densément peuplé des pays d'Amérique centrale"],
    },
  },
  {
    id: "GD",
    continent: "NAM",
    name: { en: "Grenada", fr: "Grenade" },
    capital: { en: "St. George's", fr: "Saint-Georges" },
    aliases: ["Grenade"],
    capitalAliases: ["Saint George's", "St Georges", "Saint-Georges"],
    history: {
      en: "Grenada was a French colony before becoming British in 1763. It gained independence on 7 February 1974. A revolutionary government took power in 1979, and a US-led invasion followed in 1983.",
      fr: "La Grenade est une colonie française avant de devenir britannique en 1763. Elle accède à l'indépendance le 7 février 1974. Un gouvernement révolutionnaire prend le pouvoir en 1979, suivi d'une invasion menée par les États-Unis en 1983.",
    },
    keyFacts: {
      en: ["Population: about 117,000", "Language: English", "Nicknamed the \"Spice Isle\"; a nutmeg appears on its flag"],
      fr: ["Population : environ 117 000", "Langue : anglais", "Surnommée « l'île aux épices » ; une noix de muscade figure sur son drapeau"],
    },
  },
  {
    id: "GT",
    continent: "NAM",
    name: { en: "Guatemala", fr: "Guatemala" },
    capital: { en: "Guatemala City", fr: "Guatemala" },
    capitalAliases: ["Guatemala", "Ciudad de Guatemala"],
    history: {
      en: "Guatemala was a centre of the Maya civilisation, with great cities such as Tikal. Spain conquered it in 1524, and it gained independence on 15 September 1821. A civil war lasted from 1960 to 1996.",
      fr: "Le Guatemala est un centre de la civilisation maya, avec de grandes cités comme Tikal. L'Espagne le conquiert en 1524, et il obtient son indépendance le 15 septembre 1821. Une guerre civile dure de 1960 à 1996.",
    },
    keyFacts: {
      en: ["Population: about 18 million", "Language: Spanish; over 20 Mayan languages spoken", "The most populous country in Central America"],
      fr: ["Population : environ 18 millions", "Langue : espagnol ; plus de 20 langues mayas parlées", "Le pays le plus peuplé d'Amérique centrale"],
    },
  },
  {
    id: "HT",
    continent: "NAM",
    name: { en: "Haiti", fr: "Haïti" },
    capital: { en: "Port-au-Prince", fr: "Port-au-Prince" },
    aliases: ["Haiti", "Hayti"],
    capitalAliases: ["Port au Prince"],
    history: {
      en: "The French colony of Saint-Domingue was the richest in the Caribbean, built on slavery. A slave revolution beginning in 1791, led by figures such as Toussaint Louverture, led to independence on 1 January 1804. Haiti became the first free Black republic and the first independent nation in the Caribbean.",
      fr: "La colonie française de Saint-Domingue est la plus riche des Caraïbes, fondée sur l'esclavage. Une révolution des esclaves commencée en 1791, menée notamment par Toussaint Louverture, aboutit à l'indépendance le 1er janvier 1804. Haïti devient la première république noire libre et la première nation indépendante des Caraïbes.",
    },
    keyFacts: {
      en: ["Population: about 11.7 million", "Languages: Haitian Creole and French", "The Citadelle Laferrière is the largest fortress in the Americas"],
      fr: ["Population : environ 11,7 millions", "Langues : créole haïtien et français", "La Citadelle Laferrière est la plus grande forteresse des Amériques"],
    },
  },
  {
    id: "HN",
    continent: "NAM",
    name: { en: "Honduras", fr: "Honduras" },
    capital: { en: "Tegucigalpa", fr: "Tegucigalpa" },
    history: {
      en: "The Maya city of Copán flourished in western Honduras. Spain colonised the region in the 16th century, and Honduras became independent in 1821 with Central America. The term \"banana republic\" was coined in 1904 with Honduras in mind.",
      fr: "La cité maya de Copán prospère dans l'ouest du Honduras. L'Espagne colonise la région au XVIe siècle, et le Honduras devient indépendant en 1821 avec l'Amérique centrale. L'expression « république bananière » est inventée en 1904 en pensant au Honduras.",
    },
    keyFacts: {
      en: ["Population: about 10.8 million", "Language: Spanish", "Copán's ruins are a UNESCO World Heritage Site"],
      fr: ["Population : environ 10,8 millions", "Langue : espagnol", "Les ruines de Copán sont classées au patrimoine mondial"],
    },
  },
  {
    id: "JM",
    continent: "NAM",
    name: { en: "Jamaica", fr: "Jamaïque" },
    capital: { en: "Kingston", fr: "Kingston" },
    aliases: ["Jamaique"],
    history: {
      en: "The Taíno inhabited Jamaica before Spanish colonisation in the early 16th century. England seized the island in 1655 and turned it into a major sugar colony. Jamaica became independent on 6 August 1962.",
      fr: "Les Taïnos peuplent la Jamaïque avant la colonisation espagnole au début du XVIe siècle. L'Angleterre s'empare de l'île en 1655 et en fait une grande colonie sucrière. La Jamaïque devient indépendante le 6 août 1962.",
    },
    keyFacts: {
      en: ["Population: about 2.8 million", "Language: English; Jamaican Patois widely spoken", "Birthplace of reggae and Bob Marley"],
      fr: ["Population : environ 2,8 millions", "Langue : anglais ; patois jamaïcain très parlé", "Berceau du reggae et de Bob Marley"],
    },
  },
  {
    id: "MX",
    continent: "NAM",
    name: { en: "Mexico", fr: "Mexique" },
    capital: { en: "Mexico City", fr: "Mexico" },
    aliases: ["Mexique", "Mexico"],
    capitalAliases: ["Mexico", "Ciudad de Mexico", "Mexico DF"],
    history: {
      en: "Mexico was home to the Olmec, Maya and Aztec civilisations; the Aztec capital Tenochtitlan fell to the Spanish in 1521. Independence was declared in 1810 and achieved in 1821. Mexico lost about half its territory to the United States in 1848, and a revolution reshaped it from 1910 to 1920.",
      fr: "Le Mexique voit naître les civilisations olmèque, maya et aztèque ; la capitale aztèque Tenochtitlan tombe aux mains des Espagnols en 1521. L'indépendance est proclamée en 1810 et obtenue en 1821. Le Mexique perd environ la moitié de son territoire au profit des États-Unis en 1848, et une révolution le transforme de 1910 à 1920.",
    },
    keyFacts: {
      en: ["Population: about 130 million", "Language: Spanish (plus 68 recognised Indigenous languages)", "The country with the most Spanish speakers in the world"],
      fr: ["Population : environ 130 millions", "Langue : espagnol (plus 68 langues autochtones reconnues)", "Le pays qui compte le plus d'hispanophones au monde"],
    },
  },
  {
    id: "NI",
    continent: "NAM",
    name: { en: "Nicaragua", fr: "Nicaragua" },
    capital: { en: "Managua", fr: "Managua" },
    history: {
      en: "Nicaragua became independent from Spain in 1821 with Central America. The Somoza family ruled from 1936 until the Sandinista revolution of 1979. A war against US-backed Contra rebels followed in the 1980s.",
      fr: "Le Nicaragua devient indépendant de l'Espagne en 1821 avec l'Amérique centrale. La famille Somoza gouverne de 1936 jusqu'à la révolution sandiniste de 1979. Une guerre contre les rebelles Contras soutenus par les États-Unis suit dans les années 1980.",
    },
    keyFacts: {
      en: ["Population: about 7 million", "Language: Spanish", "The largest country in Central America; Lake Nicaragua is home to bull sharks"],
      fr: ["Population : environ 7 millions", "Langue : espagnol", "Le plus grand pays d'Amérique centrale ; le lac Nicaragua abrite des requins-bouledogues"],
    },
  },
  {
    id: "PA",
    continent: "NAM",
    name: { en: "Panama", fr: "Panama" },
    capital: { en: "Panama City", fr: "Panama" },
    capitalAliases: ["Panama", "Ciudad de Panama"],
    history: {
      en: "Vasco Núñez de Balboa crossed the isthmus to the Pacific in 1513. Panama was part of Colombia until it separated on 3 November 1903 with US support. The Panama Canal opened in 1914 and was handed over to Panama on 31 December 1999.",
      fr: "Vasco Núñez de Balboa traverse l'isthme jusqu'au Pacifique en 1513. Le Panama fait partie de la Colombie jusqu'à sa séparation le 3 novembre 1903, avec le soutien des États-Unis. Le canal de Panama ouvre en 1914 et est rétrocédé au Panama le 31 décembre 1999.",
    },
    keyFacts: {
      en: ["Population: about 4.5 million", "Language: Spanish", "Uses the US dollar alongside its own balboa"],
      fr: ["Population : environ 4,5 millions", "Langue : espagnol", "Utilise le dollar américain aux côtés de son propre balboa"],
    },
  },
  {
    id: "KN",
    continent: "NAM",
    name: { en: "Saint Kitts and Nevis", fr: "Saint-Christophe-et-Niévès" },
    capital: { en: "Basseterre", fr: "Basseterre" },
    aliases: ["St Kitts and Nevis", "St. Kitts and Nevis", "Saint Kitts", "St Kitts", "Saint-Kitts-et-Nevis", "Saint Christophe et Nieves"],
    mapNames: ["St. Kitts and Nevis"],
    history: {
      en: "Saint Kitts was the site of the first English settlement in the Caribbean, in 1623, earning it the title \"Mother Colony of the West Indies\". The islands became independent on 19 September 1983. Alexander Hamilton, a US founding father, was born on Nevis.",
      fr: "Saint-Christophe accueille en 1623 la première colonie anglaise des Caraïbes, d'où son surnom de « colonie mère des Antilles ». Les îles deviennent indépendantes le 19 septembre 1983. Alexander Hamilton, l'un des pères fondateurs des États-Unis, est né à Niévès.",
    },
    keyFacts: {
      en: ["Population: about 47,000", "Language: English", "The smallest sovereign state in the Americas"],
      fr: ["Population : environ 47 000", "Langue : anglais", "Le plus petit État souverain des Amériques"],
    },
  },
  {
    id: "LC",
    continent: "NAM",
    name: { en: "Saint Lucia", fr: "Sainte-Lucie" },
    capital: { en: "Castries", fr: "Castries" },
    aliases: ["St Lucia", "St. Lucia", "Sainte Lucie"],
    history: {
      en: "France and Britain fought over Saint Lucia so often that it changed hands 14 times. It became definitively British in 1814 and gained independence on 22 February 1979. Its twin volcanic peaks, the Pitons, are a UNESCO World Heritage Site.",
      fr: "La France et la Grande-Bretagne se disputent tant Sainte-Lucie qu'elle change de mains 14 fois. Elle devient définitivement britannique en 1814 et accède à l'indépendance le 22 février 1979. Ses deux pics volcaniques, les Pitons, sont classés au patrimoine mondial.",
    },
    keyFacts: {
      en: ["Population: about 180,000", "Language: English; Saint Lucian Creole (French-based) widely spoken", "Has produced two Nobel laureates, the most per person of any country"],
      fr: ["Population : environ 180 000", "Langue : anglais ; créole saint-lucien très parlé", "A produit deux prix Nobel, le record par habitant"],
    },
  },
  {
    id: "VC",
    continent: "NAM",
    name: { en: "Saint Vincent and the Grenadines", fr: "Saint-Vincent-et-les-Grenadines" },
    capital: { en: "Kingstown", fr: "Kingstown" },
    aliases: ["St Vincent", "St. Vincent and the Grenadines", "Saint Vincent", "Saint-Vincent", "St Vincent and the Grenadines"],
    mapNames: ["St. Vin. and Gren."],
    history: {
      en: "The Kalinago and Garifuna people long resisted European colonisation, until Britain deported most Garifuna in 1797. The islands became independent on 27 October 1979. La Soufrière volcano erupted in 2021.",
      fr: "Les Kalinagos et les Garifunas résistent longtemps à la colonisation européenne, jusqu'à la déportation de la plupart des Garifunas par les Britanniques en 1797. L'archipel devient indépendant le 27 octobre 1979. Le volcan de la Soufrière entre en éruption en 2021.",
    },
    keyFacts: {
      en: ["Population: about 100,000", "Language: English", "Made up of 32 islands and cays"],
      fr: ["Population : environ 100 000", "Langue : anglais", "Composé de 32 îles et îlots"],
    },
  },
  {
    id: "TT",
    continent: "NAM",
    name: { en: "Trinidad and Tobago", fr: "Trinité-et-Tobago" },
    capital: { en: "Port of Spain", fr: "Port-d'Espagne" },
    aliases: ["Trinidad", "Trinite-et-Tobago", "Trinidad & Tobago"],
    capitalAliases: ["Port-of-Spain", "Port d'Espagne"],
    history: {
      en: "Trinidad was Spanish until Britain captured it in 1797, and Tobago changed hands many times before both were joined in 1889. The country became independent on 31 August 1962 and a republic in 1976. Oil and gas made it one of the Caribbean's richest nations.",
      fr: "Trinité est espagnole jusqu'à sa prise par les Britanniques en 1797, et Tobago change souvent de mains avant l'union des deux îles en 1889. Le pays devient indépendant le 31 août 1962 et une république en 1976. Le pétrole et le gaz en font l'un des pays les plus riches des Caraïbes.",
    },
    keyFacts: {
      en: ["Population: about 1.5 million", "Language: English", "The steelpan, the only acoustic instrument invented in the 20th century, was born here"],
      fr: ["Population : environ 1,5 million", "Langue : anglais", "Le steelpan, seul instrument acoustique inventé au XXe siècle, est né ici"],
    },
  },
  {
    id: "US",
    continent: "NAM",
    name: { en: "United States", fr: "États-Unis" },
    capital: { en: "Washington, D.C.", fr: "Washington" },
    aliases: ["USA", "U.S.A.", "US", "U.S.", "United States of America", "America", "Etats-Unis", "Etats-Unis d'Amerique", "Amérique"],
    capitalAliases: ["Washington", "Washington DC", "Washington D.C."],
    mapNames: ["United States of America"],
    history: {
      en: "Indigenous peoples lived across North America long before European colonisation. Thirteen British colonies declared independence on 4 July 1776, and the Constitution took effect in 1789. After the Civil War (1861–1865) ended slavery, the country grew into the world's largest economy.",
      fr: "Les peuples autochtones vivent en Amérique du Nord bien avant la colonisation européenne. Treize colonies britanniques proclament leur indépendance le 4 juillet 1776, et la Constitution entre en vigueur en 1789. Après la guerre de Sécession (1861-1865), qui abolit l'esclavage, le pays devient la première économie mondiale.",
    },
    keyFacts: {
      en: ["Population: about 340 million", "Language: English (de facto)", "A federation of 50 states; first to land humans on the Moon (1969)"],
      fr: ["Population : environ 340 millions", "Langue : anglais (de fait)", "Une fédération de 50 États ; premier pays à poser des humains sur la Lune (1969)"],
    },
  },
];
