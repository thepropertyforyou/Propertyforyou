export interface District {
  name: string;
  taluks: string[];
}

export interface StateData {
  state: string;
  districts: District[];
}

export const statesAndDistricts: StateData[] = [
  {
    "state": "Andaman and Nicobar Islands",
    "districts": [
      {
        "name": "Nicobar",
        "taluks": [
          "Campbell Bay",
          "Car Nicobar",
          "Nancowrie"
        ]
      },
      {
        "name": "North And Middle Andaman",
        "taluks": [
          "Diglipur",
          "Mayabunder",
          "Rangat"
        ]
      },
      {
        "name": "South Andaman",
        "taluks": [
          "Ferrargunj",
          "Little Andaman",
          "Prothrapur"
        ]
      }
    ]
  },
  {
    "state": "Andhra Pradesh",
    "districts": [
      {
        "name": "Anantpur",
        "taluks": [
          "Agali",
          "Amadagur",
          "Amarapuram",
          "Anantapur",
          "Atmakur",
          "Bathalapalle",
          "Beluguppa",
          "Bommanahal",
          "Brahmasamudram",
          "Bukkapatnam",
          "Bukkarayasamudram",
          "Chennekothapalle",
          "Chilamathur",
          "D.hirehal",
          "Dharmavaram",
          "Gandlapenta",
          "Garladinne",
          "Gooty",
          "Gorantla",
          "Gudibanda",
          "Gummagatta",
          "Guntakal",
          "Hindupur",
          "Kadiri",
          "Kalyandrug",
          "Kambadur",
          "Kanaganapalle",
          "Kanekal",
          "Kothacheruvu",
          "Kudair",
          "Kundurpi",
          "Lepakshi",
          "Madakasira",
          "Mudigubba",
          "Nallacheruvu",
          "Nallamada",
          "Nambulapulikunta",
          "Narpala",
          "Obuladevarecheruvu",
          "Pamidi",
          "Parigi",
          "Peddapappur",
          "Peddavadugur",
          "Penukonda",
          "Putlur",
          "Puttaparthi",
          "Ramagiri",
          "Raptadu",
          "Rayadurg",
          "Roddam",
          "Rolla",
          "Settur",
          "Singanamala",
          "Somandepalle",
          "Tadimarri",
          "Tadipatri",
          "Talupula",
          "Tanakal",
          "Uravakonda",
          "Vajrakarur",
          "Vidapanakal",
          "Yadiki",
          "Yellanur"
        ]
      },
      {
        "name": "Chittoor",
        "taluks": [
          "B.kothakota",
          "Baireddipalle",
          "Bangarupalem",
          "Buchinadidu Khandriga",
          "Chandragiri",
          "Chinnagottigallu",
          "Chittoor",
          "Chowdepalle",
          "Gangadhara Nellore",
          "Gangavaram",
          "Gudipala",
          "Gudupalle",
          "Gurramkonda",
          "Irala",
          "K.v.b.puram",
          "Kalakada",
          "Kalikiri",
          "Kambhamvaripalle",
          "Karvetinagar",
          "Kuppam",
          "Kurabalakota",
          "Madanapalle",
          "Mulakalacheruvu",
          "Nagalapuram",
          "Nagari",
          "Narayanavanam",
          "Nimmanapalle",
          "Nindra",
          "Pakala",
          "Palamaner",
          "Palasamudram",
          "Peddamandyam",
          "Peddapanjani",
          "Peddathippasamudram",
          "Penumuru",
          "Piler",
          "Pitchatur",
          "Pulicherla H/o Reddivaripalle",
          "Punganur",
          "Puthalapattu",
          "Puttur",
          "Ramachandrapuram",
          "Ramakuppam",
          "Ramasamudram",
          "Renigunta",
          "Rompicherla",
          "Santhipuram Ho Arimuthanapalle",
          "Satyavedu",
          "Sodam",
          "Somala",
          "Srikalahasti",
          "Srirangarajapuram",
          "Thamballapalle",
          "Thavanampalle",
          "Thottambedu",
          "Tirupati (Rural)",
          "Tirupati(urban)",
          "Vadamalapeta",
          "Varadaiahpalem",
          "Vayalpad",
          "Vedurukuppam",
          "Venkatagirikota",
          "Vijayapuram",
          "Yadamari",
          "Yerpedu",
          "Yerravaripalem"
        ]
      },
      {
        "name": "East Godavari",
        "taluks": [
          "Addateegala",
          "Ainavilli",
          "Alamuru",
          "Allavaram",
          "Amalapuram",
          "Ambajipeta",
          "Anaparthy",
          "Atreyapuram",
          "Biccavolu",
          "Devipatnam",
          "Gandepalle",
          "Gangavaram",
          "Gokavaram",
          "Gollaprolu",
          "I. Polavaram",
          "Jaggampeta",
          "Kadiam",
          "Kajuluru",
          "Kakinada Rural",
          "Kakinada Urban",
          "Kapileswarapuram",
          "Karapa",
          "Katrenikona",
          "Kirlampudi",
          "Korukonda",
          "Kotananduru",
          "Kothapeta",
          "Malikipuram",
          "Mamidikuduru",
          "Mandapeta",
          "Maredumilli",
          "Mummidivaram",
          "P.gannavaram",
          "Pamarru",
          "Pedapudi",
          "Peddapuram",
          "Pithapuram",
          "Prathipadu",
          "Rajahmundry Rural",
          "Rajahmundry Urban",
          "Rajanagaram",
          "Rajavommangi",
          "Ramachandrapuram",
          "Rampachodavaram",
          "Rangampeta",
          "Ravulapalem",
          "Rayavaram",
          "Razole",
          "Routhulapudi",
          "Sakhinetipalle",
          "Samalkota",
          "Sankhavaram",
          "Seethanagaram",
          "Thallarevu",
          "Thondangi",
          "Tuni",
          "U.kothapalle",
          "Uppalaguptam",
          "Y. Ramavaram",
          "Yeleswaram"
        ]
      },
      {
        "name": "Guntur",
        "taluks": [
          "Achampet",
          "Amaravathi",
          "Amruthalur",
          "Atchempet",
          "Bapatla",
          "Bellamkonda",
          "Bhattiprolu",
          "Bollapalle",
          "Chebrole",
          "Cherukupalle",
          "Chilakaluripet",
          "Dachepalle",
          "Duggirala",
          "Durgi",
          "Edlapadu",
          "Guntur",
          "Gurazala",
          "Ipur",
          "Kakumanu",
          "Karempudi",
          "Karlapalem",
          "Kollipara",
          "Kollur",
          "Krosuru",
          "Machavaram",
          "Macherla",
          "Mangalagiri",
          "Medikonduru",
          "Muppalla",
          "Nadendla",
          "Nagaram",
          "Narasaraopeta",
          "Nekarikallu",
          "Nizampatnam",
          "Nuzendla",
          "Pedakakani",
          "Pedakurapadu",
          "Pedanandipadu",
          "Phirangipuram",
          "Piduguralla",
          "Pittalavanipalem",
          "Ponnur",
          "Prathipadu",
          "Rajupalem",
          "Rentachintala",
          "Repalle",
          "Rompicherla",
          "Sattenapalle",
          "Savalyapuram",
          "Tadepalle",
          "Tadikonda",
          "Tenali",
          "Thullur",
          "Tsundur",
          "Vatticherukuru",
          "Veldurthy",
          "Vemuru",
          "Vinukonda"
        ]
      },
      {
        "name": "Krishna",
        "taluks": [
          "A.konduru",
          "Agiripalli",
          "Avanigadda",
          "Bantumilli",
          "Bapulapadu",
          "Challapalli",
          "Chandarlapadu",
          "Chatrai",
          "G.konduru",
          "Gampalagudem",
          "Gannavaram",
          "Ghantasala",
          "Gudivada",
          "Gudlavalleru",
          "Guduru",
          "Ibrahimpatnam",
          "Jaggayyapeta",
          "Kaikalur",
          "Kalidindi",
          "Kanchikacherla",
          "Kankipadu",
          "Koduru",
          "Kruttivennu",
          "Machilipatnam",
          "Mandavalli",
          "Mopidevi",
          "Movva",
          "Mudinepalle",
          "Musunuru",
          "Mylavaram",
          "Nagayalanka",
          "Nandigama",
          "Nandivada",
          "Nuzvid",
          "Pamarru",
          "Pamidimukkala",
          "Pedana",
          "Pedaparupudi",
          "Penamaluru",
          "Penuganchiprolu",
          "Reddigudem",
          "Thotlavalluru",
          "Tiruvuru",
          "Unguturu",
          "Vatsavai",
          "Veerullapadu",
          "Vijayawada Rural",
          "Vijayawada Urban",
          "Vissannapet",
          "Vuyyuru"
        ]
      },
      {
        "name": "Kurnool",
        "taluks": [
          "Adoni",
          "Allagadda",
          "Alur",
          "Aspari",
          "Atmakur",
          "Banaganapalle",
          "Bandi Atmakur",
          "Bethamcherla",
          "C.belagal",
          "Chagalamarri",
          "Chippagiri",
          "Devanakonda",
          "Dhone Alias Dronachalam",
          "Dornipadu",
          "Gadivemula",
          "Gonegandla",
          "Gospadu",
          "Gudur",
          "Halaharvi",
          "Holagunda",
          "Jupadu Bungalow",
          "Kallur",
          "Kodumur",
          "Koilakuntla",
          "Kolimigundla",
          "Kosigi",
          "Kothapalle",
          "Kowthalam",
          "Krishnagiri",
          "Kurnool",
          "Maddikera (East)",
          "Mahanandi",
          "Mantralayam",
          "Midthur",
          "Nandavaram",
          "Nandikotkur",
          "Nandyal",
          "Orvakal",
          "Owk",
          "Pagidyala",
          "Pamulapadu",
          "Panyam",
          "Pattikonda",
          "Peapully",
          "Peddakadabur",
          "Rudravaram",
          "Sanjamala",
          "Sirivel",
          "Srisailam",
          "Tuggali",
          "Uyyalawada",
          "Veldurthi",
          "Velugodu",
          "Yemmiganur"
        ]
      },
      {
        "name": "Nellore",
        "taluks": [
          "Allur",
          "Ananthasagaram",
          "Anumasamudrampeta",
          "Atmakur",
          "Balayapalle",
          "Bogole",
          "Butchireddipalem",
          "Chejerla",
          "Chillakur",
          "Chittamur",
          "Dagadarthi",
          "Dakkili",
          "Doravarisatram",
          "Duttalur",
          "Gudur",
          "Indukurpet",
          "Jaladanki",
          "Kaligiri",
          "Kaluvoya",
          "Kavali",
          "Kodavalur",
          "Kondapuram",
          "Kota",
          "Kovur",
          "Manubolu",
          "Marripadu",
          "Muthukur",
          "Naidupeta",
          "Nellore",
          "Ozili",
          "Pellakur",
          "Podalakur",
          "Rapur",
          "Sangam",
          "Seetharamapuram",
          "Sullurpeta",
          "Sydapuram",
          "Tada",
          "Thotapalligudur",
          "Udayagiri",
          "Vakadu",
          "Varikuntapadu",
          "Venkatachalam",
          "Venkatagiri",
          "Vidavalur",
          "Vinjamur"
        ]
      },
      {
        "name": "Prakasam",
        "taluks": [
          "Addanki",
          "Ardhaveedu",
          "Ballikurava",
          "Bestavaripeta",
          "Chandra Sekhara Puram",
          "Chimakurthi",
          "Chinaganjam",
          "Chirala",
          "Cumbum",
          "Darsi",
          "Donakonda",
          "Dornala",
          "Giddaluru",
          "Gudluru",
          "Hanumanthuni Padu",
          "Inkollu",
          "Janakavaram Ponguluru",
          "Kandukur",
          "Kanigiri",
          "Karamchedu",
          "Komarolu",
          "Konakanamittla",
          "Kondapi",
          "Korisapadu",
          "Kotha Patnam",
          "Kurichedu",
          "Lingasamudram",
          "Maddipadu",
          "Markapur",
          "Marripudi",
          "Martur",
          "Mundlamuru",
          "Naguluppala Padu",
          "Ongole",
          "Pamur",
          "Parchur",
          "Peda Araveedu",
          "Pedacherlo Palle",
          "Podili",
          "Ponnaluru",
          "Pullalacheruvu",
          "Racherla",
          "Santhamaguluru",
          "Santhanuthala Padu",
          "Singarayakonda",
          "Tallur",
          "Tangutur",
          "Tarlupadu",
          "Tripuranthakam",
          "Ulavapadu",
          "Veligandla",
          "Vetapalem",
          "Voletivari Palem",
          "Yddana Pudi",
          "Yerragondapalem",
          "Zarugumilli"
        ]
      },
      {
        "name": "Srikakulam",
        "taluks": [
          "Amadalavalasa",
          "Bhamini",
          "Burja",
          "Etcherla",
          "Ganguvarisigadam",
          "Gara",
          "Hiramandalam",
          "Ichapuram",
          "Jalumuru",
          "Kanchili",
          "Kaviti",
          "Kotabommili",
          "Kotturu",
          "L.n Peta",
          "Laveru",
          "Mandasa",
          "Meliaputti",
          "Nandigam",
          "Narasannapeta",
          "Palakonda",
          "Palasa",
          "Pathapatnam",
          "Polaki",
          "Ponduru",
          "Rajam",
          "Ranastalam",
          "Regidi Amadalavalasa",
          "Santhabommali",
          "Santhakavati",
          "Saravakota",
          "Sarubujjili",
          "Seethampeta",
          "Sompeta",
          "Srikakulam",
          "Tekkali",
          "Vajrapukotturu",
          "Vangara",
          "Veeraghattam"
        ]
      },
      {
        "name": "Visakhapatnam",
        "taluks": [
          "Achutapuram",
          "Anakapalle",
          "Anandapuram",
          "Ananthagiri",
          "Araku Valley",
          "Bheemunipatnam",
          "Butchayyapeta",
          "Cheedikada",
          "Chintapalle",
          "Chodavaram",
          "Devarapalle",
          "Dumbriguda",
          "G.madugula",
          "Gajuwaka",
          "Golugonda",
          "Gudem Kotha Veedhi",
          "Hukumpeta",
          "K.kotapadu",
          "Kasimkota",
          "Kotauratla",
          "Koyyuru",
          "Madugula",
          "Makavarapalem",
          "Munagapaka",
          "Munchingi Puttu",
          "Nakkapalle",
          "Narsipatnam",
          "Nathavaram",
          "Paderu",
          "Padmanabham",
          "Paravada",
          "Payakaraopeta",
          "Peda Bayalu",
          "Pedagantyada",
          "Pendurthi",
          "Rambilli",
          "Ravikamatham",
          "Rolugunta",
          "S.rayavaram",
          "Sabbavaram",
          "Visakhapatnam(rural)",
          "Visakhapatnam(urban)",
          "Yelamanchili"
        ]
      },
      {
        "name": "Vizianagarm",
        "taluks": [
          "Badangi",
          "Balijipeta",
          "Bhoghapuram",
          "Bobbili",
          "Bondapalle",
          "Cheepurupalle",
          "Dattirajeru",
          "Denkada",
          "Gajapathinagaram",
          "Gantyada",
          "Garividi",
          "Garugubilli",
          "Gummalakshmipuram",
          "Gurla",
          "Jami",
          "Jiyyammavalasa",
          "Komarada",
          "Kothavalasa",
          "Kurupam",
          "Lakkavarapukota",
          "Makkuva",
          "Mentada",
          "Merakamudidam",
          "Nellimarla",
          "Pachipenta",
          "Parvathipuram",
          "Pusapatirega",
          "Ramabhadrapuram",
          "Salur",
          "Seethanagaram",
          "Srungavarapukota",
          "Therlam",
          "Vepada",
          "Vizianagaram"
        ]
      },
      {
        "name": "West Godavari",
        "taluks": [
          "Achanta",
          "Akividu",
          "Attili",
          "Bhimadole",
          "Bhimavaram",
          "Buttayagudem",
          "Chagallu",
          "Chintalapudi",
          "Denduluru",
          "Devarapalle",
          "Dwarakatirumala",
          "Elamanchili",
          "Eluru",
          "Ganapavaram",
          "Gopalapuram",
          "Iragavaram",
          "Jangareddigudem",
          "Jeelugumilli",
          "Kalla",
          "Kamavarapukota",
          "Kovvur",
          "Koyyalagudem",
          "Lingapalem",
          "Mogalthur",
          "Nallajerla",
          "Narsapur",
          "Nidadavole",
          "Nidamarru",
          "Palacole",
          "Palakoderu",
          "Pedapadu",
          "Pedavegi",
          "Pentapadu",
          "Penugonda",
          "Penumantra",
          "Peravali",
          "Poduru",
          "Polavaram",
          "T.narasapuram",
          "Tadepalligudem",
          "Tanuku",
          "Thallapudi",
          "Undi",
          "Undrajavaram",
          "Unguturu",
          "Veeravasaram"
        ]
      },
      {
        "name": "Y S R",
        "taluks": [
          "Atlur",
          "B Kodur",
          "Badvel",
          "Brahmamgarimatham.",
          "Chakrayapet",
          "Chapadu",
          "Chennur",
          "Chinnamandem",
          "Chintakomma Dinne",
          "Chitvel",
          "Cuddapah",
          "Duvvur",
          "Galiveedu",
          "Gopavaram",
          "Jammalamadugu",
          "Kalasapadu",
          "Kamalapuram",
          "Khajipet",
          "Kodur",
          "Kondapuram",
          "Lakkireddipalle",
          "Lingala",
          "Muddanur",
          "Mydukur",
          "Mylavaram",
          "Nandalur",
          "Obulavaripalle",
          "Peddamudium",
          "Penagalur",
          "Pendlimarri",
          "Porumamilla",
          "Proddatur",
          "Pulivendla",
          "Pullampeta",
          "Rajampet",
          "Rajupalem",
          "Ramapuram",
          "Rayachoty",
          "Sambepalle",
          "Sidhout",
          "Simhadripuram",
          "Sri Avadutha Kasinayana",
          "T.sundupalle",
          "Thondur",
          "Vallur",
          "Veeraballi",
          "Veerapanayani Palle",
          "Vempalle",
          "Vemula",
          "Vontimitta",
          "Yerraguntla"
        ]
      }
    ]
  },
  {
    "state": "Arunachal Pradesh",
    "districts": [
      {
        "name": "Anjaw",
        "taluks": [
          "Hawai",
          "Hayulliang"
        ]
      },
      {
        "name": "Changlang",
        "taluks": [
          "Bordumsa",
          "Changlang",
          "Diyum",
          "Khimyong",
          "Manmao-jairampur",
          "Miao",
          "Nampong-rima Putok"
        ]
      },
      {
        "name": "East Kameng",
        "taluks": [
          "Bameng East",
          "Bameng West",
          "Bana",
          "Chayangtajo",
          "Pakkekessang",
          "Papu-valley",
          "Pipu",
          "Sawa",
          "Seijosa",
          "Seppa"
        ]
      },
      {
        "name": "East Siang",
        "taluks": [
          "Bilat",
          "Bogong",
          "Boleng Pegging-bote",
          "Bosing",
          "Koyu",
          "Mebo",
          "Monggu-banggo",
          "Nari-seren",
          "Pangin Rebo Perperging",
          "Ruksin",
          "Sille Oyan"
        ]
      },
      {
        "name": "Kurung Kumey",
        "taluks": [
          "Chambang",
          "Damin",
          "Gangte Tarak Lengdi",
          "Lower Koloriang",
          "Nyapin",
          "Palin",
          "Parsi Parlo",
          "Pipsorang",
          "Sangram",
          "Sarli",
          "Tali",
          "Upper Koloriang",
          "Yangte"
        ]
      },
      {
        "name": "Lohit",
        "taluks": [
          "Chokham",
          "Chonglongam",
          "Hawai-walong",
          "Hayuliang",
          "Lekang",
          "Manchal",
          "Namsai",
          "Ningroo",
          "Sunpura",
          "Tezu",
          "Upper Lekang",
          "Wakro"
        ]
      },
      {
        "name": "Longding",
        "taluks": [
          "Longding"
        ]
      },
      {
        "name": "Lower Dibang Valley",
        "taluks": [
          "Dambuk",
          "Hunli-desali",
          "Iduli",
          "Koronu",
          "Meka",
          "Roing"
        ]
      },
      {
        "name": "Lower Subabsiri",
        "taluks": [
          "Diibo",
          "Dollumukh Taming",
          "Hari",
          "Hija",
          "Kamporijo I",
          "Kamporijo Ii",
          "Nichii",
          "Nitii",
          "Pistana",
          "Raga",
          "Reru Kalung",
          "Tajang",
          "Yachuli",
          "Yazali"
        ]
      },
      {
        "name": "Papumpare",
        "taluks": [
          "Borum",
          "Doimukh",
          "Kimin",
          "Leporiang",
          "Lower Balijan",
          "Mengio",
          "Sagalee",
          "Tarasso",
          "Toru",
          "Upper Balijan"
        ]
      },
      {
        "name": "Tawang",
        "taluks": [
          "Jang-thingbu",
          "Kitpi",
          "Lumla",
          "Mukto",
          "Tawang",
          "Zemithang Dudunghar"
        ]
      },
      {
        "name": "Tirap",
        "taluks": [
          "Chubam",
          "Dadam",
          "Deomali",
          "Kanubari",
          "Kapu",
          "Khakam",
          "Khela",
          "Khonsa",
          "Laju",
          "Launu",
          "Longchun",
          "Longding",
          "Pongchau",
          "Pumao",
          "Soha",
          "Wakka"
        ]
      },
      {
        "name": "Upper Dibang Valley",
        "taluks": [
          "Anelih-arzoo",
          "Anini-mepi",
          "Etalin Malinye"
        ]
      },
      {
        "name": "Upper Siang",
        "taluks": [
          "Geku-katan",
          "Mariyang",
          "Tuting",
          "Yingkiong-jengging"
        ]
      },
      {
        "name": "Upper Subansiri",
        "taluks": [
          "Baririjo",
          "Chetam",
          "Chikom",
          "Daporijo-sigin I",
          "Daporijo-sigin Ii",
          "Dumporijo",
          "Giba",
          "Gusar",
          "Nacho",
          "Pate",
          "Siyum",
          "Taksing/limeking",
          "Taliha"
        ]
      },
      {
        "name": "West Kameng",
        "taluks": [
          "Bhalukpong-jamiri",
          "Dirang",
          "Jerigaon",
          "Kalaktang-balemu",
          "Nafra",
          "Rupa",
          "Singchung",
          "Thembang",
          "Thrizino"
        ]
      },
      {
        "name": "West Siang",
        "taluks": [
          "Along East Lower",
          "Along East Upper",
          "Along West Pubu-yombu",
          "Along West Pushi",
          "Along West Ubu",
          "Basar",
          "Darak Kamba",
          "Daring",
          "Gensi",
          "Jomlo Mobuk",
          "Kaying",
          "Likabali-kangku",
          "Liromoba-yomcha",
          "Manigong-pidi",
          "Mechuka-tato",
          "Payum",
          "Rumgong",
          "Tirbin"
        ]
      }
    ]
  },
  {
    "state": "Assam",
    "districts": [
      {
        "name": "Baksa",
        "taluks": [
          "Bajali(part)",
          "Baksa",
          "Barigog Bangbhag(part)",
          "Bihdia Jajikopna(part)",
          "Dham Dhama",
          "Gobardhana(part)",
          "Jalah(part)",
          "Nagrijulli",
          "Rangia(part)",
          "Tamulpur",
          "Tihu Barma",
          "Tihu(part)"
        ]
      },
      {
        "name": "Barpeta",
        "taluks": [
          "Bajali",
          "Barpeta",
          "Bhawanipur",
          "Chakchaka",
          "Chenga",
          "Gobardhana",
          "Gomaphulbari",
          "Jalah",
          "Mandia",
          "Pakabetbari",
          "Rupshi",
          "Sarukhetri"
        ]
      },
      {
        "name": "Bongaigaon",
        "taluks": [
          "Boitamari",
          "Borobazar(part)",
          "Dangtol",
          "Manikpur",
          "Sidhli Chirang Pt.(part)",
          "Srijangram",
          "Tapattary"
        ]
      },
      {
        "name": "Cachar",
        "taluks": [
          "Banskandi",
          "Barjalenga",
          "Binnakandi",
          "Borkhola",
          "Kalain",
          "Katigorah",
          "Lakhipur",
          "Narsingpur",
          "Palonghat",
          "Rajabazar",
          "Salchapra",
          "Silchar",
          "Sonai",
          "Tapang",
          "Udharbond"
        ]
      },
      {
        "name": "Chirang",
        "taluks": [
          "Borobazar",
          "Dangtola(part)",
          "Gobardhana(part)",
          "Kokrajhar(part)",
          "Manikpur(part)",
          "Sidli-chirang Part"
        ]
      },
      {
        "name": "Darrang",
        "taluks": [
          "Bechimari",
          "Bhergaon",
          "Dalgaon-sialmari",
          "Kalaigaon",
          "Kalaigaon (Pt)",
          "Khairabari",
          "Khairabari (Pt)",
          "Mazbat",
          "Pachim-mangaldai",
          "Pub-mangaldai",
          "Rowta",
          "Sipajhar",
          "Udalguri"
        ]
      },
      {
        "name": "Dhemaji",
        "taluks": [
          "Bordoloni",
          "Dhemaji",
          "Machkhowa",
          "Murkongselek",
          "Sissiborgaon"
        ]
      },
      {
        "name": "Dhubri",
        "taluks": [
          "Agomani",
          "Bilasipara",
          "Birsingjarua",
          "Chapar Salkocha",
          "Debitola",
          "Fekamari",
          "Gauripur",
          "Golakganj",
          "Jamadarhat",
          "Mahamaya",
          "Mankachar",
          "Nayeralga",
          "Rupsi",
          "South Salmara"
        ]
      },
      {
        "name": "Dibrugarh",
        "taluks": [
          "Borboruah",
          "Joypur",
          "Khowang",
          "Lahoal",
          "Panitola",
          "Tengakhat",
          "Tingkhong"
        ]
      },
      {
        "name": "Goalpara",
        "taluks": [
          "Balijana",
          "Dudhani",
          "Jaleswar",
          "Kharmuza",
          "Krishnai",
          "Kuchdhowa",
          "Lakhipur",
          "Matia"
        ]
      },
      {
        "name": "Golaghat",
        "taluks": [
          "Golaghat Central",
          "Golaghat East",
          "Golaghat North",
          "Golaghat South",
          "Golaghat West",
          "Gomariguri",
          "Kakodonga",
          "Morongi"
        ]
      },
      {
        "name": "Hailakandi",
        "taluks": [
          "Algapur",
          "Hailakandi",
          "Katlicherra",
          "Lala",
          "South Hailakandi"
        ]
      },
      {
        "name": "Jorhat",
        "taluks": [
          "Jorhat",
          "Jorhat Central",
          "Jorhat East",
          "Kaliapani",
          "Majuli",
          "North West Jorhat",
          "Titabor",
          "Ujani Majuli"
        ]
      },
      {
        "name": "Kamrup",
        "taluks": [
          "Bezera",
          "Bihdia",
          "Boko",
          "Bongaon",
          "Chamaria(pt.)",
          "Chandrapur",
          "Chayani",
          "Chhaygaon(pt.)",
          "Dimoria(pt.)",
          "Goreswar",
          "Goroimari",
          "Hajo",
          "Kamalpur(pt.)",
          "Rampur",
          "Rangia",
          "Rani",
          "Sualkuchi"
        ]
      },
      {
        "name": "Kamrup Metropolitan",
        "taluks": [
          "Bezera(part)",
          "Chandarpur",
          "Dimoria",
          "Rani(part)"
        ]
      },
      {
        "name": "Karbi-anglong",
        "taluks": [
          "Amri",
          "Bokajan",
          "Chinthong",
          "Howraghat",
          "Langsomepi",
          "Lumbajong",
          "Nilip",
          "Rongkhang",
          "Rongmongwe",
          "Samelangso",
          "Socheng"
        ]
      },
      {
        "name": "Karimganj",
        "taluks": [
          "Badarpur",
          "Dullavcherra",
          "Lowairpoa",
          "North Karimganj",
          "Patharkandi",
          "Ramkrishna Nagar",
          "South Karimganj"
        ]
      },
      {
        "name": "Kokrajhar",
        "taluks": [
          "Dotoma",
          "Gossaigaon",
          "Hati Dura",
          "Kachugaon",
          "Kokrajhar",
          "Sidli Chirang (Part)"
        ]
      },
      {
        "name": "Lakhimpur",
        "taluks": [
          "Bihpuria",
          "Boginadi",
          "Dhakuakhana",
          "Ghilamara",
          "Karunabari",
          "Lakhimpur",
          "Narayanpur",
          "Nowboicha",
          "Telahi"
        ]
      },
      {
        "name": "Marigoan",
        "taluks": [
          "Batabraba (Part)",
          "Bhurbandha",
          "Dolongghat (Part)",
          "Kapili",
          "Laharighat",
          "Mayang",
          "Moirabari"
        ]
      },
      {
        "name": "Nagaon",
        "taluks": [
          "Bajiagaon",
          "Barhampur",
          "Batadrava",
          "Binakandi",
          "Dhalpukhuri",
          "Dolongghat",
          "Jugijan",
          "Juria",
          "Kaliabor",
          "Kapili Pt.i",
          "Kathiatoli",
          "Khagarijan",
          "Laokhowa",
          "Lumding",
          "Moirabari Part",
          "Pachim Kaliabor",
          "Pakhimoria",
          "Raha",
          "Rupahi",
          "Udali"
        ]
      },
      {
        "name": "Nalbari",
        "taluks": [
          "Barama",
          "Barigog Banbhag",
          "Barkhetri",
          "Baska",
          "Borbhag",
          "Dhamdhama",
          "Madhupur",
          "Nagrijuli",
          "Paschim Nalbari",
          "Pub Nalbari",
          "Tamulpur",
          "Tihu"
        ]
      },
      {
        "name": "North Cachar Hills",
        "taluks": [
          "Diyang Valley",
          "Diyungbra",
          "Harangajao",
          "Jatinga Valley",
          "New Sangbar"
        ]
      },
      {
        "name": "Sivasagar",
        "taluks": [
          "Amguri",
          "Demow",
          "Gaurisagar",
          "Lakwa",
          "Nazira",
          "Sapekhati",
          "Sivasagar",
          "Sonari",
          "West Abhayapuri"
        ]
      },
      {
        "name": "Sonitpur",
        "taluks": [
          "Baghmara",
          "Balipara",
          "Behali",
          "Bihaguri",
          "Biswanath",
          "Borchala",
          "Chaiduar",
          "Dhekiajuli",
          "Gabhoru",
          "Naduar",
          "Pub Chaiduar",
          "Rangapara",
          "Sakomatha",
          "Sootea"
        ]
      },
      {
        "name": "Tinsukia",
        "taluks": [
          "Guijan",
          "Hapjan",
          "Itakhuli",
          "Kakopathar",
          "Margherita",
          "Sadiya",
          "Saikhowa"
        ]
      },
      {
        "name": "Udalguri",
        "taluks": [
          "Barchala(part)",
          "Bechim Ari(part)",
          "Bhergoan",
          "Kalaigaon(part)",
          "Khirabari",
          "Mazbat",
          "Pachim Mangaldai(part)",
          "Pub Mangaldai(part)",
          "Rowta",
          "Sipajhar(part)",
          "Udalguai"
        ]
      }
    ]
  },
  {
    "state": "Bihar",
    "districts": [
      {
        "name": "Araria",
        "taluks": [
          "Araria",
          "Bhargama",
          "Forbesganj",
          "Jokihat",
          "Kursakanta",
          "Narpatganj",
          "Palasi",
          "Raniganj",
          "Sikty"
        ]
      },
      {
        "name": "Arwal",
        "taluks": [
          "Arwal",
          "Kaler",
          "Kapri",
          "Kurtha",
          "Sonbhadra-bansi-surajpur"
        ]
      },
      {
        "name": "Aurangabad",
        "taluks": [
          "Aurangabad",
          "Barun",
          "Daudnagar",
          "Deo",
          "Goh",
          "Haspura",
          "Kutumba",
          "Madanpur",
          "Nabinagar",
          "Obra",
          "Rafiganj"
        ]
      },
      {
        "name": "Banka",
        "taluks": [
          "Amarpur",
          "Banka",
          "Barahat",
          "Bausi",
          "Belhar",
          "Chandan",
          "Dhuraiya",
          "Fullidumar",
          "Katoria",
          "Rajaun",
          "Shambhuganj"
        ]
      },
      {
        "name": "Begusarai",
        "taluks": [
          "Bachhwara",
          "Bakhri",
          "Ballia",
          "Barauni",
          "Begusarai",
          "Bhagwanpur",
          "Birpur",
          "Cheria Bariarpur",
          "Chhaurahi",
          "Dandari",
          "Gadhpura",
          "Khodawandpur",
          "Mansurchak",
          "Matihani",
          "Nawkothi",
          "Sahebpur Kamal",
          "Samho Akha Kurha",
          "Teghra"
        ]
      },
      {
        "name": "Bhagalpur",
        "taluks": [
          "Bihpur",
          "Colgong",
          "Gopalpur",
          "Goradih",
          "Ismailpur",
          "Jagdishpur",
          "Kharik",
          "Narayanpur",
          "Nathnagar",
          "Naugachhia",
          "Pirpainti",
          "Rangrachowk",
          "Sabour",
          "Shahkund",
          "Sonhaula",
          "Sultanganj"
        ]
      },
      {
        "name": "Bhojpur",
        "taluks": [
          "Agiaon",
          "Ara",
          "Barhara",
          "Behea",
          "Charpokhari",
          "Garhani",
          "Jagdishpur",
          "Koilwar",
          "Piro",
          "Sahar",
          "Sandesh",
          "Shahpur",
          "Tarari",
          "Udwantnagar"
        ]
      },
      {
        "name": "Buxar",
        "taluks": [
          "Brahmpur",
          "Buxar",
          "Chakki",
          "Chausa",
          "Chougain",
          "Dumraon",
          "Itarhi",
          "Kesath",
          "Nawanagar",
          "Rajpur",
          "Simri"
        ]
      },
      {
        "name": "Darbhanga",
        "taluks": [
          "Alinagar",
          "Bahadurpur",
          "Baheri",
          "Benipur",
          "Biraul",
          "Darbhanga",
          "Gaurabauram",
          "Ghanshyampur",
          "Hanuman Nagar",
          "Hayaghat",
          "Jale",
          "Keotirunway",
          "Kiratpur",
          "Kusheshwar Asthan",
          "Kusheswar Asthan East",
          "Manigachhi",
          "Singhwara",
          "Tardih"
        ]
      },
      {
        "name": "Gaya",
        "taluks": [
          "Amas",
          "Atri",
          "Bankey Bazar",
          "Barachatti",
          "Belaganj",
          "Bodhgaya",
          "Dobhi",
          "Dumaria",
          "Fatehpur",
          "Gaya Town",
          "Guraru",
          "Gurua",
          "Imamganj",
          "Khizarsarai",
          "Konch",
          "Manpur",
          "Mohanpur",
          "Mohra",
          "Neemchak Bathani",
          "Paraiya",
          "Sherghatty",
          "Tankuppa",
          "Tekari",
          "Wazirganj"
        ]
      },
      {
        "name": "Gopalganj",
        "taluks": [
          "Baikunthpur",
          "Barauli",
          "Bhorey",
          "Bijaipur",
          "Gopalganj",
          "Hathua",
          "Kataiya",
          "Kuchaikote",
          "Manjha",
          "Panchdeori",
          "Phulwariya",
          "Sidhwaliya",
          "Thawe",
          "Uchkagaon"
        ]
      },
      {
        "name": "Jamui",
        "taluks": [
          "Barhat",
          "Chakai",
          "Gidhor",
          "Islamnagar Aliganj",
          "Jamui",
          "Jhajha",
          "Khaira",
          "Laxmipur",
          "Sikandra",
          "Sono"
        ]
      },
      {
        "name": "Jehanabad",
        "taluks": [
          "Ghoshi",
          "Hulasganj",
          "Jehanabad",
          "Kako",
          "Makhdumpur",
          "Modanganj",
          "Ratni Faridpur"
        ]
      },
      {
        "name": "Kaimur",
        "taluks": [
          "Adhaura",
          "Bhabua",
          "Bhagwanpur",
          "Chainpur",
          "Chand",
          "Durgawati",
          "Kudra",
          "Mohania",
          "Nuaon",
          "Ramgarh",
          "Rampur"
        ]
      },
      {
        "name": "Katihar",
        "taluks": [
          "Amdabad",
          "Azamnagar",
          "Balrampur",
          "Barari",
          "Barsoi",
          "Dandkhora",
          "Falka",
          "Hasanganj",
          "Kadwa",
          "Katihar",
          "Korha",
          "Kursela",
          "Manihari",
          "Mansahi",
          "Pranpur",
          "Sameli"
        ]
      },
      {
        "name": "Khagaria",
        "taluks": [
          "Alauli",
          "Beldaur",
          "Chautham",
          "Gogri",
          "Khagaria",
          "Mansi",
          "Parbatta"
        ]
      },
      {
        "name": "Kishanganj",
        "taluks": [
          "Bahadurganj",
          "Dighalbank",
          "Kishanganj",
          "Kochadhaman",
          "Pothia",
          "Terhagachh",
          "Thakurganj"
        ]
      },
      {
        "name": "Lakhisaria",
        "taluks": [
          "Barahiya",
          "Channan",
          "Halsi",
          "Lakhisarai",
          "Pipariya",
          "Ramgarh Chowk",
          "Surajgarha"
        ]
      },
      {
        "name": "Madhepura",
        "taluks": [
          "Alamnagar",
          "Bihariganj",
          "Chausa",
          "Gamhariya",
          "Ghelarh",
          "Gwalpara",
          "Kumarkhand",
          "Madhepura",
          "Murliganj",
          "Purani",
          "Shankarpur",
          "Singheshwar",
          "Uda Kishanganj"
        ]
      },
      {
        "name": "Madhubani",
        "taluks": [
          "Andhratharhi",
          "Babu Barhi",
          "Basopatti",
          "Benipatti",
          "Bisfi",
          "Ghoghardiha",
          "Harlakhi",
          "Jainagar",
          "Jhanjharpur",
          "Kaluahi",
          "Khajauli",
          "Ladania",
          "Lakhnaur",
          "Laukaha (Khutauna)",
          "Laukahi",
          "Madhepur",
          "Madhubani",
          "Madhwapur",
          "Pandaul",
          "Phulparas",
          "Rajnagar"
        ]
      },
      {
        "name": "Munger",
        "taluks": [
          "Asarganj",
          "Bariyarpur",
          "Dharhara",
          "Jamalpur",
          "Kharagpur",
          "Munger Sadar",
          "Sangrampur",
          "Tarapur",
          "Tetiabambar"
        ]
      },
      {
        "name": "Muzaffarpur",
        "taluks": [
          "Aurai",
          "Bandra",
          "Bochahan",
          "Gaighat",
          "Kanti",
          "Katra",
          "Kurhani",
          "Marwan",
          "Minapur",
          "Motipur",
          "Muraul",
          "Mushahari",
          "Paroo",
          "Sahebganj",
          "Sakra",
          "Saraiya"
        ]
      },
      {
        "name": "Nalanda",
        "taluks": [
          "Asthawan",
          "Ben",
          "Biharsharif",
          "Bind",
          "Chandi",
          "Ekangarsarai",
          "Giriak",
          "Harnaut",
          "Hilsa",
          "Islampur",
          "Karai Parsurai",
          "Katrisarai",
          "Nagar Nausa",
          "Noorsarai",
          "Parbalpur",
          "Rahui",
          "Rajgir",
          "Sarmera",
          "Silao",
          "Tharthari"
        ]
      },
      {
        "name": "Nawadha",
        "taluks": [
          "Akbarpur",
          "Gobindpur",
          "Hisua",
          "Kashichak",
          "Kawakole",
          "Mescaur",
          "Nardiganj",
          "Narhat",
          "Nawada",
          "Pakri Barawan",
          "Rajauli",
          "Roh",
          "Sirdala",
          "Warisaliganj"
        ]
      },
      {
        "name": "Pashchim Champaran",
        "taluks": [
          "Bagaha-i",
          "Bagaha-ii",
          "Bairia",
          "Bettiah",
          "Bhitaha",
          "Chanpatia",
          "Gaunaha",
          "Jogapatti",
          "Lauriya",
          "Madhubani",
          "Mainatand",
          "Majhaulia",
          "Narkatiaganj",
          "Nautan",
          "Piprasi",
          "Ramnagar",
          "Sikta",
          "Thakrahan"
        ]
      },
      {
        "name": "Patna",
        "taluks": [
          "Athamalgola",
          "Bakhtiarpur",
          "Barh",
          "Belchchi",
          "Bihta",
          "Bikram",
          "Daniyawan",
          "Dhanarua",
          "Dinapur",
          "Dulhin Bazar",
          "Fatuha",
          "Ghoswari",
          "Khusrupur",
          "Maner",
          "Masaurhi",
          "Mokama",
          "Naubatpur",
          "Paliganj",
          "Pandarak",
          "Patna Sadar",
          "Phulwari",
          "Punpun",
          "Sampatchak"
        ]
      },
      {
        "name": "Purba Champaran",
        "taluks": [
          "Adapur",
          "Areraj",
          "Banjariya",
          "Bankatwa",
          "Chakia (Pipra)",
          "Chawradano",
          "Chiraiya",
          "Dhaka",
          "Ghorasahan",
          "Harsidhi",
          "Kalyanpur",
          "Kesaria",
          "Kotwa",
          "Madhuban",
          "Mehsi",
          "Motihari",
          "Paharpur",
          "Pakridayal",
          "Patahi",
          "Phenhara",
          "Pipra Kothi",
          "Ramgarhwa",
          "Raxaul",
          "Sangrampur",
          "Sugauli",
          "Tetariya",
          "Turkaulia"
        ]
      },
      {
        "name": "Purnea",
        "taluks": [
          "Amour",
          "Baisa",
          "Baisi",
          "Banmankhi",
          "Barhara",
          "Bhawanipur",
          "Dagraua",
          "Dhamdaha",
          "Jalalgarh",
          "Kasba",
          "Krityanand Nagar",
          "Purnia East",
          "Rupouli",
          "Srinagar"
        ]
      },
      {
        "name": "Rohtas",
        "taluks": [
          "Akhorigola",
          "Bikramganj",
          "Chenari",
          "Dawath",
          "Dehri",
          "Dinara",
          "Karakat",
          "Kargahar",
          "Kochas",
          "Nasriganj",
          "Nawhatta",
          "Nokha",
          "Rajpur",
          "Rohtas",
          "Sanjhouli",
          "Sasaram",
          "Sheosagar",
          "Surajpura",
          "Tilouthu"
        ]
      },
      {
        "name": "Saharsa",
        "taluks": [
          "Banma Itahari",
          "Kahara",
          "Mahishi",
          "Nauhatta",
          "Patarghat",
          "Salkhua",
          "Sattar Kattaiya",
          "Simri Bakhtiarpur",
          "Sonbarsa",
          "Sour Bazar"
        ]
      },
      {
        "name": "Samastipur",
        "taluks": [
          "Bibhutpur",
          "Bithan",
          "Dalsinghsarai",
          "Hasanpur",
          "Kalyanpur",
          "Khanpur",
          "Mohanpur",
          "Mohiuddinagar",
          "Morwa",
          "Patori",
          "Pusa",
          "Rosera",
          "Samastipur",
          "Sarairanjan",
          "Shivaji Nagar",
          "Singhia",
          "Tajpur",
          "Ujiarpur",
          "Vidyapati Nagar",
          "Warisnagar"
        ]
      },
      {
        "name": "Saran",
        "taluks": [
          "Amnour",
          "Baniapur",
          "Chhapra",
          "Dariapur",
          "Dighwara",
          "Ekma",
          "Garkha",
          "Isuapur",
          "Jalalpur",
          "Lahladpur",
          "Maker",
          "Manjhi",
          "Marhaurah",
          "Mashrakh",
          "Nagra",
          "Panapur",
          "Parsa",
          "Revelganj",
          "Sonepur",
          "Taraiya"
        ]
      },
      {
        "name": "Shekhpura",
        "taluks": [
          "Ariari",
          "Barbigha",
          "Chewara",
          "Ghat Kusumbha",
          "Sheikhopur Sarai",
          "Sheikhpura"
        ]
      },
      {
        "name": "Sheohar",
        "taluks": [
          "Dumari Katsari",
          "Piprahi",
          "Purnahiya",
          "Sheohar",
          "Tariyani"
        ]
      },
      {
        "name": "Sitamarhi",
        "taluks": [
          "Bairgania",
          "Bajpatti",
          "Bathanaha",
          "Belsand",
          "Bokhra",
          "Choraut",
          "Dumra",
          "Majorganj",
          "Nanpur",
          "Parihar",
          "Parsauni",
          "Pupri",
          "Riga",
          "Runnisaidpur",
          "Sitamarhi",
          "Sonbarsa",
          "Suppi",
          "Sursand"
        ]
      },
      {
        "name": "Siwan",
        "taluks": [
          "Andar",
          "Barharia",
          "Basantpur",
          "Bhagwanpur Hat",
          "Darauli",
          "Daraundha",
          "Goriakothi",
          "Guthani",
          "Hasan Pura",
          "Hussainganj",
          "Lakri Nabiganj",
          "Maharajganj",
          "Mairwa",
          "Nautan",
          "Pachrukhi",
          "Raghunathpur",
          "Siswan",
          "Siwan",
          "Ziradei"
        ]
      },
      {
        "name": "Supaul",
        "taluks": [
          "Basantpur",
          "Chhatapur",
          "Kishanpur",
          "Marauna",
          "Nirmali",
          "Pipra",
          "Pratapganj",
          "Raghopur",
          "Saraigarh Bhaptiyahi",
          "Supaul",
          "Tribeniganj"
        ]
      },
      {
        "name": "Vaishali",
        "taluks": [
          "Bhagwanpur",
          "Bidupur",
          "Chehrakala",
          "Desri",
          "Garaul",
          "Hajipur",
          "Jandaha",
          "Lalganj",
          "Mahnar",
          "Mahua",
          "Patedhi Belsar",
          "Patepur",
          "Raghopur",
          "Rajapakar",
          "Sahdei Buzurg",
          "Vaishali"
        ]
      }
    ]
  },
  {
    "state": "Chandigarh",
    "districts": [
      {
        "name": "Chandigarh",
        "taluks": [
          "Chandigarh"
        ]
      }
    ]
  },
  {
    "state": "Chhattisgarh",
    "districts": [
      {
        "name": "Balod",
        "taluks": [
          "Balod",
          "Dondi",
          "Dondilohara",
          "Gunderdehi",
          "Gurur"
        ]
      },
      {
        "name": "Balodabazar",
        "taluks": [
          "Baloda Bazar",
          "Bhatapara",
          "Bilaigarh",
          "Kasdol",
          "Palari",
          "Simga"
        ]
      },
      {
        "name": "Balrampur",
        "taluks": [
          "Balrampur",
          "Kusmi",
          "Rajpur",
          "Ramchandrapur",
          "Shankargarh",
          "Wadrafnagar"
        ]
      },
      {
        "name": "Bastar",
        "taluks": [
          "Bakawand",
          "Bastanar",
          "Bastar",
          "Darbha",
          "Jagdalpur",
          "Lohandiguda",
          "Tokapal"
        ]
      },
      {
        "name": "Bemetara",
        "taluks": [
          "Bemetara",
          "Berla",
          "Nawagarh",
          "Saja"
        ]
      },
      {
        "name": "Bijapur",
        "taluks": [
          "Bhairamgarh",
          "Bhopal Patnam",
          "Bijapur",
          "Usoor"
        ]
      },
      {
        "name": "Bilaspur",
        "taluks": [
          "Belha",
          "Gaurella-1",
          "Gaurella-2 (Pendra)",
          "Kota",
          "Marwahi",
          "Masturi",
          "Takhatpur"
        ]
      },
      {
        "name": "Dakshin Bastar Dantewada",
        "taluks": [
          "Dantewada",
          "Geedam",
          "Katekalyan",
          "Kuwakonda"
        ]
      },
      {
        "name": "Dantewara",
        "taluks": [
          "Dantewara"
        ]
      },
      {
        "name": "Dhamtari",
        "taluks": [
          "Dhamtari",
          "Kurud",
          "Magarlod",
          "Nagari"
        ]
      },
      {
        "name": "Durg",
        "taluks": [
          "Dhamdha",
          "Dondilohara",
          "Durg",
          "Patan"
        ]
      },
      {
        "name": "Gariyaband",
        "taluks": [
          "Chhurra",
          "Deobhog",
          "Fingeshwar",
          "Gariyaband",
          "Mainpur"
        ]
      },
      {
        "name": "Jagdalpur",
        "taluks": [
          "Jagdalpur"
        ]
      },
      {
        "name": "Janjgir-champa",
        "taluks": [
          "Akaltara",
          "Baloda",
          "Bamhindih",
          "Dabhara",
          "Jaijaipur",
          "Malkharoda",
          "Nawagarh",
          "Pamgarh",
          "Sakti"
        ]
      },
      {
        "name": "Jashpur",
        "taluks": [
          "Bagicha",
          "Duldula",
          "Jashpur",
          "Kansabel",
          "Kunkuri",
          "Manora",
          "Patthalgaon",
          "Pharsabahar"
        ]
      },
      {
        "name": "Kabeerdham",
        "taluks": [
          "Bodla",
          "Kawardha",
          "Pandariya",
          "S.lohara"
        ]
      },
      {
        "name": "Karwardha",
        "taluks": [
          "Karwardha"
        ]
      },
      {
        "name": "Kondagaon",
        "taluks": [
          "Baderajpur",
          "Keshkal",
          "Kondagaon",
          "Makdi",
          "Pharasgon"
        ]
      },
      {
        "name": "Korba",
        "taluks": [
          "Kartala",
          "Katghora",
          "Korba",
          "Pali",
          "Podi Uparoda"
        ]
      },
      {
        "name": "Koriya",
        "taluks": [
          "Baikunthpur",
          "Bharatpur",
          "Khadgawana",
          "Manendragarh",
          "Sonhat"
        ]
      },
      {
        "name": "Mahasamund",
        "taluks": [
          "Bagbahara",
          "Basna",
          "Mahasamund",
          "Pithora",
          "Saraipali"
        ]
      },
      {
        "name": "Mungeli",
        "taluks": [
          "Lormi",
          "Mungeli",
          "Pathariya"
        ]
      },
      {
        "name": "Narayanpur",
        "taluks": [
          "Narayanpur",
          "Orchha(abhujmad)"
        ]
      },
      {
        "name": "Raigarh",
        "taluks": [
          "Baramkela",
          "Dharamjaigarh",
          "Gharghoda",
          "Kharsia",
          "Lailunga",
          "Pussore",
          "Raigarh",
          "Sarangarh",
          "Tamnar"
        ]
      },
      {
        "name": "Raipur",
        "taluks": [
          "Abhanpur",
          "Arang",
          "Dharsiwa",
          "Tilda"
        ]
      },
      {
        "name": "Raj Nandgaon",
        "taluks": [
          "A.chowki (Td)",
          "Chhuikhadan",
          "Chhuriya",
          "Dongargaon",
          "Dongarghar",
          "Khairagarh",
          "Manpur (Td)",
          "Mohala (Td)",
          "Rajnandgaon"
        ]
      },
      {
        "name": "Sukma",
        "taluks": [
          "Chhindgarh",
          "Konta",
          "Sukma"
        ]
      },
      {
        "name": "Surajpur",
        "taluks": [
          "Bhaiyathan",
          "Odagi",
          "Pratappur",
          "Premnagar",
          "Ramanujnagar",
          "Surajpur"
        ]
      },
      {
        "name": "Surguja",
        "taluks": [
          "Ambikapur",
          "Batauli",
          "Lakhanpur",
          "Lundra",
          "Mainpat",
          "Sitapur",
          "Udaipur"
        ]
      },
      {
        "name": "Uttar Bastar Kanker",
        "taluks": [
          "Antagarh",
          "Bhanupratappur",
          "Charama",
          "Durgukondal",
          "Kanker",
          "Koilebeda",
          "Narharpur"
        ]
      }
    ]
  },
  {
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "districts": [
      {
        "name": "Dadra And Nagar Haveli",
        "taluks": [
          "Dadra Nagar Haveli"
        ]
      },
      {
        "name": "Daman",
        "taluks": [
          "Daman"
        ]
      },
      {
        "name": "Diu",
        "taluks": [
          "Diu"
        ]
      }
    ]
  },
  {
    "state": "Delhi",
    "districts": [
      {
        "name": "Central Delhi (Daryaganj)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "East Delhi (preet Vihar)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "New Delhi (connaught Place)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "North Delhi (Narela)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "North East Delhi (Seelampur)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "North West Delhi (Kanjhawala)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "Shahdara",
        "taluks": [
          "Shahdara"
        ]
      },
      {
        "name": "South Delhi (Saket)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "South East Delhi (defence Colony)",
        "taluks": [
          "South East Delhi (defence Colony)"
        ]
      },
      {
        "name": "South West Delhi (Dwarka)",
        "taluks": [
          "Delhi"
        ]
      },
      {
        "name": "West Delhi (rajouri Garden)",
        "taluks": [
          "Delhi"
        ]
      }
    ]
  },
  {
    "state": "Goa",
    "districts": [
      {
        "name": "Goa North",
        "taluks": [
          "Bardez",
          "Bicholim",
          "Pernem",
          "Ponda",
          "Satari",
          "Tiswadi"
        ]
      },
      {
        "name": "Goa South",
        "taluks": [
          "Canacona",
          "Mormugao",
          "Quepem",
          "Salcete",
          "Sanguem"
        ]
      }
    ]
  },
  {
    "state": "Gujarat",
    "districts": [
      {
        "name": "Ahmadabad",
        "taluks": [
          "Ahmadabad City",
          "Bavla",
          "Daskroi",
          "Detroj Rampura",
          "Dhandhuka",
          "Dholka",
          "Mandal",
          "Sanand",
          "Viramgam"
        ]
      },
      {
        "name": "Amreli",
        "taluks": [
          "Amreli",
          "Babra",
          "Bagasara",
          "Dhari",
          "Jafrabad",
          "Khambha",
          "Kunkavav -vadia",
          "Lathi",
          "Lilia",
          "Rajula",
          "Saverkundla"
        ]
      },
      {
        "name": "Anand",
        "taluks": [
          "Anand",
          "Anklav",
          "Borsad",
          "Khambhat",
          "Petlad",
          "Sojitra",
          "Tarapur",
          "Umreth"
        ]
      },
      {
        "name": "Aravalli",
        "taluks": [
          "Bayad",
          "Bhiloda",
          "Dhansura",
          "Malpur",
          "Meghraj",
          "Modasa"
        ]
      },
      {
        "name": "Banas Kantha",
        "taluks": [
          "Amirgadh",
          "Bhabhar",
          "Danta",
          "Dantivada",
          "Deesa",
          "Deodar",
          "Dhanera",
          "Kankrej",
          "Palanpur",
          "Tharad",
          "Vadgam",
          "Vav"
        ]
      },
      {
        "name": "Bharuch",
        "taluks": [
          "Amod",
          "Anklesvar",
          "Bharuch",
          "Hansot",
          "Jambusar",
          "Jhagadia",
          "Vagra",
          "Valia"
        ]
      },
      {
        "name": "Bhavnagar",
        "taluks": [
          "Bhavnagar",
          "Gariadhar",
          "Ghogha",
          "Mahuva",
          "Palitana",
          "Sihor",
          "Talaja",
          "Umrala",
          "Vallabhipur"
        ]
      },
      {
        "name": "Botad",
        "taluks": [
          "Barvala",
          "Botad",
          "Ranpur"
        ]
      },
      {
        "name": "Chhota Udaipur",
        "taluks": [
          "Bodeli",
          "Chhota Udepur",
          "Jetpur Pavi",
          "Kawant",
          "Naswadi",
          "Sankheda"
        ]
      },
      {
        "name": "Dahod",
        "taluks": [
          "Dahod",
          "Devgad Bariya",
          "Dhanpur",
          "Fatepura",
          "Garbada",
          "Jhalod",
          "Limkheda"
        ]
      },
      {
        "name": "Dang",
        "taluks": [
          "Ahwa"
        ]
      },
      {
        "name": "Devbhoomi Dwarka",
        "taluks": [
          "Bhanvad",
          "Dwarka",
          "Kalyanpur",
          "Khambhalia"
        ]
      },
      {
        "name": "Gandhinagar",
        "taluks": [
          "Dehgam",
          "Gandhinagar",
          "Kalol",
          "Mansa"
        ]
      },
      {
        "name": "Gir Somnath",
        "taluks": [
          "Gadhada",
          "Kodinar",
          "Patan Veraval",
          "Talala",
          "Una"
        ]
      },
      {
        "name": "Jamnagar",
        "taluks": [
          "Dhrol",
          "Jamjodhpur",
          "Jamnagar",
          "Jodiya",
          "Kalavad",
          "Lalpur",
          "Okhamandal"
        ]
      },
      {
        "name": "Junagadh",
        "taluks": [
          "Bhesan",
          "Junagadh",
          "Keshod",
          "Malia",
          "Manavadar",
          "Mangrol",
          "Mendarda",
          "Sutrapada",
          "Vanthali",
          "Visavadar"
        ]
      },
      {
        "name": "Kachchh",
        "taluks": [
          "Abdasa",
          "Anjar",
          "Bhachau",
          "Bhuj",
          "Gandhidham",
          "Lakhpat",
          "Mandvi",
          "Mundra",
          "Nakhatrana",
          "Rapar"
        ]
      },
      {
        "name": "Kheda",
        "taluks": [
          "Kapadvanj",
          "Kathlal",
          "Kheda",
          "Mahudha",
          "Matar",
          "Mehmedabad",
          "Nadiad",
          "Thasra"
        ]
      },
      {
        "name": "Mahisagar",
        "taluks": [
          "Balasinor",
          "Kadana",
          "Khanpur",
          "Lunawada",
          "Santrampur",
          "Virpur"
        ]
      },
      {
        "name": "Mehsana",
        "taluks": [
          "Bechraji",
          "Kadi",
          "Kheralu",
          "Mahesana",
          "Satlasna",
          "Unjha",
          "Vadnagar",
          "Vijapur",
          "Visnagar"
        ]
      },
      {
        "name": "Morbi",
        "taluks": [
          "Halvad",
          "Maliya",
          "Morvi",
          "Tankara",
          "Wankaner"
        ]
      },
      {
        "name": "Narmada",
        "taluks": [
          "Dediyapada",
          "Nandod",
          "Sagbara",
          "Tilakwada"
        ]
      },
      {
        "name": "Navsari",
        "taluks": [
          "Chikhali",
          "Gandevi",
          "Jalalpore",
          "Navsari",
          "Vansda"
        ]
      },
      {
        "name": "Panch Mahal",
        "taluks": [
          "Ghoghamba",
          "Godhra",
          "Halol",
          "Jambughoda",
          "Kalol",
          "Morvahadaf",
          "Shehera"
        ]
      },
      {
        "name": "Patan",
        "taluks": [
          "Chanasma",
          "Harij",
          "Patan",
          "Radhanpur",
          "Sami",
          "Santalpur",
          "Sidhpur"
        ]
      },
      {
        "name": "Porbandar",
        "taluks": [
          "Kutiyana",
          "Porbandar",
          "Ranavav"
        ]
      },
      {
        "name": "Rajkot",
        "taluks": [
          "Dhoraji",
          "Gondal",
          "Jamkandorna",
          "Jasdan",
          "Jetpur",
          "Kotda Sangani",
          "Lodhika",
          "Paddhari",
          "Rajkot",
          "Upleta"
        ]
      },
      {
        "name": "Sabarkantha",
        "taluks": [
          "Himatnagar",
          "Idar",
          "Khedbrahma",
          "Prantij",
          "Talod",
          "Vadali",
          "Vijaynagar"
        ]
      },
      {
        "name": "Surat",
        "taluks": [
          "Bardoli",
          "Chorasi",
          "Kamrej",
          "Mandvi",
          "Mangrol",
          "Olpad",
          "Suratcity",
          "Umarpada"
        ]
      },
      {
        "name": "Surendranagar",
        "taluks": [
          "Chotila",
          "Chuda",
          "Dasada",
          "Dhrangadhra",
          "Lakhtar",
          "Limbdi",
          "Muli",
          "Sayla",
          "Wadhwan"
        ]
      },
      {
        "name": "Tapi",
        "taluks": [
          "Mahuva",
          "Nizar",
          "Palsana",
          "Songadh",
          "Utchhal",
          "Valod",
          "Vyara"
        ]
      },
      {
        "name": "Vadodara",
        "taluks": [
          "Dabhoi",
          "Karjan",
          "Padra",
          "Savli",
          "Shinor",
          "Vadodara(city And Rural)",
          "Waghodia"
        ]
      },
      {
        "name": "Valsad",
        "taluks": [
          "Dharampur",
          "Kaprada",
          "Pardi",
          "Umbergaon",
          "Valsad"
        ]
      }
    ]
  },
  {
    "state": "Haryana",
    "districts": [
      {
        "name": "Ambala",
        "taluks": [
          "Ambala-i",
          "Ambala-ii",
          "Barara",
          "Naraingarh",
          "Saha",
          "Shahzadpur"
        ]
      },
      {
        "name": "Bhiwani",
        "taluks": [
          "Badhra",
          "Bawani Khera",
          "Behal",
          "Bhiwani",
          "Dadri-i",
          "Dadri-ii",
          "Kairu",
          "Loharu",
          "Siwani",
          "Tosham"
        ]
      },
      {
        "name": "Faridabad",
        "taluks": [
          "Ballabgarh",
          "Faridabad"
        ]
      },
      {
        "name": "Fatehabad",
        "taluks": [
          "Bhattu Kalan",
          "Bhuna",
          "Fatehabad",
          "Jakhal",
          "Ratia",
          "Tohana"
        ]
      },
      {
        "name": "Gurgaon",
        "taluks": [
          "Farrukh Nagar",
          "Gurgaon",
          "Pataudi",
          "Sohna"
        ]
      },
      {
        "name": "Hissar",
        "taluks": [
          "Adampur",
          "Agroha",
          "Barwala",
          "Hansi-i",
          "Hansi-ii",
          "Hisar-i",
          "Hisar-ii",
          "Narnaund",
          "Uklana"
        ]
      },
      {
        "name": "Jhajjar",
        "taluks": [
          "Bahadurgarh",
          "Beri",
          "Jhajjar",
          "Matannail",
          "Salhawas"
        ]
      },
      {
        "name": "Jind",
        "taluks": [
          "Alewa",
          "Jind",
          "Julana",
          "Narwana",
          "Pillukhera",
          "Safidon",
          "Uchana"
        ]
      },
      {
        "name": "Kaithal",
        "taluks": [
          "Guhla",
          "Kaithal",
          "Kalayat",
          "Pundri",
          "Rajound",
          "Siwan"
        ]
      },
      {
        "name": "Karnal",
        "taluks": [
          "Assandh",
          "Gharaunda (Part)",
          "Indri",
          "Karnal",
          "Nilokheri",
          "Nissing At Chirao"
        ]
      },
      {
        "name": "Kurkshetra",
        "taluks": [
          "Babain",
          "Ladwa",
          "Pehowa",
          "Shahbad",
          "Thanesar"
        ]
      },
      {
        "name": "Mahendra Garh",
        "taluks": [
          "Ateli Nangal",
          "Kanina",
          "Mahendragarh",
          "Nangal Chaudhry",
          "Narnaul"
        ]
      },
      {
        "name": "Mewat",
        "taluks": [
          "Ferozepur Jhirka",
          "Nagina",
          "Nuh",
          "Punahana",
          "Taoru"
        ]
      },
      {
        "name": "Palwal",
        "taluks": [
          "Hassanpur",
          "Hathin",
          "Hodal",
          "Palwal"
        ]
      },
      {
        "name": "Panchkula",
        "taluks": [
          "Barwala",
          "Morni",
          "Pinjore",
          "Raipur Rani"
        ]
      },
      {
        "name": "Panipat",
        "taluks": [
          "Bapoli",
          "Israna",
          "Madlauda",
          "Panipat",
          "Samalkha"
        ]
      },
      {
        "name": "Rewari",
        "taluks": [
          "Bawal",
          "Jatusana",
          "Khol At Rewari",
          "Nahar",
          "Rewari"
        ]
      },
      {
        "name": "Rohtak",
        "taluks": [
          "Kalanaur",
          "Lakhan Majra",
          "Maham",
          "Rohtak",
          "Sampla"
        ]
      },
      {
        "name": "Sirsa",
        "taluks": [
          "Baragudha",
          "Dabwali",
          "Ellenabad",
          "Nathusari Chopta",
          "Odhan",
          "Rania",
          "Sirsa"
        ]
      },
      {
        "name": "Sonepat",
        "taluks": [
          "Ganaur",
          "Gohana",
          "Kathura",
          "Kharkhoda",
          "Mundlana",
          "Rai",
          "Sonipat"
        ]
      },
      {
        "name": "Yamuna Nagar",
        "taluks": [
          "Bilaspur",
          "Chhachhrauli",
          "Jagadhri",
          "Mustafabad",
          "Radaur",
          "Sadaura (Part)"
        ]
      }
    ]
  },
  {
    "state": "Himachal Pradesh",
    "districts": [
      {
        "name": "Bilaspur",
        "taluks": [
          "Bilaspur Sadar",
          "Gehrwin",
          "Ghumarwin",
          "Sri Naina Devi Ji"
        ]
      },
      {
        "name": "Chamba",
        "taluks": [
          "Bharmour",
          "Bhattiyat",
          "Chamba",
          "Mehla",
          "Pangi",
          "Saluni",
          "Tisa"
        ]
      },
      {
        "name": "Hamirpur",
        "taluks": [
          "Bamson",
          "Bhoranj",
          "Bijhri",
          "Hamirpur",
          "Nadaun",
          "Tira Sujanpur"
        ]
      },
      {
        "name": "Kangra",
        "taluks": [
          "Baijnath",
          "Bhawarna",
          "Dehra Gopipur",
          "Dharamshala",
          "Fatehpur",
          "Indora",
          "Kangra",
          "Lambagaon",
          "Nagrota Bagwan",
          "Nagrota Surian",
          "Nurpur",
          "Panchrukhi",
          "Pragpur",
          "Rait",
          "Sulah"
        ]
      },
      {
        "name": "Kinnaur",
        "taluks": [
          "Kalpa",
          "Nichar",
          "Pooh"
        ]
      },
      {
        "name": "Kullu",
        "taluks": [
          "Anni",
          "Banjar",
          "Kullu",
          "Naggar",
          "Nirmand"
        ]
      },
      {
        "name": "Lahul And Spiti",
        "taluks": [
          "Lahul",
          "Spiti"
        ]
      },
      {
        "name": "Mandi",
        "taluks": [
          "Balh",
          "Chauntra",
          "Dharmpur",
          "Drang",
          "Gohar",
          "Gopalpur",
          "Karsog",
          "Mandi Sadar",
          "Seraj",
          "Sundarnagar"
        ]
      },
      {
        "name": "Shimla",
        "taluks": [
          "Basantpur",
          "Chauhara",
          "Chaupal",
          "Jubbal Kotkhai",
          "Mashobra",
          "Nankhari",
          "Narkanda",
          "Rampur",
          "Rohru",
          "Theog"
        ]
      },
      {
        "name": "Sirmaur",
        "taluks": [
          "Nahan",
          "Pachhad",
          "Paonta Sahib",
          "Rajgarh",
          "Sangrah",
          "Shillai"
        ]
      },
      {
        "name": "Solan",
        "taluks": [
          "Dharampur",
          "Kandaghat",
          "Kunihar",
          "Nalagarh",
          "Solan"
        ]
      },
      {
        "name": "Una",
        "taluks": [
          "Amb",
          "Bangana",
          "Gagret",
          "Haroli",
          "Una"
        ]
      }
    ]
  },
  {
    "state": "Jammu and Kashmir",
    "districts": [
      {
        "name": "Anantnag",
        "taluks": [
          "Achabal",
          "Assar",
          "Breng",
          "Dachnipora",
          "Dhpora",
          "Khoveripora",
          "Koviripora",
          "Qaimoh",
          "Qazigund",
          "Shahabad",
          "Shangus"
        ]
      },
      {
        "name": "Badgam",
        "taluks": [
          "B.k.pora",
          "Badgam",
          "Beerwah",
          "Budgam",
          "Chadoora",
          "Khag",
          "Khan-sahib",
          "Nagam",
          "Narbal"
        ]
      },
      {
        "name": "Bandipore",
        "taluks": [
          "Bandipora",
          "Gurez",
          "Hajin",
          "Sumbal",
          "Tulsipur"
        ]
      },
      {
        "name": "Baramulla",
        "taluks": [
          "Baramulla",
          "Boniyar",
          "Kunzer",
          "Pattan",
          "Rafiabad",
          "Rohama",
          "Singhpora",
          "Sopore",
          "Tangmarg",
          "Uri",
          "Wagoora",
          "Zaingeer"
        ]
      },
      {
        "name": "Doda",
        "taluks": [
          "Bhaderwah",
          "Bhagwah",
          "Bhalessa(gandoh)",
          "Doda",
          "Gundana",
          "Marmat",
          "Ramsoo",
          "Thathri"
        ]
      },
      {
        "name": "Ganderbal",
        "taluks": [
          "Ganderbal",
          "Kangan",
          "Lar",
          "Wakura"
        ]
      },
      {
        "name": "Jammu",
        "taluks": [
          "Akhnoor",
          "Bhalwal",
          "Bishnah",
          "Dansal",
          "Khour",
          "Marh",
          "R.s.pura",
          "Satwari"
        ]
      },
      {
        "name": "Kargil",
        "taluks": [
          "Drass",
          "G.m.pore",
          "Kargil",
          "Lungnuk",
          "Sankoo",
          "Shakar-chiktan",
          "Shargole",
          "Taisuru",
          "Zanskar"
        ]
      },
      {
        "name": "Kathua",
        "taluks": [
          "Bani",
          "Barnoti",
          "Basohli",
          "Billawar",
          "Duggan",
          "Ghagwal",
          "Hiranagar",
          "Kathua",
          "Lohai-malhar"
        ]
      },
      {
        "name": "Kishtwar",
        "taluks": [
          "Dachan",
          "Drabshalla",
          "Inderwal",
          "Kishtwar",
          "Marwah",
          "Nagbani",
          "Padder",
          "Warwan"
        ]
      },
      {
        "name": "Kulgam",
        "taluks": [
          "D.h.pora",
          "Devsar",
          "Kulgam",
          "Pahloo",
          "Quimoh"
        ]
      },
      {
        "name": "Kupwara",
        "taluks": [
          "Kalarooch",
          "Kralpora",
          "Kupwara",
          "Langate",
          "Rajwar",
          "Ramhal",
          "Sogam",
          "Tangdar",
          "Teetwal",
          "Trehgam",
          "Wavoora"
        ]
      },
      {
        "name": "Leh",
        "taluks": [
          "Chuchot",
          "Durbuk",
          "Kahru",
          "Khaltsi",
          "Kharu",
          "Leh",
          "Nubra",
          "Nyoma",
          "Panamic",
          "Suspol"
        ]
      },
      {
        "name": "Pulwama",
        "taluks": [
          "Kakapora",
          "Keller",
          "Pampore",
          "Pulwama",
          "Tral"
        ]
      },
      {
        "name": "Punch",
        "taluks": [
          "Balakote",
          "Bufliaz",
          "Mandi",
          "Mendhar",
          "Poonch",
          "Surankote"
        ]
      },
      {
        "name": "Rajouri",
        "taluks": [
          "Budhal",
          "Darhal",
          "Kalakote",
          "Manjakote",
          "Nowshera",
          "Rajouri",
          "Sunderbani"
        ]
      },
      {
        "name": "Ramban",
        "taluks": [
          "Banihal",
          "Gool",
          "Okheral",
          "Ramban"
        ]
      },
      {
        "name": "Reasi",
        "taluks": [
          "Arnas",
          "Mahore",
          "Pouni",
          "Reasi"
        ]
      },
      {
        "name": "Samba",
        "taluks": [
          "Gagwal",
          "Purmandal",
          "Samba",
          "Vijaypur"
        ]
      },
      {
        "name": "Shupiyan",
        "taluks": [
          "Shopian"
        ]
      },
      {
        "name": "Srinagar",
        "taluks": [
          "Srinagar"
        ]
      },
      {
        "name": "Udhampur",
        "taluks": [
          "Chenani",
          "Dudu",
          "Ghordi",
          "Majalta",
          "Panchrai",
          "Ramnagar",
          "Udhampur"
        ]
      }
    ]
  },
  {
    "state": "Jharkhand",
    "districts": [
      {
        "name": "Bokaro",
        "taluks": [
          "Bermo",
          "Chandankiyari",
          "Chandrapura",
          "Chas",
          "Gomia",
          "Jaridih",
          "Kasmar",
          "Nawadih",
          "Peterwar"
        ]
      },
      {
        "name": "Chatra",
        "taluks": [
          "Chatra",
          "Giddhor",
          "Hunterganj",
          "Itkhori",
          "Kanhachatti",
          "Kunda",
          "Lawalong",
          "Mayurhund",
          "Pathalgada",
          "Pratappur",
          "Simaria",
          "Tandwa"
        ]
      },
      {
        "name": "Deoghar",
        "taluks": [
          "Deoghar",
          "Devipur",
          "Karown",
          "Madhupur",
          "Margo Munda",
          "Mohanpur",
          "Palojori",
          "Sarath",
          "Sarwan",
          "Sonaraithari"
        ]
      },
      {
        "name": "Dhanbad",
        "taluks": [
          "Baghmara",
          "Baliapur",
          "Dhanbad",
          "East Tundi",
          "Govindpur",
          "Jharia",
          "Nirsa",
          "Topchanchi",
          "Tundi"
        ]
      },
      {
        "name": "Dumka",
        "taluks": [
          "Dumka",
          "Gopikander",
          "Jama",
          "Jarmundi",
          "Kathikund",
          "Masaliya",
          "Ramgarh",
          "Ranishwar",
          "Saraiyahat",
          "Sikaripara"
        ]
      },
      {
        "name": "East Singhbhum",
        "taluks": [
          "Bahragora",
          "Boram",
          "Chakulia",
          "Dhalbhumgarh",
          "Dumaria",
          "Ghatshila",
          "Golmuri Cum Jugsalai",
          "Gorabanda",
          "Musabani",
          "Patamda",
          "Potka"
        ]
      },
      {
        "name": "Garhwa",
        "taluks": [
          "Bardiha",
          "Bhandaria",
          "Bhawnathpur",
          "Bisunpura",
          "Chinia",
          "Danda",
          "Dandai",
          "Dhurki",
          "Garhwa",
          "Kandi",
          "Ketar",
          "Kharaundhi",
          "Manjhiaon",
          "Meral",
          "Nagar Untari",
          "Ramkanda",
          "Ramna",
          "Ranka",
          "Sangma"
        ]
      },
      {
        "name": "Giridih",
        "taluks": [
          "Bagodar",
          "Bengabad",
          "Birni",
          "Deori",
          "Dhanwar",
          "Dumri",
          "Gandey",
          "Gawan",
          "Giridih",
          "Jamua",
          "Pirtand",
          "Sariya",
          "Tisri"
        ]
      },
      {
        "name": "Godda",
        "taluks": [
          "Basantrai",
          "Boarijor",
          "Godda",
          "Mahagama",
          "Mehrma",
          "Pathergama",
          "Poraiyahat",
          "Sunderpahari",
          "Thakurgangti"
        ]
      },
      {
        "name": "Gumla",
        "taluks": [
          "Albert Ekka",
          "Basia",
          "Bharno",
          "Bishunpur",
          "Chainpur",
          "Dumri",
          "Ghaghra",
          "Gumla",
          "Kamdara",
          "Palkot",
          "Raidih",
          "Sisai"
        ]
      },
      {
        "name": "Hazaribagh",
        "taluks": [
          "Barhi",
          "Barkagaon",
          "Barkatha",
          "Bishnugarh",
          "Chalkusa",
          "Chouparan",
          "Churchu",
          "Dadi",
          "Daru",
          "Ichak",
          "Katkamdag",
          "Katkamsandi",
          "Keredari",
          "Padma",
          "Sadar",
          "Tatijharia"
        ]
      },
      {
        "name": "Jamtara",
        "taluks": [
          "Fatehpur",
          "Jamtara",
          "Kundhit",
          "Nala",
          "Narayanpur"
        ]
      },
      {
        "name": "Khunti",
        "taluks": [
          "Arki",
          "Karra",
          "Khunti",
          "Murhu",
          "Rania",
          "Torpa"
        ]
      },
      {
        "name": "Kodarma",
        "taluks": [
          "Chandwara",
          "Domchanch",
          "Jainagar",
          "Koderma",
          "Markacho",
          "Satgawan"
        ]
      },
      {
        "name": "Latehar",
        "taluks": [
          "Balumath",
          "Bariyatu",
          "Barwadih",
          "Chandwa",
          "Garu",
          "Herhanj",
          "Latehar",
          "Mahuadanr",
          "Manika"
        ]
      },
      {
        "name": "Lohardaga",
        "taluks": [
          "Bhandra",
          "Kairo",
          "Kisko",
          "Kuru",
          "Lohardaga",
          "Peshrar",
          "Senha"
        ]
      },
      {
        "name": "Pakur",
        "taluks": [
          "Amrapara",
          "Hiranpur",
          "Littipara",
          "Maheshpur",
          "Pakur",
          "Pakuria"
        ]
      },
      {
        "name": "Palamu",
        "taluks": [
          "Bishrampur",
          "Chainpur",
          "Chhatarpur",
          "Daltonganj",
          "Haidernagar",
          "Hariharganj",
          "Hussainabad",
          "Lesliganj",
          "Manatu",
          "Mohmmadganj",
          "Nawabazar",
          "Nawadih Bazar",
          "Pandu",
          "Pandwa",
          "Panki",
          "Patan",
          "Pipra",
          "Satbarwa",
          "Tarhasi",
          "Utari Road"
        ]
      },
      {
        "name": "Ramgarh",
        "taluks": [
          "Chitarpur",
          "Dulmi",
          "Gola",
          "Mandu",
          "Patratu",
          "Ramgarh"
        ]
      },
      {
        "name": "Ranchi",
        "taluks": [
          "Angara",
          "Bero",
          "Bundu",
          "Burmu",
          "Chanho",
          "Itki",
          "Kanke",
          "Khalari",
          "Lapung",
          "Mandar",
          "Nagri",
          "Namkum",
          "Ormanjhi",
          "Rahe",
          "Ratu",
          "Silli",
          "Sonahatu",
          "Tamar"
        ]
      },
      {
        "name": "Sahibganj",
        "taluks": [
          "Barhait",
          "Barharwa",
          "Borio",
          "Mandro",
          "Pathna",
          "Rajmahal",
          "Sahibganj",
          "Taljhari",
          "Udhwa"
        ]
      },
      {
        "name": "Seraikela",
        "taluks": [
          "Chandil",
          "Gamarhia",
          "Ichagarh",
          "Kharsawan",
          "Kuchai",
          "Kukru",
          "Nimdeeh",
          "Rajnagar",
          "Seraikella"
        ]
      },
      {
        "name": "Simdega",
        "taluks": [
          "Bano",
          "Bansjor",
          "Bolba",
          "Jaldega",
          "Kersai",
          "Kolebira",
          "Kurdeg",
          "Pakratanr",
          "Simdega",
          "Thethaitanger"
        ]
      },
      {
        "name": "West Singhbhum",
        "taluks": [
          "Anandpur",
          "Bandgaon",
          "Chaibasa",
          "Chakradharpur",
          "Goelkera",
          "Gudri",
          "Hatgamharia",
          "Jagannathpur",
          "Jhinkpani",
          "Khuntpani",
          "Kumardungi",
          "Manjhari",
          "Manjhgaon",
          "Manoharpur",
          "Noamundi",
          "Sonua",
          "Tantnagar",
          "Tonto"
        ]
      }
    ]
  },
  {
    "state": "Karnataka",
    "districts": [
      {
        "name": "Bagalkot",
        "taluks": [
          "Badami",
          "Bagalkot",
          "Bilagi",
          "Hungund",
          "Jamkhandi",
          "Mudhol"
        ]
      },
      {
        "name": "Bangalore",
        "taluks": [
          "Anekal",
          "Bangalore East",
          "Bangalore North",
          "Bangalore South"
        ]
      },
      {
        "name": "Bangalore Rural",
        "taluks": [
          "Channapatna",
          "Devanhalli",
          "Dodballapur",
          "Hoskote",
          "Kanakapura",
          "Magadi",
          "Nelamangala",
          "Ramanagaram"
        ]
      },
      {
        "name": "Belgaum",
        "taluks": [
          "Athni",
          "Belgaum",
          "Bylahongal",
          "Chikodi",
          "Gokak",
          "Hukeri",
          "Khanapur",
          "Parasgad",
          "Ramdurg",
          "Raybag"
        ]
      },
      {
        "name": "Bellary",
        "taluks": [
          "Bellary",
          "Hadagalli",
          "Hagaribommanahalli",
          "Hospet",
          "Kudligi",
          "Sandur",
          "Siruguppa"
        ]
      },
      {
        "name": "Bidar",
        "taluks": [
          "Aurad",
          "Basavakalyan",
          "Bhalki",
          "Bidar",
          "Humnabad"
        ]
      },
      {
        "name": "Bijapur",
        "taluks": [
          "Basavana Bagewadi",
          "Bijapur",
          "Indi",
          "Muddebihal",
          "Sindagi"
        ]
      },
      {
        "name": "Chamarajanagar",
        "taluks": [
          "Chamarajanagar",
          "Gundlupet",
          "Kollegala",
          "Yelandur"
        ]
      },
      {
        "name": "Chikkaballapur",
        "taluks": [
          "Bagepalli",
          "Chikkaballapura",
          "Chintamani",
          "Gaudibanda",
          "Gauribidanur",
          "Sidlghatta"
        ]
      },
      {
        "name": "Chikmagalur",
        "taluks": [
          "Chickmagalur",
          "Kadur",
          "Koppa",
          "Mudigere",
          "Narasimharajapura",
          "Sringeri",
          "Tarikere"
        ]
      },
      {
        "name": "Chitradurga",
        "taluks": [
          "Challakere",
          "Chitradurga",
          "Hiriyur",
          "Holalkere",
          "Hosdurga",
          "Molakalmuru"
        ]
      },
      {
        "name": "Dakshinakannada",
        "taluks": [
          "Bantval",
          "Beltangadi",
          "Mangalore",
          "Puttur",
          "Sulya"
        ]
      },
      {
        "name": "Davanagere",
        "taluks": [
          "Channagiri",
          "Davanagere",
          "Harappanahalli",
          "Harihara",
          "Honnali",
          "Jagalur"
        ]
      },
      {
        "name": "Dharwad",
        "taluks": [
          "Dharwad",
          "Hubli",
          "Kalghatgi",
          "Kundgol",
          "Navalgund"
        ]
      },
      {
        "name": "Gadag",
        "taluks": [
          "Gadag",
          "Mundaragi",
          "Naragund",
          "Ron",
          "Shirahatti"
        ]
      },
      {
        "name": "Gulbarga",
        "taluks": [
          "Afzalpur",
          "Aland",
          "Chincholi",
          "Chitapur",
          "Gulbarga",
          "Jevargi",
          "Sedam",
          "Shahpur",
          "Shorapur",
          "Yadgir"
        ]
      },
      {
        "name": "Hassan",
        "taluks": [
          "Alur",
          "Arkalgud",
          "Arsikere",
          "Belur",
          "Channarayapatna",
          "Hassan",
          "Holenarsipur",
          "Sakaleshpur"
        ]
      },
      {
        "name": "Haveri",
        "taluks": [
          "Byadgi",
          "Hanagal",
          "Haveri",
          "Hirekerur",
          "Ranebennur",
          "Savanur",
          "Shiggaon"
        ]
      },
      {
        "name": "Kodagu",
        "taluks": [
          "Madikeri",
          "Somvarpet",
          "Virajpet"
        ]
      },
      {
        "name": "Kolar",
        "taluks": [
          "Bagepalli",
          "Bangarapet",
          "Chikballapur",
          "Chintamani",
          "Gauribidanur",
          "Gudibanda",
          "Kolar",
          "Malur",
          "Mulbagal",
          "Sidlaghatta",
          "Srinivaspur"
        ]
      },
      {
        "name": "Koppal",
        "taluks": [
          "Gangavathi",
          "Koppal",
          "Kushtagi",
          "Yelburga"
        ]
      },
      {
        "name": "Mandya",
        "taluks": [
          "Krishnarajpet",
          "Maddur",
          "Malvalli",
          "Mandya",
          "Nagamangala",
          "Pandavapura",
          "Shrirangapattana"
        ]
      },
      {
        "name": "Mysore",
        "taluks": [
          "Heggadadevankote",
          "Hunsur",
          "Krishnarajanagara",
          "Mysore",
          "Nanjangud",
          "Piriyapatna",
          "Tirumakudal-narsipur"
        ]
      },
      {
        "name": "Raichur",
        "taluks": [
          "Devadurga",
          "Lingsugur",
          "Manvi",
          "Raichur",
          "Sindhanur"
        ]
      },
      {
        "name": "Ramanagara",
        "taluks": [
          "Channapanta",
          "Kanakapura",
          "Magadi",
          "Ramanagara"
        ]
      },
      {
        "name": "Shimoga",
        "taluks": [
          "Bhadravati",
          "Hosanagara",
          "Sagar",
          "Shikarpur",
          "Shimoga",
          "Sorab",
          "Tirthahalli"
        ]
      },
      {
        "name": "Tumkur",
        "taluks": [
          "Chiknayakanhalli",
          "Gubbi",
          "Koratagere",
          "Kunigal",
          "Madhugiri",
          "Pavagada",
          "Sira",
          "Tiptur",
          "Tumkur",
          "Turuvekere"
        ]
      },
      {
        "name": "Udupi",
        "taluks": [
          "Karkal",
          "Kundapura",
          "Udupi"
        ]
      },
      {
        "name": "Uttarakannada",
        "taluks": [
          "Ankola",
          "Bhatkal",
          "Haliyal",
          "Honavar",
          "Karwar",
          "Kumta",
          "Mundgod",
          "Siddapur",
          "Sirsi",
          "Supa",
          "Yellapur"
        ]
      },
      {
        "name": "Yadagiri",
        "taluks": [
          "Shahpur",
          "Shorapur",
          "Yadagiri"
        ]
      }
    ]
  },
  {
    "state": "Kerala",
    "districts": [
      {
        "name": "Alappuzha",
        "taluks": [
          "Ambalappuzha",
          "Aryad",
          "Bharanicavu",
          "Champakulam",
          "Chengannur",
          "Harippad",
          "Kanjikkuzhy",
          "Mavelikkara",
          "Muthukulam",
          "Pattanakkad",
          "Thycattussery",
          "Veliyanad"
        ]
      },
      {
        "name": "Ernakulam",
        "taluks": [
          "Alangad",
          "Angamali",
          "Edappally",
          "Koovappady",
          "Kothamangalam",
          "Mulanthuruthy",
          "Muvattupuzha",
          "Palluruthy",
          "Pampakuda",
          "Parakkadav",
          "Paravur",
          "Vadavucode",
          "Vazhakkulam",
          "Vypeen",
          "Vyttila"
        ]
      },
      {
        "name": "Idukki",
        "taluks": [
          "Adimaly",
          "Azhutha",
          "Devikulam",
          "Elemdesam",
          "Idukki",
          "Kattappana",
          "Nedumkandom",
          "Thodupuzha"
        ]
      },
      {
        "name": "Kannur",
        "taluks": [
          "Edakkad",
          "Irikkur",
          "Iritty",
          "Kannur",
          "Kuthuparamba",
          "Panoor",
          "Payyannur",
          "Peravoor",
          "Taliparamba",
          "Thalassery"
        ]
      },
      {
        "name": "Kasargod",
        "taluks": [
          "Kanhangad",
          "Kasargod",
          "Manjeshwar",
          "Nileshwar"
        ]
      },
      {
        "name": "Kollam",
        "taluks": [
          "Anchal",
          "Anchalummood",
          "Chadayamangalam",
          "Chavara",
          "Chittumala",
          "Ithikkara",
          "Karunagappally",
          "Kottarakkara",
          "Mukhathala",
          "Oachira",
          "Pathanapuram",
          "Sasthamcottah",
          "Vettikkavala"
        ]
      },
      {
        "name": "Kottayam",
        "taluks": [
          "Erattupetta",
          "Ettumanoor",
          "Kaduthuruthy",
          "Kanjirappally",
          "Lalam",
          "Madappally",
          "Pallom",
          "Pampady",
          "Uzhavoor",
          "Vaikom",
          "Vazhoor"
        ]
      },
      {
        "name": "Kozhikode",
        "taluks": [
          "Balusseri",
          "Chelannur",
          "Koduvally",
          "Kozhikode",
          "Kunnamangalam",
          "Kunnummal",
          "Melday",
          "Panthalayani",
          "Perambra",
          "Thodannur",
          "Thuneri",
          "Vadakara"
        ]
      },
      {
        "name": "Malappuram",
        "taluks": [
          "Areakode",
          "Kalikavu",
          "Kondotty",
          "Kuttippuram",
          "Malappuram",
          "Mankada",
          "Nilambur",
          "Perinthalmanna",
          "Perumpadappu",
          "Ponnani",
          "Tanur",
          "Tirur",
          "Tirurangadi",
          "Vengara",
          "Wandoor"
        ]
      },
      {
        "name": "Palakkad",
        "taluks": [
          "Alathur",
          "Attappadi",
          "Chittur",
          "Kollengode",
          "Kuzhalmannam",
          "Malampuzha",
          "Mannarkad",
          "Nemmara",
          "Ottappalam",
          "Palakkad",
          "Pattambi",
          "Sreekrishnapuram",
          "Trithala"
        ]
      },
      {
        "name": "Pathanamthitta",
        "taluks": [
          "Elanthoor",
          "Koipuram",
          "Konni",
          "Kulanada",
          "Mallappally",
          "Pandlam",
          "Parakode",
          "Pulikeezhu",
          "Ranni"
        ]
      },
      {
        "name": "Thrissur",
        "taluks": [
          "Anthikkad",
          "Chalakkudy",
          "Chavakkad",
          "Cherpu",
          "Chowannur",
          "Irinjalakkuda",
          "Kodakara",
          "Kodungallur",
          "Mala",
          "Mathilakam",
          "Mullassery",
          "Ollukkara",
          "Pazhayannur",
          "Puzhakkal",
          "Thalikkulam",
          "Vellangallur",
          "Wadakkanchery"
        ]
      },
      {
        "name": "Trivandrum",
        "taluks": [
          "Athiyannoor",
          "Chirayinkeezhu",
          "Kazhakuttam",
          "Kilimanoor",
          "Nedumangad",
          "Nemom",
          "Parassala",
          "Perumkadavila",
          "Thiruvananthapuram Rural",
          "Vamanapuram",
          "Varkala",
          "Vellanad"
        ]
      },
      {
        "name": "Wayanad",
        "taluks": [
          "Kalpetta",
          "Mananthavady",
          "Panamaram",
          "Sulthan Bathery"
        ]
      }
    ]
  },
  {
    "state": "Lakshadweep",
    "districts": [
      {
        "name": "Lakshadweep",
        "taluks": [
          "Agatti",
          "Amini",
          "Andrott",
          "Chetlat",
          "Kadmat",
          "Kalpeni",
          "Kavaratti",
          "Kiltan",
          "Minicoy"
        ]
      }
    ]
  },
  {
    "state": "Madhya Pradesh",
    "districts": [
      {
        "name": "Agar",
        "taluks": [
          "Agar"
        ]
      },
      {
        "name": "Alirajpur",
        "taluks": [
          "Alirajpur",
          "Bhabhra",
          "Jobat",
          "Katthiwada",
          "Sondwa",
          "Udaigarh"
        ]
      },
      {
        "name": "Anuppur",
        "taluks": [
          "Anuppur",
          "Jaithari",
          "Kotma",
          "Pushprajgarh"
        ]
      },
      {
        "name": "Ashoknagar",
        "taluks": [
          "Ashoknagar",
          "Chanderi",
          "Isagarh",
          "Mungaoli"
        ]
      },
      {
        "name": "Balaghat",
        "taluks": [
          "Baihar",
          "Balaghat",
          "Birsa",
          "Katangi",
          "Khairlanji",
          "Kirnapur",
          "Lalbarra",
          "Lanji",
          "Paraswada",
          "Waraseoni"
        ]
      },
      {
        "name": "Barwani",
        "taluks": [
          "Barwani",
          "Newali",
          "Pansemal",
          "Pati",
          "Rajpur",
          "Sendhawa",
          "Thikri"
        ]
      },
      {
        "name": "Betul",
        "taluks": [
          "Amla",
          "Athner",
          "Betul",
          "Bhainsdehi",
          "Bhimpur",
          "Chicholi",
          "Ghoradongri",
          "Multai",
          "Prabhat Pattan",
          "Shahpur"
        ]
      },
      {
        "name": "Bhind",
        "taluks": [
          "Ater",
          "Bhind",
          "Gohad",
          "Lahar",
          "Mehgaon",
          "Raon"
        ]
      },
      {
        "name": "Bhopal",
        "taluks": [
          "Berasia",
          "Phanda"
        ]
      },
      {
        "name": "Burhanpur",
        "taluks": [
          "Burhanpur",
          "Khaknar"
        ]
      },
      {
        "name": "Chhatarpur",
        "taluks": [
          "Bada Malehara",
          "Barigarh",
          "Bijawar",
          "Buxwaha",
          "Chhatarpur",
          "Laundi",
          "Nowgong",
          "Rajnagar"
        ]
      },
      {
        "name": "Chhindwara",
        "taluks": [
          "Amarwara",
          "Bichhua",
          "Chaurai",
          "Chhindwara",
          "Harrai",
          "Jamai",
          "Mohkhed",
          "Pandhurna",
          "Parasia",
          "Sausar",
          "Tamia"
        ]
      },
      {
        "name": "Damoh",
        "taluks": [
          "Batiyagarh",
          "Damoh",
          "Hatta",
          "Jabera",
          "Patera",
          "Pathariya",
          "Tendukheda"
        ]
      },
      {
        "name": "Datia",
        "taluks": [
          "Bhander",
          "Datia",
          "Seondha"
        ]
      },
      {
        "name": "Dewas",
        "taluks": [
          "Bagli",
          "Dewas",
          "Kannod",
          "Khategaon",
          "Sonkatch",
          "Tonk Khurd"
        ]
      },
      {
        "name": "Dhar",
        "taluks": [
          "Badnawar",
          "Bagh",
          "Dahi",
          "Dhar",
          "Dharampuri",
          "Gandhwani",
          "Kukshi",
          "Manawar",
          "Nalchha",
          "Nisarpur",
          "Sardarpur",
          "Tirla",
          "Umarban"
        ]
      },
      {
        "name": "Dindori",
        "taluks": [
          "Amarpur",
          "Bajag",
          "Dindori",
          "Karanjiya",
          "Mehandwani",
          "Samnapur",
          "Shahpura"
        ]
      },
      {
        "name": "East Nimar",
        "taluks": [
          "Baladi",
          "Chhaigaon Makhan",
          "Harsud",
          "Khalwa",
          "Khandwa",
          "Pandhana",
          "Punasa"
        ]
      },
      {
        "name": "Guna",
        "taluks": [
          "Aron",
          "Bamori",
          "Chanchoda",
          "Guna",
          "Raghogarh"
        ]
      },
      {
        "name": "Gwalior",
        "taluks": [
          "Bhitarwar",
          "Dabra",
          "Ghatigaon",
          "Morar"
        ]
      },
      {
        "name": "Harda",
        "taluks": [
          "Harda",
          "Khirkiya",
          "Timarni"
        ]
      },
      {
        "name": "Hoshangabad",
        "taluks": [
          "Babai",
          "Bankhedi",
          "Hoshangabad",
          "Kesla",
          "Pipariya",
          "Seoni Malwa",
          "Sohagpur"
        ]
      },
      {
        "name": "Indore",
        "taluks": [
          "Depalpur",
          "Indore",
          "Mhow",
          "Sanwer"
        ]
      },
      {
        "name": "Jabalpur",
        "taluks": [
          "Jabalpur",
          "Kundam",
          "Majhouli",
          "Panagar",
          "Patan",
          "Shahpura",
          "Sihora"
        ]
      },
      {
        "name": "Jhabua",
        "taluks": [
          "Alirajpur",
          "Bhabra",
          "Jhabua",
          "Jobat",
          "Katthiwada",
          "Meghnagar",
          "Petlawad",
          "Rama",
          "Ranapur",
          "Sondwa",
          "Thandla",
          "Udaigarh"
        ]
      },
      {
        "name": "Katni",
        "taluks": [
          "Badwara",
          "Bahoriband",
          "Dheemerkheda",
          "Katni",
          "Rithi",
          "Vijayraghavgarh"
        ]
      },
      {
        "name": "Mandla",
        "taluks": [
          "Bichhiya",
          "Bijadandi",
          "Ghughri",
          "Mandla",
          "Mawai",
          "Mohgaon",
          "Nainpur",
          "Narayanganj",
          "Niwas"
        ]
      },
      {
        "name": "Mandsaur",
        "taluks": [
          "Bhanpura",
          "Garoth",
          "Malhargarh",
          "Mandsaur",
          "Sitamau"
        ]
      },
      {
        "name": "Morena",
        "taluks": [
          "Ambah",
          "Joura",
          "Kailaras",
          "Morena",
          "Pahadgarh",
          "Porsa",
          "Sabalgarh"
        ]
      },
      {
        "name": "Narsimpur",
        "taluks": [
          "Babai Chichali",
          "Chawarpatha",
          "Gotegaon",
          "Kareli",
          "Narsimhapur",
          "Sainkheda"
        ]
      },
      {
        "name": "Neemuch",
        "taluks": [
          "Jawad",
          "Manasa",
          "Neemuch"
        ]
      },
      {
        "name": "Panna",
        "taluks": [
          "Ajaigarh",
          "Gunour",
          "Panna",
          "Pawai",
          "Shahnagar"
        ]
      },
      {
        "name": "Raisen",
        "taluks": [
          "Baraily",
          "Begamganj",
          "Gairatganj",
          "Goharganj",
          "Sanchi",
          "Silwani",
          "Udaipura"
        ]
      },
      {
        "name": "Rajgarh",
        "taluks": [
          "Biaora",
          "Khilchipur",
          "Narsinghgarh",
          "Rajgarh",
          "Sarangpur",
          "Zirapur"
        ]
      },
      {
        "name": "Ratlam",
        "taluks": [
          "Alot",
          "Bajna",
          "Jaora",
          "Piploda",
          "Ratlam",
          "Sailana"
        ]
      },
      {
        "name": "Rewa",
        "taluks": [
          "Gangev",
          "Hanumana",
          "Jawa",
          "Mauganj",
          "Naigarhi",
          "Raipur Karchuliyan",
          "Rewa",
          "Sirmour",
          "Teonthar"
        ]
      },
      {
        "name": "Sagar",
        "taluks": [
          "Banda",
          "Bina",
          "Deori",
          "Jaisinagar",
          "Kesli",
          "Khurai",
          "Malthone",
          "Rahatgarh",
          "Rehli",
          "Sagar",
          "Shahgarh"
        ]
      },
      {
        "name": "Satna",
        "taluks": [
          "Amarpatan",
          "Maihar",
          "Majhgawan",
          "Nagod",
          "Ramnagar",
          "Rampur Baghelan",
          "Satna",
          "Sohawal",
          "Unchahara"
        ]
      },
      {
        "name": "Sehore",
        "taluks": [
          "Ashta",
          "Budni",
          "Ichhawar",
          "Nasrullaganj",
          "Sehore"
        ]
      },
      {
        "name": "Seoni",
        "taluks": [
          "Barghat",
          "Chhapara",
          "Dhanaura",
          "Kahnapas(ghansaur)",
          "Keolari",
          "Kurai",
          "Lakhnadon",
          "Seoni"
        ]
      },
      {
        "name": "Shahdol",
        "taluks": [
          "Beohari",
          "Burhar",
          "Gohparu",
          "Jaisinghnagar",
          "Sohagpur"
        ]
      },
      {
        "name": "Shajapur",
        "taluks": [
          "Agar",
          "Barod",
          "Kalapipal",
          "Moman Badodia",
          "Nalkheda",
          "Shajapur",
          "Shujalpur",
          "Susner"
        ]
      },
      {
        "name": "Sheopur Kala",
        "taluks": [
          "Karahal",
          "Sheopur",
          "Vijaypur"
        ]
      },
      {
        "name": "Shivpuri",
        "taluks": [
          "Badarwas",
          "Karera",
          "Khaniadhana",
          "Kolaras",
          "Narwar",
          "Pichhore",
          "Pohri",
          "Shivpuri"
        ]
      },
      {
        "name": "Sidhi",
        "taluks": [
          "Kusmi",
          "Majhauli",
          "Rampur Naikin",
          "Sidhi",
          "Sihawal"
        ]
      },
      {
        "name": "Singrauli",
        "taluks": [
          "Chitrangi",
          "Deosar",
          "Waidhan"
        ]
      },
      {
        "name": "Tikamgarh",
        "taluks": [
          "Baldeogarh",
          "Jatara",
          "Niwari",
          "Palera",
          "Prithvipur",
          "Tikamgarh"
        ]
      },
      {
        "name": "Ujjain",
        "taluks": [
          "Badnagar",
          "Ghatiya",
          "Khacharod",
          "Mahidpur",
          "Tarana",
          "Ujjain"
        ]
      },
      {
        "name": "Umaria",
        "taluks": [
          "Karkeli",
          "Manpur",
          "Pali"
        ]
      },
      {
        "name": "Vidisha",
        "taluks": [
          "Basoda",
          "Gyaraspur",
          "Kurwai",
          "Lateri",
          "Nateran",
          "Sironj",
          "Vidisha"
        ]
      },
      {
        "name": "West Nimar",
        "taluks": [
          "Barwah",
          "Bhagvanpura",
          "Bhikangaon",
          "Gogawan",
          "Kasrawad",
          "Khargone",
          "Maheshwar",
          "Segaon",
          "Ziranya"
        ]
      }
    ]
  },
  {
    "state": "Maharashtra",
    "districts": [
      {
        "name": "Ahmadnagar",
        "taluks": [
          "Akole",
          "Jamkhed",
          "Karjat",
          "Kopargaon",
          "Nagar",
          "Nevasa",
          "Parner",
          "Pathardi",
          "Rahata",
          "Rahuri",
          "Sangamner",
          "Shevgaon",
          "Shrigonda",
          "Shrirampur"
        ]
      },
      {
        "name": "Akola",
        "taluks": [
          "Akola",
          "Akot",
          "Balapur",
          "Barshitakli",
          "Murtijapur",
          "Patur",
          "Telhara"
        ]
      },
      {
        "name": "Amravati",
        "taluks": [
          "Achalpur",
          "Amravati",
          "Anjangaon S",
          "Bhatkuli",
          "Chandur Bz",
          "Chandur Ril",
          "Chikhaldara",
          "Daryapur",
          "Dhamangaon Ril",
          "Dharni",
          "Morshi",
          "Nandgaon Kh",
          "Tiwsa",
          "Warud"
        ]
      },
      {
        "name": "Aurangabad",
        "taluks": [
          "Aurangabad",
          "Gangapur",
          "Kanand",
          "Khultabad",
          "Paithan",
          "Phulambri",
          "Sillod",
          "Soegaon",
          "Vaijapur"
        ]
      },
      {
        "name": "Beed",
        "taluks": [
          "Ambajogai",
          "Ashti",
          "Beed",
          "Dharur",
          "Georai",
          "Kaij",
          "Majalgaon",
          "Parali V .",
          "Patoda",
          "Shirur ( Ka )",
          "Wadwani"
        ]
      },
      {
        "name": "Bhandara",
        "taluks": [
          "Bhandara",
          "Lakhandur",
          "Lakhani",
          "Mohadi",
          "Pauni",
          "Sakoli",
          "Tumsar"
        ]
      },
      {
        "name": "Buldana",
        "taluks": [
          "Buldana",
          "Chikhli",
          "D. Raja",
          "Jalgaonjamod",
          "Khamgaon",
          "Lonar",
          "Malkapur",
          "Mehkar",
          "Motala",
          "Nandura",
          "Sangrampur",
          "Shegaon",
          "Sindkhedraja"
        ]
      },
      {
        "name": "Chandrapur",
        "taluks": [
          "Ballarpur",
          "Bhadrawati",
          "Brahmapuri",
          "Chandrapur",
          "Chimur",
          "Gondpipri",
          "Jiwati",
          "Korpana",
          "Mul",
          "Nagbhid",
          "Pombhurna",
          "Rajura",
          "Saoli",
          "Sindewahi",
          "Warora"
        ]
      },
      {
        "name": "Dhule",
        "taluks": [
          "Dhule",
          "Sakri",
          "Shindkhede",
          "Shirpur"
        ]
      },
      {
        "name": "Gadchiroli",
        "taluks": [
          "Aheri",
          "Armori",
          "Bhamaragad",
          "Chamorshi",
          "Desaiganj (Wadsa)",
          "Dhanora",
          "Etapalli",
          "Gadchiroli",
          "Korchi",
          "Kurkheda",
          "Mulchera",
          "Sironcha"
        ]
      },
      {
        "name": "Gondiya",
        "taluks": [
          "Amgaon",
          "Arjuni Morgaon",
          "Deori",
          "Gondia",
          "Goregaon",
          "Sadak Arjuni",
          "Salekasa",
          "Tirora"
        ]
      },
      {
        "name": "Hingoli",
        "taluks": [
          "Aundha Nagnath",
          "Basmat",
          "Hingoli",
          "Kalamnuri",
          "Sengaon"
        ]
      },
      {
        "name": "Jalgaon",
        "taluks": [
          "Amalner",
          "Bhadgaon",
          "Bhusawal",
          "Bodwad",
          "Chalisgaon",
          "Chopda",
          "Dharangaon",
          "Erandol",
          "Jalgaon",
          "Jamner",
          "Muktainagar",
          "Pachora",
          "Parola",
          "Raver",
          "Yawal"
        ]
      },
      {
        "name": "Jalna",
        "taluks": [
          "Ambad",
          "Badnapur",
          "Bhokardan",
          "Ghansawangi",
          "Jafrabad",
          "Jalna",
          "Mantha",
          "Partur"
        ]
      },
      {
        "name": "Kolhapur",
        "taluks": [
          "Ajara",
          "Bhudargad",
          "Chandgad",
          "Gadhinglaj",
          "Gagan Bawada",
          "Hatkangale",
          "Kagal",
          "Karvir",
          "Panhala",
          "Radhanagari",
          "Shahuwadi",
          "Shirol"
        ]
      },
      {
        "name": "Latur",
        "taluks": [
          "Ahemadpur",
          "Ausa",
          "Chakur",
          "Deoni",
          "Jalkot",
          "Latur",
          "Nilanga",
          "Renapur",
          "Shirur Anantpal",
          "Udgir"
        ]
      },
      {
        "name": "Mumbai",
        "taluks": [
          "Mumbai"
        ]
      },
      {
        "name": "Mumbai Suburban",
        "taluks": [
          "Andheri",
          "Borivali",
          "Kurla"
        ]
      },
      {
        "name": "Nagpur",
        "taluks": [
          "Bhivapur",
          "Hingna",
          "Kalmeshwar",
          "Kamptee",
          "Katol",
          "Kuhi",
          "Mouda",
          "Nagpur",
          "Narkhed",
          "Parseoni",
          "Ramtek",
          "Saoner",
          "Umred"
        ]
      },
      {
        "name": "Nanded",
        "taluks": [
          "Ardhapur",
          "Bhokar",
          "Biloli",
          "Deglur",
          "Dharmabad",
          "Hadgaon",
          "Himayatnagar",
          "Kandhar",
          "Kinwat",
          "Loha",
          "Mahur",
          "Modkhed",
          "Mokhed",
          "Naigaon (Kh)",
          "Nanded",
          "Umri"
        ]
      },
      {
        "name": "Nandurbar",
        "taluks": [
          "Akarani",
          "Akkalkuwa",
          "Nandurbar",
          "Navapur",
          "Shahada",
          "Taloda"
        ]
      },
      {
        "name": "Nasik",
        "taluks": [
          "Baglan",
          "Chandwad",
          "Deola",
          "Dindori",
          "Igatpuri",
          "Kalwan",
          "Malegaon",
          "Nandgaon",
          "Nashik",
          "Niphad",
          "Peth",
          "Sinnar",
          "Surgana",
          "Trimbak",
          "Yeola"
        ]
      },
      {
        "name": "Osmanabad",
        "taluks": [
          "Bhoom",
          "Kalamb",
          "Lohara",
          "Omerga",
          "Osmanabad",
          "Paranda",
          "Tuljapur",
          "Washi"
        ]
      },
      {
        "name": "Palghar",
        "taluks": [
          "Dahanu",
          "Javhar",
          "Mokhada",
          "Palghar",
          "Talasari",
          "Vasai",
          "Vikramgad",
          "Wada"
        ]
      },
      {
        "name": "Parbhani",
        "taluks": [
          "Gangakhed",
          "Jintur",
          "Manwat",
          "Palam",
          "Parbhani",
          "Pathri",
          "Purna",
          "Sailu",
          "Sonpeth"
        ]
      },
      {
        "name": "Pune",
        "taluks": [
          "Ambegaon",
          "Baramati",
          "Bhor",
          "Daund",
          "Haveli",
          "Indapur",
          "Junnar",
          "Khed",
          "Maval",
          "Mulshi",
          "Pune City",
          "Purandar",
          "Shirur",
          "Velhe"
        ]
      },
      {
        "name": "Raigarh",
        "taluks": [
          "Alibag",
          "Karjat",
          "Khalapur",
          "Mahad",
          "Mangaon",
          "Mhasala",
          "Murud",
          "Panvel",
          "Pen",
          "Poladpur",
          "Roha",
          "Shrivardhan",
          "Sudhagad",
          "Tala",
          "Uran"
        ]
      },
      {
        "name": "Ratnagiri",
        "taluks": [
          "Chipalun",
          "Dapoli",
          "Guhagar",
          "Khed",
          "Lanja",
          "Mandangad",
          "Rajapur",
          "Ratnagiri",
          "Sangmeshwar"
        ]
      },
      {
        "name": "Sangli",
        "taluks": [
          "Atpadi",
          "Jath",
          "Kadegaon",
          "Kavathemahankal",
          "Khanapur-vita",
          "Miraj",
          "Palus",
          "Shirala",
          "Tasgaon",
          "Valva-islampur"
        ]
      },
      {
        "name": "Satara",
        "taluks": [
          "Jawali",
          "Karad",
          "Khandala",
          "Khatav",
          "Koregaon",
          "Mahabaleshwar",
          "Man",
          "Patan",
          "Phaltan",
          "Satara",
          "Wai"
        ]
      },
      {
        "name": "Sindhudurg",
        "taluks": [
          "Deogad",
          "Dodamarg",
          "Kankavali",
          "Kudal",
          "Malvan",
          "Sawantwadi",
          "Vaibhavawadi",
          "Vengurla"
        ]
      },
      {
        "name": "Solapur",
        "taluks": [
          "Akkalkot",
          "Barshi",
          "Karmala",
          "Madha",
          "Malshiras",
          "Mangalvedhe",
          "Mohol",
          "Pandharpur",
          "Sangola",
          "Solapur North",
          "South Solapur"
        ]
      },
      {
        "name": "Thane",
        "taluks": [
          "Ambernath",
          "Bhiwandi",
          "Kalyan",
          "Murbad",
          "Shahapur",
          "Thane",
          "Ulhasnagar"
        ]
      },
      {
        "name": "Wardha",
        "taluks": [
          "Arvi",
          "Ashti",
          "Deoli",
          "Hinganghat",
          "Karanja",
          "Samudrapur",
          "Seloo",
          "Wardha"
        ]
      },
      {
        "name": "Washim",
        "taluks": [
          "Karanja",
          "Malegaon",
          "Mangrulpir",
          "Manora",
          "Risod",
          "Washim"
        ]
      },
      {
        "name": "Yevatmal",
        "taluks": [
          "Arni",
          "Babhulgaon",
          "Darwha",
          "Digras",
          "Ghatanji",
          "Kalamb",
          "Kelapur",
          "Mahagaon",
          "Maregaon",
          "Ner",
          "Pusad",
          "Ralegaon",
          "Umarkhed",
          "Wani",
          "Yavatmal",
          "Zari Jamni"
        ]
      }
    ]
  },
  {
    "state": "Manipur",
    "districts": [
      {
        "name": "Bishnupur",
        "taluks": [
          "Bishnupur",
          "Moirang"
        ]
      },
      {
        "name": "Chandel",
        "taluks": [
          "Chakpikarong",
          "Chandel",
          "Machi",
          "Tengnoupal"
        ]
      },
      {
        "name": "Churachandpur",
        "taluks": [
          "Churachandpur",
          "Henglep T D Block",
          "Parbung T D Block",
          "Samulamlan",
          "Singngat",
          "Thanlon T D Block"
        ]
      },
      {
        "name": "Imphal East",
        "taluks": [
          "Imphal East I",
          "Imphal East Ii",
          "Jiribam"
        ]
      },
      {
        "name": "Imphal West",
        "taluks": [
          "Imphal West I",
          "Imphal West Ii"
        ]
      },
      {
        "name": "Senapati",
        "taluks": [
          "Kangpokpi",
          "Paomata",
          "Purul",
          "Saikul",
          "Saitu Gamphazol",
          "Tadubi"
        ]
      },
      {
        "name": "Tamenglong",
        "taluks": [
          "Nungba",
          "Tamei",
          "Tamenglong",
          "Tousem"
        ]
      },
      {
        "name": "Thoubal",
        "taluks": [
          "Kakching",
          "Thoubal"
        ]
      },
      {
        "name": "Ukhrul",
        "taluks": [
          "Chingai",
          "Kamjong",
          "Kasom Khullen",
          "Phungyar",
          "Ukhrul"
        ]
      }
    ]
  },
  {
    "state": "Meghalaya",
    "districts": [
      {
        "name": "East Garo Hills",
        "taluks": [
          "Dambo Rongjeng",
          "Samanda",
          "Songsak"
        ]
      },
      {
        "name": "East Jainta Hills",
        "taluks": [
          "Khliehriat",
          "Saipung"
        ]
      },
      {
        "name": "East Khasi Hills",
        "taluks": [
          "Khadarshnong-laitkroh",
          "Mawkynrew",
          "Mawphlang",
          "Mawryngkneng",
          "Mawsynram",
          "Mylliem",
          "Pynursla",
          "Shella Bholaganj"
        ]
      },
      {
        "name": "North Garo Hills",
        "taluks": [
          "Kharkutta",
          "Resubelpara"
        ]
      },
      {
        "name": "Ri Bhoi",
        "taluks": [
          "Jirang",
          "Umling",
          "Umsning"
        ]
      },
      {
        "name": "South Garo Hills",
        "taluks": [
          "Baghmara",
          "Chokpot",
          "Gasuapara",
          "Rongara"
        ]
      },
      {
        "name": "South West Garo Hills",
        "taluks": [
          "Betasing",
          "Zikzak"
        ]
      },
      {
        "name": "South West Khasi Hills",
        "taluks": [
          "Mawkyrwat",
          "Ranikor"
        ]
      },
      {
        "name": "West Garo Hills",
        "taluks": [
          "Dadenggre",
          "Dalu",
          "Gambegre",
          "Rongram",
          "Selsella",
          "Tikrikilla"
        ]
      },
      {
        "name": "West Jaintia Hills",
        "taluks": [
          "Amlarem",
          "Laskein",
          "Thadlaskein"
        ]
      },
      {
        "name": "West Khasi Hills",
        "taluks": [
          "Mairang",
          "Mawshynrut",
          "Mawthadraishan",
          "Nongstoin"
        ]
      }
    ]
  },
  {
    "state": "Mizoram",
    "districts": [
      {
        "name": "Aizawl",
        "taluks": [
          "Aibawk",
          "Darlawn",
          "Phullen",
          "Thingsulthliah",
          "Tlangnuam"
        ]
      },
      {
        "name": "Champhai",
        "taluks": [
          "Champhai",
          "Khawbung",
          "Khawzawl",
          "Ngopa"
        ]
      },
      {
        "name": "Chhimtuipui",
        "taluks": [
          "Chhimtuipui"
        ]
      },
      {
        "name": "Kolasib",
        "taluks": [
          "Bilkhawthlir",
          "Thingdawl"
        ]
      },
      {
        "name": "Lawngtlai",
        "taluks": [
          "Bungtlang South",
          "Chawngte",
          "Lawngtlai",
          "Sangu"
        ]
      },
      {
        "name": "Lunglei",
        "taluks": [
          "Bunghmun",
          "Hnahthial",
          "Lunglei",
          "Lungsen"
        ]
      },
      {
        "name": "Mamit",
        "taluks": [
          "Reiek",
          "West Phaileng",
          "Zawlnuam"
        ]
      },
      {
        "name": "Saiha",
        "taluks": [
          "Saiha",
          "Sangau",
          "Tuipang"
        ]
      },
      {
        "name": "Sercchip",
        "taluks": [
          "East Lungdar",
          "North Vanlaiphai",
          "Serchhip"
        ]
      }
    ]
  },
  {
    "state": "Nagaland",
    "districts": [
      {
        "name": "Dimapur",
        "taluks": [
          "Dhansiripar",
          "Kuhuboto",
          "Medziphema",
          "Niuland"
        ]
      },
      {
        "name": "Kiphrie",
        "taluks": [
          "Kiphire",
          "Pungro",
          "Sitimi"
        ]
      },
      {
        "name": "Kohima",
        "taluks": [
          "Chiephobozou",
          "Jakhama",
          "Kohima",
          "Tseminyu"
        ]
      },
      {
        "name": "Longleng",
        "taluks": [
          "Longleng",
          "Tamlu"
        ]
      },
      {
        "name": "Mokokchung",
        "taluks": [
          "Changtongya",
          "Kubolong",
          "Longchem",
          "Mangkolemba",
          "Ongpangkong(north)",
          "Ongpangkong(south)"
        ]
      },
      {
        "name": "Mon",
        "taluks": [
          "Chen",
          "Mon",
          "Phomching",
          "Tizit",
          "Tobu",
          "Wakching"
        ]
      },
      {
        "name": "Peren",
        "taluks": [
          "Jalukie",
          "Peren",
          "Tenning"
        ]
      },
      {
        "name": "Phek",
        "taluks": [
          "Kikruma",
          "Meluri",
          "Pfutsero",
          "Phek",
          "Sekruzu"
        ]
      },
      {
        "name": "Tuensang",
        "taluks": [
          "Chare",
          "Chessore",
          "Longkhim",
          "Noklak",
          "Noksen",
          "Sangsangyu",
          "Shamator",
          "Thonoknyu"
        ]
      },
      {
        "name": "Wokha",
        "taluks": [
          "Bhandari",
          "Chukitong",
          "Sanis",
          "Wokha",
          "Wozhuro-ralan"
        ]
      },
      {
        "name": "Zunheboto",
        "taluks": [
          "Akuluto",
          "Ghathashi",
          "Satakha",
          "Suruhoto",
          "Tokiye",
          "Zunheboto"
        ]
      }
    ]
  },
  {
    "state": "Odisha",
    "districts": [
      {
        "name": "Anugul",
        "taluks": [
          "Anugul",
          "Athmallik",
          "Banarpal",
          "Chhendipada",
          "Kaniha",
          "Kishorenagar",
          "Palalahada",
          "Talacher"
        ]
      },
      {
        "name": "Balangir",
        "taluks": [
          "Agalpur",
          "Balangir",
          "Bangomunda",
          "Belpara",
          "Deogaon",
          "Gudvella",
          "Khaprakhol",
          "Loisinga",
          "Muribahal",
          "Patnagarh",
          "Puintala",
          "Saintala",
          "Titlagarh",
          "Turekela"
        ]
      },
      {
        "name": "Balasore",
        "taluks": [
          "Bahanaga",
          "Baleshwar",
          "Baliapal",
          "Basta",
          "Bhograi",
          "Jaleswar",
          "Khaira",
          "Nilgiri",
          "Oupada",
          "Remuna",
          "Simulia",
          "Soro"
        ]
      },
      {
        "name": "Bargarh",
        "taluks": [
          "Ambabhona",
          "Attabira",
          "Bargarh",
          "Barpali",
          "Bhatli",
          "Bheden",
          "Bijepur",
          "Gaisilet",
          "Jharbandh",
          "Padampur",
          "Paikmal",
          "Sohella"
        ]
      },
      {
        "name": "Baudh",
        "taluks": [
          "Boudh",
          "Harabhanga",
          "Kantamal"
        ]
      },
      {
        "name": "Bhadrak",
        "taluks": [
          "Basudevpur",
          "Bhadrak",
          "Bhandaripokhari",
          "Bonth",
          "Chandabali",
          "Dhamanagar",
          "Tihidi"
        ]
      },
      {
        "name": "Cuttack",
        "taluks": [
          "Athagad",
          "Badamba",
          "Banki",
          "Banki- Dampara",
          "Baranga",
          "Cuttacksadar",
          "Kantapada",
          "Mahanga",
          "Narasinghpur",
          "Niali",
          "Nischinta Koili",
          "Salepur",
          "Tangi Choudwar",
          "Tigiria"
        ]
      },
      {
        "name": "Debagarh",
        "taluks": [
          "Barkote",
          "Reamal",
          "Tileibani"
        ]
      },
      {
        "name": "Dhenkanal",
        "taluks": [
          "Bhuban",
          "Dhenkanal Sadar",
          "Gondia",
          "Hindol",
          "Kamakhyanagar",
          "Kankada Had",
          "Odapada",
          "Parjang"
        ]
      },
      {
        "name": "Gajapati",
        "taluks": [
          "Gosani",
          "Gumma",
          "Kasinagar",
          "Mohona",
          "Nuagada",
          "R.udayagiri",
          "Rayagada"
        ]
      },
      {
        "name": "Ganjam",
        "taluks": [
          "Aska",
          "Beguniapada",
          "Bellaguntha",
          "Bhanjanagar",
          "Buguda",
          "Chatrapur",
          "Chikiti",
          "Dharakote",
          "Digapahandi",
          "Ganjam",
          "Hinjilicut",
          "Jagannathprasad",
          "Kabisuryanagar",
          "Khallikote",
          "Kukudakhandi",
          "Patrapur",
          "Polosara",
          "Purushottampur",
          "Rangeilunda",
          "Sanakhemundi",
          "Sheragada",
          "Surada"
        ]
      },
      {
        "name": "Jagatsinghapur",
        "taluks": [
          "Balikuda",
          "Biridi",
          "Erasama",
          "Jagatsinghpur",
          "Kujang",
          "Naugaon",
          "Raghunathpur",
          "Tirtol"
        ]
      },
      {
        "name": "Jajapur",
        "taluks": [
          "Badchana",
          "Bari",
          "Binjharpur",
          "Dahrmasala",
          "Danagadi",
          "Dasarathapur",
          "Jajpur",
          "Korei",
          "Rasulpur",
          "Sukinda"
        ]
      },
      {
        "name": "Jharsuguda",
        "taluks": [
          "Jharsuguda",
          "Kirmira",
          "Kolabira",
          "Laikera",
          "Lakhanpur"
        ]
      },
      {
        "name": "Kalahandi",
        "taluks": [
          "Bhawanipatna",
          "Dharamagarh",
          "Golamunda",
          "Jayapatna",
          "Junagarh",
          "Kalampur",
          "Karlamunda",
          "Kesinga",
          "Kokasara",
          "Lanjigarh",
          "Madanpur Rampur",
          "Narala",
          "Thuamul Ram Pur"
        ]
      },
      {
        "name": "Kandhamal",
        "taluks": [
          "Baliguda",
          "Chakapad",
          "Daringibadi",
          "G.udayagiri",
          "K.nuagan",
          "Khajuripada",
          "Kotagarh",
          "Phiringia",
          "Phulbani",
          "Raikia",
          "Tikabali",
          "Tumudibandh"
        ]
      },
      {
        "name": "Kedrapara",
        "taluks": [
          "Aul",
          "Derabish",
          "Garadapur",
          "Kendrapada",
          "Mahakalapada",
          "Marsaghai",
          "Pattamundai",
          "Rajkanika",
          "Rajnagar"
        ]
      },
      {
        "name": "Keonjhar",
        "taluks": [
          "Anandapur",
          "Bansapal",
          "Champua",
          "Ghasipura",
          "Ghatgaon",
          "Harichadanpur",
          "Hatadihi",
          "Jhumpura",
          "Joda",
          "Kendujhar Sadar",
          "Patana",
          "Saharapada",
          "Telkoi"
        ]
      },
      {
        "name": "Khordha",
        "taluks": [
          "Balianta",
          "Balipatna",
          "Banapur",
          "Begunia",
          "Bhubaneswar",
          "Bolagarh",
          "Chilika",
          "Jatni",
          "Khordha",
          "Tangi"
        ]
      },
      {
        "name": "Koraput",
        "taluks": [
          "Bandhugaon",
          "Boipariguda",
          "Borigumma",
          "Dasamantapur",
          "Jeypore",
          "Koraput",
          "Kotpad",
          "Kundura",
          "Lamtaput",
          "Laxmipur",
          "Nandapur",
          "Narayan Patana",
          "Pottangi",
          "Semiliguda"
        ]
      },
      {
        "name": "Malkangiri",
        "taluks": [
          "Kalimela",
          "Khairaput",
          "Korukonda",
          "Kudumulugumma",
          "Malkangiri",
          "Mathili",
          "Podia"
        ]
      },
      {
        "name": "Mayurbhanj",
        "taluks": [
          "Badasahi",
          "Bahalda",
          "Bangriposi",
          "Baripada",
          "Betnoti",
          "Bijatala",
          "Bisoi",
          "Gopabandhunagar",
          "Jamda",
          "Joshipur",
          "Kaptipada",
          "Karanjia",
          "Khunta",
          "Kuliana",
          "Kusumi",
          "Morada",
          "Rairangpur",
          "Raruan",
          "Rasgovindpur",
          "Samakhunta",
          "Saraskana",
          "Sukruli",
          "Suliapada",
          "Thakurmunda",
          "Tiring",
          "Udala"
        ]
      },
      {
        "name": "Nawapara",
        "taluks": [
          "Boden",
          "Khariar",
          "Komna",
          "Nuapada",
          "Sinapali"
        ]
      },
      {
        "name": "Naworangpur",
        "taluks": [
          "Chandahandi",
          "Dabugam",
          "Jharigam",
          "Kosagumuda",
          "Nabarangpur",
          "Nandahandi",
          "Papadahandi",
          "Raighar",
          "Tentulikhunti",
          "Umerkote"
        ]
      },
      {
        "name": "Nayagarh",
        "taluks": [
          "Bhapur",
          "Dasapalla",
          "Gania",
          "Khandapara",
          "Nayagarh",
          "Nuagaon",
          "Odagaon",
          "Ranapur"
        ]
      },
      {
        "name": "Puri",
        "taluks": [
          "Astaranga",
          "Brahmagiri",
          "Delanga",
          "Gop",
          "Kakat Pur",
          "Kanas",
          "Krushnaprasad",
          "Nimapada",
          "Pipili",
          "Sadar",
          "Satyabadi"
        ]
      },
      {
        "name": "Rayagada",
        "taluks": [
          "Bissamcuttack",
          "Chandrapur",
          "Gudari",
          "Gunupur",
          "Kalyansingpur",
          "Kasipur",
          "Kolnara",
          "Muniguda",
          "Padmapur",
          "Ramanaguda",
          "Rayagada"
        ]
      },
      {
        "name": "Sambalpur",
        "taluks": [
          "Bamra",
          "Dhankauda",
          "Jamankira",
          "Jujomura",
          "Kuchinda",
          "Maneswar",
          "Naktideul",
          "Rairakhol",
          "Rengali"
        ]
      },
      {
        "name": "Sonepur",
        "taluks": [
          "Binika",
          "Birmaharajpur",
          "Dunguripali",
          "Sonepur",
          "Tarbha",
          "Ullunda"
        ]
      },
      {
        "name": "Sundargarh",
        "taluks": [
          "Balisankara",
          "Bargaon",
          "Bisra",
          "Bonaigarh",
          "Gurundia",
          "Hemgir",
          "Koida",
          "Kuarmunda",
          "Kutra",
          "Lahunipara",
          "Lathikata",
          "Lephripara",
          "Nuagaon",
          "Rajgangpur",
          "Subdega",
          "Sundargarh",
          "Tangarpali"
        ]
      }
    ]
  },
  {
    "state": "Puducherry",
    "districts": [
      {
        "name": "Karaikal",
        "taluks": [
          "Karaikal",
          "Kottucherry",
          "Nedungadu",
          "Neravy",
          "Thirunallar",
          "Tr Pattinam"
        ]
      },
      {
        "name": "Mahe",
        "taluks": [
          "Mahe"
        ]
      },
      {
        "name": "Puducherry",
        "taluks": [
          "Ariyankuppam",
          "Bahour",
          "Mannadipet",
          "Nettapakkam",
          "Ozhukarai",
          "Puducherry",
          "Villianur"
        ]
      },
      {
        "name": "Yanam",
        "taluks": [
          "Yanam"
        ]
      }
    ]
  },
  {
    "state": "Punjab",
    "districts": [
      {
        "name": "Amritsar",
        "taluks": [
          "Ajnala-1",
          "Chogawan-2",
          "Harsha Chhina",
          "Jandiala-4",
          "Majitha-3",
          "Rayya-6",
          "Tarsikka-7",
          "Verka-5"
        ]
      },
      {
        "name": "Barnala",
        "taluks": [
          "Barnala",
          "Mehal Kalan",
          "Sehna"
        ]
      },
      {
        "name": "Bhatinda",
        "taluks": [
          "Bathinda",
          "Bhagta Bhaika",
          "Maur",
          "Nathana",
          "Phul",
          "Rampura",
          "Sangat",
          "Talwandi Sabo"
        ]
      },
      {
        "name": "Faridkot",
        "taluks": [
          "Faridkot",
          "Kot Kapura"
        ]
      },
      {
        "name": "Fatehgarh Sahib",
        "taluks": [
          "Amloh",
          "Bassi Pathana",
          "Khamano",
          "Khera",
          "Sirhind"
        ]
      },
      {
        "name": "Fazilka",
        "taluks": [
          "Abohar",
          "Arniwala Sheikh Subhan",
          "Fazilka",
          "Jalalabad",
          "Khuian Sarwar"
        ]
      },
      {
        "name": "Ferozpur",
        "taluks": [
          "Firozpur",
          "Ghall Khurd",
          "Guru Har Sahai",
          "Makhu",
          "Mamdot",
          "Zira"
        ]
      },
      {
        "name": "Gurdaspur",
        "taluks": [
          "Batala",
          "Dera Baba Nanak",
          "Dhariwal",
          "Dinanagar",
          "Dorangla",
          "Fatehgarh Churian",
          "Gurdaspur",
          "Kahnuwan",
          "Kalanaur",
          "Qadian",
          "Srihargobind Pur"
        ]
      },
      {
        "name": "Hoshiarpur",
        "taluks": [
          "Bhunga",
          "Dasuya",
          "Garhshankar",
          "Hajipur",
          "Hoshiarpur-i",
          "Hoshiarpur-ii",
          "Mahilpur",
          "Mukerian",
          "Talwara",
          "Tanda"
        ]
      },
      {
        "name": "Jalandhar",
        "taluks": [
          "Adampur",
          "Bhogpur",
          "Jalandhar - West",
          "Jalandhar-east",
          "Lohian",
          "Nakodar",
          "Nurmahal",
          "Phillaur",
          "Rurka Kalan",
          "Shahkot"
        ]
      },
      {
        "name": "Kapurthala",
        "taluks": [
          "Dhilwan",
          "Kapurthala",
          "Nadala",
          "Phagwara",
          "Sultanpur Lodhi"
        ]
      },
      {
        "name": "Ludhiana",
        "taluks": [
          "Dehlon",
          "Doraha",
          "Jagraon",
          "Khanna",
          "Ludhiana-1",
          "Ludhiana-2",
          "Machhiwara",
          "Mangat",
          "Pakhowal",
          "Samrala",
          "Sidhwan Bet",
          "Sudhar"
        ]
      },
      {
        "name": "Mansa",
        "taluks": [
          "Bhikhi",
          "Budhlada",
          "Jhunir",
          "Mansa",
          "Sardulgarh"
        ]
      },
      {
        "name": "Moga",
        "taluks": [
          "Baghapurana",
          "Kot-ise-khan",
          "Moga-i",
          "Moga-ii",
          "Nihal Singh Wala"
        ]
      },
      {
        "name": "Muktsar",
        "taluks": [
          "Gidderbaha",
          "Lambi",
          "Malout",
          "Muktsar"
        ]
      },
      {
        "name": "Nawanshahar",
        "taluks": [
          "Nawanshahar"
        ]
      },
      {
        "name": "Pathankot",
        "taluks": [
          "Bamial",
          "Dharkalan",
          "Gharota",
          "Narot Jaimal Singh",
          "Pathankot",
          "Sujanpur"
        ]
      },
      {
        "name": "Patiala",
        "taluks": [
          "Bhuner Heri",
          "Ghanaur",
          "Nabha",
          "Patiala",
          "Patran",
          "Rajpura",
          "Samana",
          "Sanour"
        ]
      },
      {
        "name": "Rupnagar",
        "taluks": [
          "Anandpur Sahib",
          "Chamkaur Sahib",
          "Morinda",
          "Nurpur Bedi",
          "Rupnagar"
        ]
      },
      {
        "name": "Sahibzada Ajit Singh Nagar",
        "taluks": [
          "Dera Bassi",
          "Kharar",
          "Majri"
        ]
      },
      {
        "name": "Sangrur",
        "taluks": [
          "Ahmedgarh",
          "Andana",
          "Bhawani Garh",
          "Dhuri",
          "Lehragaga",
          "Malerkotla",
          "Sangrur",
          "Sherpur",
          "Sunam"
        ]
      },
      {
        "name": "Shahid Bhagat Singh Nagar (Nawanshahr)",
        "taluks": [
          "Aur",
          "Balachaur",
          "Banga",
          "Nawanshahr",
          "Saroya"
        ]
      },
      {
        "name": "Tarn Taran",
        "taluks": [
          "Bhikhi Wind-13",
          "Chohla Sahib-8",
          "Gandiwind-9",
          "Khadur-sahib-10",
          "Naushehra Pannuan-11",
          "Patti-14",
          "Tarn Taran-12",
          "Valtoha-15"
        ]
      }
    ]
  },
  {
    "state": "Rajasthan",
    "districts": [
      {
        "name": "Ajmer",
        "taluks": [
          "Arain",
          "Bhinay",
          "Jawaja",
          "Kekri",
          "Kishangarh",
          "Masooda",
          "Pisangan",
          "Srinagar"
        ]
      },
      {
        "name": "Alwar",
        "taluks": [
          "Bansur",
          "Behror",
          "Kathumar",
          "Kishangarh Bas",
          "Kotkasim",
          "Lachhmangarh",
          "Mandawar",
          "Nimrana",
          "Rajgarh",
          "Ramgarh",
          "Reni",
          "Thanagazi",
          "Tijara",
          "Umren"
        ]
      },
      {
        "name": "Banswara",
        "taluks": [
          "Anandpuri",
          "Bagidora",
          "Banswara",
          "Garhi",
          "Ghatol",
          "Kushalgarh",
          "Peepal Khoont",
          "Sajjangarh"
        ]
      },
      {
        "name": "Baran",
        "taluks": [
          "Anta",
          "Atru",
          "Baran (Full)",
          "Chhabra",
          "Chhipabarod",
          "Kishanganj",
          "Shahbad"
        ]
      },
      {
        "name": "Barmer",
        "taluks": [
          "Baltora",
          "Barmer",
          "Baytoo",
          "Chohtan",
          "Dhorimanna",
          "Sheo",
          "Sindhari",
          "Siwana"
        ]
      },
      {
        "name": "Bharatpur",
        "taluks": [
          "Bayana",
          "Deeg",
          "Kaman",
          "Kumher",
          "Nadbai",
          "Nagar Pahari",
          "Rupbas",
          "Sewar",
          "Weir"
        ]
      },
      {
        "name": "Bhilwara",
        "taluks": [
          "Asind",
          "Banera",
          "Hurda",
          "Jahazpur",
          "Kotri",
          "Mandal",
          "Mandalgarh",
          "Raipur",
          "Sahara",
          "Shahpura",
          "Suwana"
        ]
      },
      {
        "name": "Bikaner",
        "taluks": [
          "Bikaner",
          "Khajuwala",
          "Kolayat",
          "Lunkaransar",
          "Nokha",
          "Sri Dungargarh"
        ]
      },
      {
        "name": "Bundi",
        "taluks": [
          "Hindoli",
          "Keshoraipatan",
          "Nainwa",
          "Talera"
        ]
      },
      {
        "name": "Chittaurgarh",
        "taluks": [
          "Arnod",
          "Bari Sadri",
          "Begun",
          "Bhadesar",
          "Bhainsrorgarh",
          "Bhopalsagar",
          "Chhoti Sadri",
          "Chittaurgarh",
          "Dungla",
          "Gangrar",
          "Kapasan",
          "Nimbahera",
          "Pratapgarh",
          "Rashmi"
        ]
      },
      {
        "name": "Churu",
        "taluks": [
          "Churu",
          "Rajgarh",
          "Ratangarh",
          "Sardarshahar",
          "Sujangarh",
          "Taranagar"
        ]
      },
      {
        "name": "Dausa",
        "taluks": [
          "Bandikui",
          "Dausa",
          "Lalsot",
          "Mahwa",
          "Sikrai"
        ]
      },
      {
        "name": "Dhaulpur",
        "taluks": [
          "Bari",
          "Baseri",
          "Dhaulpur",
          "Rajakhera"
        ]
      },
      {
        "name": "Dungarpur",
        "taluks": [
          "Aspur",
          "Bichiwara",
          "Dungarpur",
          "Sagwara",
          "Simalwara"
        ]
      },
      {
        "name": "Ganganagar",
        "taluks": [
          "Anupgarh",
          "Ganganagar",
          "Karanpur",
          "Padampur",
          "Raisinghnagar",
          "Sadulshahar",
          "Suratgarh"
        ]
      },
      {
        "name": "Hanumangarh",
        "taluks": [
          "Bhadra",
          "Hanumangarh",
          "Nohar"
        ]
      },
      {
        "name": "Jaipur",
        "taluks": [
          "Amber",
          "Bassi",
          "Chaksu",
          "Dudu",
          "Govindgarh",
          "Jamwa Ramgarh",
          "Jhotwara",
          "Kotputli",
          "Phagi",
          "Sambhar",
          "Sanganer",
          "Shahpura",
          "Viratnagar"
        ]
      },
      {
        "name": "Jaisalmer",
        "taluks": [
          "Jaisalmer",
          "Sam",
          "Sankra"
        ]
      },
      {
        "name": "Jalor",
        "taluks": [
          "Ahore",
          "Bhinmal",
          "Jalore",
          "Jaswantpura",
          "Raniwara",
          "Sanchore",
          "Sayla"
        ]
      },
      {
        "name": "Jhalawar",
        "taluks": [
          "Bakani",
          "Dag",
          "Jhalrapatan",
          "Khanpur",
          "Manoharthana",
          "Pirawa (Sunel)"
        ]
      },
      {
        "name": "Jhunjhunu",
        "taluks": [
          "Alsisar",
          "Buhana",
          "Chirawa",
          "Jhunjhunun",
          "Khetri",
          "Nawalgarh",
          "Surajgarh",
          "Udaipurwati"
        ]
      },
      {
        "name": "Jodhpur",
        "taluks": [
          "Balesar",
          "Bap",
          "Bhopalgarh",
          "Bilara",
          "Luni",
          "Mandor",
          "Osian",
          "Phalodi",
          "Shergarh"
        ]
      },
      {
        "name": "Karauli",
        "taluks": [
          "Hindaun",
          "Karauli",
          "Nadauti",
          "Sapotra",
          "Todabhim"
        ]
      },
      {
        "name": "Kota",
        "taluks": [
          "Itawa",
          "Khairabad",
          "Ladpura",
          "Sangod",
          "Sultanpur"
        ]
      },
      {
        "name": "Nagaur",
        "taluks": [
          "Degana",
          "Didwana",
          "Jayal",
          "Kuchaman",
          "Ladnu",
          "Makrana",
          "Merta",
          "Mundwa",
          "Nagaur",
          "Parbatsar",
          "Riyan"
        ]
      },
      {
        "name": "Pali",
        "taluks": [
          "Bali",
          "Desuri",
          "Jaitaran",
          "Kharchi(mar.jun)",
          "Pali",
          "Raipur",
          "Rani Station",
          "Rohat",
          "Sojat",
          "Sumerpur"
        ]
      },
      {
        "name": "Pratapgarh",
        "taluks": [
          "Arnod",
          "Chhoti Sadari",
          "Dhariawad",
          "Peepalkhoont",
          "Pratapgarh"
        ]
      },
      {
        "name": "Rajsamand",
        "taluks": [
          "Amet",
          "Bhim",
          "Deogarh",
          "Khamnor",
          "Kumbhalgarh",
          "Railmagra",
          "Rajsamand"
        ]
      },
      {
        "name": "Sawai Madhopur",
        "taluks": [
          "Bamanwas",
          "Bonli",
          "Gangapur City",
          "Khandar",
          "Sawai Madhopur"
        ]
      },
      {
        "name": "Sikar",
        "taluks": [
          "Danta Ramgarh",
          "Dhond",
          "Fatehpur",
          "Khandela",
          "Lachhmangarh",
          "Neem Ka Thana",
          "Piprali",
          "Sri Madhopur"
        ]
      },
      {
        "name": "Sirohi",
        "taluks": [
          "Abu Road",
          "Pindwara",
          "Reodar",
          "Sheoganj",
          "Sirohi"
        ]
      },
      {
        "name": "Tonk",
        "taluks": [
          "Deoli",
          "Malpura",
          "Newai",
          "Todaraisingh",
          "Tonk",
          "Uniara"
        ]
      },
      {
        "name": "Udaipur",
        "taluks": [
          "Bargaon",
          "Bhinder",
          "Dhariawad",
          "Girwa",
          "Gogunda",
          "Jhadol",
          "Kherwara",
          "Kotra",
          "Mavli",
          "Salumbar",
          "Sarada"
        ]
      }
    ]
  },
  {
    "state": "Sikkim",
    "districts": [
      {
        "name": "East District",
        "taluks": [
          "Duga",
          "Gangtok",
          "Khamdong",
          "Pakyong",
          "Rakdong Tintek",
          "Ranka",
          "Reghu",
          "Rhenock"
        ]
      },
      {
        "name": "North District",
        "taluks": [
          "Chungthang",
          "Dzongu",
          "Kabi Tingda",
          "Mangan"
        ]
      },
      {
        "name": "South District",
        "taluks": [
          "Namchi",
          "Ravong",
          "Sikip",
          "Sumbuk",
          "Temi Tarku",
          "Yangang"
        ]
      },
      {
        "name": "West District",
        "taluks": [
          "Daramdin",
          "Dentam",
          "Gyalshing",
          "Kaluk",
          "Soreng",
          "Yuksom"
        ]
      }
    ]
  },
  {
    "state": "Tamil Nadu",
    "districts": [
      {
        "name": "Ariyalur",
        "taluks": [
          "Andimadam",
          "Ariyalur",
          "Jayamkondam",
          "Sendurai",
          "T. Palur",
          "Thirumanur"
        ]
      },
      {
        "name": "Chennai(madras)",
        "taluks": [
          "Chennai"
        ]
      },
      {
        "name": "Coimbatore",
        "taluks": [
          "Anamalai",
          "Annur",
          "Avanashi",
          "Gudimangalam",
          "Karamadai",
          "Kinathukadavu",
          "Madathukulam",
          "Madukkarai",
          "Palladam",
          "Periyanayakkanpalayam",
          "Pollachi North",
          "Pollachi South",
          "Pongalur",
          "Sarcarsamakulam",
          "Sultanpet",
          "Sulur",
          "Thondamuthur",
          "Tiruppur",
          "Udumalaipettai"
        ]
      },
      {
        "name": "Cuddalore",
        "taluks": [
          "Annagramam",
          "Cuddalore",
          "Kammapuram",
          "Kattumannarkoil",
          "Keerapalayam",
          "Komaratchi",
          "Kurinjipadi",
          "Mangalur",
          "Melbhuvanagiri",
          "Nallur",
          "Panruti",
          "Parangipettai",
          "Vriddhachalam"
        ]
      },
      {
        "name": "Dharmapuri",
        "taluks": [
          "Dharmapuri",
          "Harur",
          "Karimangalam",
          "Morappur",
          "Nallampalli",
          "Palakkodu",
          "Pappireddipatty",
          "Pennagaram"
        ]
      },
      {
        "name": "Dindigul",
        "taluks": [
          "Athoor",
          "Dindigul",
          "Guziliamparai",
          "Kodaikanal",
          "Nattam",
          "Nilakottai",
          "Oddanchatram",
          "Palani",
          "Reddiyarchatiram",
          "Shanarpatti",
          "Thoppampatti",
          "Vadamadurai",
          "Vattalkundu",
          "Vedasandur"
        ]
      },
      {
        "name": "Erode",
        "taluks": [
          "Ammapet",
          "Andiyur",
          "Bhavani",
          "Bhavanisagar",
          "Chennimalai",
          "Dharapuram",
          "Erode",
          "Gopichettipalaiyam",
          "Kangayam",
          "Kodumudi",
          "Kundadam",
          "Modakurichi",
          "Mulanur",
          "Nambiyur",
          "Perundurai",
          "Satyamangalam",
          "Talavadi",
          "Thoockanaickenpalaiyam",
          "Uttukkuli",
          "Vellakoil"
        ]
      },
      {
        "name": "Kancheepuram",
        "taluks": [
          "Acharapakkam",
          "Chithamur",
          "Kanchipuram",
          "Kattankolathur",
          "Kunnattur",
          "Lathur",
          "Madurantakam",
          "Sriperumbudur",
          "St.thomas Mount",
          "Thiruporur",
          "Tirukkalukunram",
          "Uttiramerur",
          "Walajabad"
        ]
      },
      {
        "name": "Kanniya Kumari",
        "taluks": [
          "Agastiswaram",
          "Killiyoor",
          "Kurunthancode",
          "Melpuram",
          "Munchira",
          "Rajakkamangalam",
          "Thackalai",
          "Thiruvattar",
          "Thovala"
        ]
      },
      {
        "name": "Karur",
        "taluks": [
          "Aravakurichi",
          "K.paramathy",
          "Kadavur",
          "Karur",
          "Krishnarayapuram",
          "Kulittalai",
          "Thanthoni",
          "Thogaimalai"
        ]
      },
      {
        "name": "Krishnagiri",
        "taluks": [
          "Bargur",
          "Hosur",
          "Kaveripattinam",
          "Kelamangalam",
          "Krishnagiri",
          "Mathur",
          "Shoolagiri",
          "Thally",
          "Uttangarai",
          "Veppanapalli"
        ]
      },
      {
        "name": "Madurai",
        "taluks": [
          "Alanganallur",
          "Chellampatti",
          "Kallikudi",
          "Kottampatti",
          "Madurai East",
          "Madurai West",
          "Melur",
          "Sedapatti",
          "T.kallupatti",
          "Tirumangalam",
          "Tirupparangunram",
          "Usilampatti",
          "Vadipatti"
        ]
      },
      {
        "name": "Nagapattinam",
        "taluks": [
          "Keelaiyur",
          "Kilvelur",
          "Kollidam",
          "Kuttalam",
          "Mayiladuthurai",
          "Nagappattinam",
          "Sembanar Koil",
          "Sirkazhi",
          "Thalanayar",
          "Thirumarugal",
          "Vedaranyam"
        ]
      },
      {
        "name": "Namakkal",
        "taluks": [
          "Elacipalayam",
          "Erumapatty",
          "Kabilamalai",
          "Kolli Hills",
          "Mallasamudram",
          "Mohanur",
          "Namagiripet",
          "Namakkal",
          "Pallipalayam",
          "Paramathy",
          "Puduchatram",
          "Rasipuram",
          "Sendamangalam",
          "Tiruchengodu",
          "Vennandur"
        ]
      },
      {
        "name": "Perambalur",
        "taluks": [
          "Alathur",
          "Perambalur",
          "Veppanthattai",
          "Veppur"
        ]
      },
      {
        "name": "Pudukkottai",
        "taluks": [
          "Annavasal",
          "Arantangi",
          "Arimalam",
          "Avadaiyarkovil",
          "Gandaravakottai",
          "Karambakudi",
          "Kunnandarkoil",
          "Manalmelkudi",
          "Ponnamaravati",
          "Pudukkottai",
          "Thiruvarankulam",
          "Tirumayam",
          "Viralimalai"
        ]
      },
      {
        "name": "Ramanathapuram",
        "taluks": [
          "Bogalur",
          "Kadaladi",
          "Kamudi",
          "Mandapam",
          "Mudukulathur",
          "Nainarkoil",
          "Paramakkudi",
          "Rajasingamangalam",
          "Ramanathapuram",
          "Tiruppullani",
          "Tiruvadanai"
        ]
      },
      {
        "name": "Salem",
        "taluks": [
          "Attur",
          "Ayodhiyapattinam",
          "Gangavalli",
          "Idappadi",
          "Kadaiyampatty",
          "Kolathur",
          "Konganapuram",
          "Macdonalds Choultry",
          "Mecheri",
          "Nangavalli",
          "Omalur",
          "Panamarathupatti",
          "Peddanaickenpalayam",
          "Salem",
          "Sankari",
          "Talavasal",
          "Taramangalam",
          "Valapady",
          "Veerapandi",
          "Yercaud"
        ]
      },
      {
        "name": "Sivaganga",
        "taluks": [
          "Devakottai",
          "Ilayankudi",
          "Kalaiyarkoil",
          "Kallal",
          "Kannankudi",
          "Manamadurai",
          "S. Pudur",
          "Sakkottai",
          "Singampunari",
          "Sivaganga",
          "Tiruppathur",
          "Tiruppuvanam"
        ]
      },
      {
        "name": "Thanjavur",
        "taluks": [
          "Ammapettai",
          "Budalur",
          "Kumbakonam",
          "Madukkur",
          "Orattanadu",
          "Papanasam",
          "Pattukkottai",
          "Peravurani",
          "Sethubhavachatram",
          "Thanjavur",
          "Thiruppanandal",
          "Thiruvaiyaru",
          "Thiruvonam",
          "Tiruvidaimarudur"
        ]
      },
      {
        "name": "The Nilgiris",
        "taluks": [
          "Coonoor",
          "Gudalur",
          "Kotagiri",
          "Udhagamandalam"
        ]
      },
      {
        "name": "Theni",
        "taluks": [
          "Andipatti",
          "Bodinayakkanur",
          "Chinnamanur",
          "Kadamalaikundru Myladumparai",
          "Kambam",
          "Periyakulam",
          "Theni",
          "Uttamapalaiyam"
        ]
      },
      {
        "name": "Thiruvallur",
        "taluks": [
          "Ellapuram",
          "Gummidipundi",
          "Kadambathur",
          "Minjur",
          "Pallipattu",
          "Poonamallee",
          "Poondi",
          "Pulal",
          "R.k.pet",
          "Sholavaram",
          "Tiruttani",
          "Tiruvallur",
          "Tiruvelangadu",
          "Villivakkam"
        ]
      },
      {
        "name": "Thiruvarur",
        "taluks": [
          "Kodavasal",
          "Koradacherry",
          "Kottur",
          "Mannargudi",
          "Muthupettai",
          "Nannilam",
          "Nidamangalam",
          "Thiruvarur",
          "Tirutturaippundi",
          "Valangaiman"
        ]
      },
      {
        "name": "Thoothukudi",
        "taluks": [
          "Alwarthirunagari",
          "Karungulam",
          "Kayathar",
          "Kovilpatti",
          "Ottapidaram",
          "Pudur",
          "Sattankulam",
          "Srivaikundam",
          "Thoothukkudi",
          "Tiruchendur",
          "Udangudi",
          "Vilathikulam"
        ]
      },
      {
        "name": "Tiruchirappalli",
        "taluks": [
          "Andanallur",
          "Lalgudi",
          "Manachanellur",
          "Manapparai",
          "Manikandam",
          "Marungapuri",
          "Musiri",
          "Pullambadi",
          "Tattayyangarpettai",
          "Thiruverambur",
          "Thottiam",
          "Turaiyur",
          "Uppiliapuram",
          "Vaiyampatti"
        ]
      },
      {
        "name": "Tirunelveli",
        "taluks": [
          "Alangulam",
          "Ambasamudram",
          "Cheranmahadevi",
          "Kadaiyanallur",
          "Kadayam",
          "Kalakadu",
          "Keelapavoor",
          "Kuruvikulam",
          "Manur",
          "Melaneelithanallur",
          "Nanguneri",
          "Palayankottal",
          "Pappakudi",
          "Radhapuram",
          "Sankarankovil",
          "Shencottah",
          "Tenkasi",
          "Valliyoor",
          "Vasudevanallur"
        ]
      },
      {
        "name": "Tirupur",
        "taluks": [
          "Avanashi",
          "Dharapuram",
          "Gudimanlam",
          "Kangyam",
          "Kundadam",
          "Madathukulam",
          "Mulanor",
          "Palladam",
          "Pongalur",
          "Tirrpur",
          "Udumalaipettai",
          "Vellakoil"
        ]
      },
      {
        "name": "Tiruvannamalai",
        "taluks": [
          "Anakkavur",
          "Arani",
          "Chengam",
          "Chetput",
          "Cheyyar",
          "Jawathu Hills",
          "Kalasapakkam",
          "Keelpennathur",
          "Pernamallur",
          "Polur",
          "Pudupalayam",
          "Thandrampet",
          "Thellar",
          "Thurinjapuram",
          "Tiruvannamalai",
          "Vandavasi",
          "Vembakkam",
          "West Arani"
        ]
      },
      {
        "name": "Vellore",
        "taluks": [
          "Alangayan",
          "Anaicut",
          "Arakkonam",
          "Arcot",
          "Gudiyattam",
          "Jolarpet",
          "K.v.kuppam",
          "Kandili",
          "Kaniyambadi",
          "Katpadi",
          "Kaveripakkam",
          "Madhanur",
          "Natrampalli",
          "Nemili",
          "Peranambattu",
          "Sholinghur",
          "Timiri",
          "Tiruppattur",
          "Vellore",
          "Walajapet"
        ]
      },
      {
        "name": "Villuppuram",
        "taluks": [
          "Chinnasalem",
          "Gingee",
          "Kallakkurichi",
          "Kalrayanhills",
          "Kanai",
          "Kandamangalam",
          "Koliyanur",
          "Mailam",
          "Marakkanam",
          "Melmalayanur",
          "Mugaiyur",
          "Olakkur",
          "Rishivandiam",
          "Sankarapuram",
          "Thiagadurgam",
          "Thiruvennainallur",
          "Tirukkoyilur",
          "Tirunavalur",
          "Ulundurpet",
          "Vallam",
          "Vanur",
          "Vikravandi"
        ]
      },
      {
        "name": "Virudhunagar",
        "taluks": [
          "Aruppukottai",
          "Kariapatti",
          "Narikudi",
          "Rajapalaiyam",
          "Sattur",
          "Sivakasi",
          "Srivilliputtur",
          "Tiruchuli",
          "Vembakottai",
          "Virudhunagar",
          "Watrap"
        ]
      }
    ]
  },
  {
    "state": "Telangana",
    "districts": [
      {
        "name": "Adilabad",
        "taluks": [
          "Adilabad",
          "Asifabad",
          "Bazarhatnoor",
          "Bejjur",
          "Bela",
          "Bellampally",
          "Bhainsa",
          "Bheemini",
          "Boath",
          "Chennur",
          "Dahegaon",
          "Dandepally",
          "Dilawarpur",
          "Gudihatnur",
          "Ichoda",
          "Indervelly",
          "Jainad",
          "Jainoor",
          "Jaipur",
          "Jannaram",
          "Kaddam (Peddur)",
          "Kagaznagar",
          "Kasipet",
          "Kerameri",
          "Khanapur",
          "Kotapally",
          "Kouthala",
          "Kubeer",
          "Kuntala",
          "Laxmanchanda",
          "Lokeswaram",
          "Luxettipet",
          "Mamda",
          "Mancherial",
          "Mandamarri",
          "Mudhole",
          "Narnoor",
          "Nennel",
          "Neradigonda",
          "Nirmal",
          "Rebbena",
          "Sarangapur",
          "Sirpur (T)",
          "Sirpur (U)",
          "Talamadugu",
          "Tamsi",
          "Tandur",
          "Tanur",
          "Tiryani",
          "Utnoor",
          "Vemanpally",
          "Wankidi"
        ]
      },
      {
        "name": "Hyderabad",
        "taluks": [
          "Amberpet",
          "Ameerpet",
          "Asifnagar",
          "Bahadurpura",
          "Bandlaguda",
          "Charminar",
          "Golconda",
          "Himayathnagar",
          "Khairthabad",
          "Marredpally",
          "Musheerabad",
          "Nampally",
          "Saidabad",
          "Secunderabad",
          "Shaikpet",
          "Tirumalagiry"
        ]
      },
      {
        "name": "Karimnagar",
        "taluks": [
          "Bejanki",
          "Bheemdevarapalli",
          "Boinpalli",
          "Chandurthi",
          "Chigurumamidi",
          "Choppadandi",
          "Dharmapuri",
          "Dharmaram",
          "Eligaid",
          "Elkathurthi",
          "Ellanthakunta",
          "Gambhiraopet",
          "Gangadhara",
          "Gollapalli",
          "Husnabad",
          "Huzurabad",
          "Ibrahimpatnam",
          "Jagtial",
          "Jammikunta",
          "Julapalli",
          "Kamalapur",
          "Kamanpur",
          "Karimnagar",
          "Kataram",
          "Kathalapur",
          "Kesavapatnam",
          "Kodimial",
          "Koheda",
          "Konaraopet",
          "Korutla",
          "Mahadevpur",
          "Malhar Rao",
          "Mallapur",
          "Mallial",
          "Manakondur",
          "Manthani",
          "Medipalli",
          "Metpalli",
          "Mustabad",
          "Mutharam (Mahadevpur)",
          "Mutharam (Manthani)",
          "Odela",
          "Peddapalli",
          "Pegadapalli",
          "Raikal",
          "Ramadugu",
          "Ramagundam",
          "Saidapur",
          "Sarangapur",
          "Sircilla",
          "Srirampur",
          "Sulthanabad",
          "Thimmapur (L.m.d.)",
          "Veenavanka",
          "Velgatoor",
          "Vemulawada",
          "Yellareddipet"
        ]
      },
      {
        "name": "Khammam",
        "taluks": [
          "Aswapuram",
          "Aswaraopeta",
          "Bayyaram",
          "Bhadrachalam",
          "Bonakal",
          "Burgampahad",
          "Chandrugonda",
          "Cherla",
          "Chinthakani",
          "Chintoor",
          "Dammapeta",
          "Dummugudem",
          "Enkoor",
          "Garla",
          "Gundala",
          "Julurupadu",
          "Kallur",
          "Kamepally",
          "Khammam (Rural)",
          "Khammam (Urban)",
          "Konijerla",
          "Kothagudem",
          "Kukkunur",
          "Kunavaram",
          "Kusumanchi",
          "Madhira",
          "Manugur",
          "Mudigonda",
          "Mulakalapally",
          "Nelakondapally",
          "Palwancha",
          "Penubally",
          "Pinapaka",
          "Sathupally",
          "Singareni",
          "Tekulapally",
          "Thallada",
          "Thirumalayapalem",
          "Vararamachandrapuram",
          "Velairpad",
          "Vemsoor",
          "Venkatapuram",
          "Wazeed",
          "Wyra",
          "Yellandu",
          "Yerrupalem"
        ]
      },
      {
        "name": "Mahaboobnagar",
        "taluks": [
          "Achampeta",
          "Addakal",
          "Aiza",
          "Alampur",
          "Amangal",
          "Amrabad",
          "Atmakur",
          "Balanagar",
          "Balmoor",
          "Bhoothpur",
          "Bijinapalle",
          "Bomraspeta",
          "Chinnachintakunta",
          "Damaragidda",
          "Devarakadara",
          "Dhanwada",
          "Dharur",
          "Doulatabad",
          "Farooqnagar",
          "Gadwal",
          "Ghanpur",
          "Ghattu",
          "Gopalpeta",
          "Hanwada",
          "Itikyal",
          "Jadcherla",
          "Kalwakurthy",
          "Keshampeta",
          "Kodair",
          "Kodangal",
          "Koilkonda",
          "Kollapur",
          "Kondurg",
          "Kosgi",
          "Kothakota",
          "Kothur",
          "Lingal",
          "Maddur",
          "Madgul",
          "Maganoor",
          "Mahbubnagar",
          "Makthal",
          "Maldakal",
          "Manopadu",
          "Midjil",
          "Nagarkurnool",
          "Narayanpet",
          "Narva",
          "Nawabpet",
          "Pangal",
          "Pebbair",
          "Peddakothapalle",
          "Peddamandadi",
          "Tadoor",
          "Talakondapalle",
          "Telkapalle",
          "Thimmajipeta",
          "Uppununthala",
          "Utkoor",
          "Vangoor",
          "Veepangandla",
          "Veldanda",
          "Waddepalle",
          "Wanaparthy"
        ]
      },
      {
        "name": "Medak",
        "taluks": [
          "Alladurg",
          "Andole",
          "Chegunta",
          "Chinnakodur",
          "Doultabad",
          "Dubbak",
          "Gajwel",
          "Hathnoora",
          "Jagdevpur",
          "Jharasangam",
          "Jinnaram",
          "Kalher",
          "Kangti",
          "Kohir",
          "Kondapak",
          "Kondapur",
          "Kowdipalli",
          "Kulcharam",
          "Manoor",
          "Medak",
          "Mirdoddi",
          "Mulug",
          "Munpalle",
          "Nanganur",
          "Narayankhed",
          "Narsapur",
          "Nyalkal",
          "Papannapet",
          "Patancheru",
          "Pulkal",
          "Raikode",
          "Ramayampet",
          "Ramchandrapuram",
          "Regode",
          "Sadasivpet",
          "Sangareddy",
          "Shankarampet[a]",
          "Shankarampet[r]",
          "Shivampet",
          "Siddipet",
          "Tekmal",
          "Thoguta",
          "Tupran",
          "Wargal",
          "Yeldurthy",
          "Zahirabad"
        ]
      },
      {
        "name": "Nalgonda",
        "taluks": [
          "Alair",
          "Anumula",
          "Atmakur(m)",
          "Atmakur(s)",
          "Bhuvanagiri",
          "Bibinagar",
          "Bommala Ramaram",
          "Chandampet",
          "Chandur",
          "Chilkur",
          "Chintha Pally",
          "Chityala",
          "Chivvemla",
          "Choutuppal",
          "Dameracherla",
          "Devarakonda",
          "Garide Pally",
          "Gundala",
          "Gundlapally (Dindi)",
          "Gurrampode",
          "Huzurnagar",
          "Jaji Reddi Gudem (Arvapally)",
          "Kanagal",
          "Kattangoor",
          "Kethe Pally",
          "Kodad",
          "M.turka Pally",
          "Marriguda",
          "Mattam Pally",
          "Mella Chervu",
          "Miryalaguda",
          "Mothey",
          "Mothkur",
          "Munagala",
          "Munugode",
          "Nadigudem",
          "Nakrekal",
          "Nalgonda",
          "Nampally",
          "Narayanapur",
          "Narketpally",
          "Nereducherla",
          "Nidamanoor",
          "Nuthankal",
          "Pedda Adiserla Pally",
          "Peddavura",
          "Penpahad",
          "Pochampally",
          "Rajapet",
          "Ramannapeta",
          "Shali Gouraram",
          "Suryapet",
          "Thipparthi",
          "Thirumalagiri",
          "Thungathurthi",
          "Tripuraram",
          "Valigonda",
          "Vemula Pally",
          "Yadagirigutta"
        ]
      },
      {
        "name": "Nizamabad",
        "taluks": [
          "Armur",
          "Balkonda",
          "Banswada",
          "Bheemgal",
          "Bhiknur",
          "Bichkunda",
          "Birkoor",
          "Bodhan",
          "Dharpalle",
          "Dichpalle",
          "Domakonda",
          "Gandhari",
          "Jakranpalle",
          "Jukkal",
          "Kamareddy",
          "Kammarapalle",
          "Kotgiri",
          "Lingampet",
          "Machareddy",
          "Madnur",
          "Makloor",
          "Mortad",
          "Nagireddypet",
          "Nandipet",
          "Navipet",
          "Nizamabad",
          "Nizamsagar",
          "Pitlam",
          "Renjal",
          "Sadasivanagar",
          "Sirkonda",
          "Tadwai",
          "Varni",
          "Velpur",
          "Yedapalle",
          "Yellareddy"
        ]
      },
      {
        "name": "Rangareddy",
        "taluks": [
          "Balanagar",
          "Bantwaram",
          "Basheerabad",
          "Chevella",
          "Dharur",
          "Doma",
          "Gandeed",
          "Ghatkesar",
          "Hayathnagar",
          "Ibrahimpatnam",
          "Kandukur",
          "Keesara",
          "Kulkacharla",
          "Maheswaram",
          "Malkajgiri",
          "Manchal",
          "Marpally",
          "Medchal",
          "Moinabad",
          "Mominpet",
          "Nawabpet",
          "Pargi",
          "Peddemul",
          "Pudur",
          "Quthbullapur",
          "Rajendranagar",
          "Saroornagar",
          "Shabad",
          "Shamirpet",
          "Shamshabad",
          "Shankarpally",
          "Tandur",
          "Uppal",
          "Vikarabad",
          "Yacharam",
          "Yalal"
        ]
      },
      {
        "name": "Warangal",
        "taluks": [
          "Atmakur",
          "Bachannapeta",
          "Bhupalpalle",
          "Chennaraopet",
          "Cheriyal",
          "Chityal",
          "Devaruppula",
          "Dharmasagar",
          "Dornakal",
          "Duggondi",
          "Eturnagaram",
          "Geesugonda",
          "Ghanapur (Mulug)",
          "Ghanpur(station)",
          "Govindaraopet",
          "Gudur",
          "Hanamkonda",
          "Hasanparthy",
          "Jangaon",
          "Kesamudram",
          "Khanapur",
          "Kodakandla",
          "Kothagudem",
          "Kuravi",
          "Lingalaghanpur",
          "Maddur",
          "Mahbubabad",
          "Mangapet",
          "Maripeda",
          "Mogullapalle",
          "Mulug",
          "Nalla Belli",
          "Nallikudur",
          "Narmetta",
          "Narsampet",
          "Narsimhulapet",
          "Nekkonda",
          "Palakurthi",
          "Parkal",
          "Parvathagiri",
          "Raghunathpalle",
          "Raiparthy",
          "Regonda",
          "Sangam",
          "Shyampet",
          "Tadvai",
          "Thorrur",
          "Venkatapur",
          "Wardhanna Pet",
          "Zaffergadh"
        ]
      }
    ]
  },
  {
    "state": "Tripura",
    "districts": [
      {
        "name": "Dhalai",
        "taluks": [
          "Ambassa",
          "Chawmanu",
          "Dumburnagar",
          "Manu",
          "Salema"
        ]
      },
      {
        "name": "East Tripura",
        "taluks": [
          "East Tripura"
        ]
      },
      {
        "name": "Gomati",
        "taluks": [
          "Gomati"
        ]
      },
      {
        "name": "Khowai",
        "taluks": [
          "Khowai"
        ]
      },
      {
        "name": "North Tripura",
        "taluks": [
          "Damcherra",
          "Dasda",
          "Gournagar",
          "Jampui Hills",
          "Kadamtala",
          "Kumarghat",
          "Panisagar",
          "Pecharthal"
        ]
      },
      {
        "name": "Sepahijela",
        "taluks": [
          "Sepahijela"
        ]
      },
      {
        "name": "South Tripura",
        "taluks": [
          "Amarpur",
          "Bokafa",
          "Hrishyamukh",
          "Kakraban",
          "Karbook",
          "Killa",
          "Matabari",
          "Ompi",
          "Rajnagar",
          "Rupaichari",
          "Satchand"
        ]
      },
      {
        "name": "Unakoti",
        "taluks": [
          "Unakoti"
        ]
      },
      {
        "name": "West Tripura",
        "taluks": [
          "Bishalgarh",
          "Boxanagar",
          "Dukli",
          "Hezamara",
          "Jampuijala",
          "Jirania",
          "Kalyanpur",
          "Kathalia",
          "Khowai",
          "Mandwai",
          "Melaghar",
          "Mohanpur",
          "Mungiakami",
          "Padmabil",
          "Teliamura",
          "Tulashikhar"
        ]
      }
    ]
  },
  {
    "state": "Uttar Pradesh",
    "districts": [
      {
        "name": "Agra",
        "taluks": [
          "Achhnera",
          "Akola",
          "Bah",
          "Barauli Ahir",
          "Bichpuri",
          "Etmadpur",
          "Fatehabad",
          "Fatehpur Sikri",
          "Jagner",
          "Jaitpur Kalan",
          "Khandauli",
          "Kheragarh",
          "Pinahat",
          "Saiyan",
          "Shamsabad"
        ]
      },
      {
        "name": "Aligarh",
        "taluks": [
          "Akrabad",
          "Atrauli",
          "Bijauli",
          "Chandaus",
          "Dhanipur",
          "Gangiri",
          "Gonda",
          "Iglas",
          "Jawan Sikanderpur",
          "Khair",
          "Lodha",
          "Tappal"
        ]
      },
      {
        "name": "Ambedkar Nagar",
        "taluks": [
          "Akbarpur",
          "Baskhari",
          "Bhiti",
          "Bhiyawan",
          "Jahangir Ganj",
          "Jalal Pur",
          "Katehari",
          "Ram Nagar",
          "Tanda"
        ]
      },
      {
        "name": "Amethi ( Shahu Ji Maharaj)",
        "taluks": [
          "Amethi",
          "Bazar Shukul",
          "Bhadar",
          "Bhadurpur",
          "Bhetua",
          "Chhatoh",
          "Deeh",
          "Gauriganj",
          "Jagdishpur",
          "Jamo",
          "Musafirkhana",
          "Salon",
          "Sangrampur",
          "Shahgarh",
          "Singhpur",
          "Tiloi"
        ]
      },
      {
        "name": "Auraiya",
        "taluks": [
          "Achchalda",
          "Ajitmal",
          "Auraiya",
          "Bhagyanagar",
          "Bidhuna",
          "Erwa Katra",
          "Sahar"
        ]
      },
      {
        "name": "Azamgarh",
        "taluks": [
          "Ahiraula",
          "Atraulia",
          "Azmatgarh",
          "Bilariyaganj",
          "Haraiya",
          "Jahanaganj",
          "Koilsa",
          "Lalganj",
          "Mahrajganj",
          "Martinganj",
          "Mehnagar",
          "Mirzapur",
          "Mohammadpur",
          "Palhana",
          "Palhani",
          "Pawai",
          "Phulpur",
          "Rani Ki Sarai",
          "Sathiyaon",
          "Tahbarpur",
          "Tarwa",
          "Thekma"
        ]
      },
      {
        "name": "Badaun",
        "taluks": [
          "Ambiapur",
          "Asafpur",
          "Bisauli",
          "Dahgavan",
          "Dataganj",
          "Gunnaur",
          "Islamnagar",
          "Jagat",
          "Junawai",
          "Mion",
          "Qadar Chowk",
          "Rajpura",
          "Sahaswan",
          "Salarpur",
          "Samrer",
          "Ujhani",
          "Usawan",
          "Wazirganj"
        ]
      },
      {
        "name": "Baghpat",
        "taluks": [
          "Baghpat",
          "Baraut",
          "Binauli",
          "Chhaprauli",
          "Khekra",
          "Pilana"
        ]
      },
      {
        "name": "Bahraich",
        "taluks": [
          "Balaha",
          "Chitaura",
          "Huzoorpur",
          "Jarwal",
          "Kaisarganj",
          "Mahasi",
          "Mihinpurwa",
          "Nawabganj",
          "Phakharpur",
          "Prayagpur",
          "Risia",
          "Shivpur",
          "Tajwapur",
          "Visheshwarganj"
        ]
      },
      {
        "name": "Ballia",
        "taluks": [
          "Bairia",
          "Bansdih",
          "Belhari",
          "Beruarbari",
          "Chilkahar",
          "Dubhar",
          "Garwar",
          "Hanumanganj",
          "Maniar",
          "Murlichhapra",
          "Nagra",
          "Navanagar",
          "Pandah",
          "Rasra",
          "Reoti",
          "Siar",
          "Sohanv"
        ]
      },
      {
        "name": "Balrampur",
        "taluks": [
          "Balrampur",
          "Gaindas Bujurg",
          "Gaisri",
          "Harriya Satgharwa",
          "Pachpedwa",
          "Rehera Bazaar",
          "Shriduttganj",
          "Tulsipur",
          "Utraula"
        ]
      },
      {
        "name": "Banda",
        "taluks": [
          "Baberu",
          "Badokhar Khurd",
          "Bisanda",
          "Jaspura",
          "Kamasin",
          "Mahuva",
          "Naraini",
          "Tindwari"
        ]
      },
      {
        "name": "Barabanki",
        "taluks": [
          "Bani Kodar",
          "Banki",
          "Dariyabad",
          "Dewa",
          "Fatehpur",
          "Haidargarh",
          "Harakh",
          "Masauli",
          "Mawai",
          "Nindaura",
          "Puredalai",
          "Ramnagar",
          "Rudauli",
          "Sidhaur",
          "Sirauli Gauspur",
          "Suratganj",
          "Trivediganj"
        ]
      },
      {
        "name": "Bareilly",
        "taluks": [
          "Aalampur Jafarabad",
          "Baheri",
          "Bhadpura",
          "Bhojipura",
          "Bhuta",
          "Bithiri Chainpur",
          "Damkhauda",
          "Faridpur",
          "Fatehganj West",
          "Kyara",
          "Majhgawan",
          "Mirganj",
          "Nawabganj",
          "Ramnagar",
          "Shergarh"
        ]
      },
      {
        "name": "Basti",
        "taluks": [
          "Bahadurpur",
          "Bankati",
          "Basti",
          "Bugauliya",
          "Gaur",
          "Harraiya",
          "Kaptanganj",
          "Kudaraha",
          "Paras Rampur",
          "Ramnagar",
          "Rudauli",
          "Saltaua Gopal Pur",
          "Sau Ghat",
          "Vikram Jot"
        ]
      },
      {
        "name": "Bijnor",
        "taluks": [
          "Afzalgarh",
          "Budhanpur Seohara",
          "Dhampur",
          "Haldaur(khari Jhalu)",
          "Jalilpur",
          "Kiratpur",
          "Kotwali",
          "Mohammedpur Deomal",
          "Najibabad",
          "Nehtaur",
          "Noorpur"
        ]
      },
      {
        "name": "Bulandshahar",
        "taluks": [
          "Agauta",
          "Anupshahr",
          "Araniya",
          "Bhawan Bahadur Nagar",
          "Bulandshahr",
          "Danpur",
          "Dibai",
          "Gulaothi",
          "Jahangirabad",
          "Khurja",
          "Lakhaothi",
          "Pahasu",
          "Shikarpur",
          "Sikandrabad",
          "Syana",
          "Unchagaon"
        ]
      },
      {
        "name": "Chandauli",
        "taluks": [
          "Berahani",
          "Chahniya",
          "Chakiya",
          "Chandauli",
          "Dhanapur",
          "Naugarh",
          "Niyamatabad",
          "Sahabganj",
          "Sakaldiha"
        ]
      },
      {
        "name": "Chitrakoot",
        "taluks": [
          "Karwi",
          "Manikpur",
          "Mau",
          "Pahari",
          "Ramnagar"
        ]
      },
      {
        "name": "Deoria",
        "taluks": [
          "Baitalpur",
          "Bankata",
          "Barhaj",
          "Bhagalpur",
          "Bhaluani",
          "Bhatni",
          "Bhatpar Rani",
          "Deoria Sadar",
          "Desai Deoria",
          "Gauri Bazar",
          "Lar",
          "Pathar Dewa",
          "Rampur Karkhana",
          "Rudrapur",
          "Salempur",
          "Tarkalua"
        ]
      },
      {
        "name": "Etah",
        "taluks": [
          "Aliganj",
          "Amanpur",
          "Awagarh",
          "Ganj Dundwara",
          "Jaithara",
          "Jalesar",
          "Kasganj",
          "Marehra",
          "Nidhauli Kalan",
          "Patiyali",
          "Sahawar",
          "Sakit",
          "Shitalpur",
          "Sidhpura",
          "Soron"
        ]
      },
      {
        "name": "Etawah",
        "taluks": [
          "Barhpura",
          "Basrehar",
          "Bharthana",
          "Chakarnagar",
          "Jaswantnagar",
          "Mahewa",
          "Sefai",
          "Takha"
        ]
      },
      {
        "name": "Faizabad",
        "taluks": [
          "Amaniganj",
          "Bikapur",
          "Hariyangatanganj",
          "Masodha",
          "Mawai",
          "Maya Bazar",
          "Milkipur",
          "Pura Bazar",
          "Sohawal",
          "Tarun"
        ]
      },
      {
        "name": "Farrukhabad",
        "taluks": [
          "Barhpur",
          "Kaimganj",
          "Kamalganj",
          "Mohamdabad",
          "Nawabganj",
          "Rajepur",
          "Shamsabad"
        ]
      },
      {
        "name": "Fatehpur",
        "taluks": [
          "Airayan",
          "Amauli",
          "Asothar",
          "Bahua",
          "Bhitaura",
          "Devmai",
          "Dhata",
          "Haswa",
          "Hathgaon",
          "Khajuha",
          "Malwan",
          "Telyani",
          "Vijayipur"
        ]
      },
      {
        "name": "Firozabad",
        "taluks": [
          "Araon",
          "Eka",
          "Firozabad",
          "Hathwant",
          "Jasrana",
          "Madanpur",
          "Narkhi",
          "Shikohabad",
          "Tundla"
        ]
      },
      {
        "name": "Gautam Buddha Nagar",
        "taluks": [
          "Bisrakh",
          "Dadri",
          "Dankaur",
          "Jewar"
        ]
      },
      {
        "name": "Ghaziabad",
        "taluks": [
          "Bhojpur",
          "Dhaulana",
          "Garh Mukteshwar",
          "Hapur",
          "Loni",
          "Muradnagar",
          "Rajapur",
          "Simbhawali"
        ]
      },
      {
        "name": "Ghazipur",
        "taluks": [
          "Bhadaura",
          "Bhanwarkol",
          "Devkali",
          "Ghazipur",
          "Jakhania",
          "Karanda",
          "Kasimabad",
          "Manihari",
          "Mardah",
          "Mohammadabad",
          "Revatipur",
          "Sadat",
          "Saidpur",
          "Varachakwar",
          "Virno",
          "Zamania"
        ]
      },
      {
        "name": "Gonda",
        "taluks": [
          "Babhanjot",
          "Belsar",
          "Chhapia",
          "Colonelganj",
          "Haldharmau",
          "Itiathok",
          "Jhanjhari",
          "Katra Bazar",
          "Mankapur",
          "Mujehana",
          "Nawabganj",
          "Pandri Kripal",
          "Paraspur",
          "Rupaideeh",
          "Tarabganj",
          "Wazirganj"
        ]
      },
      {
        "name": "Gorakhpur",
        "taluks": [
          "Bansgaon",
          "Barhalganj",
          "Belghat",
          "Bhathat",
          "Brahmpur",
          "Campierganj",
          "Chargawan",
          "Gagaha",
          "Gola",
          "Jangal Kaudia",
          "Kauri Ram",
          "Khajni",
          "Khorabar",
          "Pali",
          "Pipraich",
          "Piprauli",
          "Sahjanawa",
          "Sardarnagar",
          "Uruwa"
        ]
      },
      {
        "name": "Hamirpur",
        "taluks": [
          "Gohand",
          "Kurara",
          "Maudaha",
          "Muskara",
          "Rath",
          "Sarila",
          "Sumerpur"
        ]
      },
      {
        "name": "Hapur (panchsheel Nagar)",
        "taluks": [
          "Hapur (panchsheel Nagar)"
        ]
      },
      {
        "name": "Hardoi",
        "taluks": [
          "Ahirori",
          "Bawan",
          "Behendar",
          "Bharawan",
          "Bharkhani",
          "Bilgram",
          "Hariyawan",
          "Harpalpur",
          "Kachauna",
          "Kothawan",
          "Madhoganj",
          "Mallawan",
          "Pihani",
          "Sandi",
          "Sandila",
          "Shahabad",
          "Sursa",
          "Tandiyawan",
          "Todarpur"
        ]
      },
      {
        "name": "Hathras",
        "taluks": [
          "Hasayan",
          "Hathras",
          "Mursan",
          "Sadabad",
          "Sasni",
          "Sehpau",
          "Sikandrarao"
        ]
      },
      {
        "name": "Jalaun",
        "taluks": [
          "Dakore",
          "Jalaun",
          "Kadaura",
          "Konch",
          "Kuthaund",
          "Madhogarh",
          "Maheva",
          "Nadigaon",
          "Rampura"
        ]
      },
      {
        "name": "Jaunpur",
        "taluks": [
          "Badla Pur",
          "Baksha",
          "Barasathi",
          "Dharma Pur",
          "Dobhi",
          "Jalal Pur",
          "Karanja Kala",
          "Kerakat",
          "Khuthan",
          "Machchali Shahar",
          "Maharaj Ganj",
          "Mariyahu",
          "Mufti Ganj",
          "Mungra Badshah Pur",
          "Ram Nagar",
          "Ram Pur",
          "Shah Ganj",
          "Sikrara",
          "Sirkoni",
          "Suitha Kala",
          "Sujan Ganj"
        ]
      },
      {
        "name": "Jhansi",
        "taluks": [
          "Babina",
          "Badagaon",
          "Bamaur",
          "Bangra",
          "Chirgaon",
          "Gursarai",
          "Mauranipur",
          "Moth"
        ]
      },
      {
        "name": "Jyotiba Phule Nagar",
        "taluks": [
          "Amroha",
          "Dhanaura",
          "Gajraula",
          "Gangeshwari",
          "Hasanpur",
          "Joya"
        ]
      },
      {
        "name": "Kannauj",
        "taluks": [
          "Chhibramau",
          "Gughrapur",
          "Haseran",
          "Jalalabad",
          "Kannauj",
          "Saurikh",
          "Talgram",
          "Umarda"
        ]
      },
      {
        "name": "Kanpur City",
        "taluks": [
          "Bhitargaon",
          "Bilhaur",
          "Chaubeypur",
          "Ghatampur",
          "Kakwan",
          "Kalyanpur",
          "Patara",
          "Sarsol",
          "Shivrajpur",
          "Vidhunu"
        ]
      },
      {
        "name": "Kanpur Dehat",
        "taluks": [
          "Akbarpur",
          "Amrodha",
          "Derapur",
          "Jhinjhak",
          "Maitha",
          "Malasa",
          "Rajpur",
          "Rasulabad",
          "Sandalpur",
          "Sarbankhera"
        ]
      },
      {
        "name": "Kanshiram Nagar",
        "taluks": [
          "Amanpur",
          "Ganj Dundwara",
          "Kasganj",
          "Patiyali",
          "Sahawar",
          "Sidhpura",
          "Soron"
        ]
      },
      {
        "name": "Kaushambi",
        "taluks": [
          "Chail",
          "Kara",
          "Kaushambi",
          "Manjhanpur",
          "Mooratganj",
          "Nevada",
          "Sarsawan",
          "Sirathu"
        ]
      },
      {
        "name": "Kheri",
        "taluks": [
          "Bankeyganj",
          "Behjam",
          "Bijuwa",
          "Dhaurhara",
          "Isanagar",
          "Kumbhigola",
          "Lakhimpur",
          "Mitauli",
          "Mohammadi",
          "Nakaha",
          "Nighasan",
          "Palia",
          "Pasgawan",
          "Phoolbehar",
          "Ramia Behar"
        ]
      },
      {
        "name": "Kushi Nagar",
        "taluks": [
          "Dudhahi",
          "Fazilnagar",
          "Hata",
          "Kaptainganj",
          "Kasaya",
          "Khadda",
          "Motichak",
          "Nebua Naurangia",
          "Padrauna",
          "Ramkola",
          "Seorahi",
          "Sukrauli",
          "Tamkuhiraj",
          "Vishunpura"
        ]
      },
      {
        "name": "Lalitpur",
        "taluks": [
          "Bar",
          "Birdha",
          "Jakhaura",
          "Mandawara",
          "Mehroni",
          "Talbehat"
        ]
      },
      {
        "name": "Lucknow",
        "taluks": [
          "Bakshi-ka-talab",
          "Chinhat",
          "Gosaiganj",
          "Kakori",
          "Mal",
          "Malihabad",
          "Mohanlalganj",
          "Sarojaninagar"
        ]
      },
      {
        "name": "Maharahganj",
        "taluks": [
          "Bridgemanganj",
          "Dhani",
          "Ghughli",
          "Lakshmipur",
          "Mahrajganj",
          "Mithaura",
          "Nautanwa",
          "Nichlaul",
          "Paniyara",
          "Partawal",
          "Pharenda",
          "Siswa"
        ]
      },
      {
        "name": "Mahoba",
        "taluks": [
          "Charkhari",
          "Jaitpur",
          "Kabrai",
          "Panwari"
        ]
      },
      {
        "name": "Mainpuri",
        "taluks": [
          "Barnahal",
          "Bewar",
          "Ghiror",
          "Jageer",
          "Karhal",
          "Kishni",
          "Kuraoli",
          "Mainpuri",
          "Sultanganj"
        ]
      },
      {
        "name": "Mathura",
        "taluks": [
          "Baldeo",
          "Chaumuha",
          "Chhata",
          "Farah",
          "Govardhan",
          "Mat",
          "Mathura",
          "Nandgaon",
          "Nohjhil",
          "Raya"
        ]
      },
      {
        "name": "Mau",
        "taluks": [
          "Badraon",
          "Dohri Ghat",
          "Fatehpur Madaun",
          "Ghosi",
          "Kopaganj",
          "Mohammadabad Gohana",
          "Pardaha",
          "Ranipur",
          "Ratanpura"
        ]
      },
      {
        "name": "Meerut",
        "taluks": [
          "Daurala",
          "Hastinapur",
          "Janikhurd",
          "Kharkhoda",
          "Machra",
          "Mawana Kalan",
          "Meerut",
          "Parikshitgarh",
          "Rajpura",
          "Rohta",
          "Sardhana",
          "Sarurpur Khurd"
        ]
      },
      {
        "name": "Mirzapur",
        "taluks": [
          "Chhanvey",
          "Hallia",
          "Jamalpur",
          "Kon",
          "Lalganj",
          "Majhawa",
          "Nagar (City)",
          "Narainpur",
          "Pahari",
          "Patehra",
          "Rajgarh",
          "Shikhar"
        ]
      },
      {
        "name": "Moradabad",
        "taluks": [
          "Asmauli",
          "Bahjoi",
          "Baniyakhera",
          "Bhagatpur Tanda",
          "Bilari",
          "Chhajlet",
          "Dilari",
          "Kundarki",
          "Moradabad",
          "Munda Pandey",
          "Panwasa",
          "Sambhal",
          "Thakurdwara"
        ]
      },
      {
        "name": "Muzaffarnagar",
        "taluks": [
          "Baghara",
          "Budhana",
          "Charthawal",
          "Jansath",
          "Kairana",
          "Kandhla",
          "Khatauli",
          "Morna",
          "Muzaffarnagar",
          "Purkaji",
          "Shahpur",
          "Shamli",
          "Thana Bhawan",
          "Un"
        ]
      },
      {
        "name": "Pilibhit",
        "taluks": [
          "Amariya",
          "Barkhera",
          "Bilsanda",
          "Bisalpur",
          "Lalaurikhera",
          "Marori",
          "Puranpur"
        ]
      },
      {
        "name": "Pratapgarh",
        "taluks": [
          "Aspur Deosara",
          "Baba Belkharnath Dham",
          "Babaganj",
          "Bihar",
          "Gaura",
          "Kalakankar",
          "Kunda",
          "Lakshamanpur",
          "Lalganj",
          "Magraura",
          "Mandhata",
          "Patti",
          "Pratapgarh (Sadar)",
          "Rampur Sanramgarh",
          "Sandwa Chandrika",
          "Sangipur",
          "Shivgarh"
        ]
      },
      {
        "name": "Prayagraj",
        "taluks": [
          "Bahadurpur",
          "Bahria",
          "Chaka",
          "Dhanupur",
          "Handia",
          "Holagarh",
          "Jasra",
          "Karchhana",
          "Kaudhiyara",
          "Kaurihar",
          "Koraon",
          "Manda",
          "Mauaima",
          "Meja",
          "Phulpur",
          "Pratappur",
          "Saidabad",
          "Shankargarh",
          "Soraon",
          "Uruwan"
        ]
      },
      {
        "name": "Raebareli",
        "taluks": [
          "Amawan",
          "Bachharawan",
          "Bahadurpur",
          "Chhatoh",
          "Dalmau",
          "Deenshah Gaura",
          "Dih",
          "Harchandpur",
          "Jagatpur",
          "Khiron",
          "Lalganj",
          "Mahrajganj",
          "Rahi",
          "Rohania",
          "Salon",
          "Sareni",
          "Sataon",
          "Shivgarh",
          "Singhpur",
          "Tiloi",
          "Unchahar"
        ]
      },
      {
        "name": "Rampur",
        "taluks": [
          "Bilaspur",
          "Chamraon",
          "Milak",
          "Saidnagar",
          "Shahabad",
          "Suar"
        ]
      },
      {
        "name": "Saharanpur",
        "taluks": [
          "Ballia Kheri",
          "Deoband",
          "Gangoh",
          "Muzaffarabad",
          "Nagal",
          "Nakur",
          "Nanauta",
          "Puwarka",
          "Rampur Maniharan",
          "Sadauli Qadeem",
          "Sarsawan"
        ]
      },
      {
        "name": "Sambal (bhim Nagar)",
        "taluks": [
          "Asmoli",
          "Baniyakheda",
          "Behjoi",
          "Gunnor",
          "Junawai",
          "Pawasa",
          "Rajpura",
          "Sambhal"
        ]
      },
      {
        "name": "Sant Kabir Nagar",
        "taluks": [
          "Baghauli",
          "Belhar Kala",
          "Hainsar Bazar",
          "Khalilabad",
          "Mehdawal",
          "Nath Nagar",
          "Pauli",
          "Santha",
          "Semariyawan"
        ]
      },
      {
        "name": "Sant Ravidas Nagar Bhadohi",
        "taluks": [
          "Abhauli",
          "Aurai",
          "Bhadohi",
          "Deegh",
          "Gyanpur",
          "Suriyavan"
        ]
      },
      {
        "name": "Shahjahanpur",
        "taluks": [
          "Banda",
          "Bhawal Khera",
          "Dadrol",
          "Jaitpur",
          "Jalalabad",
          "Kalan",
          "Kanth",
          "Khudaganj Katra",
          "Khutar",
          "Madnapur",
          "Mirzapur",
          "Nigohi",
          "Powayan",
          "Sindhauli",
          "Tilhar"
        ]
      },
      {
        "name": "Shamli (prabudh Nager)",
        "taluks": [
          "Shamli (prabudh Nager)"
        ]
      },
      {
        "name": "Shivasti",
        "taluks": [
          "Ekona",
          "Gilaula",
          "Hariharpur Rani",
          "Jamunaha",
          "Sirsiya"
        ]
      },
      {
        "name": "Siddharth Nagar",
        "taluks": [
          "Bansi",
          "Barhni",
          "Bhanwapur",
          "Birdpur",
          "Domariyaganj",
          "Itwa",
          "Jogia",
          "Khesraha",
          "Khuniyaon",
          "Lotan",
          "Mithwal",
          "Naugarh",
          "Shoharatgarh",
          "Uska Bazar"
        ]
      },
      {
        "name": "Sitapur",
        "taluks": [
          "Ailiya",
          "Behta",
          "Biswan",
          "Gondlamau",
          "Hargaon",
          "Kasmanda",
          "Khairabad",
          "Laharpur",
          "Machhrehta",
          "Mahmudabad",
          "Maholi",
          "Misrikh",
          "Pahala",
          "Parsendi",
          "Pisawan",
          "Rampur Mathura",
          "Reusa",
          "Sakran",
          "Sidhauli"
        ]
      },
      {
        "name": "Sonbhadra",
        "taluks": [
          "Babhani",
          "Chatra",
          "Chopan",
          "Dudhi",
          "Ghorawal",
          "Myorpur",
          "Nagwa",
          "Robertsganj"
        ]
      },
      {
        "name": "Sultanpur",
        "taluks": [
          "Akhand Nagar",
          "Amethi",
          "Baldirai",
          "Bhadaiya",
          "Bhadar",
          "Bhetua",
          "Dhanpatganj",
          "Dostpur",
          "Dubepur",
          "Gauriganj",
          "Jagdishpur",
          "Jaisinghpur",
          "Jamo",
          "Kadipur",
          "Kurebhar",
          "Kurwar",
          "Lambhua",
          "Motigarpur",
          "Musafir Khana",
          "P.p.kamaicha",
          "Sangrampur",
          "Shahgarh",
          "Shukul Bazar"
        ]
      },
      {
        "name": "Unnao",
        "taluks": [
          "Asoha",
          "Auras",
          "Bangarmau",
          "Bichhiya",
          "Bighapur",
          "Fatehpur Chaurasi",
          "Ganj Moradabad",
          "Hasanganj",
          "Hilauli",
          "Mianganj",
          "Nawabganj",
          "Purwa",
          "Safipur",
          "Sikandarpur Karan",
          "Sikandarpur Sarausi",
          "Sumerpur"
        ]
      },
      {
        "name": "Varanasi",
        "taluks": [
          "Arajiline",
          "Baragaon",
          "Chiraigaon",
          "Cholapur",
          "Harahua",
          "Kashi Vidyapeeth",
          "Pindra",
          "Sevapuri"
        ]
      }
    ]
  },
  {
    "state": "Uttarakhand",
    "districts": [
      {
        "name": "Almora",
        "taluks": [
          "Bhaisiya Chhana",
          "Bhikiyasain",
          "Chaukhutiya",
          "Dhauladevi",
          "Dwarahat",
          "Hawalbag",
          "Lamgara",
          "Sult",
          "Syaldey",
          "Takula",
          "Tarikhet"
        ]
      },
      {
        "name": "Bageshwar",
        "taluks": [
          "Bageshwar",
          "Garur",
          "Kapkote"
        ]
      },
      {
        "name": "Chamoli",
        "taluks": [
          "Dasholi",
          "Dewal",
          "Gairsain",
          "Ghat",
          "Joshimath",
          "Karnaprayag",
          "Narayanbagar",
          "Pokhari",
          "Tharali"
        ]
      },
      {
        "name": "Champawat",
        "taluks": [
          "Barakot",
          "Champawat",
          "Lohaghat",
          "Pati"
        ]
      },
      {
        "name": "Dehradun",
        "taluks": [
          "Chakrata",
          "Doiwala",
          "Kalsi",
          "Raipur",
          "Sahaspur",
          "Vikasnagar"
        ]
      },
      {
        "name": "Haridwar",
        "taluks": [
          "Bahadrabad",
          "Bhagwanpur",
          "Khanpur",
          "Laksar",
          "Narsan",
          "Roorkee"
        ]
      },
      {
        "name": "Nainital",
        "taluks": [
          "Betalghat",
          "Bhimtal",
          "Dhari",
          "Haldwani",
          "Kotabag",
          "Okhalkanda",
          "Ramgarh",
          "Ramnagar"
        ]
      },
      {
        "name": "Pauri Garhwal",
        "taluks": [
          "Bironkhal",
          "Duggada",
          "Dwarikhal",
          "Ekeshwar",
          "Kaljikhal",
          "Khirsu",
          "Kot",
          "Nainidanda",
          "Pabau",
          "Pauri",
          "Pokhra",
          "Rikhnikhal",
          "Thalisain",
          "Yamkeshwar",
          "Zahrikhal"
        ]
      },
      {
        "name": "Pithoragarh",
        "taluks": [
          "Berinag",
          "Dharchula",
          "Didihat",
          "Gangolihat",
          "Kanalichina",
          "Munakot",
          "Munsyari",
          "Pithoragarh"
        ]
      },
      {
        "name": "Rudraprayag",
        "taluks": [
          "Augustmuni",
          "Jakholi",
          "Ukhimath"
        ]
      },
      {
        "name": "Tehri Garwal",
        "taluks": [
          "Bhilangna",
          "Chamba",
          "Deoprayag",
          "Jakhnidhar",
          "Jaunpur",
          "Kirtinagar",
          "Narendra Nagar",
          "Pratapnagar",
          "Thauldhar"
        ]
      },
      {
        "name": "Udham Singh Nagar",
        "taluks": [
          "Bajpur",
          "Gadarpur",
          "Jaspur",
          "Kashipur",
          "Khatima",
          "Rudrapur",
          "Sitarganj"
        ]
      },
      {
        "name": "Uttarkashi",
        "taluks": [
          "Bhatwari",
          "Chinyalisaur",
          "Dunda",
          "Mori",
          "Naugaon",
          "Purola"
        ]
      }
    ]
  },
  {
    "state": "West Bengal",
    "districts": [
      {
        "name": "Alipurduar",
        "taluks": [
          "Alipurduar-i",
          "Alipurduar-ii",
          "Falakata",
          "Kalchini",
          "Kumargram",
          "Madarihat"
        ]
      },
      {
        "name": "Bankura",
        "taluks": [
          "Bankura-i",
          "Bankura-ii",
          "Barjora",
          "Chhatna",
          "Gangajal Ghati",
          "Hirbandh",
          "Indpur",
          "Indus",
          "Jaypur",
          "Khatra-i",
          "Kotulpur",
          "Mejhia",
          "Onda",
          "Patrasayer",
          "Raipur-i",
          "Ranibundh",
          "Saltora",
          "Sarenga",
          "Simlapal",
          "Sonamukhi",
          "Taldangra",
          "Vishnupur"
        ]
      },
      {
        "name": "Barddhaman",
        "taluks": [
          "Ausgram-i",
          "Ausgram-ii",
          "Barabani",
          "Bhatar",
          "Burdwan-i",
          "Burdwan-ii",
          "Faridpur - Durgapur",
          "Galsi -i",
          "Galsi-ii",
          "Jamal Pur",
          "Jamuria",
          "Kalna Ii",
          "Kalna-i",
          "Kanksa",
          "Katwa-i",
          "Katwa-ii",
          "Ketugram_i",
          "Ketugram-ii",
          "Khandaghosh",
          "Mangolkote",
          "Manteswar",
          "Memari-1",
          "Memari-ii",
          "Ondal",
          "Pandaveswar",
          "Purbasthali-i",
          "Purbasthali-ii",
          "Raina-i",
          "Raina-ii",
          "Raniganj",
          "Salanpur"
        ]
      },
      {
        "name": "Birbhum",
        "taluks": [
          "Bolpur-sriniketan",
          "Dubrajpur",
          "Illambazar",
          "Khoyrasol",
          "Labpur",
          "Mayureswar-i",
          "Mayureswar-ii",
          "Mohammad Bazar",
          "Murarai-i",
          "Murarai-ii",
          "Nalhati-i",
          "Nalhati-ii",
          "Nanoor",
          "Rajnagar",
          "Rampurhat-i",
          "Rampurhat-ii",
          "Sainthia",
          "Suri-i",
          "Suri-ii"
        ]
      },
      {
        "name": "Cooch Bihar",
        "taluks": [
          "Cooch Behar Ii",
          "Cooch Behar-i",
          "Dinhata-i",
          "Dinhata-ii",
          "Haldibari",
          "Matha Bhanga-ii",
          "Mathabhanga-i",
          "Mekliganj",
          "Sitai",
          "Sitalkuchi",
          "Tufanganj-i",
          "Tufanganj-ii"
        ]
      },
      {
        "name": "Darjeeling",
        "taluks": [
          "Darjeeling-pulbazar",
          "Gorubathan",
          "Jore Bunglow-sukiapokhri",
          "Kalimpong-i",
          "Kalimpong-ii",
          "Kharibari",
          "Kurseong",
          "Matigara",
          "Mirik",
          "Naxal Bari",
          "Phansidewa",
          "Rangli Rangliot"
        ]
      },
      {
        "name": "Est Medinipur",
        "taluks": [
          "Bhagawanpur-i",
          "Bhagawanpur-ii",
          "Chandipur",
          "Contai-i",
          "Contai-iii",
          "Deshapran",
          "Egra-i",
          "Egra-ii",
          "Haldia",
          "Khejuri-i",
          "Khejuri-ii",
          "Kolaghat",
          "Mahishadal",
          "Moyna",
          "Nandakumar",
          "Nandigram-i",
          "Nandigram-ii",
          "Nandigram-iii",
          "Panskura-i",
          "Patashpur-i",
          "Patashpur-ii",
          "Ramnagar-i",
          "Ramnagar-ii",
          "Shahid Matangini",
          "Sutahata",
          "Tamluk"
        ]
      },
      {
        "name": "Hooghly",
        "taluks": [
          "Arambagh",
          "Balagarh",
          "Chanditala-i",
          "Chanditala-ii",
          "Chinsurah-magrah",
          "Dhaniakhali",
          "Goghat-i",
          "Goghat-ii",
          "Haripal",
          "Jangipara",
          "Khanakul-i",
          "Khanakul-ii",
          "Pandua",
          "Polba-dadpur",
          "Pursurah",
          "Singur",
          "Sirampur-uttarpara",
          "Tarakeswar"
        ]
      },
      {
        "name": "Howrah",
        "taluks": [
          "Amta-i",
          "Amta-ii",
          "Bagnan-i",
          "Bagnan-ii",
          "Bally-jagacha",
          "Domjur",
          "Howarh Muncipal Corporation",
          "Jagatballavpur",
          "Panchla",
          "Sankrail",
          "Shyampur-i",
          "Shyampur-ii",
          "Udaynarayanpur",
          "Uluberia-i",
          "Uluberia-ii"
        ]
      },
      {
        "name": "Jalpaiguri",
        "taluks": [
          "Dhupguri",
          "Jalpaiguri",
          "Jalpaiguri Sadar",
          "Mal",
          "Matiali",
          "Maynaguri",
          "Nagrakata",
          "Rajganj"
        ]
      },
      {
        "name": "Kolkatta",
        "taluks": [
          "Kolkata"
        ]
      },
      {
        "name": "Maldah",
        "taluks": [
          "Bamongola",
          "Chanchal-i",
          "Chanchal-ii",
          "English Bazar",
          "Gazole",
          "Habibpur",
          "Harishchandrapur-i",
          "Harishchandrapur-ii",
          "Kaliachak-i",
          "Kaliachak-ii",
          "Kaliachak-iii",
          "Manikchak",
          "Old Malda",
          "Ratua-i",
          "Ratua-ii"
        ]
      },
      {
        "name": "Murshidabad",
        "taluks": [
          "Beldanga-i",
          "Beldanga-ii",
          "Berhampore",
          "Bhagabangola-ii",
          "Bhagawangola-i",
          "Bharatpur-i",
          "Bharatpur-ii",
          "Burwan",
          "Domkal",
          "Farakka",
          "Hariharpara",
          "Jalangi",
          "Kandi",
          "Khargram",
          "Lalgola",
          "Murshidabad-jiagunj",
          "Nabagram",
          "Nawda",
          "Raghunathganj-i",
          "Raghunathganj-ii",
          "Raninagar-i",
          "Raninagar-ii",
          "Sagardighi",
          "Shamsherganj",
          "Suti-i",
          "Suti-ii"
        ]
      },
      {
        "name": "Nadia",
        "taluks": [
          "Chakdah",
          "Chapra",
          "Hanskhali",
          "Haringhata",
          "Kaliganj",
          "Karimpur-1",
          "Karimpur-ii",
          "Krishnaganj",
          "Krishnagar-i",
          "Krishnagar-ii",
          "Nabadwip",
          "Nakashipara",
          "Ranaghat-i",
          "Ranaghat-ii",
          "Santipur",
          "Tehatta-i",
          "Tehatta-ii"
        ]
      },
      {
        "name": "North 24 Parganas",
        "taluks": [
          "Amdanga",
          "Baduria",
          "Bagda",
          "Barasat-i",
          "Barasat-ii",
          "Barrackpur-i",
          "Barrackpur-ii",
          "Basirhat-i",
          "Basirhat-ii",
          "Bongaon",
          "Deganga",
          "Gaighata",
          "Habra-i",
          "Habra-ii",
          "Haroa",
          "Hasnabad",
          "Hingalganj",
          "Minakhan",
          "Rajarhat",
          "Sandeshkhali-i",
          "Sandeshkhali-ii",
          "Swarupnagar"
        ]
      },
      {
        "name": "North Dinajpur",
        "taluks": [
          "Chopra",
          "Goalpokhar Ii",
          "Goalpokhar-i",
          "Hemtabad",
          "Islampur",
          "Itahar",
          "Kaliaganj",
          "Karandighi",
          "Raiganj"
        ]
      },
      {
        "name": "Purulia",
        "taluks": [
          "Arsha",
          "Bagmundi",
          "Balarampur",
          "Barabazar",
          "Bundwan",
          "Hura",
          "Jaipur",
          "Jhalda-i",
          "Jhalda-ii",
          "Kashipur",
          "Manbazar-i",
          "Manbazar-ii",
          "Neturia",
          "Para",
          "Puncha",
          "Purulia-i",
          "Purulia-ii",
          "Raghunath Pur-i",
          "Raghunathpur-ii",
          "Santuri"
        ]
      },
      {
        "name": "South 24 Parganas",
        "taluks": [
          "Baruipur",
          "Basanti",
          "Bhangar-i",
          "Bhangar-ii",
          "Bishnupur-i",
          "Bishnupur-ii",
          "Budge Budge-i",
          "Budge Budge-ii",
          "Canning-i",
          "Canning-ii",
          "Diamond Harbour-i",
          "Diamond Harbour-ii",
          "Falta",
          "Gosaba",
          "Jaynagar-i",
          "Jaynagar-ii",
          "Kak Dwip",
          "Kulpi",
          "Kultali",
          "Magra Hat-i",
          "Magra Hat-ii",
          "Mandirbazar",
          "Mathurapur I",
          "Mathurapur-ii",
          "Namkhana",
          "Pathar Pratima",
          "Sagar",
          "Sonar Pur",
          "Thakurpukur Mahestola"
        ]
      },
      {
        "name": "South Dinajpur",
        "taluks": [
          "Balurghat",
          "Bansihari",
          "Gangarampur",
          "Harirampur",
          "Hili",
          "Kumarganj",
          "Kushmandi",
          "Tapan"
        ]
      },
      {
        "name": "West Medinipur",
        "taluks": [
          "Binpur-i",
          "Binpur-ii",
          "Chandrakona-i",
          "Chandrakona-ii",
          "Dantan-i",
          "Dantan-ii",
          "Daspur-i",
          "Daspur-ii",
          "Debra",
          "Garbeta-i",
          "Garbeta-ii",
          "Garbeta-iii",
          "Ghatal",
          "Gopiballav Pur -ii",
          "Gopiballavpur-i",
          "Jambani",
          "Jhargram",
          "Keshiary",
          "Keshpur",
          "Kharagpur-i",
          "Kharagpur-ii",
          "Midnapore",
          "Mohanpur",
          "Narayangarh",
          "Nayagram",
          "Pingla",
          "Sabang",
          "Salbani",
          "Sankrail"
        ]
      }
    ]
  }
];
