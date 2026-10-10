/**
 * Europe — 46 countries.
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
    id: "AL",
    continent: "EUR",
    name: { en: "Albania", fr: "Albanie" },
    capital: { en: "Tirana", fr: "Tirana" },
    aliases: ["Albanie", "Shqiperia"],
    capitalAliases: ["Tirane"],
    history: {
      en: "The region was home to the ancient Illyrians and was ruled by the Ottoman Empire from the 15th century. Albania declared independence on 28 November 1912. Under communist leader Enver Hoxha (1944–1985) it became one of the most isolated countries in the world.",
      fr: "La région est le berceau des Illyriens et passe sous domination ottomane au XVe siècle. L'Albanie proclame son indépendance le 28 novembre 1912. Sous le dirigeant communiste Enver Hoxha (1944-1985), elle devient l'un des pays les plus isolés du monde.",
    },
    keyFacts: {
      en: ["Population: about 2.4 million", "Language: Albanian", "Hoxha's regime built over 170,000 concrete bunkers across the country"],
      fr: ["Population : environ 2,4 millions", "Langue : albanais", "Le régime d'Hoxha a construit plus de 170 000 bunkers en béton dans le pays"],
    },
  },
  {
    id: "AD",
    continent: "EUR",
    name: { en: "Andorra", fr: "Andorre" },
    capital: { en: "Andorra la Vella", fr: "Andorre-la-Vieille" },
    aliases: ["Andorre"],
    capitalAliases: ["Andorra la Vieja", "Andorre la Vieille"],
    history: {
      en: "Andorra's co-principality dates from agreements of 1278 between the Count of Foix and the Bishop of Urgell. Today its two co-princes are the President of France and the Bishop of Urgell in Spain. It adopted a modern constitution in 1993 and joined the United Nations the same year.",
      fr: "La coprincipauté d'Andorre remonte aux accords de 1278 entre le comte de Foix et l'évêque d'Urgell. Aujourd'hui, ses deux coprinces sont le président de la République française et l'évêque d'Urgell en Espagne. Elle adopte une constitution moderne en 1993 et entre à l'ONU la même année.",
    },
    keyFacts: {
      en: ["Population: about 80,000", "Language: Catalan", "Andorra la Vella is the highest capital city in Europe (about 1,023 m)"],
      fr: ["Population : environ 80 000", "Langue : catalan", "Andorre-la-Vieille est la capitale la plus haute d'Europe (environ 1 023 m)"],
    },
  },
  {
    id: "AT",
    continent: "EUR",
    name: { en: "Austria", fr: "Autriche" },
    capital: { en: "Vienna", fr: "Vienne" },
    aliases: ["Autriche", "Osterreich"],
    history: {
      en: "Austria was the heart of the Habsburg monarchy for centuries and of Austria-Hungary from 1867 to 1918. It became a republic in 1918, was annexed by Nazi Germany in 1938, and regained full sovereignty in 1955 as a neutral state. It joined the European Union in 1995.",
      fr: "L'Autriche est pendant des siècles le cœur de la monarchie des Habsbourg, puis de l'Autriche-Hongrie de 1867 à 1918. Elle devient une république en 1918, est annexée par l'Allemagne nazie en 1938 et retrouve sa pleine souveraineté en 1955 comme État neutre. Elle rejoint l'Union européenne en 1995.",
    },
    keyFacts: {
      en: ["Population: about 9.2 million", "Language: German", "Birthplace of Mozart and a historic capital of classical music"],
      fr: ["Population : environ 9,2 millions", "Langue : allemand", "Patrie de Mozart et capitale historique de la musique classique"],
    },
  },
  {
    id: "BY",
    continent: "EUR",
    name: { en: "Belarus", fr: "Biélorussie" },
    capital: { en: "Minsk", fr: "Minsk" },
    aliases: ["Bielorussie", "Belarussia", "Belorussia", "Bélarus"],
    history: {
      en: "The lands of Belarus were part of the Grand Duchy of Lithuania and then the Russian Empire. After being a Soviet republic, Belarus declared independence in August 1991. Alexander Lukashenko has ruled the country since 1994.",
      fr: "Les terres biélorusses font partie du grand-duché de Lituanie puis de l'Empire russe. Ancienne république soviétique, la Biélorussie proclame son indépendance en août 1991. Alexandre Loukachenko dirige le pays depuis 1994.",
    },
    keyFacts: {
      en: ["Population: about 9.1 million", "Languages: Belarusian and Russian", "Shares the ancient Białowieża Forest, home of European bison, with Poland"],
      fr: ["Population : environ 9,1 millions", "Langues : biélorusse et russe", "Partage avec la Pologne l'antique forêt de Białowieża, refuge du bison d'Europe"],
    },
  },
  {
    id: "BE",
    continent: "EUR",
    name: { en: "Belgium", fr: "Belgique" },
    capital: { en: "Brussels", fr: "Bruxelles" },
    aliases: ["Belgique"],
    history: {
      en: "Belgium broke away from the Netherlands in the revolution of 1830 and chose Leopold I as its first king. It was occupied by Germany in both world wars. A founding member of the European project, its capital Brussels hosts the main EU institutions and NATO.",
      fr: "La Belgique se sépare des Pays-Bas lors de la révolution de 1830 et choisit Léopold Ier comme premier roi. Elle est occupée par l'Allemagne lors des deux guerres mondiales. Membre fondateur de la construction européenne, sa capitale Bruxelles accueille les principales institutions de l'UE et l'OTAN.",
    },
    keyFacts: {
      en: ["Population: about 11.8 million", "Languages: Dutch, French and German", "Famous for chocolate, comics (Tintin) and hundreds of beers"],
      fr: ["Population : environ 11,8 millions", "Langues : néerlandais, français et allemand", "Célèbre pour son chocolat, sa bande dessinée (Tintin) et ses centaines de bières"],
    },
  },
  {
    id: "BA",
    continent: "EUR",
    name: { en: "Bosnia and Herzegovina", fr: "Bosnie-Herzégovine" },
    capital: { en: "Sarajevo", fr: "Sarajevo" },
    aliases: ["Bosnia", "Bosnie", "Bosnia-Herzegovina", "BiH"],
    mapNames: ["Bosnia and Herz."],
    history: {
      en: "A medieval Bosnian kingdom fell to the Ottomans in 1463, and Austria-Hungary took control in 1878. The assassination of Archduke Franz Ferdinand in Sarajevo in 1914 triggered World War I. After leaving Yugoslavia in 1992, the country suffered a devastating war until the Dayton Agreement of 1995.",
      fr: "Le royaume médiéval de Bosnie tombe aux mains des Ottomans en 1463, puis l'Autriche-Hongrie en prend le contrôle en 1878. L'assassinat de l'archiduc François-Ferdinand à Sarajevo en 1914 déclenche la Première Guerre mondiale. Après avoir quitté la Yougoslavie en 1992, le pays subit une guerre dévastatrice jusqu'aux accords de Dayton de 1995.",
    },
    keyFacts: {
      en: ["Population: about 3.2 million", "Languages: Bosnian, Croatian and Serbian", "Has an access to the sea only 20 km long, at Neum"],
      fr: ["Population : environ 3,2 millions", "Langues : bosnien, croate et serbe", "Ne dispose que d'un accès à la mer d'environ 20 km, à Neum"],
    },
  },
  {
    id: "BG",
    continent: "EUR",
    name: { en: "Bulgaria", fr: "Bulgarie" },
    capital: { en: "Sofia", fr: "Sofia" },
    aliases: ["Bulgarie"],
    history: {
      en: "The First Bulgarian Empire was founded in 681, and the Cyrillic alphabet was developed in its literary schools. Bulgaria was under Ottoman rule from the late 14th century until 1878 and declared full independence in 1908. It joined the European Union in 2007.",
      fr: "Le Premier Empire bulgare est fondé en 681, et l'alphabet cyrillique est élaboré dans ses écoles littéraires. La Bulgarie est sous domination ottomane de la fin du XIVe siècle à 1878 et proclame sa pleine indépendance en 1908. Elle rejoint l'Union européenne en 2007.",
    },
    keyFacts: {
      en: ["Population: about 6.4 million", "Language: Bulgarian", "One of the world's leading producers of rose oil"],
      fr: ["Population : environ 6,4 millions", "Langue : bulgare", "L'un des premiers producteurs mondiaux d'huile essentielle de rose"],
    },
  },
  {
    id: "HR",
    continent: "EUR",
    name: { en: "Croatia", fr: "Croatie" },
    capital: { en: "Zagreb", fr: "Zagreb" },
    aliases: ["Croatie", "Hrvatska"],
    history: {
      en: "The Kingdom of Croatia was established in 925 and entered a union with Hungary in 1102. After centuries under Habsburg rule and then within Yugoslavia, Croatia declared independence on 25 June 1991, followed by a war until 1995. It joined the EU in 2013 and adopted the euro in 2023.",
      fr: "Le royaume de Croatie est fondé en 925 et s'unit à la Hongrie en 1102. Après des siècles sous les Habsbourg puis au sein de la Yougoslavie, la Croatie proclame son indépendance le 25 juin 1991, suivie d'une guerre jusqu'en 1995. Elle rejoint l'UE en 2013 et adopte l'euro en 2023.",
    },
    keyFacts: {
      en: ["Population: about 3.9 million", "Language: Croatian", "The necktie (cravat) is named after Croatian soldiers of the 17th century"],
      fr: ["Population : environ 3,9 millions", "Langue : croate", "La cravate tire son nom des soldats croates du XVIIe siècle"],
    },
  },
  {
    id: "CY",
    continent: "EUR",
    name: { en: "Cyprus", fr: "Chypre" },
    capital: { en: "Nicosia", fr: "Nicosie" },
    aliases: ["Chypre"],
    history: {
      en: "Cyprus was ruled by many powers, from the Ottomans in 1571 to Britain in 1878. It became independent on 16 August 1960. Since a Greek-backed coup and the Turkish invasion of 1974, the island has been divided; it joined the EU in 2004.",
      fr: "Chypre passe sous de nombreuses dominations, des Ottomans en 1571 aux Britanniques en 1878. L'île devient indépendante le 16 août 1960. Depuis un coup d'État soutenu par la Grèce et l'invasion turque de 1974, elle est divisée ; elle a rejoint l'UE en 2004.",
    },
    keyFacts: {
      en: ["Population: about 1.3 million (whole island)", "Languages: Greek and Turkish", "Nicosia is the last divided capital in Europe"],
      fr: ["Population : environ 1,3 million (toute l'île)", "Langues : grec et turc", "Nicosie est la dernière capitale divisée d'Europe"],
    },
  },
  {
    id: "CZ",
    continent: "EUR",
    name: { en: "Czechia", fr: "Tchéquie" },
    capital: { en: "Prague", fr: "Prague" },
    aliases: ["Czech Republic", "Tchequie", "République tchèque", "Czechoslovakia"],
    capitalAliases: ["Praha"],
    history: {
      en: "The Kingdom of Bohemia was a major power of the Holy Roman Empire before coming under Habsburg rule. Czechoslovakia was founded on 28 October 1918, came under communist rule in 1948 and regained freedom in the Velvet Revolution of 1989. The Czech Republic became independent on 1 January 1993 after a peaceful split.",
      fr: "Le royaume de Bohême est une grande puissance du Saint-Empire avant de passer sous les Habsbourg. La Tchécoslovaquie est fondée le 28 octobre 1918, passe sous régime communiste en 1948 et retrouve la liberté lors de la révolution de Velours de 1989. La Tchéquie devient indépendante le 1er janvier 1993 après une séparation pacifique.",
    },
    keyFacts: {
      en: ["Population: about 10.9 million", "Language: Czech", "Has the highest beer consumption per person in the world"],
      fr: ["Population : environ 10,9 millions", "Langue : tchèque", "Détient la plus forte consommation de bière par habitant au monde"],
    },
  },
  {
    id: "DK",
    continent: "EUR",
    name: { en: "Denmark", fr: "Danemark" },
    capital: { en: "Copenhagen", fr: "Copenhague" },
    aliases: ["Danemark"],
    history: {
      en: "Denmark was a Viking power and one of Europe's oldest kingdoms; it led the Kalmar Union with Norway and Sweden from 1397. It became a constitutional monarchy in 1849 and joined the European Economic Community in 1973. Greenland and the Faroe Islands are autonomous parts of the Danish realm.",
      fr: "Puissance viking et l'un des plus anciens royaumes d'Europe, le Danemark dirige l'union de Kalmar avec la Norvège et la Suède à partir de 1397. Il devient une monarchie constitutionnelle en 1849 et rejoint la Communauté économique européenne en 1973. Le Groenland et les îles Féroé sont des parties autonomes du royaume.",
    },
    keyFacts: {
      en: ["Population: about 6 million", "Language: Danish", "Its flag, the Dannebrog, is said to be the oldest national flag still in use"],
      fr: ["Population : environ 6 millions", "Langue : danois", "Son drapeau, le Dannebrog, serait le plus ancien drapeau national encore utilisé"],
    },
  },
  {
    id: "EE",
    continent: "EUR",
    name: { en: "Estonia", fr: "Estonie" },
    capital: { en: "Tallinn", fr: "Tallinn" },
    aliases: ["Estonie"],
    history: {
      en: "Estonia was ruled in turn by Danes, Germans, Swedes and Russians. It declared independence on 24 February 1918, was occupied by the Soviet Union in 1940, and restored independence on 20 August 1991. It joined the EU and NATO in 2004.",
      fr: "L'Estonie est successivement dominée par les Danois, les Allemands, les Suédois et les Russes. Elle proclame son indépendance le 24 février 1918, est occupée par l'URSS en 1940 et restaure son indépendance le 20 août 1991. Elle rejoint l'UE et l'OTAN en 2004.",
    },
    keyFacts: {
      en: ["Population: about 1.37 million", "Language: Estonian", "A digital pioneer: Skype was developed here and citizens can vote online"],
      fr: ["Population : environ 1,37 million", "Langue : estonien", "Pionnière du numérique : Skype y a été développé et l'on peut voter en ligne"],
    },
  },
  {
    id: "FI",
    continent: "EUR",
    name: { en: "Finland", fr: "Finlande" },
    capital: { en: "Helsinki", fr: "Helsinki" },
    aliases: ["Finlande", "Suomi"],
    history: {
      en: "Finland was part of Sweden for about 600 years and then an autonomous Grand Duchy of the Russian Empire from 1809. It declared independence on 6 December 1917 and resisted the Soviet Union in the Winter War of 1939–1940. It joined the EU in 1995 and NATO in 2023.",
      fr: "La Finlande fait partie de la Suède pendant environ 600 ans, puis devient un grand-duché autonome de l'Empire russe en 1809. Elle proclame son indépendance le 6 décembre 1917 et résiste à l'URSS lors de la guerre d'Hiver de 1939-1940. Elle rejoint l'UE en 1995 et l'OTAN en 2023.",
    },
    keyFacts: {
      en: ["Population: about 5.6 million", "Languages: Finnish and Swedish", "Often called the \"land of a thousand lakes\" — it actually has around 188,000"],
      fr: ["Population : environ 5,6 millions", "Langues : finnois et suédois", "Surnommée le « pays des mille lacs » — elle en compte en fait environ 188 000"],
    },
  },
  {
    id: "FR",
    continent: "EUR",
    name: { en: "France", fr: "France" },
    capital: { en: "Paris", fr: "Paris" },
    history: {
      en: "Roman Gaul became the kingdom of the Franks and then France. The Revolution of 1789 abolished the monarchy and proclaimed the rights of man; Napoleon later built an empire. The current Fifth Republic was founded in 1958, and France was a founding member of the European project.",
      fr: "La Gaule romaine devient le royaume des Francs puis la France. La Révolution de 1789 abolit la monarchie et proclame les droits de l'homme ; Napoléon bâtit ensuite un empire. L'actuelle Ve République est fondée en 1958, et la France est un membre fondateur de la construction européenne.",
    },
    keyFacts: {
      en: ["Population: about 68 million (including overseas)", "Language: French", "The world's most visited country by international tourists"],
      fr: ["Population : environ 68 millions (outre-mer compris)", "Langue : français", "Le pays le plus visité au monde par les touristes internationaux"],
    },
  },
  {
    id: "DE",
    continent: "EUR",
    name: { en: "Germany", fr: "Allemagne" },
    capital: { en: "Berlin", fr: "Berlin" },
    aliases: ["Allemagne", "Deutschland"],
    history: {
      en: "German lands formed the core of the Holy Roman Empire before unification under Prussia in 1871. After World War I, the Weimar Republic and the Nazi dictatorship, Germany was divided in 1949. It was reunified on 3 October 1990 and is the largest economy in the European Union.",
      fr: "Les terres allemandes forment le cœur du Saint-Empire avant l'unification sous la Prusse en 1871. Après la Première Guerre mondiale, la république de Weimar et la dictature nazie, l'Allemagne est divisée en 1949. Elle est réunifiée le 3 octobre 1990 et constitue la première économie de l'Union européenne.",
    },
    keyFacts: {
      en: ["Population: about 84 million", "Language: German", "The most populous country in the European Union"],
      fr: ["Population : environ 84 millions", "Langue : allemand", "Le pays le plus peuplé de l'Union européenne"],
    },
  },
  {
    id: "GR",
    continent: "EUR",
    name: { en: "Greece", fr: "Grèce" },
    capital: { en: "Athens", fr: "Athènes" },
    aliases: ["Grece", "Hellas"],
    capitalAliases: ["Athenes"],
    history: {
      en: "Ancient Greece gave birth to democracy in Athens in the 5th century BC, as well as to philosophy and the Olympic Games. After Byzantine and Ottoman rule, Greece won its War of Independence, which began in 1821, and was recognised in 1830. It joined the European Community in 1981.",
      fr: "La Grèce antique donne naissance à la démocratie athénienne au Ve siècle av. J.-C., ainsi qu'à la philosophie et aux Jeux olympiques. Après les dominations byzantine et ottomane, la Grèce gagne sa guerre d'indépendance, commencée en 1821, et est reconnue en 1830. Elle rejoint la Communauté européenne en 1981.",
    },
    keyFacts: {
      en: ["Population: about 10.4 million", "Language: Greek", "Has around 6,000 islands, of which about 200 are inhabited"],
      fr: ["Population : environ 10,4 millions", "Langue : grec", "Compte environ 6 000 îles, dont quelque 200 habitées"],
    },
  },
  {
    id: "HU",
    continent: "EUR",
    name: { en: "Hungary", fr: "Hongrie" },
    capital: { en: "Budapest", fr: "Budapest" },
    aliases: ["Hongrie", "Magyarorszag"],
    history: {
      en: "The Magyars settled the Carpathian Basin around 895, and Stephen I was crowned the first king in 1000. After Ottoman and Habsburg rule, Hungary formed Austria-Hungary from 1867 to 1918. A 1956 uprising against Soviet control was crushed; Hungary joined the EU in 2004.",
      fr: "Les Magyars s'installent dans le bassin des Carpates vers 895, et Étienne Ier est couronné premier roi en l'an 1000. Après les dominations ottomane et habsbourgeoise, la Hongrie forme l'Autriche-Hongrie de 1867 à 1918. Le soulèvement de 1956 contre la tutelle soviétique est écrasé ; le pays rejoint l'UE en 2004.",
    },
    keyFacts: {
      en: ["Population: about 9.6 million", "Language: Hungarian", "The Rubik's Cube was invented here by Ernő Rubik in 1974"],
      fr: ["Population : environ 9,6 millions", "Langue : hongrois", "Le Rubik's Cube y a été inventé par Ernő Rubik en 1974"],
    },
  },
  {
    id: "IS",
    continent: "EUR",
    name: { en: "Iceland", fr: "Islande" },
    capital: { en: "Reykjavík", fr: "Reykjavik" },
    aliases: ["Islande"],
    capitalAliases: ["Reykjavik"],
    history: {
      en: "Norse settlers arrived around 874, and the Althing assembly founded in 930 is one of the world's oldest parliaments. Iceland later came under Norwegian and then Danish rule. It became a fully independent republic on 17 June 1944.",
      fr: "Des colons scandinaves arrivent vers 874, et l'Althing, assemblée fondée en 930, est l'un des plus anciens parlements du monde. L'Islande passe ensuite sous domination norvégienne puis danoise. Elle devient une république pleinement indépendante le 17 juin 1944.",
    },
    keyFacts: {
      en: ["Population: about 390,000", "Language: Icelandic", "Reykjavík is the world's northernmost capital of a sovereign state"],
      fr: ["Population : environ 390 000", "Langue : islandais", "Reykjavik est la capitale d'État souverain la plus septentrionale du monde"],
    },
  },
  {
    id: "IE",
    continent: "EUR",
    name: { en: "Ireland", fr: "Irlande" },
    capital: { en: "Dublin", fr: "Dublin" },
    aliases: ["Irlande", "Eire", "Republic of Ireland"],
    history: {
      en: "Christianised by Saint Patrick in the 5th century, Ireland came under growing English and then British control. The Great Famine of 1845–1852 killed about a million people and forced mass emigration. After the 1916 Easter Rising and a war of independence, the Irish Free State was created in 1922 and became a republic in 1949.",
      fr: "Christianisée par saint Patrick au Ve siècle, l'Irlande passe sous un contrôle anglais puis britannique croissant. La Grande Famine de 1845-1852 fait environ un million de morts et provoque une émigration massive. Après l'insurrection de Pâques 1916 et une guerre d'indépendance, l'État libre d'Irlande est créé en 1922 et devient une république en 1949.",
    },
    keyFacts: {
      en: ["Population: about 5.3 million", "Languages: Irish and English", "The harp on its coins and passport is a national symbol"],
      fr: ["Population : environ 5,3 millions", "Langues : irlandais et anglais", "La harpe, sur ses pièces et passeports, est un symbole national"],
    },
  },
  {
    id: "IT",
    continent: "EUR",
    name: { en: "Italy", fr: "Italie" },
    capital: { en: "Rome", fr: "Rome" },
    aliases: ["Italie", "Italia"],
    capitalAliases: ["Roma"],
    history: {
      en: "Rome grew from a city-state into an empire that dominated the Mediterranean. Italy was the cradle of the Renaissance but remained divided into many states until unification in 1861. It became a republic in 1946 and was a founding member of the European project.",
      fr: "Rome passe de cité-État à un empire dominant la Méditerranée. L'Italie est le berceau de la Renaissance mais reste divisée en de nombreux États jusqu'à l'unification de 1861. Elle devient une république en 1946 et est membre fondateur de la construction européenne.",
    },
    keyFacts: {
      en: ["Population: about 59 million", "Language: Italian", "Has one of the highest numbers of UNESCO World Heritage Sites"],
      fr: ["Population : environ 59 millions", "Langue : italien", "Compte l'un des plus grands nombres de sites du patrimoine mondial"],
    },
  },
  {
    id: "XK",
    continent: "EUR",
    name: { en: "Kosovo", fr: "Kosovo" },
    capital: { en: "Pristina", fr: "Pristina" },
    capitalAliases: ["Prishtina", "Prishtine"],
    history: {
      en: "Kosovo was a heartland of medieval Serbia before centuries of Ottoman rule. After the 1998–1999 war and NATO intervention, it was administered by the United Nations. Kosovo declared independence on 17 February 2008; it is recognised by many countries but not by Serbia.",
      fr: "Le Kosovo est un cœur de la Serbie médiévale avant des siècles de domination ottomane. Après la guerre de 1998-1999 et l'intervention de l'OTAN, il est administré par les Nations unies. Le Kosovo proclame son indépendance le 17 février 2008 ; il est reconnu par de nombreux pays mais pas par la Serbie.",
    },
    keyFacts: {
      en: ["Population: about 1.6 million", "Languages: Albanian and Serbian", "Uses the euro even though it is not in the EU"],
      fr: ["Population : environ 1,6 million", "Langues : albanais et serbe", "Utilise l'euro sans être membre de l'UE"],
    },
  },
  {
    id: "LV",
    continent: "EUR",
    name: { en: "Latvia", fr: "Lettonie" },
    capital: { en: "Riga", fr: "Riga" },
    aliases: ["Lettonie"],
    history: {
      en: "Latvia was ruled by German knights, Poland-Lithuania, Sweden and Russia over the centuries. It declared independence on 18 November 1918, was occupied by the Soviet Union in 1940 and regained independence in 1991. It joined the EU and NATO in 2004.",
      fr: "La Lettonie est dominée au fil des siècles par les chevaliers teutoniques, la Pologne-Lituanie, la Suède et la Russie. Elle proclame son indépendance le 18 novembre 1918, est occupée par l'URSS en 1940 et retrouve son indépendance en 1991. Elle rejoint l'UE et l'OTAN en 2004.",
    },
    keyFacts: {
      en: ["Population: about 1.9 million", "Language: Latvian", "Riga has one of the largest collections of Art Nouveau buildings in the world"],
      fr: ["Population : environ 1,9 million", "Langue : letton", "Riga possède l'une des plus grandes concentrations d'architecture Art nouveau au monde"],
    },
  },
  {
    id: "LI",
    continent: "EUR",
    name: { en: "Liechtenstein", fr: "Liechtenstein" },
    capital: { en: "Vaduz", fr: "Vaduz" },
    history: {
      en: "The Principality of Liechtenstein was created in 1719 within the Holy Roman Empire. It became fully sovereign in 1806 and abolished its army in 1868. It has a customs union with Switzerland and uses the Swiss franc.",
      fr: "La principauté de Liechtenstein est créée en 1719 au sein du Saint-Empire. Elle devient pleinement souveraine en 1806 et supprime son armée en 1868. Elle forme une union douanière avec la Suisse et utilise le franc suisse.",
    },
    keyFacts: {
      en: ["Population: about 40,000", "Language: German", "One of only two doubly landlocked countries, with Uzbekistan"],
      fr: ["Population : environ 40 000", "Langue : allemand", "L'un des deux seuls pays doublement enclavés, avec l'Ouzbékistan"],
    },
  },
  {
    id: "LT",
    continent: "EUR",
    name: { en: "Lithuania", fr: "Lituanie" },
    capital: { en: "Vilnius", fr: "Vilnius" },
    aliases: ["Lituanie"],
    history: {
      en: "The Grand Duchy of Lithuania was one of Europe's largest states in the 14th–15th centuries and joined Poland in a Commonwealth in 1569. After Russian rule, Lithuania declared independence on 16 February 1918. On 11 March 1990 it became the first Soviet republic to declare independence; it joined the EU and NATO in 2004.",
      fr: "Le grand-duché de Lituanie est l'un des plus vastes États d'Europe aux XIVe-XVe siècles et s'unit à la Pologne dans une république en 1569. Après la domination russe, la Lituanie proclame son indépendance le 16 février 1918. Le 11 mars 1990, elle est la première république soviétique à proclamer son indépendance ; elle rejoint l'UE et l'OTAN en 2004.",
    },
    keyFacts: {
      en: ["Population: about 2.9 million", "Language: Lithuanian", "Lithuanian is one of the oldest living Indo-European languages"],
      fr: ["Population : environ 2,9 millions", "Langue : lituanien", "Le lituanien est l'une des plus anciennes langues indo-européennes vivantes"],
    },
  },
  {
    id: "LU",
    continent: "EUR",
    name: { en: "Luxembourg", fr: "Luxembourg" },
    capital: { en: "Luxembourg", fr: "Luxembourg" },
    capitalAliases: ["Luxembourg City"],
    history: {
      en: "Luxembourg traces its origins to a castle acquired by Count Siegfried in 963. It became a Grand Duchy in 1815, and its independence and neutrality were confirmed by the Treaty of London in 1867. It was a founding member of the European project and hosts several EU institutions.",
      fr: "Le Luxembourg trouve son origine dans un château acquis par le comte Sigefroi en 963. Il devient un grand-duché en 1815, et son indépendance et sa neutralité sont confirmées par le traité de Londres en 1867. Membre fondateur de la construction européenne, il accueille plusieurs institutions de l'UE.",
    },
    keyFacts: {
      en: ["Population: about 670,000", "Languages: Luxembourgish, French and German", "First country with free public transport nationwide (2020)"],
      fr: ["Population : environ 670 000", "Langues : luxembourgeois, français et allemand", "Premier pays à rendre les transports publics gratuits sur tout le territoire (2020)"],
    },
  },
  {
    id: "MT",
    continent: "EUR",
    name: { en: "Malta", fr: "Malte" },
    capital: { en: "Valletta", fr: "La Valette" },
    aliases: ["Malte"],
    capitalAliases: ["Valette", "Valetta"],
    history: {
      en: "Malta was ruled by Phoenicians, Romans, Arabs and, from 1530, the Knights of St John, who withstood the Great Siege of 1565. Britain controlled the islands from 1800 to independence on 21 September 1964. Malta joined the EU in 2004.",
      fr: "Malte est dominée par les Phéniciens, les Romains, les Arabes puis, à partir de 1530, les chevaliers de Saint-Jean, qui résistent au Grand Siège de 1565. Les Britanniques contrôlent l'archipel de 1800 à l'indépendance, le 21 septembre 1964. Malte rejoint l'UE en 2004.",
    },
    keyFacts: {
      en: ["Population: about 550,000", "Languages: Maltese and English", "Maltese is the only Semitic official language of the EU"],
      fr: ["Population : environ 550 000", "Langues : maltais et anglais", "Le maltais est la seule langue sémitique officielle de l'UE"],
    },
  },
  {
    id: "MD",
    continent: "EUR",
    name: { en: "Moldova", fr: "Moldavie" },
    capital: { en: "Chișinău", fr: "Chișinău" },
    aliases: ["Moldavie", "Republic of Moldova"],
    capitalAliases: ["Chisinau", "Kishinev"],
    history: {
      en: "The Principality of Moldavia was founded in the 14th century; its eastern part, Bessarabia, was annexed by Russia in 1812. After union with Romania and then Soviet rule, Moldova declared independence on 27 August 1991. The breakaway region of Transnistria is outside government control.",
      fr: "La principauté de Moldavie est fondée au XIVe siècle ; sa partie orientale, la Bessarabie, est annexée par la Russie en 1812. Après une union avec la Roumanie puis la période soviétique, la Moldavie proclame son indépendance le 27 août 1991. La région séparatiste de Transnistrie échappe au contrôle du gouvernement.",
    },
    keyFacts: {
      en: ["Population: about 2.4 million", "Language: Romanian", "Mileștii Mici is the world's largest wine cellar by number of bottles"],
      fr: ["Population : environ 2,4 millions", "Langue : roumain", "Mileștii Mici est la plus grande cave à vin du monde par le nombre de bouteilles"],
    },
  },
  {
    id: "MC",
    continent: "EUR",
    name: { en: "Monaco", fr: "Monaco" },
    capital: { en: "Monaco", fr: "Monaco" },
    capitalAliases: ["Monte Carlo"],
    history: {
      en: "The Grimaldi family seized the fortress of Monaco in 1297 and still rules today. France recognised Monaco's independence in the treaty of 1861. It joined the United Nations in 1993.",
      fr: "La famille Grimaldi s'empare de la forteresse de Monaco en 1297 et règne toujours. La France reconnaît l'indépendance de Monaco par le traité de 1861. La principauté rejoint l'ONU en 1993.",
    },
    keyFacts: {
      en: ["Population: about 39,000", "Language: French", "The world's second-smallest and most densely populated country"],
      fr: ["Population : environ 39 000", "Langue : français", "Le deuxième plus petit pays du monde et le plus densément peuplé"],
    },
  },
  {
    id: "ME",
    continent: "EUR",
    name: { en: "Montenegro", fr: "Monténégro" },
    capital: { en: "Podgorica", fr: "Podgorica" },
    aliases: ["Montenegro", "Crna Gora"],
    capitalAliases: ["Cetinje"],
    history: {
      en: "Montenegro kept its autonomy under the Ottomans and was recognised as independent in 1878. It joined Yugoslavia after World War I and later formed a union with Serbia. It regained independence on 3 June 2006 after a referendum.",
      fr: "Le Monténégro garde son autonomie face aux Ottomans et voit son indépendance reconnue en 1878. Il rejoint la Yougoslavie après la Première Guerre mondiale puis forme une union avec la Serbie. Il retrouve son indépendance le 3 juin 2006 après un référendum.",
    },
    keyFacts: {
      en: ["Population: about 620,000", "Language: Montenegrin", "Uses the euro; the Bay of Kotor is a UNESCO World Heritage Site"],
      fr: ["Population : environ 620 000", "Langue : monténégrin", "Utilise l'euro ; les bouches de Kotor sont classées au patrimoine mondial"],
    },
  },
  {
    id: "NL",
    continent: "EUR",
    name: { en: "Netherlands", fr: "Pays-Bas" },
    capital: { en: "Amsterdam", fr: "Amsterdam" },
    aliases: ["Holland", "Hollande", "The Netherlands", "Pays Bas", "Nederland"],
    history: {
      en: "The Dutch revolted against Spain in 1568, and their republic was recognised in 1648. The 17th-century Golden Age made it a global trading power. Amsterdam is the capital, while the government sits in The Hague.",
      fr: "Les Néerlandais se révoltent contre l'Espagne en 1568, et leur république est reconnue en 1648. Le Siècle d'or du XVIIe siècle en fait une puissance commerciale mondiale. Amsterdam est la capitale, tandis que le gouvernement siège à La Haye.",
    },
    keyFacts: {
      en: ["Population: about 18 million", "Language: Dutch", "About a quarter of the country lies below sea level"],
      fr: ["Population : environ 18 millions", "Langue : néerlandais", "Environ un quart du pays se trouve sous le niveau de la mer"],
    },
  },
  {
    id: "MK",
    continent: "EUR",
    name: { en: "North Macedonia", fr: "Macédoine du Nord" },
    capital: { en: "Skopje", fr: "Skopje" },
    aliases: ["Macedonia", "Macédoine", "Macedoine du Nord", "FYROM"],
    mapNames: ["Macedonia", "North Macedonia"],
    history: {
      en: "After centuries of Ottoman rule, the region became part of Yugoslavia. It declared independence on 8 September 1991 as the Republic of Macedonia. Following an agreement with Greece, it was renamed North Macedonia in 2019 and joined NATO in 2020.",
      fr: "Après des siècles de domination ottomane, la région intègre la Yougoslavie. Elle proclame son indépendance le 8 septembre 1991 sous le nom de République de Macédoine. À la suite d'un accord avec la Grèce, elle est rebaptisée Macédoine du Nord en 2019 et rejoint l'OTAN en 2020.",
    },
    keyFacts: {
      en: ["Population: about 1.8 million", "Languages: Macedonian and Albanian", "Lake Ohrid is one of Europe's oldest lakes"],
      fr: ["Population : environ 1,8 million", "Langues : macédonien et albanais", "Le lac d'Ohrid est l'un des plus anciens lacs d'Europe"],
    },
  },
  {
    id: "NO",
    continent: "EUR",
    name: { en: "Norway", fr: "Norvège" },
    capital: { en: "Oslo", fr: "Oslo" },
    aliases: ["Norvege", "Norge"],
    history: {
      en: "Norway was a Viking kingdom, then in union with Denmark until 1814 and with Sweden until 1905. It became fully independent on 7 June 1905. Oil discovered in the North Sea in 1969 made it one of the richest countries, with a huge sovereign wealth fund.",
      fr: "Royaume viking, la Norvège est ensuite unie au Danemark jusqu'en 1814 puis à la Suède jusqu'en 1905. Elle devient pleinement indépendante le 7 juin 1905. Le pétrole découvert en mer du Nord en 1969 en fait l'un des pays les plus riches, doté d'un énorme fonds souverain.",
    },
    keyFacts: {
      en: ["Population: about 5.6 million", "Language: Norwegian", "Famous for its fjords; not a member of the EU"],
      fr: ["Population : environ 5,6 millions", "Langue : norvégien", "Célèbre pour ses fjords ; n'est pas membre de l'UE"],
    },
  },
  {
    id: "PL",
    continent: "EUR",
    name: { en: "Poland", fr: "Pologne" },
    capital: { en: "Warsaw", fr: "Varsovie" },
    aliases: ["Pologne", "Polska"],
    capitalAliases: ["Warszawa"],
    history: {
      en: "Poland's history as a state begins with the baptism of Mieszko I in 966. The Polish-Lithuanian Commonwealth was a major power until it was partitioned by its neighbours in 1795. Poland regained independence on 11 November 1918, and the Solidarity movement helped end communist rule in 1989.",
      fr: "L'histoire de l'État polonais commence avec le baptême de Mieszko Ier en 966. La république des Deux Nations est une grande puissance jusqu'à son partage par ses voisins en 1795. La Pologne retrouve son indépendance le 11 novembre 1918, et le mouvement Solidarność contribue à la fin du communisme en 1989.",
    },
    keyFacts: {
      en: ["Population: about 37 million", "Language: Polish", "Birthplace of Marie Curie and Nicolaus Copernicus"],
      fr: ["Population : environ 37 millions", "Langue : polonais", "Patrie de Marie Curie et de Nicolas Copernic"],
    },
  },
  {
    id: "PT",
    continent: "EUR",
    name: { en: "Portugal", fr: "Portugal" },
    capital: { en: "Lisbon", fr: "Lisbonne" },
    capitalAliases: ["Lisboa"],
    history: {
      en: "Portugal became a kingdom in the 12th century and led the Age of Discovery; Vasco da Gama reached India by sea in 1498. The monarchy fell in 1910, and the Carnation Revolution of 25 April 1974 ended dictatorship. Portugal joined the European Community in 1986.",
      fr: "Le Portugal devient un royaume au XIIe siècle et mène l'ère des Grandes Découvertes ; Vasco de Gama atteint l'Inde par la mer en 1498. La monarchie tombe en 1910, et la révolution des Œillets du 25 avril 1974 met fin à la dictature. Le Portugal rejoint la Communauté européenne en 1986.",
    },
    keyFacts: {
      en: ["Population: about 10.6 million", "Language: Portuguese", "Its borders are among the oldest in Europe, largely unchanged since 1297"],
      fr: ["Population : environ 10,6 millions", "Langue : portugais", "Ses frontières sont parmi les plus anciennes d'Europe, presque inchangées depuis 1297"],
    },
  },
  {
    id: "RO",
    continent: "EUR",
    name: { en: "Romania", fr: "Roumanie" },
    capital: { en: "Bucharest", fr: "Bucarest" },
    aliases: ["Roumanie"],
    history: {
      en: "Ancient Dacia was conquered by Rome in 106 AD, giving Romanian its Latin roots. The principalities of Wallachia and Moldavia united in 1859, and independence was won in 1877–1878. The Ceaușescu dictatorship fell in 1989, and Romania joined the EU in 2007.",
      fr: "L'antique Dacie est conquise par Rome en 106 apr. J.-C., d'où les racines latines du roumain. Les principautés de Valachie et de Moldavie s'unissent en 1859, et l'indépendance est acquise en 1877-1878. La dictature de Ceaușescu tombe en 1989, et la Roumanie rejoint l'UE en 2007.",
    },
    keyFacts: {
      en: ["Population: about 19 million", "Language: Romanian", "Home to most of the Danube Delta and to Bran Castle, linked to the Dracula legend"],
      fr: ["Population : environ 19 millions", "Langue : roumain", "Abrite l'essentiel du delta du Danube et le château de Bran, lié à la légende de Dracula"],
    },
  },
  {
    id: "RU",
    continent: "EUR",
    name: { en: "Russia", fr: "Russie" },
    capital: { en: "Moscow", fr: "Moscou" },
    aliases: ["Russie", "Russian Federation", "Fédération de Russie"],
    capitalAliases: ["Moskva"],
    history: {
      en: "Russia traces its roots to Kievan Rus' and later the Grand Duchy of Moscow, whose ruler took the title of tsar in 1547. The Russian Empire was overthrown in the 1917 revolutions, leading to the Soviet Union (1922–1991). Since 1991 it has been the Russian Federation.",
      fr: "La Russie trouve ses racines dans la Rus' de Kiev puis la grande-principauté de Moscou, dont le souverain prend le titre de tsar en 1547. L'Empire russe est renversé par les révolutions de 1917, qui mènent à l'URSS (1922-1991). Depuis 1991, c'est la Fédération de Russie.",
    },
    keyFacts: {
      en: ["Population: about 144 million", "Language: Russian", "The largest country in the world, spanning 11 time zones"],
      fr: ["Population : environ 144 millions", "Langue : russe", "Le plus grand pays du monde, s'étendant sur 11 fuseaux horaires"],
    },
  },
  {
    id: "SM",
    continent: "EUR",
    name: { en: "San Marino", fr: "Saint-Marin" },
    capital: { en: "San Marino", fr: "Saint-Marin" },
    aliases: ["Saint-Marin", "Saint Marin"],
    capitalAliases: ["City of San Marino", "Saint Marin"],
    history: {
      en: "According to tradition, San Marino was founded in 301 AD by Saint Marinus, a stonemason who fled persecution. It is considered the world's oldest surviving republic. The small state is entirely surrounded by Italy.",
      fr: "Selon la tradition, Saint-Marin est fondée en 301 apr. J.-C. par saint Marin, un tailleur de pierre fuyant les persécutions. Elle est considérée comme la plus ancienne république encore existante. Ce petit État est entièrement enclavé dans l'Italie.",
    },
    keyFacts: {
      en: ["Population: about 34,000", "Language: Italian", "Built on Mount Titano, with three medieval towers on its flag"],
      fr: ["Population : environ 34 000", "Langue : italien", "Bâtie sur le mont Titano, avec trois tours médiévales sur son drapeau"],
    },
  },
  {
    id: "RS",
    continent: "EUR",
    name: { en: "Serbia", fr: "Serbie" },
    capital: { en: "Belgrade", fr: "Belgrade" },
    aliases: ["Serbie", "Srbija"],
    capitalAliases: ["Beograd"],
    history: {
      en: "The medieval Serbian state reached its peak under Stefan Dušan in the 14th century before falling to the Ottomans. Serbia's independence was recognised in 1878, and it became the core of Yugoslavia in 1918. After the breakup of Yugoslavia, it became a separate state again in 2006.",
      fr: "L'État serbe médiéval atteint son apogée sous Stefan Dušan au XIVe siècle avant de tomber aux mains des Ottomans. L'indépendance de la Serbie est reconnue en 1878, et elle devient le cœur de la Yougoslavie en 1918. Après l'éclatement de la Yougoslavie, elle redevient un État distinct en 2006.",
    },
    keyFacts: {
      en: ["Population: about 6.6 million", "Language: Serbian", "Belgrade stands where the Sava River meets the Danube"],
      fr: ["Population : environ 6,6 millions", "Langue : serbe", "Belgrade se dresse au confluent de la Save et du Danube"],
    },
  },
  {
    id: "SK",
    continent: "EUR",
    name: { en: "Slovakia", fr: "Slovaquie" },
    capital: { en: "Bratislava", fr: "Bratislava" },
    aliases: ["Slovaquie", "Slovak Republic"],
    history: {
      en: "Slovakia was part of Great Moravia in the 9th century and then of the Kingdom of Hungary for about a thousand years. It joined the Czechs in Czechoslovakia in 1918. Slovakia became independent on 1 January 1993, joined the EU in 2004 and adopted the euro in 2009.",
      fr: "La Slovaquie fait partie de la Grande-Moravie au IXe siècle puis du royaume de Hongrie pendant environ mille ans. Elle rejoint les Tchèques au sein de la Tchécoslovaquie en 1918. Indépendante le 1er janvier 1993, elle rejoint l'UE en 2004 et adopte l'euro en 2009.",
    },
    keyFacts: {
      en: ["Population: about 5.4 million", "Language: Slovak", "Bratislava borders both Austria and Hungary"],
      fr: ["Population : environ 5,4 millions", "Langue : slovaque", "Bratislava est frontalière de l'Autriche et de la Hongrie"],
    },
  },
  {
    id: "SI",
    continent: "EUR",
    name: { en: "Slovenia", fr: "Slovénie" },
    capital: { en: "Ljubljana", fr: "Ljubljana" },
    aliases: ["Slovenie"],
    history: {
      en: "Slovene lands were ruled by the Habsburgs for centuries before becoming part of Yugoslavia. Slovenia declared independence on 25 June 1991 after a brief Ten-Day War. It joined the EU in 2004 and adopted the euro in 2007.",
      fr: "Les terres slovènes sont dominées par les Habsbourg pendant des siècles avant d'intégrer la Yougoslavie. La Slovénie proclame son indépendance le 25 juin 1991 après une brève guerre de dix jours. Elle rejoint l'UE en 2004 et adopte l'euro en 2007.",
    },
    keyFacts: {
      en: ["Population: about 2.1 million", "Language: Slovene", "About 58% of the country is covered by forest"],
      fr: ["Population : environ 2,1 millions", "Langue : slovène", "Environ 58 % du pays est couvert de forêts"],
    },
  },
  {
    id: "ES",
    continent: "EUR",
    name: { en: "Spain", fr: "Espagne" },
    capital: { en: "Madrid", fr: "Madrid" },
    aliases: ["Espagne", "Espana"],
    history: {
      en: "After Roman rule, much of Iberia became Muslim al-Andalus from 711. The Catholic Monarchs completed the conquest of Granada in 1492, the same year Columbus reached the Americas. After the Civil War (1936–1939) and Franco's dictatorship, Spain became a democracy in 1978 and joined the European Community in 1986.",
      fr: "Après la domination romaine, une grande partie de la péninsule devient al-Andalus musulman à partir de 711. Les Rois catholiques achèvent la conquête de Grenade en 1492, l'année où Colomb atteint les Amériques. Après la guerre civile (1936-1939) et la dictature de Franco, l'Espagne devient une démocratie en 1978 et rejoint la Communauté européenne en 1986.",
    },
    keyFacts: {
      en: ["Population: about 48 million", "Language: Spanish; Catalan, Basque and Galician co-official regionally", "Spanish is the world's second most spoken native language"],
      fr: ["Population : environ 48 millions", "Langue : espagnol ; catalan, basque et galicien co-officiels selon les régions", "L'espagnol est la deuxième langue maternelle la plus parlée au monde"],
    },
  },
  {
    id: "SE",
    continent: "EUR",
    name: { en: "Sweden", fr: "Suède" },
    capital: { en: "Stockholm", fr: "Stockholm" },
    aliases: ["Suede", "Sverige"],
    history: {
      en: "Sweden emerged from Viking-age kingdoms and left the Kalmar Union under Gustav Vasa in 1523. It was a great power in the 17th century. Sweden stayed neutral for about two centuries, joined the EU in 1995 and NATO in 2024.",
      fr: "La Suède naît des royaumes de l'ère viking et quitte l'union de Kalmar sous Gustave Vasa en 1523. Elle est une grande puissance au XVIIe siècle. Neutre pendant environ deux siècles, elle rejoint l'UE en 1995 et l'OTAN en 2024.",
    },
    keyFacts: {
      en: ["Population: about 10.6 million", "Language: Swedish", "Home of the Nobel Prizes, founded by Alfred Nobel"],
      fr: ["Population : environ 10,6 millions", "Langue : suédois", "Patrie des prix Nobel, fondés par Alfred Nobel"],
    },
  },
  {
    id: "CH",
    continent: "EUR",
    name: { en: "Switzerland", fr: "Suisse" },
    capital: { en: "Bern", fr: "Berne" },
    aliases: ["Suisse", "Schweiz", "Svizzera"],
    capitalAliases: ["Berne"],
    history: {
      en: "The Swiss Confederation traces its origin to an alliance of three cantons in 1291. Its permanent neutrality was recognised in 1815, and the modern federal state was created in 1848. Switzerland only joined the United Nations in 2002 and is not in the EU.",
      fr: "La Confédération suisse fait remonter son origine à l'alliance de trois cantons en 1291. Sa neutralité permanente est reconnue en 1815, et l'État fédéral moderne est créé en 1848. La Suisse n'a rejoint l'ONU qu'en 2002 et n'est pas membre de l'UE.",
    },
    keyFacts: {
      en: ["Population: about 9 million", "Languages: German, French, Italian and Romansh", "Citizens vote on national issues several times a year (direct democracy)"],
      fr: ["Population : environ 9 millions", "Langues : allemand, français, italien et romanche", "Les citoyens votent plusieurs fois par an sur des sujets nationaux (démocratie directe)"],
    },
  },
  {
    id: "UA",
    continent: "EUR",
    name: { en: "Ukraine", fr: "Ukraine" },
    capital: { en: "Kyiv", fr: "Kyiv" },
    capitalAliases: ["Kiev"],
    history: {
      en: "Ukraine's history goes back to Kievan Rus', centred on Kyiv, and to the Cossack Hetmanate. After Russian and Soviet rule, including the famine of 1932–1933 (Holodomor), Ukraine declared independence on 24 August 1991. Russia annexed Crimea in 2014 and launched a full-scale invasion in February 2022.",
      fr: "L'histoire de l'Ukraine remonte à la Rus' de Kiev et à l'Hetmanat cosaque. Après les dominations russe et soviétique, dont la famine de 1932-1933 (Holodomor), l'Ukraine proclame son indépendance le 24 août 1991. La Russie annexe la Crimée en 2014 et lance une invasion à grande échelle en février 2022.",
    },
    keyFacts: {
      en: ["Population: roughly 35–38 million (wartime estimates vary)", "Language: Ukrainian", "The largest country located entirely in Europe"],
      fr: ["Population : environ 35 à 38 millions (estimations variables en temps de guerre)", "Langue : ukrainien", "Le plus grand pays situé entièrement en Europe"],
    },
  },
  {
    id: "GB",
    continent: "EUR",
    name: { en: "United Kingdom", fr: "Royaume-Uni" },
    capital: { en: "London", fr: "Londres" },
    aliases: ["UK", "U.K.", "Great Britain", "Britain", "Royaume Uni", "Grande-Bretagne", "Angleterre", "England"],
    history: {
      en: "England and Scotland united in 1707, and Ireland joined in 1801. The Industrial Revolution began here, and the British Empire became the largest in history. Most of Ireland left in 1922; the UK joined the European Community in 1973 and left the EU on 31 January 2020.",
      fr: "L'Angleterre et l'Écosse s'unissent en 1707, et l'Irlande les rejoint en 1801. La révolution industrielle y commence, et l'Empire britannique devient le plus vaste de l'histoire. La majeure partie de l'Irlande s'en sépare en 1922 ; le Royaume-Uni rejoint la Communauté européenne en 1973 et quitte l'UE le 31 janvier 2020.",
    },
    keyFacts: {
      en: ["Population: about 69 million", "Language: English", "Made up of four nations: England, Scotland, Wales and Northern Ireland"],
      fr: ["Population : environ 69 millions", "Langue : anglais", "Composé de quatre nations : Angleterre, Écosse, pays de Galles et Irlande du Nord"],
    },
  },
  {
    id: "VA",
    continent: "EUR",
    name: { en: "Vatican City", fr: "Vatican" },
    capital: { en: "Vatican City", fr: "Vatican" },
    aliases: ["Vatican", "Holy See", "Saint-Siège", "Cite du Vatican", "Città del Vaticano"],
    capitalAliases: ["Vatican", "Cite du Vatican"],
    mapNames: ["Vatican"],
    history: {
      en: "The popes ruled the Papal States in central Italy for over a thousand years until Italian unification. The Lateran Treaty of 11 February 1929 created Vatican City as an independent state. It is the headquarters of the Catholic Church.",
      fr: "Les papes gouvernent les États pontificaux dans le centre de l'Italie pendant plus de mille ans, jusqu'à l'unification italienne. Les accords du Latran du 11 février 1929 créent l'État indépendant de la Cité du Vatican. C'est le siège de l'Église catholique.",
    },
    keyFacts: {
      en: ["Population: about 800", "Languages: Italian and Latin", "The world's smallest country (0.44 km²), guarded by the Swiss Guard since 1506"],
      fr: ["Population : environ 800", "Langues : italien et latin", "Le plus petit pays du monde (0,44 km²), gardé par la Garde suisse depuis 1506"],
    },
  },
];
