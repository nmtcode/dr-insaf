export const AR_LABELS = {
  title: "تطبيق التشفير الشامل",
  author: "برمجة وتطوير نواف الماوري & عبدالرحمن الاشول",
  supervisor: "تحت إشراف: د/ إنصاف الرماح",
  key: "مفتاح التشفير",
  type: "نوع التشفير",
  caesarKeyNote: "المفتاح يجب أن يكون رقماً صحيحاً.",
  textKeyNote: "المفتاح النصي مطلوب.",
  plain: "النص الاصلي",
  cipher: "النص المشفر",
  encrypt: "تشفير",
  decrypt: "فك التشفير",
  clear: "مسح",
  showTable: "عرض جدول التشفير",
  caesarError: "مفتاح قيصر يجب أن يكون رقمًا صحيحًا.",
  tableTitle: "جدول التشفير",
  original: "الأصل",
  encrypted: "المشفر/القيمة",
  playfairTitle: "جدول بلاي فير (5x5)",
  typeCaesar: "القيصر",
  typePlayfair: "البلاي فير",
  typeMixed: "الأبجدية المختلطة",
  lineKeyNote: "أدخل عدد الأسطر (قيمة صحيحة موجبة ≥ 2).",
  lineKeyError: "يجب أن يكون المفتاح عدداً صحيحاً وموجباً (≥ 2) لعدد الأسطر.",
  noTableForRail: "طريقة سياج السكة الحديدية لا تعتمد على جدول إبدال ثابت.",
  typehere: "اكتب النص هنا..."
};

export const EN_LABELS = {
  title: "Comprehensive Encryption Application",
  author:
    "Programming and Development by Nawaf Al-Mawri & Abdulrahman Al-Ashwal",
  supervisor: "Supervised by: Dr/ Insaf Alramah",
  key: "Encrypt Key",
  type: "Encryption Type",
  caesarKeyNote: "The key must be an integer number.",
  textKeyNote: "A textual key is required.",
  plain: "Plain Text",
  cipher: "Cipher Text",
  encrypt: "Encrypt",
  decrypt: "Decrypt",
  clear: "Clear",
  showTable: "Show Cipher Table",
  caesarError: "Caesar key must be an integer.",
  tableTitle: "Cipher Table",
  original: "Original",
  encrypted: "Encrypted/Value",
  playfairTitle: "Playfair Table (5x5)",
  typeCaesar: "Caesar",
  typePlayfair: "Playfair",
  typeMixed: "Mixed Alphabet",
  lineKeyNote: "Enter the number of rails (positive integer ≥ 2).",
  lineKeyError:
    "The key must be a positive integer (≥ 2) for the number of rails.",
  noTableForRail:
    "The Rail Fence cipher method does not rely on a substitution table.",
      typehere: "Type here...",

};

export const ENCRYPTION_TYPES = [
  { value: "Caesar", ar: AR_LABELS.typeCaesar, en: EN_LABELS.typeCaesar },
  { value: "Playfair", ar: AR_LABELS.typePlayfair, en: EN_LABELS.typePlayfair },
  { value: "MixedAlphabet", ar: AR_LABELS.typeMixed, en: EN_LABELS.typeMixed },
  {
    value: "LineEncryption",
    en: "Rail Fence (Lines)",
    ar: "(الأسطر)",
  },
];
