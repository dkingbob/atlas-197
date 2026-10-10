/**
 * Africa — 54 countries.
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
    id: "DZ",
    continent: "AFR",
    name: { en: "Algeria", fr: "Algérie" },
    capital: { en: "Algiers", fr: "Alger" },
    aliases: ["Algerie"],
    history: {
      en: "Home to Berber kingdoms and later part of the Ottoman world, Algeria was invaded by France in 1830. A war of independence from 1954 to 1962 ended French rule, and independence was proclaimed on 5 July 1962. Since South Sudan split from Sudan in 2011, it has been the largest country in Africa.",
      fr: "Terre de royaumes berbères puis intégrée au monde ottoman, l'Algérie est envahie par la France en 1830. La guerre d'indépendance de 1954 à 1962 met fin à la domination française, et l'indépendance est proclamée le 5 juillet 1962. Depuis la partition du Soudan en 2011, c'est le plus grand pays d'Afrique.",
    },
    keyFacts: {
      en: ["Population: about 46 million", "Languages: Arabic and Tamazight (Berber); French widely used", "More than 80% of its territory lies in the Sahara"],
      fr: ["Population : environ 46 millions", "Langues : arabe et tamazight (berbère) ; français très utilisé", "Plus de 80 % du territoire se trouve dans le Sahara"],
    },
  },
  {
    id: "AO",
    continent: "AFR",
    name: { en: "Angola", fr: "Angola" },
    capital: { en: "Luanda", fr: "Luanda" },
    history: {
      en: "The Portuguese founded Luanda in 1576 and ruled Angola for about four centuries, making it a hub of the Atlantic slave trade. Independence came on 11 November 1975, followed by a civil war that lasted until 2002. Oil revenues have since made it one of Africa's largest economies.",
      fr: "Les Portugais fondent Luanda en 1576 et dominent l'Angola pendant environ quatre siècles, en faisant une plaque tournante de la traite atlantique. L'indépendance est obtenue le 11 novembre 1975, suivie d'une guerre civile qui dure jusqu'en 2002. Le pétrole en a depuis fait l'une des grandes économies d'Afrique.",
    },
    keyFacts: {
      en: ["Population: about 37 million", "Language: Portuguese", "One of Africa's top oil producers"],
      fr: ["Population : environ 37 millions", "Langue : portugais", "L'un des principaux producteurs de pétrole d'Afrique"],
    },
  },
  {
    id: "BJ",
    continent: "AFR",
    name: { en: "Benin", fr: "Bénin" },
    capital: { en: "Porto-Novo", fr: "Porto-Novo" },
    aliases: ["Benin", "Dahomey"],
    capitalAliases: ["Cotonou"],
    history: {
      en: "The powerful Kingdom of Dahomey ruled the area from the 17th to the 19th century before France colonised it in 1894. It became independent as Dahomey on 1 August 1960 and was renamed Benin in 1975. Porto-Novo is the official capital, while most government activity takes place in Cotonou.",
      fr: "Le puissant royaume du Dahomey domine la région du XVIIe au XIXe siècle avant la colonisation française en 1894. Le pays devient indépendant sous le nom de Dahomey le 1er août 1960, puis est rebaptisé Bénin en 1975. Porto-Novo est la capitale officielle, mais l'essentiel du gouvernement siège à Cotonou.",
    },
    keyFacts: {
      en: ["Population: about 14 million", "Language: French", "Considered the birthplace of the Vodun (Voodoo) religion"],
      fr: ["Population : environ 14 millions", "Langue : français", "Considéré comme le berceau du vaudou"],
    },
  },
  {
    id: "BW",
    continent: "AFR",
    name: { en: "Botswana", fr: "Botswana" },
    capital: { en: "Gaborone", fr: "Gaborone" },
    history: {
      en: "Botswana became the British protectorate of Bechuanaland in 1885. It gained independence on 30 September 1966 under its first president, Seretse Khama. Diamonds discovered shortly afterwards turned one of the world's poorest countries into one of Africa's most stable and prosperous democracies.",
      fr: "Le Botswana devient en 1885 le protectorat britannique du Bechuanaland. Il accède à l'indépendance le 30 septembre 1966 sous la présidence de Seretse Khama. Les diamants découverts peu après transforment l'un des pays les plus pauvres du monde en l'une des démocraties les plus stables et prospères d'Afrique.",
    },
    keyFacts: {
      en: ["Population: about 2.5 million", "Languages: English and Setswana", "Home to the Okavango Delta and one of the largest elephant populations"],
      fr: ["Population : environ 2,5 millions", "Langues : anglais et setswana", "Abrite le delta de l'Okavango et l'une des plus grandes populations d'éléphants"],
    },
  },
  {
    id: "BF",
    continent: "AFR",
    name: { en: "Burkina Faso", fr: "Burkina Faso" },
    capital: { en: "Ouagadougou", fr: "Ouagadougou" },
    aliases: ["Burkina", "Upper Volta", "Haute-Volta"],
    history: {
      en: "The Mossi kingdoms dominated the region for centuries before it became the French colony of Upper Volta. It gained independence on 5 August 1960. In 1984 President Thomas Sankara renamed it Burkina Faso, meaning roughly \"land of upright people\".",
      fr: "Les royaumes mossi dominent la région pendant des siècles avant qu'elle ne devienne la colonie française de Haute-Volta. Le pays devient indépendant le 5 août 1960. En 1984, le président Thomas Sankara le renomme Burkina Faso, soit à peu près « pays des hommes intègres ».",
    },
    keyFacts: {
      en: ["Population: about 23 million", "Languages: Mooré, Dioula, Fulfulde and other national languages; French used as a working language", "Hosts FESPACO, Africa's largest film festival"],
      fr: ["Population : environ 23 millions", "Langues : mooré, dioula, fulfulde et autres langues nationales ; français langue de travail", "Accueille le FESPACO, le plus grand festival de cinéma d'Afrique"],
    },
  },
  {
    id: "BI",
    continent: "AFR",
    name: { en: "Burundi", fr: "Burundi" },
    capital: { en: "Gitega", fr: "Gitega" },
    capitalAliases: ["Bujumbura"],
    history: {
      en: "Burundi was an ancient kingdom before coming under German and then Belgian rule as part of Ruanda-Urundi. It became independent on 1 July 1962. After a long civil war from 1993 to 2005, the political capital moved from Bujumbura to Gitega in 2019.",
      fr: "Ancien royaume, le Burundi passe sous domination allemande puis belge au sein du Ruanda-Urundi. Il devient indépendant le 1er juillet 1962. Après une longue guerre civile de 1993 à 2005, la capitale politique est transférée de Bujumbura à Gitega en 2019.",
    },
    keyFacts: {
      en: ["Population: about 14 million", "Languages: Kirundi, French and English", "Bujumbura remains the largest city and economic centre"],
      fr: ["Population : environ 14 millions", "Langues : kirundi, français et anglais", "Bujumbura reste la plus grande ville et le centre économique"],
    },
  },
  {
    id: "CV",
    continent: "AFR",
    name: { en: "Cabo Verde", fr: "Cap-Vert" },
    capital: { en: "Praia", fr: "Praia" },
    aliases: ["Cape Verde", "Cap Vert"],
    history: {
      en: "These Atlantic islands were uninhabited until Portuguese settlers arrived in the 1460s. They became a key stopover in the transatlantic slave trade. Cabo Verde gained independence on 5 July 1975 and is now one of Africa's most stable democracies.",
      fr: "Ces îles de l'Atlantique sont inhabitées jusqu'à l'arrivée des Portugais dans les années 1460. Elles deviennent une escale majeure de la traite transatlantique. Le Cap-Vert obtient son indépendance le 5 juillet 1975 et compte aujourd'hui parmi les démocraties les plus stables d'Afrique.",
    },
    keyFacts: {
      en: ["Population: about 525,000", "Language: Portuguese; Cape Verdean Creole widely spoken", "Morna music, made famous by Cesária Évora, is UNESCO heritage"],
      fr: ["Population : environ 525 000", "Langue : portugais ; créole capverdien très parlé", "La morna, rendue célèbre par Cesária Évora, est au patrimoine de l'UNESCO"],
    },
  },
  {
    id: "CM",
    continent: "AFR",
    name: { en: "Cameroon", fr: "Cameroun" },
    capital: { en: "Yaoundé", fr: "Yaoundé" },
    aliases: ["Cameroun"],
    history: {
      en: "Cameroon became the German colony of Kamerun in 1884 and was divided between France and Britain after World War I. The French part became independent on 1 January 1960, and part of British Cameroons joined it in 1961. This history explains why both French and English are official languages.",
      fr: "Le Cameroun devient la colonie allemande du Kamerun en 1884, puis est partagé entre la France et le Royaume-Uni après la Première Guerre mondiale. La partie française devient indépendante le 1er janvier 1960 et une partie du Cameroun britannique la rejoint en 1961. D'où les deux langues officielles, français et anglais.",
    },
    keyFacts: {
      en: ["Population: about 29 million", "Languages: French and English", "Nicknamed \"Africa in miniature\" for its varied landscapes"],
      fr: ["Population : environ 29 millions", "Langues : français et anglais", "Surnommé « l'Afrique en miniature » pour la variété de ses paysages"],
    },
  },
  {
    id: "CF",
    continent: "AFR",
    name: { en: "Central African Republic", fr: "République centrafricaine" },
    capital: { en: "Bangui", fr: "Bangui" },
    aliases: ["CAR", "Central Africa", "Centrafrique", "RCA"],
    mapNames: ["Central African Rep."],
    history: {
      en: "Formerly the French colony of Ubangi-Shari, the country became independent on 13 August 1960. Jean-Bédel Bokassa seized power and crowned himself emperor in 1977 before being overthrown in 1979. The country has faced repeated coups and conflicts since.",
      fr: "Ancienne colonie française de l'Oubangui-Chari, le pays devient indépendant le 13 août 1960. Jean-Bédel Bokassa prend le pouvoir et se fait couronner empereur en 1977, avant d'être renversé en 1979. Le pays a depuis connu de nombreux coups d'État et conflits.",
    },
    keyFacts: {
      en: ["Population: about 5.3 million", "Languages: French and Sango", "Located at the geographic heart of Africa"],
      fr: ["Population : environ 5,3 millions", "Langues : français et sango", "Situé au cœur géographique de l'Afrique"],
    },
  },
  {
    id: "TD",
    continent: "AFR",
    name: { en: "Chad", fr: "Tchad" },
    capital: { en: "N'Djamena", fr: "N'Djamena" },
    aliases: ["Tchad"],
    capitalAliases: ["Ndjamena", "Fort-Lamy"],
    history: {
      en: "Chad was home to the Kanem-Bornu Empire for about a thousand years. It became part of French Equatorial Africa and gained independence on 11 August 1960. Lake Chad, which gives the country its name, has shrunk dramatically since the 1960s.",
      fr: "Le Tchad abrite pendant environ mille ans l'empire du Kanem-Bornou. Intégré à l'Afrique-Équatoriale française, il devient indépendant le 11 août 1960. Le lac Tchad, qui donne son nom au pays, a fortement rétréci depuis les années 1960.",
    },
    keyFacts: {
      en: ["Population: about 20 million", "Languages: French and Arabic", "The Tibesti Mountains in the north reach 3,415 m (Emi Koussi)"],
      fr: ["Population : environ 20 millions", "Langues : français et arabe", "Le massif du Tibesti, au nord, culmine à 3 415 m (Emi Koussi)"],
    },
  },
  {
    id: "KM",
    continent: "AFR",
    name: { en: "Comoros", fr: "Comores" },
    capital: { en: "Moroni", fr: "Moroni" },
    aliases: ["Comores", "Comoro Islands"],
    history: {
      en: "The Comoros islands were long a crossroads of African, Arab and Malagasy trade before French colonisation in the 19th century. Three of the four main islands declared independence on 6 July 1975, while Mayotte chose to remain French. The young republic experienced many coups.",
      fr: "Les Comores sont longtemps un carrefour des échanges africains, arabes et malgaches avant la colonisation française au XIXe siècle. Trois des quatre îles principales proclament leur indépendance le 6 juillet 1975, tandis que Mayotte choisit de rester française. La jeune république a connu de nombreux coups d'État.",
    },
    keyFacts: {
      en: ["Population: about 870,000", "Languages: Comorian, Arabic and French", "One of the world's top producers of ylang-ylang essence"],
      fr: ["Population : environ 870 000", "Langues : comorien, arabe et français", "L'un des premiers producteurs mondiaux d'essence d'ylang-ylang"],
    },
  },
  {
    id: "CD",
    continent: "AFR",
    name: { en: "Democratic Republic of the Congo", fr: "République démocratique du Congo" },
    capital: { en: "Kinshasa", fr: "Kinshasa" },
    aliases: ["DR Congo", "DRC", "Congo-Kinshasa", "Democratic Republic of Congo", "RDC", "RD Congo", "Zaire", "Zaïre"],
    mapNames: ["Dem. Rep. Congo"],
    history: {
      en: "King Leopold II of Belgium ruled the territory as his personal property from 1885 before it became the Belgian Congo in 1908. Independence came on 30 June 1960 with Patrice Lumumba as prime minister. Mobutu renamed it Zaire from 1971 to 1997, and devastating wars followed from 1996 to 2003.",
      fr: "Le roi Léopold II de Belgique gouverne le territoire comme sa propriété personnelle à partir de 1885, avant qu'il ne devienne le Congo belge en 1908. L'indépendance est proclamée le 30 juin 1960, avec Patrice Lumumba comme Premier ministre. Mobutu le rebaptise Zaïre de 1971 à 1997, puis des guerres dévastatrices éclatent de 1996 à 2003.",
    },
    keyFacts: {
      en: ["Population: about 110 million", "Language: French; Lingala, Swahili, Kikongo and Tshiluba also national", "Kinshasa is one of the largest French-speaking cities in the world"],
      fr: ["Population : environ 110 millions", "Langue : français ; lingala, swahili, kikongo et tshiluba nationales", "Kinshasa est l'une des plus grandes villes francophones du monde"],
    },
  },
  {
    id: "CG",
    continent: "AFR",
    name: { en: "Republic of the Congo", fr: "République du Congo" },
    capital: { en: "Brazzaville", fr: "Brazzaville" },
    aliases: ["Congo", "Republic of Congo", "Congo-Brazzaville", "Congo Republic"],
    mapNames: ["Congo"],
    history: {
      en: "The French colony of Middle Congo had Brazzaville, named after explorer Pierre Savorgnan de Brazza, as its capital. During World War II, Brazzaville served as the capital of Free France. The country gained independence on 15 August 1960.",
      fr: "La colonie française du Moyen-Congo a pour capitale Brazzaville, nommée d'après l'explorateur Pierre Savorgnan de Brazza. Pendant la Seconde Guerre mondiale, Brazzaville est la capitale de la France libre. Le pays devient indépendant le 15 août 1960.",
    },
    keyFacts: {
      en: ["Population: about 6.3 million", "Language: French; Lingala and Kituba national", "Brazzaville and Kinshasa face each other across the Congo River"],
      fr: ["Population : environ 6,3 millions", "Langue : français ; lingala et kituba nationales", "Brazzaville et Kinshasa se font face de part et d'autre du fleuve Congo"],
    },
  },
  {
    id: "DJ",
    continent: "AFR",
    name: { en: "Djibouti", fr: "Djibouti" },
    capital: { en: "Djibouti", fr: "Djibouti" },
    history: {
      en: "The area became French Somaliland in the late 19th century and later the French Territory of the Afars and the Issas. Djibouti gained independence on 27 June 1977. Its strategic position at the entrance of the Red Sea makes it host to several foreign military bases.",
      fr: "La région devient la Côte française des Somalis à la fin du XIXe siècle, puis le Territoire français des Afars et des Issas. Djibouti accède à l'indépendance le 27 juin 1977. Sa position stratégique à l'entrée de la mer Rouge en fait l'hôte de plusieurs bases militaires étrangères.",
    },
    keyFacts: {
      en: ["Population: about 1.2 million", "Languages: French and Arabic", "Lake Assal, at 155 m below sea level, is Africa's lowest point"],
      fr: ["Population : environ 1,2 million", "Langues : français et arabe", "Le lac Assal, à 155 m sous le niveau de la mer, est le point le plus bas d'Afrique"],
    },
  },
  {
    id: "EG",
    continent: "AFR",
    name: { en: "Egypt", fr: "Égypte" },
    capital: { en: "Cairo", fr: "Le Caire" },
    aliases: ["Egypte"],
    capitalAliases: ["Caire"],
    history: {
      en: "Ancient Egypt was unified around 3100 BC and built the Giza pyramids around 2500 BC. After Greek, Roman and Arab rule, it came under British occupation in 1882 and became formally independent in 1922. The Suez Canal, opened in 1869, was nationalised in 1956.",
      fr: "L'Égypte antique est unifiée vers 3100 av. J.-C. et bâtit les pyramides de Gizeh vers 2500 av. J.-C. Après les dominations grecque, romaine et arabe, elle est occupée par les Britanniques en 1882 et devient officiellement indépendante en 1922. Le canal de Suez, ouvert en 1869, est nationalisé en 1956.",
    },
    keyFacts: {
      en: ["Population: about 116 million", "Language: Arabic", "About 95% of people live along the Nile valley and delta"],
      fr: ["Population : environ 116 millions", "Langue : arabe", "Environ 95 % de la population vit le long de la vallée et du delta du Nil"],
    },
  },
  {
    id: "GQ",
    continent: "AFR",
    name: { en: "Equatorial Guinea", fr: "Guinée équatoriale" },
    capital: { en: "Malabo", fr: "Malabo" },
    aliases: ["Guinee equatoriale"],
    capitalAliases: ["Ciudad de la Paz"],
    mapNames: ["Eq. Guinea"],
    history: {
      en: "Equatorial Guinea was a Spanish colony made up of the island of Bioko and the mainland region of Río Muni. It gained independence on 12 October 1968. The capital Malabo is on Bioko island, and a new capital, Ciudad de la Paz, is being built on the mainland.",
      fr: "La Guinée équatoriale est une colonie espagnole composée de l'île de Bioko et de la région continentale du Río Muni. Elle devient indépendante le 12 octobre 1968. La capitale Malabo se trouve sur l'île de Bioko, et une nouvelle capitale, Ciudad de la Paz, est en construction sur le continent.",
    },
    keyFacts: {
      en: ["Population: about 1.9 million", "Languages: Spanish, French and Portuguese", "The only African country with Spanish as an official language"],
      fr: ["Population : environ 1,9 million", "Langues : espagnol, français et portugais", "Seul pays d'Afrique dont l'espagnol est langue officielle"],
    },
  },
  {
    id: "ER",
    continent: "AFR",
    name: { en: "Eritrea", fr: "Érythrée" },
    capital: { en: "Asmara", fr: "Asmara" },
    aliases: ["Erythree"],
    history: {
      en: "Eritrea was an Italian colony from 1890 and came under British administration in 1941. It was federated with Ethiopia in 1952 and annexed in 1962, sparking a 30-year war of independence. Independence was formalised on 24 May 1993 after a referendum.",
      fr: "L'Érythrée est une colonie italienne à partir de 1890, puis passe sous administration britannique en 1941. Fédérée à l'Éthiopie en 1952 puis annexée en 1962, elle mène une guerre d'indépendance de 30 ans. L'indépendance est officialisée le 24 mai 1993 après un référendum.",
    },
    keyFacts: {
      en: ["Population: about 3.5 million", "Languages: Tigrinya, Arabic and English used officially", "Asmara's modernist architecture is a UNESCO World Heritage Site"],
      fr: ["Population : environ 3,5 millions", "Langues : tigrinya, arabe et anglais en usage officiel", "L'architecture moderniste d'Asmara est classée au patrimoine mondial"],
    },
  },
  {
    id: "SZ",
    continent: "AFR",
    name: { en: "Eswatini", fr: "Eswatini" },
    capital: { en: "Mbabane", fr: "Mbabane" },
    aliases: ["Swaziland", "eSwatini"],
    capitalAliases: ["Lobamba"],
    mapNames: ["Swaziland", "eSwatini"],
    history: {
      en: "The Swazi kingdom became a British protectorate after the Second Boer War. It gained independence on 6 September 1968. In 2018 King Mswati III renamed the country from Swaziland to Eswatini, meaning \"land of the Swazis\".",
      fr: "Le royaume swazi devient un protectorat britannique après la seconde guerre des Boers. Il accède à l'indépendance le 6 septembre 1968. En 2018, le roi Mswati III renomme le pays Eswatini (anciennement Swaziland), ce qui signifie « pays des Swazis ».",
    },
    keyFacts: {
      en: ["Population: about 1.2 million", "Languages: Swazi and English", "One of the world's last absolute monarchies; Lobamba is the royal and legislative capital"],
      fr: ["Population : environ 1,2 million", "Langues : swati et anglais", "L'une des dernières monarchies absolues ; Lobamba est la capitale royale et législative"],
    },
  },
  {
    id: "ET",
    continent: "AFR",
    name: { en: "Ethiopia", fr: "Éthiopie" },
    capital: { en: "Addis Ababa", fr: "Addis-Abeba" },
    aliases: ["Ethiopie", "Abyssinia"],
    capitalAliases: ["Addis Abeba"],
    history: {
      en: "Ethiopia is one of the world's oldest nations, heir to the ancient Kingdom of Aksum. It defeated Italy at the Battle of Adwa in 1896 and, apart from an Italian occupation from 1936 to 1941, was never colonised. Addis Ababa hosts the headquarters of the African Union.",
      fr: "L'Éthiopie est l'une des plus anciennes nations du monde, héritière de l'ancien royaume d'Aksoum. Elle bat l'Italie à la bataille d'Adoua en 1896 et, hormis l'occupation italienne de 1936 à 1941, n'a jamais été colonisée. Addis-Abeba accueille le siège de l'Union africaine.",
    },
    keyFacts: {
      en: ["Population: about 130 million", "Language: Amharic is the main working language", "Uses its own calendar and is considered the birthplace of coffee"],
      fr: ["Population : environ 130 millions", "Langue : l'amharique est la principale langue de travail", "Possède son propre calendrier et serait le berceau du café"],
    },
  },
  {
    id: "GA",
    continent: "AFR",
    name: { en: "Gabon", fr: "Gabon" },
    capital: { en: "Libreville", fr: "Libreville" },
    history: {
      en: "Gabon became a French colony and part of French Equatorial Africa. It gained independence on 17 August 1960. Omar Bongo ruled from 1967 to 2009 and was succeeded by his son Ali, who was removed in a 2023 coup.",
      fr: "Le Gabon devient une colonie française intégrée à l'Afrique-Équatoriale française. Il accède à l'indépendance le 17 août 1960. Omar Bongo gouverne de 1967 à 2009, puis son fils Ali lui succède avant d'être renversé par un coup d'État en 2023.",
    },
    keyFacts: {
      en: ["Population: about 2.5 million", "Language: French", "Rainforest covers around 85% of the country"],
      fr: ["Population : environ 2,5 millions", "Langue : français", "La forêt tropicale couvre environ 85 % du pays"],
    },
  },
  {
    id: "GM",
    continent: "AFR",
    name: { en: "Gambia", fr: "Gambie" },
    capital: { en: "Banjul", fr: "Banjul" },
    aliases: ["The Gambia"],
    history: {
      en: "The Gambia grew from a British trading post on the Gambia River into a British colony. It gained independence on 18 February 1965. The country is a narrow strip of land along the river, surrounded by Senegal except for its Atlantic coast.",
      fr: "La Gambie est née d'un comptoir britannique sur le fleuve Gambie devenu colonie britannique. Elle accède à l'indépendance le 18 février 1965. Le pays est une étroite bande de terre le long du fleuve, entourée par le Sénégal sauf sur sa façade atlantique.",
    },
    keyFacts: {
      en: ["Population: about 2.8 million", "Language: English; Mandinka, Wolof and Fula widely spoken", "The smallest country on mainland Africa"],
      fr: ["Population : environ 2,8 millions", "Langue : anglais ; mandinka, wolof et peul très parlés", "Le plus petit pays d'Afrique continentale"],
    },
  },
  {
    id: "GH",
    continent: "AFR",
    name: { en: "Ghana", fr: "Ghana" },
    capital: { en: "Accra", fr: "Accra" },
    history: {
      en: "Formerly the British Gold Coast, home of the powerful Ashanti Empire, Ghana became the first sub-Saharan African colony to gain independence, on 6 March 1957. Its first leader, Kwame Nkrumah, was a major figure of Pan-Africanism. The country is a major producer of gold and cocoa.",
      fr: "Ancienne Côte-de-l'Or britannique et terre du puissant empire ashanti, le Ghana est la première colonie d'Afrique subsaharienne à obtenir son indépendance, le 6 mars 1957. Son premier dirigeant, Kwame Nkrumah, est une figure majeure du panafricanisme. Le pays est un grand producteur d'or et de cacao.",
    },
    keyFacts: {
      en: ["Population: about 34 million", "Language: English; Akan (Twi) widely spoken", "Lake Volta is one of the world's largest artificial lakes"],
      fr: ["Population : environ 34 millions", "Langue : anglais ; akan (twi) très parlé", "Le lac Volta est l'un des plus grands lacs artificiels du monde"],
    },
  },
  {
    id: "GN",
    continent: "AFR",
    name: { en: "Guinea", fr: "Guinée" },
    capital: { en: "Conakry", fr: "Conakry" },
    aliases: ["Guinee", "Guinea-Conakry"],
    history: {
      en: "Guinea was part of great West African empires before becoming a French colony. In 1958 it voted \"no\" to staying in the French Community and became independent on 2 October 1958, the first French colony in sub-Saharan Africa to do so. Ahmed Sékou Touré ruled until 1984.",
      fr: "La Guinée fait partie des grands empires d'Afrique de l'Ouest avant de devenir une colonie française. En 1958, elle vote « non » à la Communauté française et devient indépendante le 2 octobre 1958, première colonie française d'Afrique subsaharienne à le faire. Ahmed Sékou Touré la dirige jusqu'en 1984.",
    },
    keyFacts: {
      en: ["Population: about 14.5 million", "Language: French", "Holds some of the world's largest bauxite reserves"],
      fr: ["Population : environ 14,5 millions", "Langue : français", "Possède parmi les plus grandes réserves de bauxite du monde"],
    },
  },
  {
    id: "GW",
    continent: "AFR",
    name: { en: "Guinea-Bissau", fr: "Guinée-Bissau" },
    capital: { en: "Bissau", fr: "Bissau" },
    aliases: ["Guinea Bissau", "Guinee-Bissau"],
    history: {
      en: "Guinea-Bissau was a Portuguese colony and slave-trading centre. Led by Amílcar Cabral's movement, it fought an armed liberation struggle and declared independence on 24 September 1973, recognised by Portugal in 1974. It has since experienced frequent political instability.",
      fr: "La Guinée-Bissau est une colonie portugaise et un centre de traite. Sous l'impulsion du mouvement d'Amílcar Cabral, elle mène une lutte armée de libération et proclame son indépendance le 24 septembre 1973, reconnue par le Portugal en 1974. Le pays connaît depuis une forte instabilité politique.",
    },
    keyFacts: {
      en: ["Population: about 2.2 million", "Language: Portuguese; Guinea-Bissau Creole widely spoken", "The Bijagós archipelago is a UNESCO biosphere reserve"],
      fr: ["Population : environ 2,2 millions", "Langue : portugais ; créole bissau-guinéen très parlé", "L'archipel des Bijagos est une réserve de biosphère de l'UNESCO"],
    },
  },
  {
    id: "CI",
    continent: "AFR",
    name: { en: "Côte d'Ivoire", fr: "Côte d'Ivoire" },
    capital: { en: "Yamoussoukro", fr: "Yamoussoukro" },
    aliases: ["Ivory Coast", "Cote d'Ivoire"],
    history: {
      en: "Côte d'Ivoire became a French colony in 1893 and gained independence on 7 August 1960 under Félix Houphouët-Boigny. Yamoussoukro, his home town, became the official capital in 1983, while Abidjan remains the economic capital. The country went through civil wars in 2002–2007 and 2010–2011.",
      fr: "La Côte d'Ivoire devient colonie française en 1893 et accède à l'indépendance le 7 août 1960 sous Félix Houphouët-Boigny. Yamoussoukro, sa ville natale, devient la capitale officielle en 1983, tandis qu'Abidjan reste la capitale économique. Le pays traverse des guerres civiles en 2002-2007 et 2010-2011.",
    },
    keyFacts: {
      en: ["Population: about 32 million", "Language: French", "The world's largest producer of cocoa"],
      fr: ["Population : environ 32 millions", "Langue : français", "Premier producteur mondial de cacao"],
    },
  },
  {
    id: "KE",
    continent: "AFR",
    name: { en: "Kenya", fr: "Kenya" },
    capital: { en: "Nairobi", fr: "Nairobi" },
    history: {
      en: "The coast was long a hub of Swahili trade before Britain established the East Africa Protectorate in 1895. The Mau Mau uprising of the 1950s helped lead to independence on 12 December 1963 under Jomo Kenyatta. Kenya is famous for its savannah wildlife and long-distance runners.",
      fr: "La côte est longtemps un centre du commerce swahili avant que la Grande-Bretagne n'établisse le protectorat de l'Afrique de l'Est en 1895. Le soulèvement Mau Mau des années 1950 contribue à l'indépendance du 12 décembre 1963 sous Jomo Kenyatta. Le Kenya est célèbre pour sa faune de savane et ses coureurs de fond.",
    },
    keyFacts: {
      en: ["Population: about 56 million", "Languages: Swahili and English", "Crossed by the Great Rift Valley and the equator"],
      fr: ["Population : environ 56 millions", "Langues : swahili et anglais", "Traversé par la vallée du Grand Rift et l'équateur"],
    },
  },
  {
    id: "LS",
    continent: "AFR",
    name: { en: "Lesotho", fr: "Lesotho" },
    capital: { en: "Maseru", fr: "Maseru" },
    history: {
      en: "King Moshoeshoe I founded the Basotho nation in the 1820s and sought British protection, creating Basutoland. The kingdom gained independence on 4 October 1966. It is completely surrounded by South Africa.",
      fr: "Le roi Moshoeshoe Ier fonde la nation basotho dans les années 1820 et recherche la protection britannique, créant le Basutoland. Le royaume accède à l'indépendance le 4 octobre 1966. Il est entièrement enclavé dans l'Afrique du Sud.",
    },
    keyFacts: {
      en: ["Population: about 2.3 million", "Languages: Sesotho and English", "The only country entirely above 1,000 m in altitude"],
      fr: ["Population : environ 2,3 millions", "Langues : sesotho et anglais", "Le seul pays situé entièrement au-dessus de 1 000 m d'altitude"],
    },
  },
  {
    id: "LR",
    continent: "AFR",
    name: { en: "Liberia", fr: "Liberia" },
    capital: { en: "Monrovia", fr: "Monrovia" },
    aliases: ["Libéria"],
    history: {
      en: "Liberia was founded in 1822 by the American Colonization Society as a settlement for freed African Americans. It declared independence on 26 July 1847, making it Africa's oldest republic. After civil wars from 1989 to 2003, Ellen Johnson Sirleaf became Africa's first elected female head of state in 2006.",
      fr: "Le Liberia est fondé en 1822 par l'American Colonization Society pour accueillir des Afro-Américains affranchis. Il proclame son indépendance le 26 juillet 1847, ce qui en fait la plus ancienne république d'Afrique. Après les guerres civiles de 1989 à 2003, Ellen Johnson Sirleaf devient en 2006 la première femme élue à la tête d'un État africain.",
    },
    keyFacts: {
      en: ["Population: about 5.6 million", "Language: English", "The capital Monrovia is named after US President James Monroe"],
      fr: ["Population : environ 5,6 millions", "Langue : anglais", "La capitale Monrovia porte le nom du président américain James Monroe"],
    },
  },
  {
    id: "LY",
    continent: "AFR",
    name: { en: "Libya", fr: "Libye" },
    capital: { en: "Tripoli", fr: "Tripoli" },
    aliases: ["Libye"],
    history: {
      en: "Libya was ruled by Phoenicians, Greeks, Romans, Arabs and Ottomans before becoming an Italian colony in 1911. It gained independence as a kingdom on 24 December 1951. Muammar Gaddafi took power in 1969 and was overthrown in 2011, after which the country split between rival governments.",
      fr: "La Libye connaît les dominations phénicienne, grecque, romaine, arabe et ottomane avant de devenir une colonie italienne en 1911. Elle devient un royaume indépendant le 24 décembre 1951. Mouammar Kadhafi prend le pouvoir en 1969 et est renversé en 2011 ; le pays se divise ensuite entre gouvernements rivaux.",
    },
    keyFacts: {
      en: ["Population: about 7.4 million", "Language: Arabic", "Holds Africa's largest proven oil reserves"],
      fr: ["Population : environ 7,4 millions", "Langue : arabe", "Possède les plus grandes réserves prouvées de pétrole d'Afrique"],
    },
  },
  {
    id: "MG",
    continent: "AFR",
    name: { en: "Madagascar", fr: "Madagascar" },
    capital: { en: "Antananarivo", fr: "Antananarivo" },
    aliases: ["Malagasy Republic"],
    capitalAliases: ["Tananarive"],
    history: {
      en: "Madagascar was settled by Austronesian seafarers and later by people from mainland Africa. The Merina Kingdom unified much of the island before France colonised it in 1896. Independence came on 26 June 1960.",
      fr: "Madagascar est peuplée par des navigateurs austronésiens puis par des populations venues du continent africain. Le royaume merina unifie une grande partie de l'île avant la colonisation française en 1896. L'indépendance est proclamée le 26 juin 1960.",
    },
    keyFacts: {
      en: ["Population: about 32 million", "Languages: Malagasy and French", "Most of its wildlife, including all lemurs, exists nowhere else"],
      fr: ["Population : environ 32 millions", "Langues : malgache et français", "La plupart de sa faune, dont tous les lémuriens, n'existe nulle part ailleurs"],
    },
  },
  {
    id: "MW",
    continent: "AFR",
    name: { en: "Malawi", fr: "Malawi" },
    capital: { en: "Lilongwe", fr: "Lilongwe" },
    history: {
      en: "The region became the British protectorate of Nyasaland in 1891. It gained independence on 6 July 1964, with Hastings Banda as leader until 1994. Malawi is nicknamed \"the warm heart of Africa\".",
      fr: "La région devient le protectorat britannique du Nyassaland en 1891. Elle accède à l'indépendance le 6 juillet 1964, Hastings Banda restant au pouvoir jusqu'en 1994. Le Malawi est surnommé « le cœur chaleureux de l'Afrique ».",
    },
    keyFacts: {
      en: ["Population: about 22 million", "Languages: English and Chichewa", "Lake Malawi has more fish species than any other lake"],
      fr: ["Population : environ 22 millions", "Langues : anglais et chichewa", "Le lac Malawi compte plus d'espèces de poissons que tout autre lac"],
    },
  },
  {
    id: "ML",
    continent: "AFR",
    name: { en: "Mali", fr: "Mali" },
    capital: { en: "Bamako", fr: "Bamako" },
    history: {
      en: "The Mali Empire, whose ruler Mansa Musa became legendary for his wealth in the 14th century, made Timbuktu a centre of Islamic learning. The area later became French Sudan. Mali gained independence on 22 September 1960.",
      fr: "L'empire du Mali, dont le souverain Mansa Moussa devient légendaire pour sa richesse au XIVe siècle, fait de Tombouctou un centre du savoir islamique. La région devient ensuite le Soudan français. Le Mali accède à l'indépendance le 22 septembre 1960.",
    },
    keyFacts: {
      en: ["Population: about 24 million", "Languages: Bambara and 12 other national languages (French no longer official since 2023)", "The Great Mosque of Djenné is the largest mud-brick building in the world"],
      fr: ["Population : environ 24 millions", "Langues : bambara et 12 autres langues nationales (le français n'est plus officiel depuis 2023)", "La grande mosquée de Djenné est le plus grand édifice en terre crue au monde"],
    },
  },
  {
    id: "MR",
    continent: "AFR",
    name: { en: "Mauritania", fr: "Mauritanie" },
    capital: { en: "Nouakchott", fr: "Nouakchott" },
    aliases: ["Mauritanie"],
    history: {
      en: "Mauritania was crossed by Saharan trade routes and became part of French West Africa. It gained independence on 28 November 1960, and Nouakchott was built as its new capital. It was the last country in the world to abolish slavery, in 1981.",
      fr: "Traversée par les routes commerciales sahariennes, la Mauritanie est intégrée à l'Afrique-Occidentale française. Elle devient indépendante le 28 novembre 1960, et Nouakchott est construite comme nouvelle capitale. C'est le dernier pays au monde à avoir aboli l'esclavage, en 1981.",
    },
    keyFacts: {
      en: ["Population: about 5.2 million", "Language: Arabic", "Home to the Richat Structure, the \"Eye of the Sahara\""],
      fr: ["Population : environ 5,2 millions", "Langue : arabe", "Abrite la structure de Richat, « l'œil du Sahara »"],
    },
  },
  {
    id: "MU",
    continent: "AFR",
    name: { en: "Mauritius", fr: "Maurice" },
    capital: { en: "Port Louis", fr: "Port-Louis" },
    aliases: ["Ile Maurice", "Mauritius Island"],
    history: {
      en: "Mauritius was uninhabited until the Dutch settled it in 1638. It was then ruled by France and, from 1810, by Britain, which brought indentured workers from India. It became independent on 12 March 1968 and a republic in 1992.",
      fr: "L'île Maurice est inhabitée jusqu'à l'installation des Néerlandais en 1638. Elle passe ensuite sous domination française puis, à partir de 1810, britannique, avec l'arrivée de travailleurs engagés venus d'Inde. Elle devient indépendante le 12 mars 1968 et une république en 1992.",
    },
    keyFacts: {
      en: ["Population: about 1.3 million", "Languages: English and French used officially; Mauritian Creole widely spoken", "The dodo lived only here and was extinct by the late 17th century"],
      fr: ["Population : environ 1,3 million", "Langues : anglais et français en usage officiel ; créole mauricien très parlé", "Le dodo ne vivait qu'ici et a disparu à la fin du XVIIe siècle"],
    },
  },
  {
    id: "MA",
    continent: "AFR",
    name: { en: "Morocco", fr: "Maroc" },
    capital: { en: "Rabat", fr: "Rabat" },
    aliases: ["Maroc"],
    history: {
      en: "Morocco's first Islamic dynasty, the Idrisids, was founded in 788. France and Spain established protectorates in 1912. Morocco regained independence in 1956 and remains a kingdom.",
      fr: "La première dynastie islamique du Maroc, les Idrissides, est fondée en 788. La France et l'Espagne y établissent des protectorats en 1912. Le Maroc retrouve son indépendance en 1956 et reste un royaume.",
    },
    keyFacts: {
      en: ["Population: about 38 million", "Languages: Arabic and Tamazight (Berber)", "Only about 14 km from Spain across the Strait of Gibraltar"],
      fr: ["Population : environ 38 millions", "Langues : arabe et tamazight (berbère)", "À environ 14 km de l'Espagne par le détroit de Gibraltar"],
    },
  },
  {
    id: "MZ",
    continent: "AFR",
    name: { en: "Mozambique", fr: "Mozambique" },
    capital: { en: "Maputo", fr: "Maputo" },
    capitalAliases: ["Lourenco Marques"],
    history: {
      en: "The Portuguese controlled the coast from the early 16th century and later the whole territory. Mozambique gained independence on 25 June 1975 after a liberation war. A civil war followed from 1977 to 1992.",
      fr: "Les Portugais contrôlent la côte dès le début du XVIe siècle puis l'ensemble du territoire. Le Mozambique devient indépendant le 25 juin 1975 après une guerre de libération. Une guerre civile suit de 1977 à 1992.",
    },
    keyFacts: {
      en: ["Population: about 35 million", "Language: Portuguese", "Its flag is the only national flag featuring a modern rifle (an AK-47)"],
      fr: ["Population : environ 35 millions", "Langue : portugais", "Son drapeau est le seul à représenter un fusil moderne (un AK-47)"],
    },
  },
  {
    id: "NA",
    continent: "AFR",
    name: { en: "Namibia", fr: "Namibie" },
    capital: { en: "Windhoek", fr: "Windhoek" },
    aliases: ["Namibie"],
    history: {
      en: "Namibia became German South West Africa in 1884, where colonial forces committed the genocide of the Herero and Nama peoples in 1904–1908. It was later ruled by South Africa. Independence came on 21 March 1990.",
      fr: "La Namibie devient le Sud-Ouest africain allemand en 1884 ; les forces coloniales y commettent le génocide des Héréros et des Namas en 1904-1908. Le territoire est ensuite administré par l'Afrique du Sud. L'indépendance est proclamée le 21 mars 1990.",
    },
    keyFacts: {
      en: ["Population: about 3 million", "Language: English; Afrikaans and Oshiwambo widely spoken", "The Namib is considered one of the oldest deserts on Earth"],
      fr: ["Population : environ 3 millions", "Langue : anglais ; afrikaans et oshiwambo très parlés", "Le Namib est considéré comme l'un des plus vieux déserts du monde"],
    },
  },
  {
    id: "NE",
    continent: "AFR",
    name: { en: "Niger", fr: "Niger" },
    capital: { en: "Niamey", fr: "Niamey" },
    history: {
      en: "Niger was part of several Sahelian empires, including the Songhai, before becoming a French colony. It gained independence on 3 August 1960. A military coup took place in July 2023.",
      fr: "Le Niger fait partie de plusieurs empires sahéliens, dont l'empire songhaï, avant de devenir une colonie française. Il accède à l'indépendance le 3 août 1960. Un coup d'État militaire a lieu en juillet 2023.",
    },
    keyFacts: {
      en: ["Population: about 27 million", "Language: Hausa and other national languages; French widely used", "One of the youngest populations in the world"],
      fr: ["Population : environ 27 millions", "Langues : haoussa et autres langues nationales ; français très utilisé", "L'une des populations les plus jeunes du monde"],
    },
  },
  {
    id: "NG",
    continent: "AFR",
    name: { en: "Nigeria", fr: "Nigeria" },
    capital: { en: "Abuja", fr: "Abuja" },
    aliases: ["Nigéria"],
    history: {
      en: "Nigeria was home to the Nok culture, the Benin and Oyo kingdoms and the Sokoto Caliphate. Britain merged its colonies into Nigeria in 1914, and independence came on 1 October 1960. The Biafran War raged from 1967 to 1970, and Abuja replaced Lagos as capital in 1991.",
      fr: "Le Nigeria voit naître la culture Nok, les royaumes du Bénin et d'Oyo et le califat de Sokoto. Les Britanniques réunissent leurs colonies sous le nom de Nigeria en 1914, et l'indépendance est obtenue le 1er octobre 1960. La guerre du Biafra fait rage de 1967 à 1970, et Abuja remplace Lagos comme capitale en 1991.",
    },
    keyFacts: {
      en: ["Population: about 230 million", "Language: English; Hausa, Yoruba and Igbo widely spoken", "Africa's most populous country, with a huge film industry, \"Nollywood\""],
      fr: ["Population : environ 230 millions", "Langue : anglais ; haoussa, yoruba et igbo très parlés", "Le pays le plus peuplé d'Afrique, avec une immense industrie du cinéma, « Nollywood »"],
    },
  },
  {
    id: "RW",
    continent: "AFR",
    name: { en: "Rwanda", fr: "Rwanda" },
    capital: { en: "Kigali", fr: "Kigali" },
    history: {
      en: "Rwanda was a kingdom before German and then Belgian rule. It gained independence on 1 July 1962. In 1994 the genocide against the Tutsi killed an estimated 800,000 people or more in about 100 days.",
      fr: "Le Rwanda est un royaume avant les dominations allemande puis belge. Il devient indépendant le 1er juillet 1962. En 1994, le génocide des Tutsi fait environ 800 000 victimes ou davantage en une centaine de jours.",
    },
    keyFacts: {
      en: ["Population: about 14 million", "Languages: Kinyarwanda, French, English and Swahili", "Nicknamed the \"land of a thousand hills\"; home to mountain gorillas"],
      fr: ["Population : environ 14 millions", "Langues : kinyarwanda, français, anglais et swahili", "Surnommé le « pays des mille collines » ; abrite des gorilles des montagnes"],
    },
  },
  {
    id: "ST",
    continent: "AFR",
    name: { en: "São Tomé and Príncipe", fr: "Sao Tomé-et-Principe" },
    capital: { en: "São Tomé", fr: "Sao Tomé" },
    aliases: ["Sao Tome and Principe", "Sao Tome", "São Tomé"],
    capitalAliases: ["Sao Tome"],
    mapNames: ["São Tomé and Principe", "Sao Tome and Principe"],
    history: {
      en: "These volcanic islands were uninhabited until Portuguese explorers arrived around 1470. They became major producers of sugar and later cocoa, worked by enslaved and contract labourers. Independence came on 12 July 1975.",
      fr: "Ces îles volcaniques sont inhabitées jusqu'à l'arrivée des Portugais vers 1470. Elles deviennent de grands producteurs de sucre puis de cacao, exploités par des esclaves et des travailleurs sous contrat. L'indépendance est obtenue le 12 juillet 1975.",
    },
    keyFacts: {
      en: ["Population: about 230,000", "Language: Portuguese", "Africa's second-smallest country by population after Seychelles"],
      fr: ["Population : environ 230 000", "Langue : portugais", "Deuxième plus petit pays d'Afrique par la population, après les Seychelles"],
    },
  },
  {
    id: "SN",
    continent: "AFR",
    name: { en: "Senegal", fr: "Sénégal" },
    capital: { en: "Dakar", fr: "Dakar" },
    aliases: ["Senegal"],
    history: {
      en: "Senegal was a centre of French colonial West Africa, and Gorée Island is a memorial to the Atlantic slave trade. It became independent on 20 August 1960. Its first president, Léopold Sédar Senghor, was also a celebrated poet.",
      fr: "Le Sénégal est un centre de l'Afrique-Occidentale française, et l'île de Gorée est un lieu de mémoire de la traite atlantique. Il devient indépendant le 20 août 1960. Son premier président, Léopold Sédar Senghor, est aussi un poète célèbre.",
    },
    keyFacts: {
      en: ["Population: about 18.5 million", "Language: French; Wolof widely spoken", "Dakar sits on the westernmost point of mainland Africa"],
      fr: ["Population : environ 18,5 millions", "Langue : français ; wolof très parlé", "Dakar se trouve à la pointe la plus occidentale de l'Afrique continentale"],
    },
  },
  {
    id: "SC",
    continent: "AFR",
    name: { en: "Seychelles", fr: "Seychelles" },
    capital: { en: "Victoria", fr: "Victoria" },
    history: {
      en: "The Seychelles were uninhabited until French settlers arrived in 1770. Britain took control in 1814. The archipelago of about 115 islands became independent on 29 June 1976.",
      fr: "Les Seychelles sont inhabitées jusqu'à l'arrivée de colons français en 1770. Les Britanniques en prennent le contrôle en 1814. L'archipel d'environ 115 îles devient indépendant le 29 juin 1976.",
    },
    keyFacts: {
      en: ["Population: about 130,000", "Languages: Seychellois Creole, English and French", "Africa's smallest country by population; home of the giant coco de mer nut"],
      fr: ["Population : environ 130 000", "Langues : créole seychellois, anglais et français", "Le pays le moins peuplé d'Afrique ; patrie de la noix géante coco de mer"],
    },
  },
  {
    id: "SL",
    continent: "AFR",
    name: { en: "Sierra Leone", fr: "Sierra Leone" },
    capital: { en: "Freetown", fr: "Freetown" },
    history: {
      en: "Freetown was founded in 1792 as a settlement for freed and formerly enslaved Africans, under British control. Sierra Leone became independent on 27 April 1961. A brutal civil war lasted from 1991 to 2002.",
      fr: "Freetown est fondée en 1792 pour accueillir des Africains libérés ou anciennement réduits en esclavage, sous contrôle britannique. La Sierra Leone devient indépendante le 27 avril 1961. Une guerre civile brutale dure de 1991 à 2002.",
    },
    keyFacts: {
      en: ["Population: about 8.6 million", "Language: English; Krio widely spoken", "Known for its diamonds and one of the world's largest natural harbours"],
      fr: ["Population : environ 8,6 millions", "Langue : anglais ; krio très parlé", "Connue pour ses diamants et l'un des plus grands ports naturels du monde"],
    },
  },
  {
    id: "SO",
    continent: "AFR",
    name: { en: "Somalia", fr: "Somalie" },
    capital: { en: "Mogadishu", fr: "Mogadiscio" },
    aliases: ["Somalie"],
    history: {
      en: "British Somaliland and Italian Somaliland united to form an independent Somalia on 1 July 1960. Siad Barre ruled from 1969 until 1991, when the state collapsed into civil war. Somaliland in the north declared independence in 1991 but is not internationally recognised.",
      fr: "Le Somaliland britannique et la Somalie italienne s'unissent pour former une Somalie indépendante le 1er juillet 1960. Siad Barre gouverne de 1969 à 1991, date à laquelle l'État s'effondre dans la guerre civile. Le Somaliland, au nord, proclame son indépendance en 1991 mais n'est pas reconnu internationalement.",
    },
    keyFacts: {
      en: ["Population: about 19 million", "Languages: Somali and Arabic", "The longest coastline of mainland Africa"],
      fr: ["Population : environ 19 millions", "Langues : somali et arabe", "Le plus long littoral de l'Afrique continentale"],
    },
  },
  {
    id: "ZA",
    continent: "AFR",
    name: { en: "South Africa", fr: "Afrique du Sud" },
    capital: { en: "Pretoria", fr: "Pretoria" },
    capitalAliases: ["Cape Town", "Le Cap", "Bloemfontein"],
    history: {
      en: "The Dutch founded Cape Town in 1652, and Britain later took control; the Union of South Africa was formed in 1910. The apartheid system of racial segregation ran from 1948 to 1994. Nelson Mandela became the first president elected in fully democratic elections in 1994.",
      fr: "Les Néerlandais fondent Le Cap en 1652, puis les Britanniques prennent le contrôle ; l'Union sud-africaine est créée en 1910. Le régime de ségrégation raciale de l'apartheid dure de 1948 à 1994. Nelson Mandela devient en 1994 le premier président issu d'élections pleinement démocratiques.",
    },
    keyFacts: {
      en: ["Population: about 64 million", "Languages: 12 official languages, including Zulu, Xhosa, Afrikaans and English", "Three capitals: Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)"],
      fr: ["Population : environ 64 millions", "Langues : 12 langues officielles, dont le zoulou, le xhosa, l'afrikaans et l'anglais", "Trois capitales : Pretoria (exécutif), Le Cap (législatif), Bloemfontein (judiciaire)"],
    },
  },
  {
    id: "SS",
    continent: "AFR",
    name: { en: "South Sudan", fr: "Soudan du Sud" },
    capital: { en: "Juba", fr: "Djouba" },
    aliases: ["Sud-Soudan", "Southern Sudan"],
    capitalAliases: ["Juba"],
    mapNames: ["S. Sudan"],
    history: {
      en: "After decades of civil war with the north, South Sudan voted for independence in a 2011 referendum. It became independent on 9 July 2011, the newest member of the United Nations. A civil war broke out in 2013 and formally ended with a peace deal in 2018.",
      fr: "Après des décennies de guerre civile avec le nord, le Soudan du Sud vote pour l'indépendance lors d'un référendum en 2011. Il devient indépendant le 9 juillet 2011, devenant le plus récent membre de l'ONU. Une guerre civile éclate en 2013 et prend officiellement fin avec un accord de paix en 2018.",
    },
    keyFacts: {
      en: ["Population: about 12 million", "Language: English", "The Sudd is one of the largest wetlands in the world"],
      fr: ["Population : environ 12 millions", "Langue : anglais", "Le Sudd est l'une des plus grandes zones humides du monde"],
    },
  },
  {
    id: "SD",
    continent: "AFR",
    name: { en: "Sudan", fr: "Soudan" },
    capital: { en: "Khartoum", fr: "Khartoum" },
    aliases: ["Soudan"],
    history: {
      en: "Ancient Nubia, home of the Kingdom of Kush, lies largely in Sudan. Ruled jointly by Britain and Egypt from 1899, Sudan became independent on 1 January 1956. South Sudan seceded in 2011, and a devastating war began in April 2023.",
      fr: "L'ancienne Nubie, berceau du royaume de Koush, se trouve en grande partie au Soudan. Gouverné conjointement par le Royaume-Uni et l'Égypte à partir de 1899, le Soudan devient indépendant le 1er janvier 1956. Le Soudan du Sud fait sécession en 2011, et une guerre dévastatrice éclate en avril 2023.",
    },
    keyFacts: {
      en: ["Population: about 50 million", "Languages: Arabic and English", "Has more ancient pyramids than Egypt (at Meroë and elsewhere)"],
      fr: ["Population : environ 50 millions", "Langues : arabe et anglais", "Compte plus de pyramides antiques que l'Égypte (à Méroé et ailleurs)"],
    },
  },
  {
    id: "TZ",
    continent: "AFR",
    name: { en: "Tanzania", fr: "Tanzanie" },
    capital: { en: "Dodoma", fr: "Dodoma" },
    aliases: ["Tanzanie"],
    history: {
      en: "Tanganyika, a former German and then British territory, became independent on 9 December 1961, and Zanzibar followed in 1963. The two united on 26 April 1964 to form Tanzania under Julius Nyerere. Dodoma is the official capital, while Dar es Salaam is the largest city.",
      fr: "Le Tanganyika, ancien territoire allemand puis britannique, devient indépendant le 9 décembre 1961, suivi par Zanzibar en 1963. Les deux s'unissent le 26 avril 1964 pour former la Tanzanie sous Julius Nyerere. Dodoma est la capitale officielle, Dar es Salaam la plus grande ville.",
    },
    keyFacts: {
      en: ["Population: about 68 million", "Languages: Swahili and English", "Mount Kilimanjaro (5,895 m) is Africa's highest peak"],
      fr: ["Population : environ 68 millions", "Langues : swahili et anglais", "Le Kilimandjaro (5 895 m) est le plus haut sommet d'Afrique"],
    },
  },
  {
    id: "TG",
    continent: "AFR",
    name: { en: "Togo", fr: "Togo" },
    capital: { en: "Lomé", fr: "Lomé" },
    history: {
      en: "Togo became the German protectorate of Togoland in 1884 and was divided between France and Britain after World War I. French Togo became independent on 27 April 1960. The Gnassingbé family has led the country since 1967.",
      fr: "Le Togo devient le protectorat allemand du Togoland en 1884, puis est partagé entre la France et le Royaume-Uni après la Première Guerre mondiale. Le Togo français devient indépendant le 27 avril 1960. La famille Gnassingbé dirige le pays depuis 1967.",
    },
    keyFacts: {
      en: ["Population: about 9.5 million", "Language: French; Ewe and Kabiyè national", "A narrow country only about 50 km wide on its coast"],
      fr: ["Population : environ 9,5 millions", "Langue : français ; éwé et kabiyè nationales", "Un pays étroit, d'environ 50 km de large sur la côte"],
    },
  },
  {
    id: "TN",
    continent: "AFR",
    name: { en: "Tunisia", fr: "Tunisie" },
    capital: { en: "Tunis", fr: "Tunis" },
    aliases: ["Tunisie"],
    history: {
      en: "Tunisia was home to Carthage, a Phoenician city that rivalled Rome until its destruction in 146 BC. It became a French protectorate in 1881 and gained independence on 20 March 1956 under Habib Bourguiba. The Arab Spring began here in December 2010.",
      fr: "La Tunisie abrite Carthage, cité phénicienne rivale de Rome jusqu'à sa destruction en 146 av. J.-C. Elle devient un protectorat français en 1881 et obtient son indépendance le 20 mars 1956 sous Habib Bourguiba. Le Printemps arabe commence ici en décembre 2010.",
    },
    keyFacts: {
      en: ["Population: about 12.3 million", "Language: Arabic; French widely used", "The northernmost country in Africa"],
      fr: ["Population : environ 12,3 millions", "Langue : arabe ; français très utilisé", "Le pays le plus septentrional d'Afrique"],
    },
  },
  {
    id: "UG",
    continent: "AFR",
    name: { en: "Uganda", fr: "Ouganda" },
    capital: { en: "Kampala", fr: "Kampala" },
    aliases: ["Ouganda"],
    history: {
      en: "The Kingdom of Buganda was the most powerful of several kingdoms before Uganda became a British protectorate in 1894. It gained independence on 9 October 1962. Idi Amin's brutal rule lasted from 1971 to 1979.",
      fr: "Le royaume du Buganda est le plus puissant de plusieurs royaumes avant que l'Ouganda ne devienne un protectorat britannique en 1894. Le pays accède à l'indépendance le 9 octobre 1962. Le régime brutal d'Idi Amin dure de 1971 à 1979.",
    },
    keyFacts: {
      en: ["Population: about 50 million", "Languages: English and Swahili", "The White Nile flows out of Lake Victoria here"],
      fr: ["Population : environ 50 millions", "Langues : anglais et swahili", "Le Nil Blanc sort ici du lac Victoria"],
    },
  },
  {
    id: "ZM",
    continent: "AFR",
    name: { en: "Zambia", fr: "Zambie" },
    capital: { en: "Lusaka", fr: "Lusaka" },
    aliases: ["Zambie", "Northern Rhodesia"],
    history: {
      en: "Formerly the British protectorate of Northern Rhodesia, Zambia became independent on 24 October 1964. Kenneth Kaunda led the country until 1991. Copper mining has long been the backbone of its economy.",
      fr: "Ancien protectorat britannique de Rhodésie du Nord, la Zambie devient indépendante le 24 octobre 1964. Kenneth Kaunda dirige le pays jusqu'en 1991. L'extraction du cuivre est depuis longtemps le pilier de son économie.",
    },
    keyFacts: {
      en: ["Population: about 21 million", "Language: English; Bemba and Nyanja widely spoken", "Shares Victoria Falls with Zimbabwe"],
      fr: ["Population : environ 21 millions", "Langue : anglais ; bemba et nyanja très parlés", "Partage les chutes Victoria avec le Zimbabwe"],
    },
  },
  {
    id: "ZW",
    continent: "AFR",
    name: { en: "Zimbabwe", fr: "Zimbabwe" },
    capital: { en: "Harare", fr: "Harare" },
    aliases: ["Southern Rhodesia", "Rhodesia"],
    history: {
      en: "The stone city of Great Zimbabwe flourished between the 11th and 15th centuries. The territory became the British colony of Southern Rhodesia, whose white minority government declared independence in 1965. Majority rule and independence came on 18 April 1980; Robert Mugabe then ruled until 2017.",
      fr: "La cité de pierre du Grand Zimbabwe prospère entre le XIe et le XVe siècle. Le territoire devient la colonie britannique de Rhodésie du Sud, dont le gouvernement de la minorité blanche proclame l'indépendance en 1965. La règle de la majorité et l'indépendance arrivent le 18 avril 1980 ; Robert Mugabe gouverne ensuite jusqu'en 2017.",
    },
    keyFacts: {
      en: ["Population: about 16.6 million", "Languages: 16 official languages, including English, Shona and Ndebele", "Experienced one of history's worst hyperinflations in the late 2000s"],
      fr: ["Population : environ 16,6 millions", "Langues : 16 langues officielles, dont l'anglais, le shona et le ndébélé", "A connu l'une des pires hyperinflations de l'histoire à la fin des années 2000"],
    },
  },
];
