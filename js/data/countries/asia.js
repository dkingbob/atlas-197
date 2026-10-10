/**
 * Asia — 48 countries.
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
    id: "AF",
    continent: "ASI",
    name: { en: "Afghanistan", fr: "Afghanistan" },
    capital: { en: "Kabul", fr: "Kaboul" },
    capitalAliases: ["Kaboul"],
    history: {
      en: "Afghanistan has long been a crossroads of empires; Ahmad Shah Durrani founded the modern Afghan state in 1747. After three wars with Britain, it gained full control of its foreign affairs on 19 August 1919. Decades of conflict followed the Soviet invasion of 1979, and the Taliban returned to power in August 2021.",
      fr: "L'Afghanistan est depuis longtemps un carrefour d'empires ; Ahmad Shah Durrani fonde l'État afghan moderne en 1747. Après trois guerres contre les Britanniques, il obtient le plein contrôle de sa politique étrangère le 19 août 1919. Des décennies de conflits suivent l'invasion soviétique de 1979, et les talibans reviennent au pouvoir en août 2021.",
    },
    keyFacts: {
      en: ["Population: about 42 million", "Languages: Pashto and Dari", "Landlocked and dominated by the Hindu Kush mountains"],
      fr: ["Population : environ 42 millions", "Langues : pachto et dari", "Enclavé et dominé par les montagnes de l'Hindou Kouch"],
    },
  },
  {
    id: "AM",
    continent: "ASI",
    name: { en: "Armenia", fr: "Arménie" },
    capital: { en: "Yerevan", fr: "Erevan" },
    aliases: ["Armenie", "Hayastan"],
    capitalAliases: ["Erevan", "Yerevan"],
    history: {
      en: "Armenia became the first country to adopt Christianity as its state religion, around 301 AD. During World War I, the Armenian genocide killed as many as 1.5 million people in the Ottoman Empire. After Soviet rule, Armenia became independent on 21 September 1991.",
      fr: "L'Arménie est le premier pays à adopter le christianisme comme religion d'État, vers 301 apr. J.-C. Pendant la Première Guerre mondiale, le génocide arménien fait jusqu'à 1,5 million de victimes dans l'Empire ottoman. Après la période soviétique, l'Arménie devient indépendante le 21 septembre 1991.",
    },
    keyFacts: {
      en: ["Population: about 3 million", "Language: Armenian (with its own alphabet)", "Yerevan, founded in 782 BC, is one of the oldest continuously inhabited cities"],
      fr: ["Population : environ 3 millions", "Langue : arménien (avec son propre alphabet)", "Erevan, fondée en 782 av. J.-C., est l'une des plus anciennes villes habitées en continu"],
    },
  },
  {
    id: "AZ",
    continent: "ASI",
    name: { en: "Azerbaijan", fr: "Azerbaïdjan" },
    capital: { en: "Baku", fr: "Bakou" },
    aliases: ["Azerbaidjan"],
    capitalAliases: ["Bakou"],
    history: {
      en: "Ruled by Persian and then Russian empires, Azerbaijan proclaimed in 1918 the first parliamentary republic in the Muslim world. After Soviet rule, it became independent on 18 October 1991. The long conflict with Armenia over Nagorno-Karabakh ended with Azerbaijan retaking the region in 2023.",
      fr: "Dominé par les empires perse puis russe, l'Azerbaïdjan proclame en 1918 la première république parlementaire du monde musulman. Après la période soviétique, il devient indépendant le 18 octobre 1991. Le long conflit avec l'Arménie au sujet du Haut-Karabakh s'achève par la reprise de la région par l'Azerbaïdjan en 2023.",
    },
    keyFacts: {
      en: ["Population: about 10.2 million", "Language: Azerbaijani", "Baku lies about 28 m below sea level, the lowest capital in the world"],
      fr: ["Population : environ 10,2 millions", "Langue : azéri", "Bakou se trouve à environ 28 m sous le niveau de la mer, la capitale la plus basse du monde"],
    },
  },
  {
    id: "BH",
    continent: "ASI",
    name: { en: "Bahrain", fr: "Bahreïn" },
    capital: { en: "Manama", fr: "Manama" },
    aliases: ["Bahrein"],
    history: {
      en: "Bahrain was the heart of the ancient Dilmun civilisation. The Al Khalifa family has ruled since 1783, and the islands became a British protectorate in the 19th century. Bahrain gained independence in August 1971 and became a kingdom in 2002.",
      fr: "Bahreïn est le cœur de l'ancienne civilisation de Dilmun. La famille Al Khalifa règne depuis 1783, et l'archipel devient un protectorat britannique au XIXe siècle. Bahreïn devient indépendant en août 1971 et un royaume en 2002.",
    },
    keyFacts: {
      en: ["Population: about 1.6 million", "Language: Arabic", "Linked to Saudi Arabia by the 25 km King Fahd Causeway"],
      fr: ["Population : environ 1,6 million", "Langue : arabe", "Relié à l'Arabie saoudite par la chaussée du roi Fahd, longue de 25 km"],
    },
  },
  {
    id: "BD",
    continent: "ASI",
    name: { en: "Bangladesh", fr: "Bangladesh" },
    capital: { en: "Dhaka", fr: "Dacca" },
    capitalAliases: ["Dacca"],
    history: {
      en: "Bengal became part of British India, and in 1947 its eastern half became East Pakistan. After the Liberation War of 1971, Bangladesh became independent under Sheikh Mujibur Rahman. The 1952 Bengali Language Movement is honoured worldwide on International Mother Language Day, 21 February.",
      fr: "Le Bengale intègre l'Inde britannique et, en 1947, sa moitié orientale devient le Pakistan oriental. Après la guerre de libération de 1971, le Bangladesh devient indépendant sous Sheikh Mujibur Rahman. Le mouvement pour la langue bengalie de 1952 est célébré dans le monde entier lors de la Journée internationale de la langue maternelle, le 21 février.",
    },
    keyFacts: {
      en: ["Population: about 173 million", "Language: Bengali", "Home to most of the Sundarbans, the largest mangrove forest in the world"],
      fr: ["Population : environ 173 millions", "Langue : bengali", "Abrite l'essentiel des Sundarbans, la plus grande mangrove du monde"],
    },
  },
  {
    id: "BT",
    continent: "ASI",
    name: { en: "Bhutan", fr: "Bhoutan" },
    capital: { en: "Thimphu", fr: "Thimphou" },
    aliases: ["Bhoutan"],
    capitalAliases: ["Thimphou"],
    history: {
      en: "Bhutan was unified in the 17th century by Zhabdrung Ngawang Namgyal and was never colonised. The Wangchuck dynasty has reigned since 1907, and the country became a constitutional monarchy in 2008. It measures progress through \"Gross National Happiness\".",
      fr: "Le Bhoutan est unifié au XVIIe siècle par le Zhabdrung Ngawang Namgyal et n'a jamais été colonisé. La dynastie Wangchuck règne depuis 1907, et le pays devient une monarchie constitutionnelle en 2008. Il mesure son progrès par le « bonheur national brut ».",
    },
    keyFacts: {
      en: ["Population: about 790,000", "Language: Dzongkha", "One of the few carbon-negative countries in the world"],
      fr: ["Population : environ 790 000", "Langue : dzongkha", "L'un des rares pays au bilan carbone négatif"],
    },
  },
  {
    id: "BN",
    continent: "ASI",
    name: { en: "Brunei", fr: "Brunei" },
    capital: { en: "Bandar Seri Begawan", fr: "Bandar Seri Begawan" },
    aliases: ["Brunei Darussalam"],
    history: {
      en: "The Bruneian Empire controlled much of Borneo in the 15th–16th centuries. Brunei became a British protectorate in 1888 and gained full independence on 1 January 1984. Sultan Hassanal Bolkiah has reigned since 1967.",
      fr: "L'empire de Brunei contrôle une grande partie de Bornéo aux XVe-XVIe siècles. Brunei devient un protectorat britannique en 1888 et obtient sa pleine indépendance le 1er janvier 1984. Le sultan Hassanal Bolkiah règne depuis 1967.",
    },
    keyFacts: {
      en: ["Population: about 460,000", "Language: Malay", "Its wealth comes mainly from oil and natural gas"],
      fr: ["Population : environ 460 000", "Langue : malais", "Sa richesse provient surtout du pétrole et du gaz"],
    },
  },
  {
    id: "KH",
    continent: "ASI",
    name: { en: "Cambodia", fr: "Cambodge" },
    capital: { en: "Phnom Penh", fr: "Phnom Penh" },
    aliases: ["Cambodge", "Kampuchea"],
    history: {
      en: "The Khmer Empire dominated Southeast Asia from the 9th to the 15th century and built Angkor Wat in the 12th century. Cambodia became a French protectorate in 1863 and gained independence on 9 November 1953. The Khmer Rouge regime (1975–1979) caused the deaths of around 1.5 to 2 million people.",
      fr: "L'Empire khmer domine l'Asie du Sud-Est du IXe au XVe siècle et construit Angkor Vat au XIIe siècle. Le Cambodge devient un protectorat français en 1863 et obtient son indépendance le 9 novembre 1953. Le régime des Khmers rouges (1975-1979) cause la mort d'environ 1,5 à 2 millions de personnes.",
    },
    keyFacts: {
      en: ["Population: about 17.6 million", "Language: Khmer", "Angkor Wat appears on the national flag"],
      fr: ["Population : environ 17,6 millions", "Langue : khmer", "Angkor Vat figure sur le drapeau national"],
    },
  },
  {
    id: "CN",
    continent: "ASI",
    name: { en: "China", fr: "Chine" },
    capital: { en: "Beijing", fr: "Pékin" },
    aliases: ["Chine", "People's Republic of China", "PRC"],
    capitalAliases: ["Peking", "Pekin", "Beijing"],
    history: {
      en: "Chinese civilisation stretches back more than 3,000 years, and the Qin dynasty unified China in 221 BC. The last imperial dynasty, the Qing, fell in 1912. The People's Republic of China was proclaimed on 1 October 1949.",
      fr: "La civilisation chinoise remonte à plus de 3 000 ans, et la dynastie Qin unifie la Chine en 221 av. J.-C. La dernière dynastie impériale, les Qing, tombe en 1912. La République populaire de Chine est proclamée le 1er octobre 1949.",
    },
    keyFacts: {
      en: ["Population: about 1.41 billion", "Language: Mandarin Chinese", "Uses a single time zone despite spanning about 5,000 km east to west"],
      fr: ["Population : environ 1,41 milliard", "Langue : chinois mandarin", "N'utilise qu'un seul fuseau horaire malgré environ 5 000 km d'est en ouest"],
    },
  },
  {
    id: "GE",
    continent: "ASI",
    name: { en: "Georgia", fr: "Géorgie" },
    capital: { en: "Tbilisi", fr: "Tbilissi" },
    aliases: ["Georgie", "Sakartvelo"],
    capitalAliases: ["Tbilissi"],
    history: {
      en: "Georgia adopted Christianity in the 4th century and reached a golden age under Queen Tamar around 1200. It was annexed by the Russian Empire in the 19th century and later became a Soviet republic. It declared independence on 9 April 1991.",
      fr: "La Géorgie adopte le christianisme au IVe siècle et connaît un âge d'or sous la reine Tamar vers 1200. Elle est annexée par l'Empire russe au XIXe siècle puis devient une république soviétique. Elle proclame son indépendance le 9 avril 1991.",
    },
    keyFacts: {
      en: ["Population: about 3.7 million", "Language: Georgian (with its own alphabet)", "One of the oldest wine-making traditions, about 8,000 years old"],
      fr: ["Population : environ 3,7 millions", "Langue : géorgien (avec son propre alphabet)", "L'une des plus anciennes traditions viticoles, vieille d'environ 8 000 ans"],
    },
  },
  {
    id: "IN",
    continent: "ASI",
    name: { en: "India", fr: "Inde" },
    capital: { en: "New Delhi", fr: "New Delhi" },
    aliases: ["Inde", "Bharat"],
    capitalAliases: ["Delhi", "New-Delhi"],
    history: {
      en: "The Indus Valley Civilisation flourished around 2600 BC, followed by great empires such as the Maurya, Gupta and Mughal. After nearly two centuries of British rule, India became independent on 15 August 1947, led by figures such as Mahatma Gandhi and Jawaharlal Nehru. It became a republic on 26 January 1950.",
      fr: "La civilisation de la vallée de l'Indus s'épanouit vers 2600 av. J.-C., suivie de grands empires comme les Maurya, les Gupta et les Moghols. Après près de deux siècles de domination britannique, l'Inde devient indépendante le 15 août 1947, sous l'impulsion de figures comme le Mahatma Gandhi et Jawaharlal Nehru. Elle devient une république le 26 janvier 1950.",
    },
    keyFacts: {
      en: ["Population: about 1.44 billion", "Languages: Hindi and English, plus 22 scheduled languages", "The world's most populous country since 2023"],
      fr: ["Population : environ 1,44 milliard", "Langues : hindi et anglais, plus 22 langues reconnues", "Le pays le plus peuplé du monde depuis 2023"],
    },
  },
  {
    id: "ID",
    continent: "ASI",
    name: { en: "Indonesia", fr: "Indonésie" },
    capital: { en: "Jakarta", fr: "Jakarta" },
    aliases: ["Indonesie"],
    capitalAliases: ["Nusantara"],
    history: {
      en: "The islands were home to powerful kingdoms such as Srivijaya and Majapahit before the Dutch East India Company took control. Indonesia proclaimed independence on 17 August 1945 under Sukarno, recognised by the Netherlands in 1949. A new capital, Nusantara, is being built on Borneo.",
      fr: "L'archipel voit fleurir de puissants royaumes comme Srivijaya et Majapahit avant le contrôle de la Compagnie néerlandaise des Indes orientales. L'Indonésie proclame son indépendance le 17 août 1945 sous Soekarno, reconnue par les Pays-Bas en 1949. Une nouvelle capitale, Nusantara, est en construction à Bornéo.",
    },
    keyFacts: {
      en: ["Population: about 280 million", "Language: Indonesian", "About 17,000 islands; the largest Muslim-majority country"],
      fr: ["Population : environ 280 millions", "Langue : indonésien", "Environ 17 000 îles ; le plus grand pays à majorité musulmane"],
    },
  },
  {
    id: "IR",
    continent: "ASI",
    name: { en: "Iran", fr: "Iran" },
    capital: { en: "Tehran", fr: "Téhéran" },
    aliases: ["Persia", "Perse", "Islamic Republic of Iran"],
    capitalAliases: ["Teheran"],
    history: {
      en: "Cyrus the Great founded the Achaemenid Persian Empire around 550 BC, one of the largest of the ancient world. The Safavid dynasty made Shia Islam the state religion in 1501, and Persia was renamed Iran internationally in 1935. The 1979 Islamic Revolution created the Islamic Republic.",
      fr: "Cyrus le Grand fonde l'Empire perse achéménide vers 550 av. J.-C., l'un des plus vastes de l'Antiquité. La dynastie safavide fait de l'islam chiite la religion d'État en 1501, et la Perse prend le nom d'Iran à l'international en 1935. La révolution islamique de 1979 instaure la République islamique.",
    },
    keyFacts: {
      en: ["Population: about 90 million", "Language: Persian (Farsi)", "Persian carpets and saffron are world-famous exports"],
      fr: ["Population : environ 90 millions", "Langue : persan (farsi)", "Les tapis persans et le safran sont des exportations célèbres"],
    },
  },
  {
    id: "IQ",
    continent: "ASI",
    name: { en: "Iraq", fr: "Irak" },
    capital: { en: "Baghdad", fr: "Bagdad" },
    aliases: ["Irak"],
    capitalAliases: ["Bagdad"],
    history: {
      en: "Ancient Mesopotamia, between the Tigris and Euphrates, saw the rise of Sumer, the invention of writing and Babylon. Baghdad was the capital of the Abbasid Caliphate. After Ottoman and British rule, Iraq became independent on 3 October 1932; Saddam Hussein ruled from 1979 until the 2003 invasion.",
      fr: "L'antique Mésopotamie, entre le Tigre et l'Euphrate, voit naître Sumer, l'écriture et Babylone. Bagdad est la capitale du califat abbasside. Après les dominations ottomane et britannique, l'Irak devient indépendant le 3 octobre 1932 ; Saddam Hussein gouverne de 1979 jusqu'à l'invasion de 2003.",
    },
    keyFacts: {
      en: ["Population: about 45 million", "Languages: Arabic and Kurdish", "Cuneiform, one of the first writing systems, was invented here around 3200 BC"],
      fr: ["Population : environ 45 millions", "Langues : arabe et kurde", "Le cunéiforme, l'une des premières écritures, y est inventé vers 3200 av. J.-C."],
    },
  },
  {
    id: "IL",
    continent: "ASI",
    name: { en: "Israel", fr: "Israël" },
    capital: { en: "Jerusalem", fr: "Jérusalem" },
    aliases: ["Israel"],
    capitalAliases: ["Jerusalem"],
    history: {
      en: "The land was home to the ancient kingdoms of Israel and Judah and later ruled by Romans, Arab caliphates, Ottomans and Britain. The State of Israel was proclaimed on 14 May 1948, followed by wars with its neighbours. Israel proclaims Jerusalem as its capital, but this status is disputed internationally and most embassies are in Tel Aviv.",
      fr: "La terre abrite les anciens royaumes d'Israël et de Juda, puis est dominée par les Romains, les califats arabes, les Ottomans et les Britanniques. L'État d'Israël est proclamé le 14 mai 1948, suivi de guerres avec ses voisins. Israël proclame Jérusalem comme capitale, statut contesté au niveau international ; la plupart des ambassades sont à Tel-Aviv.",
    },
    keyFacts: {
      en: ["Population: about 9.9 million", "Language: Hebrew; Arabic has a special status", "The shore of the Dead Sea is the lowest land point on Earth (about 430 m below sea level)"],
      fr: ["Population : environ 9,9 millions", "Langue : hébreu ; l'arabe a un statut spécial", "Les rives de la mer Morte sont le point terrestre le plus bas (environ 430 m sous le niveau de la mer)"],
    },
  },
  {
    id: "JP",
    continent: "ASI",
    name: { en: "Japan", fr: "Japon" },
    capital: { en: "Tokyo", fr: "Tokyo" },
    aliases: ["Japon", "Nippon", "Nihon"],
    history: {
      en: "Japan was ruled by emperors and, for centuries, by military shoguns. The Meiji Restoration of 1868 rapidly modernised the country. After defeat in World War II and the atomic bombings of 1945, Japan adopted a pacifist constitution in 1947 and became a major economic power.",
      fr: "Le Japon est gouverné par des empereurs et, pendant des siècles, par des shoguns militaires. La restauration Meiji de 1868 modernise rapidement le pays. Après la défaite de la Seconde Guerre mondiale et les bombardements atomiques de 1945, le Japon adopte une constitution pacifiste en 1947 et devient une grande puissance économique.",
    },
    keyFacts: {
      en: ["Population: about 124 million", "Language: Japanese", "Made up of more than 14,000 islands"],
      fr: ["Population : environ 124 millions", "Langue : japonais", "Composé de plus de 14 000 îles"],
    },
  },
  {
    id: "JO",
    continent: "ASI",
    name: { en: "Jordan", fr: "Jordanie" },
    capital: { en: "Amman", fr: "Amman" },
    aliases: ["Jordanie"],
    history: {
      en: "The Nabataeans carved the city of Petra into rock more than 2,000 years ago. After Ottoman rule, the area became the British mandate of Transjordan. Jordan became independent on 25 May 1946 and is ruled by the Hashemite dynasty.",
      fr: "Les Nabatéens taillent la cité de Pétra dans la roche il y a plus de 2 000 ans. Après la domination ottomane, la région devient le mandat britannique de Transjordanie. La Jordanie devient indépendante le 25 mai 1946 et est gouvernée par la dynastie hachémite.",
    },
    keyFacts: {
      en: ["Population: about 11.5 million", "Language: Arabic", "Petra is one of the New Seven Wonders of the World"],
      fr: ["Population : environ 11,5 millions", "Langue : arabe", "Pétra est l'une des sept nouvelles merveilles du monde"],
    },
  },
  {
    id: "KZ",
    continent: "ASI",
    name: { en: "Kazakhstan", fr: "Kazakhstan" },
    capital: { en: "Astana", fr: "Astana" },
    capitalAliases: ["Nur-Sultan"],
    history: {
      en: "The Kazakh Khanate was founded in the 15th century on the Central Asian steppe. It was absorbed by the Russian Empire and later became a Soviet republic. Kazakhstan was the last Soviet republic to declare independence, on 16 December 1991, and moved its capital to Astana in 1997.",
      fr: "Le khanat kazakh est fondé au XVe siècle dans les steppes d'Asie centrale. Il est absorbé par l'Empire russe puis devient une république soviétique. Le Kazakhstan est la dernière république soviétique à proclamer son indépendance, le 16 décembre 1991, et transfère sa capitale à Astana en 1997.",
    },
    keyFacts: {
      en: ["Population: about 20 million", "Languages: Kazakh and Russian", "The world's largest landlocked country; home to the Baikonur Cosmodrome"],
      fr: ["Population : environ 20 millions", "Langues : kazakh et russe", "Le plus grand pays enclavé du monde ; abrite le cosmodrome de Baïkonour"],
    },
  },
  {
    id: "KW",
    continent: "ASI",
    name: { en: "Kuwait", fr: "Koweït" },
    capital: { en: "Kuwait City", fr: "Koweït" },
    aliases: ["Koweit"],
    capitalAliases: ["Kuwait", "Koweit"],
    history: {
      en: "Kuwait was founded in the 18th century and has been ruled by the Al Sabah family since 1752. It became a British protectorate in 1899 and gained independence on 19 June 1961. Iraq invaded Kuwait in August 1990, and a US-led coalition liberated it in February 1991.",
      fr: "Le Koweït est fondé au XVIIIe siècle et gouverné par la famille Al Sabah depuis 1752. Il devient un protectorat britannique en 1899 et obtient son indépendance le 19 juin 1961. L'Irak envahit le Koweït en août 1990, et une coalition menée par les États-Unis le libère en février 1991.",
    },
    keyFacts: {
      en: ["Population: about 4.9 million", "Language: Arabic", "The Kuwaiti dinar is the world's highest-valued currency unit"],
      fr: ["Population : environ 4,9 millions", "Langue : arabe", "Le dinar koweïtien est l'unité monétaire la plus forte du monde"],
    },
  },
  {
    id: "KG",
    continent: "ASI",
    name: { en: "Kyrgyzstan", fr: "Kirghizistan" },
    capital: { en: "Bishkek", fr: "Bichkek" },
    aliases: ["Kirghizistan", "Kyrgyz Republic", "Kirghizie"],
    capitalAliases: ["Bichkek"],
    history: {
      en: "The Kyrgyz have a long nomadic tradition, celebrated in the epic of Manas. The territory was absorbed by the Russian Empire and became a Soviet republic. Kyrgyzstan declared independence on 31 August 1991.",
      fr: "Les Kirghizes ont une longue tradition nomade, célébrée dans l'épopée de Manas. Le territoire est absorbé par l'Empire russe puis devient une république soviétique. Le Kirghizistan proclame son indépendance le 31 août 1991.",
    },
    keyFacts: {
      en: ["Population: about 7.2 million", "Languages: Kyrgyz and Russian", "Over 90% mountainous; Issyk-Kul is one of the largest mountain lakes in the world"],
      fr: ["Population : environ 7,2 millions", "Langues : kirghize et russe", "Plus de 90 % montagneux ; l'Issyk-Koul est l'un des plus grands lacs de montagne du monde"],
    },
  },
  {
    id: "LA",
    continent: "ASI",
    name: { en: "Laos", fr: "Laos" },
    capital: { en: "Vientiane", fr: "Vientiane" },
    aliases: ["Lao", "Lao PDR"],
    history: {
      en: "The Kingdom of Lan Xang was founded in 1353. Laos became part of French Indochina and gained full independence in 1953. The communist Lao People's Democratic Republic was proclaimed in 1975.",
      fr: "Le royaume du Lan Xang est fondé en 1353. Le Laos intègre l'Indochine française et obtient sa pleine indépendance en 1953. La République démocratique populaire lao, communiste, est proclamée en 1975.",
    },
    keyFacts: {
      en: ["Population: about 7.7 million", "Language: Lao", "The most heavily bombed country per person in history (1964–1973)"],
      fr: ["Population : environ 7,7 millions", "Langue : lao", "Le pays le plus bombardé par habitant de l'histoire (1964-1973)"],
    },
  },
  {
    id: "LB",
    continent: "ASI",
    name: { en: "Lebanon", fr: "Liban" },
    capital: { en: "Beirut", fr: "Beyrouth" },
    aliases: ["Liban"],
    capitalAliases: ["Beyrouth"],
    history: {
      en: "The Phoenician cities of Byblos, Tyre and Sidon flourished here in ancient times. After Ottoman rule and a French mandate, Lebanon became independent on 22 November 1943. A civil war lasted from 1975 to 1990.",
      fr: "Les cités phéniciennes de Byblos, Tyr et Sidon y prospèrent dans l'Antiquité. Après la domination ottomane et un mandat français, le Liban devient indépendant le 22 novembre 1943. Une guerre civile dure de 1975 à 1990.",
    },
    keyFacts: {
      en: ["Population: about 5.8 million", "Language: Arabic; French widely spoken", "The cedar on its flag symbolises the country's ancient forests"],
      fr: ["Population : environ 5,8 millions", "Langue : arabe ; français très parlé", "Le cèdre de son drapeau symbolise les forêts antiques du pays"],
    },
  },
  {
    id: "MY",
    continent: "ASI",
    name: { en: "Malaysia", fr: "Malaisie" },
    capital: { en: "Kuala Lumpur", fr: "Kuala Lumpur" },
    aliases: ["Malaisie"],
    capitalAliases: ["Putrajaya"],
    history: {
      en: "The Sultanate of Malacca became a major trading power around 1400 before falling to the Portuguese in 1511, followed by Dutch and British rule. Malaya became independent on 31 August 1957, and Malaysia was formed on 16 September 1963. Kuala Lumpur is the capital, while the government sits in Putrajaya.",
      fr: "Le sultanat de Malacca devient une grande puissance commerciale vers 1400 avant de tomber aux mains des Portugais en 1511, puis des Néerlandais et des Britanniques. La Malaisie (Malaya) devient indépendante le 31 août 1957, et la Malaisie actuelle est formée le 16 septembre 1963. Kuala Lumpur est la capitale, le gouvernement siège à Putrajaya.",
    },
    keyFacts: {
      en: ["Population: about 35 million", "Language: Malay", "The Petronas Towers are the world's tallest twin towers"],
      fr: ["Population : environ 35 millions", "Langue : malais", "Les tours Petronas sont les plus hautes tours jumelles du monde"],
    },
  },
  {
    id: "MV",
    continent: "ASI",
    name: { en: "Maldives", fr: "Maldives" },
    capital: { en: "Malé", fr: "Malé" },
    capitalAliases: ["Male"],
    history: {
      en: "The Maldives converted to Islam in 1153. The islands became a British protectorate in 1887 and gained independence on 26 July 1965. They became a republic in 1968.",
      fr: "Les Maldives se convertissent à l'islam en 1153. L'archipel devient un protectorat britannique en 1887 et obtient son indépendance le 26 juillet 1965. Il devient une république en 1968.",
    },
    keyFacts: {
      en: ["Population: about 520,000", "Language: Dhivehi", "The world's lowest country, averaging about 1.5 m above sea level"],
      fr: ["Population : environ 520 000", "Langue : divehi", "Le pays le plus bas du monde, à environ 1,5 m au-dessus du niveau de la mer en moyenne"],
    },
  },
  {
    id: "MN",
    continent: "ASI",
    name: { en: "Mongolia", fr: "Mongolie" },
    capital: { en: "Ulaanbaatar", fr: "Oulan-Bator" },
    aliases: ["Mongolie"],
    capitalAliases: ["Ulan Bator", "Oulan Bator"],
    history: {
      en: "Genghis Khan united the Mongol tribes in 1206 and founded the largest contiguous land empire in history. Mongolia later came under Qing rule and declared independence in 1911. After decades as a Soviet-aligned communist state, it became a democracy in 1990.",
      fr: "Gengis Khan unifie les tribus mongoles en 1206 et fonde le plus vaste empire terrestre d'un seul tenant de l'histoire. La Mongolie passe ensuite sous domination Qing et proclame son indépendance en 1911. Après des décennies de régime communiste aligné sur l'URSS, elle devient une démocratie en 1990.",
    },
    keyFacts: {
      en: ["Population: about 3.5 million", "Language: Mongolian", "The least densely populated sovereign country; Ulaanbaatar is the coldest capital"],
      fr: ["Population : environ 3,5 millions", "Langue : mongol", "Le pays souverain le moins densément peuplé ; Oulan-Bator est la capitale la plus froide"],
    },
  },
  {
    id: "MM",
    continent: "ASI",
    name: { en: "Myanmar", fr: "Birmanie" },
    capital: { en: "Naypyidaw", fr: "Naypyidaw" },
    aliases: ["Burma", "Birmanie"],
    capitalAliases: ["Nay Pyi Taw", "Naypyitaw", "Nay Pyi Daw"],
    history: {
      en: "The Pagan Empire unified the region in the 11th century. Britain conquered Burma in the 19th century, and it became independent on 4 January 1948. The military seized power in 1962, renamed the country Myanmar in 1989, and staged another coup in February 2021.",
      fr: "L'empire de Pagan unifie la région au XIe siècle. Les Britanniques conquièrent la Birmanie au XIXe siècle, et elle devient indépendante le 4 janvier 1948. L'armée prend le pouvoir en 1962, renomme le pays Myanmar en 1989 et mène un nouveau coup d'État en février 2021.",
    },
    keyFacts: {
      en: ["Population: about 54 million", "Language: Burmese", "Naypyidaw replaced Yangon as capital in 2005–2006"],
      fr: ["Population : environ 54 millions", "Langue : birman", "Naypyidaw a remplacé Rangoun comme capitale en 2005-2006"],
    },
  },
  {
    id: "NP",
    continent: "ASI",
    name: { en: "Nepal", fr: "Népal" },
    capital: { en: "Kathmandu", fr: "Katmandou" },
    aliases: ["Nepal"],
    capitalAliases: ["Katmandou", "Katmandu"],
    history: {
      en: "Prithvi Narayan Shah unified Nepal in 1768, and the country was never colonised. Lumbini, in southern Nepal, is the birthplace of the Buddha. The monarchy was abolished and Nepal became a republic in 2008.",
      fr: "Prithvi Narayan Shah unifie le Népal en 1768, et le pays n'a jamais été colonisé. Lumbini, dans le sud du pays, est le lieu de naissance du Bouddha. La monarchie est abolie et le Népal devient une république en 2008.",
    },
    keyFacts: {
      en: ["Population: about 30 million", "Language: Nepali", "Home to Mount Everest (8,849 m) and the world's only non-rectangular national flag"],
      fr: ["Population : environ 30 millions", "Langue : népalais", "Abrite l'Everest (8 849 m) et le seul drapeau national non rectangulaire"],
    },
  },
  {
    id: "KP",
    continent: "ASI",
    name: { en: "North Korea", fr: "Corée du Nord" },
    capital: { en: "Pyongyang", fr: "Pyongyang" },
    aliases: ["DPRK", "Coree du Nord", "Democratic People's Republic of Korea"],
    history: {
      en: "Korea was under Japanese rule from 1910 to 1945 and was then divided between Soviet and American zones. The Democratic People's Republic of Korea was proclaimed on 9 September 1948. After the Korean War (1950–1953), it has been ruled by the Kim family.",
      fr: "La Corée est sous domination japonaise de 1910 à 1945, puis divisée entre zones soviétique et américaine. La République populaire démocratique de Corée est proclamée le 9 septembre 1948. Après la guerre de Corée (1950-1953), elle est dirigée par la famille Kim.",
    },
    keyFacts: {
      en: ["Population: about 26 million", "Language: Korean", "One of the most isolated countries in the world"],
      fr: ["Population : environ 26 millions", "Langue : coréen", "L'un des pays les plus isolés du monde"],
    },
  },
  {
    id: "OM",
    continent: "ASI",
    name: { en: "Oman", fr: "Oman" },
    capital: { en: "Muscat", fr: "Mascate" },
    capitalAliases: ["Mascate"],
    history: {
      en: "Oman built a maritime empire that once included Zanzibar and parts of the East African coast. The Al Said dynasty has ruled since 1744. Sultan Qaboos modernised the country during his reign from 1970 to 2020.",
      fr: "Oman bâtit un empire maritime qui inclut un temps Zanzibar et une partie de la côte est-africaine. La dynastie Al Saïd règne depuis 1744. Le sultan Qabous modernise le pays pendant son règne, de 1970 à 2020.",
    },
    keyFacts: {
      en: ["Population: about 5.2 million", "Language: Arabic", "Famous for frankincense, traded from its south for thousands of years"],
      fr: ["Population : environ 5,2 millions", "Langue : arabe", "Célèbre pour l'encens, commercé depuis son sud depuis des millénaires"],
    },
  },
  {
    id: "PK",
    continent: "ASI",
    name: { en: "Pakistan", fr: "Pakistan" },
    capital: { en: "Islamabad", fr: "Islamabad" },
    history: {
      en: "The Indus Valley Civilisation, with cities like Mohenjo-daro, flourished here around 2500 BC. Pakistan was created as an independent state on 14 August 1947 under Muhammad Ali Jinnah. East Pakistan seceded in 1971 to become Bangladesh, and Islamabad was purpose-built as the capital in the 1960s.",
      fr: "La civilisation de la vallée de l'Indus, avec des villes comme Mohenjo-daro, y prospère vers 2500 av. J.-C. Le Pakistan est créé comme État indépendant le 14 août 1947 sous Muhammad Ali Jinnah. Le Pakistan oriental fait sécession en 1971 pour devenir le Bangladesh, et Islamabad est construite comme capitale dans les années 1960.",
    },
    keyFacts: {
      en: ["Population: about 245 million", "Languages: Urdu and English", "K2 (8,611 m), the world's second-highest mountain, is on its border with China"],
      fr: ["Population : environ 245 millions", "Langues : ourdou et anglais", "Le K2 (8 611 m), deuxième plus haut sommet du monde, est à sa frontière avec la Chine"],
    },
  },
  {
    id: "PS",
    continent: "ASI",
    name: { en: "Palestine", fr: "Palestine" },
    capital: { en: "East Jerusalem", fr: "Jérusalem-Est" },
    aliases: ["State of Palestine", "Etat de Palestine", "Palestinian territories", "Territoires palestiniens"],
    capitalAliases: ["Jerusalem", "Jérusalem", "Ramallah", "Jerusalem-Est"],
    history: {
      en: "The region was ruled by many empires, including the Ottomans from 1516 to 1917, and then by Britain under a League of Nations mandate. Israel has occupied the West Bank and Gaza since 1967; the Palestine Liberation Organization declared a State of Palestine in 1988, and the Palestinian Authority was created by the Oslo Accords of 1993. Palestine became a UN non-member observer state in 2012 and is recognised by most UN member states.",
      fr: "La région est dominée par de nombreux empires, dont les Ottomans de 1516 à 1917, puis par le Royaume-Uni sous mandat de la Société des Nations. Israël occupe la Cisjordanie et Gaza depuis 1967 ; l'OLP proclame un État de Palestine en 1988, et l'Autorité palestinienne est créée par les accords d'Oslo de 1993. La Palestine devient État observateur non membre de l'ONU en 2012 et est reconnue par la plupart des États membres.",
    },
    keyFacts: {
      en: ["Population: about 5.5 million (West Bank and Gaza)", "Language: Arabic", "East Jerusalem is the proclaimed capital; the administration is based in Ramallah"],
      fr: ["Population : environ 5,5 millions (Cisjordanie et Gaza)", "Langue : arabe", "Jérusalem-Est est la capitale proclamée ; l'administration siège à Ramallah"],
    },
  },
  {
    id: "PH",
    continent: "ASI",
    name: { en: "Philippines", fr: "Philippines" },
    capital: { en: "Manila", fr: "Manille" },
    aliases: ["Republic of the Philippines"],
    capitalAliases: ["Manille"],
    history: {
      en: "Ferdinand Magellan reached the islands in 1521, and Spain ruled them from 1565, naming them after King Philip II. Independence was declared on 12 June 1898, but the United States took control until full independence on 4 July 1946. The 1986 People Power Revolution restored democracy.",
      fr: "Fernand de Magellan atteint l'archipel en 1521, et l'Espagne le gouverne à partir de 1565, le nommant d'après le roi Philippe II. L'indépendance est proclamée le 12 juin 1898, mais les États-Unis en prennent le contrôle jusqu'à la pleine indépendance du 4 juillet 1946. La révolution populaire de 1986 rétablit la démocratie.",
    },
    keyFacts: {
      en: ["Population: about 115 million", "Languages: Filipino and English", "Made up of more than 7,600 islands"],
      fr: ["Population : environ 115 millions", "Langues : filipino et anglais", "Composé de plus de 7 600 îles"],
    },
  },
  {
    id: "QA",
    continent: "ASI",
    name: { en: "Qatar", fr: "Qatar" },
    capital: { en: "Doha", fr: "Doha" },
    history: {
      en: "The Al Thani family has ruled Qatar since the mid-19th century. It became a British protectorate in 1916 and gained independence on 3 September 1971. Natural gas wealth has made it one of the richest countries per person.",
      fr: "La famille Al Thani gouverne le Qatar depuis le milieu du XIXe siècle. Il devient un protectorat britannique en 1916 et obtient son indépendance le 3 septembre 1971. Les richesses gazières en font l'un des pays les plus riches par habitant.",
    },
    keyFacts: {
      en: ["Population: about 3 million", "Language: Arabic", "Hosted the FIFA World Cup in 2022, the first in the Arab world"],
      fr: ["Population : environ 3 millions", "Langue : arabe", "A accueilli la Coupe du monde de football 2022, la première du monde arabe"],
    },
  },
  {
    id: "SA",
    continent: "ASI",
    name: { en: "Saudi Arabia", fr: "Arabie saoudite" },
    capital: { en: "Riyadh", fr: "Riyad" },
    aliases: ["Arabie Saoudite", "KSA", "Saudi"],
    capitalAliases: ["Riyad", "Riad"],
    history: {
      en: "The first Saudi state emerged in the 18th century around Diriyah. Abdulaziz Ibn Saud unified the kingdom, proclaimed on 23 September 1932. Oil discovered in 1938 transformed the economy; the country is home to Islam's two holiest cities, Mecca and Medina.",
      fr: "Le premier État saoudien naît au XVIIIe siècle autour de Diriyah. Abdelaziz ibn Saoud unifie le royaume, proclamé le 23 septembre 1932. Le pétrole découvert en 1938 transforme l'économie ; le pays abrite les deux villes les plus saintes de l'islam, La Mecque et Médine.",
    },
    keyFacts: {
      en: ["Population: about 34 million", "Language: Arabic", "The largest country in the world without a permanent river"],
      fr: ["Population : environ 34 millions", "Langue : arabe", "Le plus grand pays du monde sans rivière permanente"],
    },
  },
  {
    id: "SG",
    continent: "ASI",
    name: { en: "Singapore", fr: "Singapour" },
    capital: { en: "Singapore", fr: "Singapour" },
    aliases: ["Singapour"],
    capitalAliases: ["Singapour"],
    history: {
      en: "Stamford Raffles founded a British trading post in Singapore in 1819. After Japanese occupation in World War II, it joined Malaysia in 1963. Singapore became an independent city-state on 9 August 1965 under Lee Kuan Yew.",
      fr: "Stamford Raffles fonde un comptoir britannique à Singapour en 1819. Après l'occupation japonaise pendant la Seconde Guerre mondiale, la ville rejoint la Malaisie en 1963. Singapour devient une cité-État indépendante le 9 août 1965 sous Lee Kuan Yew.",
    },
    keyFacts: {
      en: ["Population: about 6 million", "Languages: English, Malay, Mandarin and Tamil", "One of the world's busiest ports"],
      fr: ["Population : environ 6 millions", "Langues : anglais, malais, mandarin et tamoul", "L'un des ports les plus actifs du monde"],
    },
  },
  {
    id: "KR",
    continent: "ASI",
    name: { en: "South Korea", fr: "Corée du Sud" },
    capital: { en: "Seoul", fr: "Séoul" },
    aliases: ["Korea", "Coree du Sud", "Republic of Korea", "ROK"],
    capitalAliases: ["Seoul"],
    history: {
      en: "The Joseon dynasty ruled Korea from 1392, and King Sejong created the Hangul alphabet in the 15th century. After Japanese rule (1910–1945), the Republic of Korea was founded on 15 August 1948. Following the Korean War, it grew rapidly into a major industrial and technological power.",
      fr: "La dynastie Joseon règne sur la Corée à partir de 1392, et le roi Sejong crée l'alphabet hangeul au XVe siècle. Après la domination japonaise (1910-1945), la République de Corée est fondée le 15 août 1948. Après la guerre de Corée, elle devient rapidement une grande puissance industrielle et technologique.",
    },
    keyFacts: {
      en: ["Population: about 51.7 million", "Language: Korean", "A global leader in electronics, shipbuilding and K-pop"],
      fr: ["Population : environ 51,7 millions", "Langue : coréen", "Un leader mondial de l'électronique, de la construction navale et de la K-pop"],
    },
  },
  {
    id: "LK",
    continent: "ASI",
    name: { en: "Sri Lanka", fr: "Sri Lanka" },
    capital: { en: "Sri Jayawardenepura Kotte", fr: "Sri Jayawardenepura Kotte" },
    aliases: ["Ceylon", "Ceylan"],
    capitalAliases: ["Kotte", "Colombo"],
    history: {
      en: "The ancient kingdom of Anuradhapura flourished for over a thousand years. The island was colonised by the Portuguese, the Dutch and then the British as Ceylon, gaining independence on 4 February 1948. It was renamed Sri Lanka in 1972, and a civil war lasted from 1983 to 2009.",
      fr: "L'ancien royaume d'Anuradhapura prospère pendant plus de mille ans. L'île est colonisée par les Portugais, les Néerlandais puis les Britanniques sous le nom de Ceylan, et devient indépendante le 4 février 1948. Elle est renommée Sri Lanka en 1972, et une guerre civile dure de 1983 à 2009.",
    },
    keyFacts: {
      en: ["Population: about 22 million", "Languages: Sinhala and Tamil", "Elected the world's first female prime minister, Sirimavo Bandaranaike, in 1960"],
      fr: ["Population : environ 22 millions", "Langues : cingalais et tamoul", "A élu la première femme Premier ministre du monde, Sirimavo Bandaranaike, en 1960"],
    },
  },
  {
    id: "SY",
    continent: "ASI",
    name: { en: "Syria", fr: "Syrie" },
    capital: { en: "Damascus", fr: "Damas" },
    aliases: ["Syrie"],
    capitalAliases: ["Damas"],
    history: {
      en: "Damascus and Aleppo are among the oldest continuously inhabited cities in the world. Damascus was the capital of the Umayyad Caliphate from 661 to 750. After Ottoman rule and a French mandate, Syria became independent in 1946; a civil war began in 2011, and the Assad government fell in December 2024.",
      fr: "Damas et Alep comptent parmi les plus anciennes villes habitées en continu. Damas est la capitale du califat omeyyade de 661 à 750. Après la domination ottomane et un mandat français, la Syrie devient indépendante en 1946 ; une guerre civile éclate en 2011, et le régime Assad tombe en décembre 2024.",
    },
    keyFacts: {
      en: ["Population: about 24 million (estimates vary)", "Language: Arabic", "Home to the ancient city of Palmyra, a UNESCO World Heritage Site"],
      fr: ["Population : environ 24 millions (estimations variables)", "Langue : arabe", "Abrite la cité antique de Palmyre, classée au patrimoine mondial"],
    },
  },
  {
    id: "TW",
    continent: "ASI",
    name: { en: "Taiwan", fr: "Taïwan" },
    capital: { en: "Taipei", fr: "Taipei" },
    aliases: ["Taiwan", "Formosa", "Republic of China"],
    capitalAliases: ["Taipeh"],
    history: {
      en: "Taiwan's first inhabitants were Austronesian peoples. The island was ruled by the Qing dynasty and then by Japan from 1895 to 1945. The Republic of China government moved there in 1949; Taiwan became a democracy in the 1990s, and its political status remains disputed by the People's Republic of China.",
      fr: "Les premiers habitants de Taïwan sont des peuples austronésiens. L'île est gouvernée par la dynastie Qing puis par le Japon de 1895 à 1945. Le gouvernement de la République de Chine s'y replie en 1949 ; Taïwan devient une démocratie dans les années 1990, et son statut politique reste contesté par la République populaire de Chine.",
    },
    keyFacts: {
      en: ["Population: about 23.4 million", "Language: Mandarin Chinese", "Produces most of the world's most advanced computer chips"],
      fr: ["Population : environ 23,4 millions", "Langue : chinois mandarin", "Produit la plupart des puces électroniques les plus avancées du monde"],
    },
  },
  {
    id: "TJ",
    continent: "ASI",
    name: { en: "Tajikistan", fr: "Tadjikistan" },
    capital: { en: "Dushanbe", fr: "Douchanbé" },
    aliases: ["Tadjikistan"],
    capitalAliases: ["Douchanbe", "Dushanbe"],
    history: {
      en: "The Persian Samanid Empire flourished here in the 9th–10th centuries. The region came under Russian and then Soviet rule. Tajikistan declared independence on 9 September 1991 and went through a civil war from 1992 to 1997.",
      fr: "L'Empire samanide persan y prospère aux IXe-Xe siècles. La région passe sous domination russe puis soviétique. Le Tadjikistan proclame son indépendance le 9 septembre 1991 et traverse une guerre civile de 1992 à 1997.",
    },
    keyFacts: {
      en: ["Population: about 10.3 million", "Language: Tajik (a form of Persian)", "More than 90% mountainous, including the Pamir Mountains"],
      fr: ["Population : environ 10,3 millions", "Langue : tadjik (une forme de persan)", "Plus de 90 % montagneux, dont le massif du Pamir"],
    },
  },
  {
    id: "TH",
    continent: "ASI",
    name: { en: "Thailand", fr: "Thaïlande" },
    capital: { en: "Bangkok", fr: "Bangkok" },
    aliases: ["Thailande", "Siam"],
    history: {
      en: "The Sukhothai and Ayutthaya kingdoms shaped Thai culture from the 13th century. The Chakri dynasty has reigned since 1782, and the country was never colonised by a European power. It became a constitutional monarchy in 1932 and changed its name from Siam to Thailand in 1939.",
      fr: "Les royaumes de Sukhothaï et d'Ayutthaya façonnent la culture thaïe dès le XIIIe siècle. La dynastie Chakri règne depuis 1782, et le pays n'a jamais été colonisé par une puissance européenne. Il devient une monarchie constitutionnelle en 1932 et change son nom de Siam en Thaïlande en 1939.",
    },
    keyFacts: {
      en: ["Population: about 71.7 million", "Language: Thai", "Bangkok's full ceremonial name is one of the longest place names in the world"],
      fr: ["Population : environ 71,7 millions", "Langue : thaï", "Le nom cérémoniel complet de Bangkok est l'un des plus longs noms de lieu au monde"],
    },
  },
  {
    id: "TL",
    continent: "ASI",
    name: { en: "Timor-Leste", fr: "Timor oriental" },
    capital: { en: "Dili", fr: "Dili" },
    aliases: ["East Timor", "Timor Leste", "Timor oriental"],
    history: {
      en: "East Timor was a Portuguese colony for over four centuries. It declared independence in November 1975 but was invaded by Indonesia days later and occupied until 1999. After a UN-backed referendum, it became independent on 20 May 2002.",
      fr: "Le Timor oriental est une colonie portugaise pendant plus de quatre siècles. Il proclame son indépendance en novembre 1975 mais est envahi par l'Indonésie quelques jours plus tard et occupé jusqu'en 1999. Après un référendum organisé par l'ONU, il devient indépendant le 20 mai 2002.",
    },
    keyFacts: {
      en: ["Population: about 1.4 million", "Languages: Tetum and Portuguese", "One of only two Asian countries with a Catholic majority, with the Philippines"],
      fr: ["Population : environ 1,4 million", "Langues : tétoum et portugais", "L'un des deux seuls pays d'Asie à majorité catholique, avec les Philippines"],
    },
  },
  {
    id: "TR",
    continent: "ASI",
    name: { en: "Turkey", fr: "Turquie" },
    capital: { en: "Ankara", fr: "Ankara" },
    aliases: ["Türkiye", "Turkiye", "Turquie"],
    history: {
      en: "Anatolia was home to the Hittites and later the Byzantine Empire, whose capital Constantinople fell to the Ottomans in 1453. The Ottoman Empire lasted until 1922. Mustafa Kemal Atatürk founded the Republic of Turkey on 29 October 1923.",
      fr: "L'Anatolie abrite les Hittites puis l'Empire byzantin, dont la capitale Constantinople tombe aux mains des Ottomans en 1453. L'Empire ottoman dure jusqu'en 1922. Mustafa Kemal Atatürk fonde la République de Turquie le 29 octobre 1923.",
    },
    keyFacts: {
      en: ["Population: about 85.6 million", "Language: Turkish", "Istanbul is the only major city spread across two continents"],
      fr: ["Population : environ 85,6 millions", "Langue : turc", "Istanbul est la seule grande métropole située sur deux continents"],
    },
  },
  {
    id: "TM",
    continent: "ASI",
    name: { en: "Turkmenistan", fr: "Turkménistan" },
    capital: { en: "Ashgabat", fr: "Achgabat" },
    aliases: ["Turkmenistan"],
    capitalAliases: ["Achgabat", "Ashkhabad"],
    history: {
      en: "The ancient city of Merv was a major stop on the Silk Road. The region came under Russian and then Soviet rule. Turkmenistan became independent on 27 October 1991, and the UN recognised its permanent neutrality in 1995.",
      fr: "L'antique cité de Merv est une grande étape de la route de la soie. La région passe sous domination russe puis soviétique. Le Turkménistan devient indépendant le 27 octobre 1991, et l'ONU reconnaît sa neutralité permanente en 1995.",
    },
    keyFacts: {
      en: ["Population: about 7 million", "Language: Turkmen", "The Darvaza gas crater, the \"Door to Hell\", has been burning since 1971"],
      fr: ["Population : environ 7 millions", "Langue : turkmène", "Le cratère de gaz de Darvaza, la « porte de l'enfer », brûle depuis 1971"],
    },
  },
  {
    id: "AE",
    continent: "ASI",
    name: { en: "United Arab Emirates", fr: "Émirats arabes unis" },
    capital: { en: "Abu Dhabi", fr: "Abou Dabi" },
    aliases: ["UAE", "Emirates", "Emirats arabes unis", "EAU"],
    capitalAliases: ["Abou Dabi", "Abou Dhabi"],
    history: {
      en: "The coastal sheikhdoms, known as the Trucial States, were under British protection from the 19th century. Six emirates formed the United Arab Emirates on 2 December 1971, and Ras al-Khaimah joined in 1972. Oil wealth transformed cities like Abu Dhabi and Dubai.",
      fr: "Les cheikhats côtiers, appelés États de la Trêve, sont sous protection britannique dès le XIXe siècle. Six émirats forment les Émirats arabes unis le 2 décembre 1971, et Ras el-Khaïmah les rejoint en 1972. La richesse pétrolière transforme des villes comme Abou Dabi et Dubaï.",
    },
    keyFacts: {
      en: ["Population: about 10 million", "Language: Arabic", "Dubai's Burj Khalifa (828 m) is the tallest building in the world"],
      fr: ["Population : environ 10 millions", "Langue : arabe", "Le Burj Khalifa de Dubaï (828 m) est le plus haut bâtiment du monde"],
    },
  },
  {
    id: "UZ",
    continent: "ASI",
    name: { en: "Uzbekistan", fr: "Ouzbékistan" },
    capital: { en: "Tashkent", fr: "Tachkent" },
    aliases: ["Ouzbekistan"],
    capitalAliases: ["Tachkent"],
    history: {
      en: "Samarkand, Bukhara and Khiva were great cities of the Silk Road, and Timur (Tamerlane) built an empire from here in the 14th century. The region came under Russian and then Soviet rule. Uzbekistan declared independence on 31 August 1991.",
      fr: "Samarcande, Boukhara et Khiva sont de grandes villes de la route de la soie, et Tamerlan y bâtit un empire au XIVe siècle. La région passe sous domination russe puis soviétique. L'Ouzbékistan proclame son indépendance le 31 août 1991.",
    },
    keyFacts: {
      en: ["Population: about 37 million", "Language: Uzbek", "One of only two doubly landlocked countries, with Liechtenstein"],
      fr: ["Population : environ 37 millions", "Langue : ouzbek", "L'un des deux seuls pays doublement enclavés, avec le Liechtenstein"],
    },
  },
  {
    id: "VN",
    continent: "ASI",
    name: { en: "Vietnam", fr: "Viêt Nam" },
    capital: { en: "Hanoi", fr: "Hanoï" },
    aliases: ["Viet Nam", "Vietnam"],
    capitalAliases: ["Hanoi"],
    history: {
      en: "Vietnam ended about a thousand years of Chinese rule in 938. After becoming part of French Indochina, Ho Chi Minh declared independence on 2 September 1945. Following the Vietnam War, the country was reunified in 1976 and launched market reforms (Đổi Mới) in 1986.",
      fr: "Le Viêt Nam met fin à environ mille ans de domination chinoise en 938. Après avoir fait partie de l'Indochine française, Hô Chi Minh proclame l'indépendance le 2 septembre 1945. Après la guerre du Viêt Nam, le pays est réunifié en 1976 et lance des réformes de marché (Đổi Mới) en 1986.",
    },
    keyFacts: {
      en: ["Population: about 101 million", "Language: Vietnamese", "The world's second-largest coffee producer"],
      fr: ["Population : environ 101 millions", "Langue : vietnamien", "Deuxième producteur mondial de café"],
    },
  },
  {
    id: "YE",
    continent: "ASI",
    name: { en: "Yemen", fr: "Yémen" },
    capital: { en: "Sanaa", fr: "Sanaa" },
    aliases: ["Yemen"],
    capitalAliases: ["Sana'a", "Aden"],
    history: {
      en: "Yemen was home to the ancient Kingdom of Saba (Sheba). North Yemen and South Yemen, a former British colony around Aden, unified on 22 May 1990. A civil war has divided the country since 2014.",
      fr: "Le Yémen abrite l'ancien royaume de Saba. Le Yémen du Nord et le Yémen du Sud, ancienne colonie britannique autour d'Aden, s'unifient le 22 mai 1990. Une guerre civile divise le pays depuis 2014.",
    },
    keyFacts: {
      en: ["Population: about 40 million", "Language: Arabic", "Shibam's mud-brick tower houses earned it the name \"Manhattan of the desert\""],
      fr: ["Population : environ 40 millions", "Langue : arabe", "Les maisons-tours en terre de Shibam lui valent le surnom de « Manhattan du désert »"],
    },
  },
];
