/**
 * South America — 12 countries.
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
    id: "AR",
    continent: "SAM",
    name: { en: "Argentina", fr: "Argentine" },
    capital: { en: "Buenos Aires", fr: "Buenos Aires" },
    aliases: ["Argentine"],
    history: {
      en: "Spanish colonists founded Buenos Aires in 1536 and again in 1580. Argentina declared independence on 9 July 1816. In the 20th century it alternated between democracy and military rule, including the dictatorship of 1976–1983 and the Falklands War with Britain in 1982.",
      fr: "Les colons espagnols fondent Buenos Aires en 1536 puis à nouveau en 1580. L'Argentine proclame son indépendance le 9 juillet 1816. Au XXe siècle, elle alterne démocratie et régimes militaires, dont la dictature de 1976-1983 et la guerre des Malouines contre le Royaume-Uni en 1982.",
    },
    keyFacts: {
      en: ["Population: about 46 million", "Language: Spanish", "Aconcagua (6,961 m) is the highest peak outside Asia"],
      fr: ["Population : environ 46 millions", "Langue : espagnol", "L'Aconcagua (6 961 m) est le plus haut sommet hors d'Asie"],
    },
  },
  {
    id: "BO",
    continent: "SAM",
    name: { en: "Bolivia", fr: "Bolivie" },
    capital: { en: "Sucre", fr: "Sucre" },
    aliases: ["Bolivie"],
    capitalAliases: ["La Paz"],
    history: {
      en: "The Tiwanaku culture and then the Inca Empire ruled the Andean highlands. Under Spain, the silver mines of Potosí were among the richest in the world. Bolivia became independent on 6 August 1825, named after Simón Bolívar, and lost its coastline to Chile in the War of the Pacific (1879–1884).",
      fr: "La culture de Tiwanaku puis l'Empire inca dominent les hauts plateaux andins. Sous l'Espagne, les mines d'argent de Potosí comptent parmi les plus riches du monde. La Bolivie devient indépendante le 6 août 1825, nommée d'après Simón Bolívar, et perd son accès à la mer au profit du Chili lors de la guerre du Pacifique (1879-1884).",
    },
    keyFacts: {
      en: ["Population: about 12.4 million", "Languages: Spanish and 36 Indigenous languages", "Sucre is the constitutional capital; La Paz, the seat of government, is the highest in the world"],
      fr: ["Population : environ 12,4 millions", "Langues : espagnol et 36 langues autochtones", "Sucre est la capitale constitutionnelle ; La Paz, siège du gouvernement, est la plus haute du monde"],
    },
  },
  {
    id: "BR",
    continent: "SAM",
    name: { en: "Brazil", fr: "Brésil" },
    capital: { en: "Brasília", fr: "Brasília" },
    aliases: ["Bresil", "Brasil"],
    capitalAliases: ["Brasilia"],
    history: {
      en: "Portuguese explorer Pedro Álvares Cabral reached Brazil in 1500. The Portuguese royal court moved to Rio de Janeiro in 1808, and Brazil declared independence on 7 September 1822 as an empire. It became a republic in 1889, and Brasília was inaugurated as the new capital in 1960.",
      fr: "L'explorateur portugais Pedro Álvares Cabral atteint le Brésil en 1500. La cour royale portugaise s'installe à Rio de Janeiro en 1808, et le Brésil proclame son indépendance le 7 septembre 1822 sous la forme d'un empire. Il devient une république en 1889, et Brasília est inaugurée comme nouvelle capitale en 1960.",
    },
    keyFacts: {
      en: ["Population: about 212 million", "Language: Portuguese", "Contains about 60% of the Amazon rainforest"],
      fr: ["Population : environ 212 millions", "Langue : portugais", "Abrite environ 60 % de la forêt amazonienne"],
    },
  },
  {
    id: "CL",
    continent: "SAM",
    name: { en: "Chile", fr: "Chili" },
    capital: { en: "Santiago", fr: "Santiago" },
    aliases: ["Chili"],
    capitalAliases: ["Santiago de Chile", "Santiago du Chili"],
    history: {
      en: "The Mapuche people long resisted both the Inca and the Spanish. Chile declared independence on 12 February 1818. Salvador Allende was overthrown in 1973 by General Augusto Pinochet, whose dictatorship lasted until 1990.",
      fr: "Le peuple mapuche résiste longtemps aux Incas puis aux Espagnols. Le Chili proclame son indépendance le 12 février 1818. Salvador Allende est renversé en 1973 par le général Augusto Pinochet, dont la dictature dure jusqu'en 1990.",
    },
    keyFacts: {
      en: ["Population: about 19.8 million", "Language: Spanish", "About 4,300 km long; the Atacama is the driest non-polar desert on Earth"],
      fr: ["Population : environ 19,8 millions", "Langue : espagnol", "Environ 4 300 km de long ; l'Atacama est le désert non polaire le plus sec du monde"],
    },
  },
  {
    id: "CO",
    continent: "SAM",
    name: { en: "Colombia", fr: "Colombie" },
    capital: { en: "Bogotá", fr: "Bogota" },
    aliases: ["Colombie"],
    capitalAliases: ["Bogota"],
    history: {
      en: "The Muisca people inspired the legend of El Dorado. Colombia declared independence in 1810 and secured it at the Battle of Boyacá in 1819, as part of Gran Colombia. After decades of armed conflict, a peace agreement was signed with the FARC guerrillas in 2016.",
      fr: "Le peuple muisca inspire la légende de l'Eldorado. La Colombie proclame son indépendance en 1810 et la consolide à la bataille de Boyacá en 1819, au sein de la Grande Colombie. Après des décennies de conflit armé, un accord de paix est signé avec la guérilla des FARC en 2016.",
    },
    keyFacts: {
      en: ["Population: about 53 million", "Language: Spanish", "Has more bird species than any other country"],
      fr: ["Population : environ 53 millions", "Langue : espagnol", "Compte plus d'espèces d'oiseaux que tout autre pays"],
    },
  },
  {
    id: "EC",
    continent: "SAM",
    name: { en: "Ecuador", fr: "Équateur" },
    capital: { en: "Quito", fr: "Quito" },
    aliases: ["Equateur"],
    history: {
      en: "Quito was the northern capital of the Inca Empire before the Spanish conquest. Ecuador won independence at the Battle of Pichincha on 24 May 1822 and left Gran Colombia in 1830. It adopted the US dollar as its currency in 2000.",
      fr: "Quito est la capitale nord de l'Empire inca avant la conquête espagnole. L'Équateur gagne son indépendance à la bataille de Pichincha le 24 mai 1822 et quitte la Grande Colombie en 1830. Il adopte le dollar américain comme monnaie en 2000.",
    },
    keyFacts: {
      en: ["Population: about 18 million", "Language: Spanish", "Owns the Galápagos Islands; named after the equator"],
      fr: ["Population : environ 18 millions", "Langue : espagnol", "Possède les îles Galápagos ; tire son nom de l'équateur"],
    },
  },
  {
    id: "GY",
    continent: "SAM",
    name: { en: "Guyana", fr: "Guyana" },
    capital: { en: "Georgetown", fr: "Georgetown" },
    history: {
      en: "The Dutch colonised the area before it became British Guiana in the early 19th century. Guyana became independent on 26 May 1966 and a republic in 1970. Large offshore oil discoveries since 2015 have made its economy one of the fastest-growing in the world.",
      fr: "Les Néerlandais colonisent la région avant qu'elle ne devienne la Guyane britannique au début du XIXe siècle. Le Guyana devient indépendant le 26 mai 1966 et une république en 1970. D'importantes découvertes pétrolières en mer depuis 2015 en font l'une des économies à la croissance la plus rapide du monde.",
    },
    keyFacts: {
      en: ["Population: about 830,000", "Language: English", "The only South American country with English as its official language"],
      fr: ["Population : environ 830 000", "Langue : anglais", "Le seul pays d'Amérique du Sud ayant l'anglais comme langue officielle"],
    },
  },
  {
    id: "PY",
    continent: "SAM",
    name: { en: "Paraguay", fr: "Paraguay" },
    capital: { en: "Asunción", fr: "Asuncion" },
    capitalAliases: ["Asuncion"],
    history: {
      en: "Jesuit missions organised Guaraní communities during Spanish colonial times. Paraguay became independent in May 1811. The War of the Triple Alliance (1864–1870) against Brazil, Argentina and Uruguay killed a large share of its population.",
      fr: "Des missions jésuites organisent les communautés guaranies à l'époque coloniale espagnole. Le Paraguay devient indépendant en mai 1811. La guerre de la Triple-Alliance (1864-1870) contre le Brésil, l'Argentine et l'Uruguay tue une grande partie de sa population.",
    },
    keyFacts: {
      en: ["Population: about 6.9 million", "Languages: Spanish and Guaraní", "Its flag has different emblems on the front and back"],
      fr: ["Population : environ 6,9 millions", "Langues : espagnol et guarani", "Son drapeau porte des emblèmes différents au recto et au verso"],
    },
  },
  {
    id: "PE",
    continent: "SAM",
    name: { en: "Peru", fr: "Pérou" },
    capital: { en: "Lima", fr: "Lima" },
    aliases: ["Perou"],
    history: {
      en: "Caral is one of the oldest cities in the Americas, and Cusco was the capital of the Inca Empire, conquered by Francisco Pizarro from 1532. Lima became the capital of a vast Spanish viceroyalty. Peru declared independence on 28 July 1821, secured in 1824.",
      fr: "Caral est l'une des plus anciennes villes des Amériques, et Cuzco est la capitale de l'Empire inca, conquis par Francisco Pizarro à partir de 1532. Lima devient la capitale d'une vaste vice-royauté espagnole. Le Pérou proclame son indépendance le 28 juillet 1821, consolidée en 1824.",
    },
    keyFacts: {
      en: ["Population: about 34 million", "Languages: Spanish, Quechua and Aymara", "Home to Machu Picchu and thousands of potato varieties"],
      fr: ["Population : environ 34 millions", "Langues : espagnol, quechua et aymara", "Abrite le Machu Picchu et des milliers de variétés de pommes de terre"],
    },
  },
  {
    id: "SR",
    continent: "SAM",
    name: { en: "Suriname", fr: "Suriname" },
    capital: { en: "Paramaribo", fr: "Paramaribo" },
    aliases: ["Surinam"],
    history: {
      en: "The Netherlands took control of Suriname in 1667, trading New Amsterdam (later New York) to England under the Treaty of Breda. Plantations relied on enslaved Africans and later contract workers from Asia. Suriname became independent on 25 November 1975.",
      fr: "Les Pays-Bas prennent le contrôle du Suriname en 1667, cédant la Nouvelle-Amsterdam (future New York) à l'Angleterre par le traité de Breda. Les plantations reposent sur des esclaves africains puis sur des travailleurs sous contrat venus d'Asie. Le Suriname devient indépendant le 25 novembre 1975.",
    },
    keyFacts: {
      en: ["Population: about 630,000", "Language: Dutch", "The smallest sovereign country in South America, about 90% covered by forest"],
      fr: ["Population : environ 630 000", "Langue : néerlandais", "Le plus petit pays souverain d'Amérique du Sud, couvert à environ 90 % de forêts"],
    },
  },
  {
    id: "UY",
    continent: "SAM",
    name: { en: "Uruguay", fr: "Uruguay" },
    capital: { en: "Montevideo", fr: "Montevideo" },
    history: {
      en: "Uruguay was disputed between Spain and Portugal and later between Argentina and Brazil. It declared independence on 25 August 1825, recognised in 1828. It hosted and won the first FIFA World Cup in 1930.",
      fr: "L'Uruguay est disputé entre l'Espagne et le Portugal, puis entre l'Argentine et le Brésil. Il proclame son indépendance le 25 août 1825, reconnue en 1828. Il organise et remporte la première Coupe du monde de football en 1930.",
    },
    keyFacts: {
      en: ["Population: about 3.4 million", "Language: Spanish", "Has about three to four cows for every person"],
      fr: ["Population : environ 3,4 millions", "Langue : espagnol", "Compte environ trois à quatre vaches par habitant"],
    },
  },
  {
    id: "VE",
    continent: "SAM",
    name: { en: "Venezuela", fr: "Venezuela" },
    capital: { en: "Caracas", fr: "Caracas" },
    history: {
      en: "Spanish explorers named the region \"Little Venice\" in 1499 after stilt houses on Lake Maracaibo. Venezuela declared independence on 5 July 1811; Simón Bolívar, born in Caracas, led the liberation of much of South America. It holds the world's largest proven oil reserves.",
      fr: "Les explorateurs espagnols nomment la région « petite Venise » en 1499 à cause des maisons sur pilotis du lac Maracaibo. Le Venezuela proclame son indépendance le 5 juillet 1811 ; Simón Bolívar, né à Caracas, mène la libération d'une grande partie de l'Amérique du Sud. Il détient les plus grandes réserves prouvées de pétrole du monde.",
    },
    keyFacts: {
      en: ["Population: about 28 million", "Language: Spanish", "Angel Falls (979 m) is the world's highest uninterrupted waterfall"],
      fr: ["Population : environ 28 millions", "Langue : espagnol", "Le Salto Ángel (979 m) est la plus haute chute d'eau ininterrompue du monde"],
    },
  },
];
