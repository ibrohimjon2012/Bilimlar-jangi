import { Question } from "./types";

export const QUESTIONS_POOL: Question[] = [
  // --- LEVEL 1 ---
  {
    id: "l1_q1",
    level: 1,
    category: "KOMPYUTER TUGMALARI",
    question: "Klaviaturadagi 'Ctrl + C' tugmalar birikmasi kompyuterda odatda qanday vazifani bajaradi?",
    options: {
      A: "Belgilangan matn yoki fayldan nusxa ko'chiradi (Copy)",
      B: "Nusxa ko'chirilgan narsani joylashtiradi (Paste)",
      C: "Hujjatni xotiraga saqlaydi (Save)",
      D: "Dasturni majburiy yopadi (Close)"
    },
    correctAnswer: "A",
    explanation: "Ctrl + C - belgilangan matn, rasm yoki fayllarni nusxalash (clipboardga olish) uchun eng ko'p ishlatiladigan tezkor tugmadir."
  },
  {
    id: "l1_q2",
    level: 1,
    category: "PYTHON",
    question: "Python dasturlash tilida ma'lumotlarni ekranga chiqarish uchun qaysi kalit so'z yoki funksiyadan foydalaniladi?",
    options: {
      A: "input()",
      B: "print()",
      C: "write()",
      D: "console.log()"
    },
    correctAnswer: "B",
    explanation: "print() funksiyasi Python tilida uning ichiga yozilgan matn yoki o'zgaruvchilarni ekranga (konsolga) chop etadi."
  },

  // --- LEVEL 2 ---
  {
    id: "l2_q1",
    level: 2,
    category: "SCRATCH",
    question: "Scratch vizual dasturlash muhitida sahna ustida harakatlanadigan, buyruqlarni bajaradigan qahramon yoki ob'ekt nima deb ataladi?",
    options: {
      A: "Fon (Backdrop)",
      B: "Sprite (Rasmcha/Qahramon)",
      C: "Skript",
      D: "Blok"
    },
    correctAnswer: "B",
    explanation: "Scratch loyihasidagi barcha ob'ektlar, jumladan mashhur sariq mushukcha ham 'Sprite' (sprite) deb ataladi."
  },
  {
    id: "l2_q2",
    level: 2,
    category: "CANVA",
    question: "Canva dasturida tayyorlangan dizayn loyihasini kompyuter yoki telefonga rasm shaklida yuklab olish uchun qaysi bo'lim ishlatiladi?",
    options: {
      A: "Yuklab olish (Download)",
      B: "Musiqa qo'shish",
      C: "Kanal yaratish",
      D: "Kodlash"
    },
    correctAnswer: "A",
    explanation: "Tayyor bo'lgan dizaynlarni PNG, JPG yoki PDF formatlarida qurilmaga saqlash uchun 'Yuklab olish' (Download) bo'limidan foydalaniladi."
  },

  // --- LEVEL 3 ---
  {
    id: "l3_q1",
    level: 3,
    category: "KOMPYUTER TUGMALARI",
    question: "Klaviaturadagi 'Ctrl + V' tugmalari birgalikda bosilganda nima sodir bo'ladi?",
    options: {
      A: "Belgilangan faylni o'chirib tashlaydi",
      B: "Nusxa olingan ma'lumotni kursor turgan joyga joylashtiradi (Paste)",
      C: "Yangi bo'sh hujjat ochadi",
      D: "Yozuv shriftini qalinlashtiradi"
    },
    correctAnswer: "B",
    explanation: "Ctrl + V tezkor tugmasi clipboardda turgan (nusxa olingan) matn yoki fayllarni kursor turgan joyga joylashtirish vazifasini bajaradi."
  },
  {
    id: "l3_q2",
    level: 3,
    category: "PYTHON",
    question: "Python dasturlash tilida butun sonlarni (masalan: 10, -5, 100) saqlash uchun qaysi ma'lumot turidan foydalaniladi?",
    options: {
      A: "float",
      B: "str",
      C: "int (integer)",
      D: "bool"
    },
    correctAnswer: "C",
    explanation: "int (butun son) ma'lumot turi kasr bo'lmagan barcha musbat va manfiy butun sonlarni saqlaydi."
  },

  // --- LEVEL 4 ---
  {
    id: "l4_q1",
    level: 4,
    category: "SCRATCH",
    question: "Scratch-da yaratgan dasturimizni yoki o'yinimizni ishga tushirish uchun odatda sahna tepasidagi qaysi rangdagi tugma bosiladi?",
    options: {
      A: "Sariq uchburchak",
      B: "Qizil sakkizburchak",
      C: "Yashil bayroqcha",
      D: "Ko'k doira"
    },
    correctAnswer: "C",
    explanation: "Yashil bayroqcha Scratch loyihalarida o'yin yoki dasturni ishga tushirish uchun standart boshlang'ich nuqta hisoblanadi."
  },
  {
    id: "l4_q2",
    level: 4,
    category: "CANVA",
    question: "Canva-da oldindan mutaxassislar tomonidan yaratilgan, dizaynimiz uchun tayyor asos bo'lib xizmat qiluvchi andozalar nima deb nomlanadi?",
    options: {
      A: "Shablonlar (Templates)",
      B: "Shriftlar",
      C: "Teglar",
      D: "Gridlar"
    },
    correctAnswer: "A",
    explanation: "Shablonlar (templates) foydalanuvchilarga noldan boshlamasdan, tayyor chiroyli dizaynlarni tezda tahrirlab foydalanish imkonini beradi."
  },

  // --- LEVEL 5 ---
  {
    id: "l5_q1",
    level: 5,
    category: "KOMPYUTER TUGMALARI",
    question: "Xatolik tufayli noto'g'ri yozilgan yoki o'chirilgan amalni tezda ortga qaytarish (bekor qilish) uchun qaysi tugmalar ishlatiladi?",
    options: {
      A: "Ctrl + Y",
      B: "Ctrl + S",
      C: "Ctrl + Z",
      D: "Ctrl + Esc"
    },
    correctAnswer: "C",
    explanation: "Ctrl + Z tugmalari oxirgi amalni bekor qiladi (Undo) va tizimni yoki matnni bir qadam oldingi holatiga qaytaradi."
  },
  {
    id: "l5_q2",
    level: 5,
    category: "PYTHON",
    question: "Python-da dastur ishlashiga ta'sir qilmaydigan, faqat kodni tushunish oson bo'lishi uchun yoziladigan izohlar (comment) qaysi belgi bilan boshlanadi?",
    options: {
      A: "//",
      B: "/*",
      C: "# (panjara)",
      D: "<!--"
    },
    correctAnswer: "C",
    explanation: "Python tilida panjara (#) belgisi bilan boshlanadigan har qanday satr izoh hisoblanib, u kompilyator tomonidan hisobga olinmaydi."
  },

  // --- LEVEL 6 ---
  {
    id: "l6_q1",
    level: 6,
    category: "SCRATCH",
    question: "Sprite-ning tashqi ko'rinishini (masalan, yurganda oyoqlarini qimirlatishini) o'zgartirish uchun Scratch-da nimalarni almashtiramiz?",
    options: {
      A: "Kostyumlar (Costumes)",
      B: "Ovozlar",
      C: "Sahnadagi koordinatalar",
      D: "O'zgaruvchilar"
    },
    correctAnswer: "A",
    explanation: "Kostyumlar - bu bitta Spritening har xil chizilgan ko'rinishlari bo'lib, ularni navbatma-navbat almashtirib animatsiya hosil qilinadi."
  },
  {
    id: "l6_q2",
    level: 6,
    category: "CANVA",
    question: "Canva loyihasida biron-bir matn, rasm yoki shaklni vaqtincha surilib ketmasligi uchun qotirib qo'yishda qaysi funksiyadan foydalaniladi?",
    options: {
      A: "Guruhlash (Group)",
      B: "Qulflash (Lock)",
      C: "Shaffoflik (Transparency)",
      D: "Nusxalash (Duplicate)"
    },
    correctAnswer: "B",
    explanation: "Qulflash (Lock) funksiyasi tanlangan dizayn elementlarini qotirib qo'yadi, natijada boshqa elementlarni tahrirlashda ular xalaqit bermaydi."
  },

  // --- LEVEL 7 ---
  {
    id: "l7_q1",
    level: 7,
    category: "KOMPYUTER TUGMALARI",
    question: "Veb-brauzerlarda (masalan, Google Chrome) ochilgan internet sahifasini yangilash (Refresh) uchun qaysi klavish bosiladi?",
    options: {
      A: "F1",
      B: "F5",
      C: "F11",
      D: "Space (Bo'shliq)"
    },
    correctAnswer: "B",
    explanation: "F5 tugmasi internet sahifalarini qaytadan yuklash yoki yangilash (Reload/Refresh) uchun tezkor tugmadir."
  },
  {
    id: "l7_q2",
    level: 7,
    category: "PYTHON",
    question: "Python tilida qo'shtirnoq ichiga yozilgan x = \"12\" o'zgaruvchisining ma'lumot turi qanday bo'ladi?",
    options: {
      A: "int (integer)",
      B: "str (string / satr)",
      C: "float",
      D: "bool"
    },
    correctAnswer: "B",
    explanation: "Qo'shtirnoq yoki yakka tirnoq ichiga olingan har qanday qiymat (hatto u raqam bo'lsa ham) Python-da 'str' (satr) turi hisoblanadi."
  },

  // --- LEVEL 8 ---
  {
    id: "l8_q1",
    level: 8,
    category: "SCRATCH",
    question: "Scratch-da ob'ektni ma'lum bir tomonga qarab yurgizish (qadam bosishi) uchun asosan qaysi rangdagi va qaysi bo'limdagi bloklar ishlatiladi?",
    options: {
      A: "Ko'k rangli, 'Harakat' (Motion) bo'limi",
      B: "Sariq rangli, 'Hodisalar' (Events) bo'limi",
      C: "Binafsha rangli, 'Ko'rinish' (Looks) bo'limi",
      D: "Yashil rangli, 'Operatorlar' bo'limi"
    },
    correctAnswer: "A",
    explanation: "Spritening o'rnini yoki yo'nalishini o'zgartirish (masalan: '10 qadam yurish') buyruqlari ko'k rangli 'Harakat' bo'limida joylashgan."
  },
  {
    id: "l8_q2",
    level: 8,
    category: "CANVA",
    question: "Canva-da dizaynga har xil chiroyli tayyor grafik shakllar, chiziqlar, ramkalar yoki stikerlar qo'shish uchun chap paneldagi qaysi bo'limga kiriladi?",
    options: {
      A: "Matn (Text)",
      B: "Elementlar (Elements)",
      C: "Yuklanganlar (Uploads)",
      D: "Loyiha sozlamalari"
    },
    correctAnswer: "B",
    explanation: "Elementlar (Elements) bo'limidan har qanday tayyor shakllar, rasmlar va grafik grafik dizayn detallarini qidirib topib qo'shish mumkin."
  },

  // --- LEVEL 9 ---
  {
    id: "l9_q1",
    level: 9,
    category: "KOMPYUTER TUGMALARI",
    question: "Yozib turgan hujjatimiz yoki loyihamiz o'chib ketmasligi uchun uni kompyuter xotirasiga tezkor saqlash (Save) buyrug'i qaysi?",
    options: {
      A: "Ctrl + O",
      B: "Ctrl + N",
      C: "Ctrl + S",
      D: "Ctrl + P"
    },
    correctAnswer: "C",
    explanation: "Ctrl + S (Save) tugmalari barcha ofis va grafik dasturlarda joriy hujjatni saqlash vazifasini bajaradi."
  },
  {
    id: "l9_q2",
    level: 9,
    category: "PYTHON",
    question: "Python dasturlash tilida shartlarni tekshirish uchun qaysi kalit so'zdan foydalaniladi?",
    options: {
      A: "while",
      B: "for",
      C: "if",
      D: "def"
    },
    correctAnswer: "C",
    explanation: "if kalit so'zi berilgan shartning rost ('true') yoki yolg'on ('false') ekanligini tekshirish uchun yoziladi."
  },

  // --- LEVEL 10 ---
  {
    id: "l10_q1",
    level: 10,
    category: "SCRATCH",
    question: "Scratch-da biror buyruqlar to'plamini to'xtovsiz, o'yin tugaguncha doimiy qaytarib turish uchun qaysi blokdan foydalaniladi?",
    options: {
      A: "'har doim' (forever) bloki",
      B: "'kutish' bloki",
      C: "'takrorla 10 marta' bloki",
      D: "'agar bo'lsa' bloki"
    },
    correctAnswer: "A",
    explanation: "'har doim' (forever) bloki ichidagi barcha skriptlarni o'yin qo'lda to'xtatilmaguncha tinimsiz aylantiradi."
  },
  {
    id: "l10_q2",
    level: 10,
    category: "CANVA",
    question: "Foydalanuvchi Canva-ga o'z kompyuteridagi shaxsiy fotosurat yoki rasmni dizaynda ishlatish uchun qaysi bo'lim orqali yuklaydi?",
    options: {
      A: "Dizayn (Design)",
      B: "Yuklanganlar (Uploads)",
      C: "Chizish (Draw)",
      D: "Ilovalar (Apps)"
    },
    correctAnswer: "B",
    explanation: "Yuklanganlar (Uploads) bo'limi orqali shaxsiy kompyuter yoki telefondagi fayllarni Canva bulutli xotirasiga kiritish mumkin."
  },

  // --- LEVEL 11 ---
  {
    id: "l11_q1",
    level: 11,
    category: "KOMPYUTER TUGMALARI",
    question: "Kompyuter ekranida ochiq turgan bir nechta dasturlar (oynalar) o'rtasida sichqonchasiz tez almashish uchun qaysi tugmalar ishlatiladi?",
    options: {
      A: "Ctrl + Tab",
      B: "Alt + Tab",
      C: "Shift + Enter",
      D: "Ctrl + Esc"
    },
    correctAnswer: "B",
    explanation: "Alt + Tab tugmalarini bosib turish orqali ochiq turgan turli oynalar ro'yxati chiqadi va ular o'rtasida tezkor o'tish imkoni beriladi."
  },
  {
    id: "l11_q2",
    level: 11,
    category: "PYTHON",
    question: "Python-da rost (true) va yolg'on (false) qiymatlarini o'z ichiga oluvchi ma'lumot turi qanday nomlanadi?",
    options: {
      A: "string",
      B: "integer",
      C: "boolean (bool)",
      D: "dictionary"
    },
    correctAnswer: "C",
    explanation: "bool (boolean) turi faqat ikkita qiymatni qabul qiladi: True (rost) yoki False (yolg'on)."
  },

  // --- LEVEL 12 ---
  {
    id: "l12_q1",
    level: 12,
    category: "SCRATCH",
    question: "Scratch-da harakatlanayotgan sprite sahna chegarasiga yetganda qayrilib, o'yin maydonidan chiqib ketmasligi uchun qaysi blok qo'yiladi?",
    options: {
      A: "'agar chetga tegsa, qayt' (if on edge, bounce)",
      B: "'buril 90 darajaga'",
      C: "'ko'rinishni yashir'",
      D: "'to'xtat barchasini'"
    },
    correctAnswer: "A",
    explanation: "'if on edge, bounce' bloki ob'ekt chegaraga tegishi bilan uning yo'nalishini teskari tomonga avtomatik burib beradi."
  },
  {
    id: "l12_q2",
    level: 12,
    category: "CANVA",
    question: "Canva-da yozilgan matnli elementga soyalar qo'shish, uni neon nuri kabi yoritish yoki egri qilish qaysi menyu yordamida bajariladi?",
    options: {
      A: "Animatsiya (Animate)",
      B: "Effektlar (Effects)",
      C: "Shaffoflik (Transparency)",
      D: "Joylashuv (Position)"
    },
    correctAnswer: "B",
    explanation: "Effektlar (Effects) menyusi yordamida matnlarga turli vizual uslublar (soya, kontur, neon va egilish) beriladi."
  },

  // --- LEVEL 13 ---
  {
    id: "l13_q1",
    level: 13,
    category: "KOMPYUTER TUGMALARI",
    question: "Kompyuter klaviaturasidagi qaysi tugma Windows tizimidagi asosiy 'Bosh sahifa' (Pusk / Start) menyusini ochadi?",
    options: {
      A: "Space (Bo'shliq)",
      B: "Esc",
      C: "Windows logotipli tugma (Win)",
      D: "Alt"
    },
    correctAnswer: "C",
    explanation: "Windows (Win) klavishi bosilganda ekran burchagidagi asosiy ishga tushirish (Pusk) menyusi ochiladi."
  },
  {
    id: "l13_q2",
    level: 13,
    category: "PYTHON",
    question: "Python dasturlash tilida 'for i in range(5):' kodi takrorlanganda, 'i' o'zgaruvchisi oxirgi qadamda qaysi qiymatni oladi?",
    options: {
      A: "5",
      B: "4",
      C: "0",
      D: "1"
    },
    correctAnswer: "B",
    explanation: "range(5) funksiyasi 0 dan 5 gacha bo'lgan sonlarni yaratadi (5 kirmaydi), shuning uchun oxirgi qiymat 4 bo'ladi."
  },

  // --- LEVEL 14 ---
  {
    id: "l14_q1",
    category: "SCRATCH",
    level: 14,
    question: "Scratch dasturida foydalanuvchi sichqoncha tugmasini bosgan-bosmaganligini tekshirish uchun qaysi sensor blokidan foydalaniladi?",
    options: {
      A: "'sichqoncha bosildimi?' (mouse down?)",
      B: "'klavish bosildimi?'",
      C: "'fonga tegyaptimi?'",
      D: "'rang aniqlandimi?'"
    },
    correctAnswer: "A",
    explanation: "'mouse down?' mantiqiy bloki sichqoncha tugmasi bosilgan lahzada 'rost' (true) qiymat qaytaradi."
  },
  {
    id: "l14_q2",
    level: 14,
    category: "CANVA",
    question: "Canva-da rasm yoki shaklning orqasidagi foni yoki boshqa elementlar ko'rinib turishi uchun qaysi xususiyat foizi pasaytiriladi?",
    options: {
      A: "Shaffoflik (Transparency / Opacity)",
      B: "Yorqinlik (Brightness)",
      C: "Kontrast",
      D: "Hajm (Scale)"
    },
    correctAnswer: "A",
    explanation: "Shaffoflik (Transparency) xususiyati 100% dan kamaytirilganda element shaffof bo'lib, uning ortidagi ob'ektlar ko'rina boshlaydi."
  },

  // --- LEVEL 15 ---
  {
    id: "l15_q1",
    level: 15,
    category: "PYTHON",
    question: "Python dasturlash tilida 'x = 10 % 3' amali bajarilgandan so'ng x o'zgaruvchisining qiymati necha bo'ladi?",
    options: {
      A: "3",
      B: "1",
      C: "10",
      D: "0"
    },
    correctAnswer: "B",
    explanation: "% operatori bo'lishdan qolgan qoldiqni hisoblaydi. 10 ni 3 ga bo'lganda qoldiq 1 qoladi."
  },
  {
    id: "l15_q2",
    level: 15,
    category: "KOMPYUTER TUGMALARI",
    question: "Kompyuter ekranidagi barcha faol oynalarni bir zumda kichraytirib (minimize), bevosita 'Ish stoli' (Desktop)ni ko'rsatish tezkor tugmasi qaysi?",
    options: {
      A: "Win + D",
      B: "Alt + F4",
      C: "Ctrl + W",
      D: "Shift + Tab"
    },
    correctAnswer: "A",
    explanation: "Win + D (Desktop) tezkor tugmasi barcha oynalarni bir zumda pastga yig'adi va foydalanuvchiga ish stolini ko'rsatadi."
  }
];
