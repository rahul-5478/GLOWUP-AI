import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../utils/api";

// ─── LANGUAGES ───────────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: "en", flag: "🇬🇧", name: "English", native: "English" },
  { id: "hi", flag: "🇮🇳", name: "Hindi", native: "हिन्दी" },
  { id: "ur", flag: "🇵🇰", name: "Urdu", native: "اردو" },
  { id: "ar", flag: "🇸🇦", name: "Arabic", native: "العربية" },
  { id: "fr", flag: "🇫🇷", name: "French", native: "Français" },
  { id: "es", flag: "🇪🇸", name: "Spanish", native: "Español" },
  { id: "de", flag: "🇩🇪", name: "German", native: "Deutsch" },
  { id: "pt", flag: "🇧🇷", name: "Portuguese", native: "Português" },
  { id: "ru", flag: "🇷🇺", name: "Russian", native: "Русский" },
  { id: "zh", flag: "🇨🇳", name: "Chinese", native: "中文" },
  { id: "ja", flag: "🇯🇵", name: "Japanese", native: "日本語" },
  { id: "ko", flag: "🇰🇷", name: "Korean", native: "한국어" },
  { id: "tr", flag: "🇹🇷", name: "Turkish", native: "Türkçe" },
  { id: "it", flag: "🇮🇹", name: "Italian", native: "Italiano" },
  { id: "nl", flag: "🇳🇱", name: "Dutch", native: "Nederlands" },
  { id: "pl", flag: "🇵🇱", name: "Polish", native: "Polski" },
  { id: "bn", flag: "🇧🇩", name: "Bengali", native: "বাংলা" },
  { id: "pa", flag: "🇮🇳", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "ta", flag: "🇮🇳", name: "Tamil", native: "தமிழ்" },
  { id: "te", flag: "🇮🇳", name: "Telugu", native: "తెలుగు" },
  { id: "mr", flag: "🇮🇳", name: "Marathi", native: "मराठी" },
  { id: "gu", flag: "🇮🇳", name: "Gujarati", native: "ગુજરાતી" },
  { id: "ml", flag: "🇮🇳", name: "Malayalam", native: "മലയാളം" },
  { id: "kn", flag: "🇮🇳", name: "Kannada", native: "ಕನ್ನಡ" },
  { id: "th", flag: "🇹🇭", name: "Thai", native: "ภาษาไทย" },
  { id: "vi", flag: "🇻🇳", name: "Vietnamese", native: "Tiếng Việt" },
  { id: "id", flag: "🇮🇩", name: "Indonesian", native: "Bahasa Indonesia" },
  { id: "ms", flag: "🇲🇾", name: "Malay", native: "Bahasa Melayu" },
  { id: "fa", flag: "🇮🇷", name: "Persian", native: "فارسی" },
  { id: "sw", flag: "🇰🇪", name: "Swahili", native: "Kiswahili" },
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcome_title: "Welcome to GlowUp AI",
    welcome_sub: "Set up your profile in just 2 minutes\nand get 100% personalized results!",
    choose_language: "Choose Your Language",
    choose_language_sub: "Select the language you're most comfortable with",
    who_are_you: "Who are you?",
    who_sub: "Required for hairstyle & fashion recommendations",
    how_old: "How old are you?",
    how_old_sub: "For age-appropriate recommendations",
    years_old: "years old",
    height_weight: "Height & Weight",
    hw_sub: "Required for BMI and fitness plan",
    height: "Height (cm)",
    weight: "Weight (kg)",
    your_bmi: "Your BMI",
    underweight: "Underweight",
    normal: "Normal ✅",
    overweight: "Overweight",
    obese: "Obese",
    skin_type: "What's your skin type?",
    skin_sub: "We'll personalize your skincare recommendations",
    main_goal: "What's your main goal?",
    goal_sub: "Personalize your GlowUp journey",
    all_set: "All set",
    profile_complete: "Your profile is complete ✨",
    your_profile: "Your Profile",
    gender_label: "Gender",
    age_label: "Age",
    height_label: "Height",
    weight_label: "Weight",
    skin_label: "Skin Type",
    goal_label: "Goal",
    years: "years",
    youll_get: "✨ Here's what you'll get",
    benefit1: "Face shape & gender-accurate hairstyle suggestions",
    benefit2: "Age-appropriate skincare routine",
    benefit3: "BMI-based fitness & diet plan",
    benefit4: "Personalized fashion recommendations",
    benefit5: "Skin type specific product suggestions",
    error_msg: "Could not save profile. Please try again.",
    saving: "Saving...",
    get_started: "Get Started →",
    next: "Next →",
    go_back: "← Go Back",
    start: "🚀 Start My GlowUp!",
    male: "Male", female: "Female", other: "Other",
    search_lang: "Search language...",
  },
  hi: {
    welcome_title: "GlowUp AI में आपका स्वागत है",
    welcome_sub: "बस 2 मिनट में अपना प्रोफ़ाइल बनाएं\nऔर 100% पर्सनलाइज़्ड रिज़ल्ट पाएं!",
    choose_language: "अपनी भाषा चुनें",
    choose_language_sub: "वो भाषा चुनें जिसमें आप सबसे सहज हों",
    who_are_you: "आप कौन हैं?",
    who_sub: "हेयरस्टाइल और फैशन सुझावों के लिए ज़रूरी",
    how_old: "आपकी उम्र क्या है?",
    how_old_sub: "उम्र के अनुसार सुझाव देने के लिए",
    years_old: "साल",
    height_weight: "लंबाई और वज़न",
    hw_sub: "BMI और फिटनेस प्लान के लिए ज़रूरी",
    height: "लंबाई (cm)",
    weight: "वज़न (kg)",
    your_bmi: "आपका BMI",
    underweight: "कम वज़न",
    normal: "सामान्य ✅",
    overweight: "अधिक वज़न",
    obese: "मोटापा",
    skin_type: "आपकी त्वचा का प्रकार क्या है?",
    skin_sub: "स्किनकेयर सुझाव पर्सनलाइज़ होंगे",
    main_goal: "आपका मुख्य लक्ष्य क्या है?",
    goal_sub: "अपना GlowUp सफर पर्सनलाइज़ करें",
    all_set: "सब तैयार है",
    profile_complete: "आपका प्रोफ़ाइल पूरा हो गया ✨",
    your_profile: "आपका प्रोफ़ाइल",
    gender_label: "लिंग",
    age_label: "उम्र",
    height_label: "लंबाई",
    weight_label: "वज़न",
    skin_label: "त्वचा प्रकार",
    goal_label: "लक्ष्य",
    years: "साल",
    youll_get: "✨ अब आपको यह सब मिलेगा",
    benefit1: "चेहरे के आकार के अनुसार हेयरस्टाइल",
    benefit2: "उम्र के अनुसार स्किनकेयर रूटीन",
    benefit3: "BMI आधारित फिटनेस और डाइट प्लान",
    benefit4: "पर्सनलाइज़्ड फैशन सुझाव",
    benefit5: "त्वचा के प्रकार के अनुसार प्रोडक्ट्स",
    error_msg: "प्रोफ़ाइल सेव नहीं हुई। दोबारा कोशिश करें।",
    saving: "सेव हो रहा है...",
    get_started: "शुरू करें →",
    next: "आगे बढ़ें →",
    go_back: "← वापस जाएं",
    start: "🚀 GlowUp शुरू करें!",
    male: "पुरुष", female: "महिला", other: "अन्य",
    search_lang: "भाषा खोजें...",
  },
  ur: {
    welcome_title: "GlowUp AI میں خوش آمدید",
    welcome_sub: "صرف 2 منٹ میں اپنی پروفائل بنائیں\nاور 100% ذاتی نتائج پائیں!",
    choose_language: "اپنی زبان چنیں",
    choose_language_sub: "وہ زبان چنیں جس میں آپ آرام دہ ہوں",
    who_are_you: "آپ کون ہیں؟",
    who_sub: "ہیئر اسٹائل اور فیشن تجاویز کے لیے ضروری",
    how_old: "آپ کی عمر کیا ہے؟",
    how_old_sub: "عمر کے مطابق تجاویز کے لیے",
    years_old: "سال",
    height_weight: "قد اور وزن",
    hw_sub: "BMI اور فٹنس پلان کے لیے ضروری",
    height: "قد (cm)",
    weight: "وزن (kg)",
    your_bmi: "آپ کا BMI",
    underweight: "کم وزن",
    normal: "نارمل ✅",
    overweight: "زیادہ وزن",
    obese: "موٹاپا",
    skin_type: "آپ کی جلد کی قسم کیا ہے؟",
    skin_sub: "اسکن کیئر تجاویز ذاتی ہوں گی",
    main_goal: "آپ کا مرکزی ہدف کیا ہے؟",
    goal_sub: "اپنا GlowUp سفر ذاتی بنائیں",
    all_set: "سب تیار ہے",
    profile_complete: "آپ کی پروفائل مکمل ہو گئی ✨",
    your_profile: "آپ کی پروفائل",
    gender_label: "جنس",
    age_label: "عمر",
    height_label: "قد",
    weight_label: "وزن",
    skin_label: "جلد کی قسم",
    goal_label: "ہدف",
    years: "سال",
    youll_get: "✨ آپ کو یہ سب ملے گا",
    benefit1: "چہرے کی شکل کے مطابق ہیئر اسٹائل",
    benefit2: "عمر کے مطابق اسکن کیئر روٹین",
    benefit3: "BMI پر مبنی فٹنس اور ڈائٹ پلان",
    benefit4: "ذاتی فیشن تجاویز",
    benefit5: "جلد کی قسم کے مطابق پروڈکٹس",
    error_msg: "پروفائل سیو نہیں ہوئی۔ دوبارہ کوشش کریں۔",
    saving: "سیو ہو رہا ہے...",
    get_started: "شروع کریں →",
    next: "آگے بڑھیں →",
    go_back: "← واپس جائیں",
    start: "🚀 GlowUp شروع کریں!",
    male: "مرد", female: "عورت", other: "دیگر",
    search_lang: "زبان تلاش کریں...",
  },
  ar: {
    welcome_title: "مرحباً بك في GlowUp AI",
    welcome_sub: "أنشئ ملفك الشخصي في دقيقتين\nواحصل على نتائج مخصصة 100%!",
    choose_language: "اختر لغتك",
    choose_language_sub: "اختر اللغة التي تشعر بالراحة معها",
    who_are_you: "من أنت؟",
    who_sub: "مطلوب لتوصيات تسريحة الشعر والأزياء",
    how_old: "كم عمرك؟",
    how_old_sub: "لتوصيات مناسبة للعمر",
    years_old: "سنة",
    height_weight: "الطول والوزن",
    hw_sub: "مطلوب لحساب BMI وخطة اللياقة",
    height: "الطول (cm)",
    weight: "الوزن (kg)",
    your_bmi: "مؤشر كتلة جسمك",
    underweight: "نقص الوزن",
    normal: "طبيعي ✅",
    overweight: "زيادة الوزن",
    obese: "سمنة",
    skin_type: "ما نوع بشرتك؟",
    skin_sub: "سنخصص توصيات العناية بالبشرة لك",
    main_goal: "ما هدفك الرئيسي؟",
    goal_sub: "خصص رحلة GlowUp الخاصة بك",
    all_set: "كل شيء جاهز",
    profile_complete: "اكتمل ملفك الشخصي ✨",
    your_profile: "ملفك الشخصي",
    gender_label: "الجنس",
    age_label: "العمر",
    height_label: "الطول",
    weight_label: "الوزن",
    skin_label: "نوع البشرة",
    goal_label: "الهدف",
    years: "سنة",
    youll_get: "✨ ما ستحصل عليه",
    benefit1: "اقتراحات تسريحة شعر حسب شكل وجهك",
    benefit2: "روتين عناية بالبشرة مناسب للعمر",
    benefit3: "خطة لياقة وغذاء بناءً على BMI",
    benefit4: "توصيات أزياء مخصصة",
    benefit5: "منتجات مناسبة لنوع بشرتك",
    error_msg: "تعذر حفظ الملف الشخصي. حاول مرة أخرى.",
    saving: "جارٍ الحفظ...",
    get_started: "ابدأ الآن →",
    next: "التالي →",
    go_back: "→ رجوع",
    start: "🚀 ابدأ رحلة GlowUp!",
    male: "ذكر", female: "أنثى", other: "آخر",
    search_lang: "ابحث عن اللغة...",
  },
  fr: {
    welcome_title: "Bienvenue sur GlowUp AI",
    welcome_sub: "Créez votre profil en 2 minutes\net obtenez des résultats 100% personnalisés!",
    choose_language: "Choisissez votre langue",
    choose_language_sub: "Sélectionnez la langue avec laquelle vous êtes le plus à l'aise",
    who_are_you: "Qui êtes-vous?",
    who_sub: "Requis pour les recommandations coiffure & mode",
    how_old: "Quel âge avez-vous?",
    how_old_sub: "Pour des recommandations adaptées à votre âge",
    years_old: "ans",
    height_weight: "Taille & Poids",
    hw_sub: "Requis pour le BMI et le plan fitness",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    your_bmi: "Votre IMC",
    underweight: "Insuffisance pondérale",
    normal: "Normal ✅",
    overweight: "Surpoids",
    obese: "Obésité",
    skin_type: "Quel est votre type de peau?",
    skin_sub: "Nous personnaliserons vos soins de la peau",
    main_goal: "Quel est votre objectif principal?",
    goal_sub: "Personnalisez votre parcours GlowUp",
    all_set: "Tout est prêt",
    profile_complete: "Votre profil est complet ✨",
    your_profile: "Votre Profil",
    gender_label: "Genre",
    age_label: "Âge",
    height_label: "Taille",
    weight_label: "Poids",
    skin_label: "Type de peau",
    goal_label: "Objectif",
    years: "ans",
    youll_get: "✨ Voici ce que vous obtiendrez",
    benefit1: "Suggestions de coiffure selon votre morphologie",
    benefit2: "Routine soins adaptée à votre âge",
    benefit3: "Plan fitness & nutrition basé sur l'IMC",
    benefit4: "Recommandations mode personnalisées",
    benefit5: "Produits adaptés à votre type de peau",
    error_msg: "Impossible de sauvegarder. Veuillez réessayer.",
    saving: "Enregistrement...",
    get_started: "Commencer →",
    next: "Suivant →",
    go_back: "← Retour",
    start: "🚀 Démarrer mon GlowUp!",
    male: "Homme", female: "Femme", other: "Autre",
    search_lang: "Rechercher une langue...",
  },
  es: {
    welcome_title: "Bienvenido a GlowUp AI",
    welcome_sub: "Configura tu perfil en solo 2 minutos\n¡y obtén resultados 100% personalizados!",
    choose_language: "Elige tu idioma",
    choose_language_sub: "Selecciona el idioma con el que te sientas más cómodo",
    who_are_you: "¿Quién eres?",
    who_sub: "Necesario para recomendaciones de peinado y moda",
    how_old: "¿Cuántos años tienes?",
    how_old_sub: "Para recomendaciones apropiadas para tu edad",
    years_old: "años",
    height_weight: "Altura y Peso",
    hw_sub: "Necesario para BMI y plan de fitness",
    height: "Altura (cm)",
    weight: "Peso (kg)",
    your_bmi: "Tu IMC",
    underweight: "Bajo peso",
    normal: "Normal ✅",
    overweight: "Sobrepeso",
    obese: "Obesidad",
    skin_type: "¿Cuál es tu tipo de piel?",
    skin_sub: "Personalizaremos tus recomendaciones de cuidado",
    main_goal: "¿Cuál es tu objetivo principal?",
    goal_sub: "Personaliza tu viaje GlowUp",
    all_set: "Todo listo",
    profile_complete: "Tu perfil está completo ✨",
    your_profile: "Tu Perfil",
    gender_label: "Género",
    age_label: "Edad",
    height_label: "Altura",
    weight_label: "Peso",
    skin_label: "Tipo de piel",
    goal_label: "Objetivo",
    years: "años",
    youll_get: "✨ Esto es lo que obtendrás",
    benefit1: "Sugerencias de peinado según tu forma de cara",
    benefit2: "Rutina de cuidado adecuada para tu edad",
    benefit3: "Plan de fitness y dieta basado en IMC",
    benefit4: "Recomendaciones de moda personalizadas",
    benefit5: "Productos específicos para tu tipo de piel",
    error_msg: "No se pudo guardar el perfil. Por favor, inténtalo de nuevo.",
    saving: "Guardando...",
    get_started: "Empezar →",
    next: "Siguiente →",
    go_back: "← Volver",
    start: "🚀 ¡Iniciar mi GlowUp!",
    male: "Hombre", female: "Mujer", other: "Otro",
    search_lang: "Buscar idioma...",
  },
  de: {
    welcome_title: "Willkommen bei GlowUp AI",
    welcome_sub: "Richte dein Profil in nur 2 Minuten ein\nund erhalte 100% personalisierte Ergebnisse!",
    choose_language: "Wähle deine Sprache",
    choose_language_sub: "Wähle die Sprache, mit der du dich am wohlsten fühlst",
    who_are_you: "Wer bist du?",
    who_sub: "Erforderlich für Frisur- & Modeempfehlungen",
    how_old: "Wie alt bist du?",
    how_old_sub: "Für altersgerechte Empfehlungen",
    years_old: "Jahre alt",
    height_weight: "Größe & Gewicht",
    hw_sub: "Erforderlich für BMI und Fitnessplan",
    height: "Größe (cm)",
    weight: "Gewicht (kg)",
    your_bmi: "Dein BMI",
    underweight: "Untergewicht",
    normal: "Normal ✅",
    overweight: "Übergewicht",
    obese: "Adipositas",
    skin_type: "Was ist dein Hauttyp?",
    skin_sub: "Wir personalisieren deine Hautpflege",
    main_goal: "Was ist dein Hauptziel?",
    goal_sub: "Personalisiere deine GlowUp-Reise",
    all_set: "Alles bereit",
    profile_complete: "Dein Profil ist vollständig ✨",
    your_profile: "Dein Profil",
    gender_label: "Geschlecht",
    age_label: "Alter",
    height_label: "Größe",
    weight_label: "Gewicht",
    skin_label: "Hauttyp",
    goal_label: "Ziel",
    years: "Jahre",
    youll_get: "✨ Das bekommst du",
    benefit1: "Frisurvorschläge passend zu deiner Gesichtsform",
    benefit2: "Altersgerechte Hautpflegeroutine",
    benefit3: "BMI-basierter Fitness- & Ernährungsplan",
    benefit4: "Personalisierte Modeempfehlungen",
    benefit5: "Produkte passend zu deinem Hauttyp",
    error_msg: "Profil konnte nicht gespeichert werden. Bitte erneut versuchen.",
    saving: "Wird gespeichert...",
    get_started: "Loslegen →",
    next: "Weiter →",
    go_back: "← Zurück",
    start: "🚀 Mein GlowUp starten!",
    male: "Männlich", female: "Weiblich", other: "Divers",
    search_lang: "Sprache suchen...",
  },
  pt: {
    welcome_title: "Bem-vindo ao GlowUp AI",
    welcome_sub: "Configure seu perfil em apenas 2 minutos\ne obtenha resultados 100% personalizados!",
    choose_language: "Escolha seu idioma",
    choose_language_sub: "Selecione o idioma com o qual você se sente mais confortável",
    who_are_you: "Quem é você?",
    who_sub: "Necessário para recomendações de penteado e moda",
    how_old: "Quantos anos você tem?",
    how_old_sub: "Para recomendações adequadas à sua idade",
    years_old: "anos",
    height_weight: "Altura e Peso",
    hw_sub: "Necessário para IMC e plano de fitness",
    height: "Altura (cm)",
    weight: "Peso (kg)",
    your_bmi: "Seu IMC",
    underweight: "Abaixo do peso",
    normal: "Normal ✅",
    overweight: "Sobrepeso",
    obese: "Obesidade",
    skin_type: "Qual é o seu tipo de pele?",
    skin_sub: "Vamos personalizar seus cuidados com a pele",
    main_goal: "Qual é o seu objetivo principal?",
    goal_sub: "Personalize sua jornada GlowUp",
    all_set: "Tudo pronto",
    profile_complete: "Seu perfil está completo ✨",
    your_profile: "Seu Perfil",
    gender_label: "Gênero",
    age_label: "Idade",
    height_label: "Altura",
    weight_label: "Peso",
    skin_label: "Tipo de pele",
    goal_label: "Objetivo",
    years: "anos",
    youll_get: "✨ Veja o que você vai receber",
    benefit1: "Sugestões de penteado para seu formato de rosto",
    benefit2: "Rotina de cuidados adequada para sua idade",
    benefit3: "Plano de fitness e dieta baseado no IMC",
    benefit4: "Recomendações de moda personalizadas",
    benefit5: "Produtos específicos para o seu tipo de pele",
    error_msg: "Não foi possível salvar o perfil. Tente novamente.",
    saving: "Salvando...",
    get_started: "Começar →",
    next: "Próximo →",
    go_back: "← Voltar",
    start: "🚀 Iniciar meu GlowUp!",
    male: "Masculino", female: "Feminino", other: "Outro",
    search_lang: "Pesquisar idioma...",
  },
  ru: {
    welcome_title: "Добро пожаловать в GlowUp AI",
    welcome_sub: "Настройте профиль за 2 минуты\nи получите 100% персонализированные результаты!",
    choose_language: "Выберите язык",
    choose_language_sub: "Выберите язык, на котором вам удобнее",
    who_are_you: "Кто вы?",
    who_sub: "Необходимо для рекомендаций по прическам и моде",
    how_old: "Сколько вам лет?",
    how_old_sub: "Для рекомендаций, соответствующих возрасту",
    years_old: "лет",
    height_weight: "Рост и вес",
    hw_sub: "Необходимо для ИМТ и плана фитнеса",
    height: "Рост (cm)",
    weight: "Вес (kg)",
    your_bmi: "Ваш ИМТ",
    underweight: "Недостаточный вес",
    normal: "Норма ✅",
    overweight: "Избыточный вес",
    obese: "Ожирение",
    skin_type: "Какой у вас тип кожи?",
    skin_sub: "Мы персонализируем ваш уход за кожей",
    main_goal: "Какова ваша главная цель?",
    goal_sub: "Персонализируйте ваше путешествие GlowUp",
    all_set: "Всё готово",
    profile_complete: "Ваш профиль заполнен ✨",
    your_profile: "Ваш профиль",
    gender_label: "Пол",
    age_label: "Возраст",
    height_label: "Рост",
    weight_label: "Вес",
    skin_label: "Тип кожи",
    goal_label: "Цель",
    years: "лет",
    youll_get: "✨ Вот что вы получите",
    benefit1: "Советы по прическам для формы вашего лица",
    benefit2: "Уход за кожей по возрасту",
    benefit3: "План фитнеса и питания на основе ИМТ",
    benefit4: "Персонализированные советы по моде",
    benefit5: "Продукты для вашего типа кожи",
    error_msg: "Не удалось сохранить профиль. Попробуйте ещё раз.",
    saving: "Сохранение...",
    get_started: "Начать →",
    next: "Далее →",
    go_back: "← Назад",
    start: "🚀 Начать мой GlowUp!",
    male: "Мужской", female: "Женский", other: "Другой",
    search_lang: "Поиск языка...",
  },
  zh: {
    welcome_title: "欢迎使用 GlowUp AI",
    welcome_sub: "只需2分钟完成个人资料设置\n获取100%个性化结果！",
    choose_language: "选择您的语言",
    choose_language_sub: "选择您最舒适的语言",
    who_are_you: "您是谁？",
    who_sub: "用于发型和时尚推荐",
    how_old: "您多大了？",
    how_old_sub: "提供适合年龄的建议",
    years_old: "岁",
    height_weight: "身高和体重",
    hw_sub: "用于BMI和健身计划",
    height: "身高 (cm)",
    weight: "体重 (kg)",
    your_bmi: "您的BMI",
    underweight: "体重不足",
    normal: "正常 ✅",
    overweight: "超重",
    obese: "肥胖",
    skin_type: "您的肤质是什么？",
    skin_sub: "我们将个性化您的护肤建议",
    main_goal: "您的主要目标是什么？",
    goal_sub: "个性化您的GlowUp之旅",
    all_set: "一切就绪",
    profile_complete: "您的资料已完成 ✨",
    your_profile: "您的资料",
    gender_label: "性别",
    age_label: "年龄",
    height_label: "身高",
    weight_label: "体重",
    skin_label: "肤质",
    goal_label: "目标",
    years: "岁",
    youll_get: "✨ 您将获得",
    benefit1: "根据脸型推荐发型",
    benefit2: "适合年龄的护肤程序",
    benefit3: "基于BMI的健身饮食计划",
    benefit4: "个性化时尚推荐",
    benefit5: "适合您肤质的产品",
    error_msg: "无法保存资料，请重试。",
    saving: "保存中...",
    get_started: "开始 →",
    next: "下一步 →",
    go_back: "← 返回",
    start: "🚀 开始我的GlowUp！",
    male: "男", female: "女", other: "其他",
    search_lang: "搜索语言...",
  },
  ja: {
    welcome_title: "GlowUp AIへようこそ",
    welcome_sub: "2分でプロフィールを設定して\n100%パーソナライズされた結果を得ましょう！",
    choose_language: "言語を選択",
    choose_language_sub: "最も使いやすい言語を選択してください",
    who_are_you: "あなたは誰ですか？",
    who_sub: "ヘアスタイル＆ファッション推薦に必要",
    how_old: "何歳ですか？",
    how_old_sub: "年齢に合ったアドバイスのために",
    years_old: "歳",
    height_weight: "身長と体重",
    hw_sub: "BMIとフィットネスプランに必要",
    height: "身長 (cm)",
    weight: "体重 (kg)",
    your_bmi: "あなたのBMI",
    underweight: "低体重",
    normal: "普通 ✅",
    overweight: "過体重",
    obese: "肥満",
    skin_type: "肌タイプは何ですか？",
    skin_sub: "スキンケアをパーソナライズします",
    main_goal: "主な目標は何ですか？",
    goal_sub: "GlowUpの旅をパーソナライズ",
    all_set: "準備完了",
    profile_complete: "プロフィールが完成しました ✨",
    your_profile: "あなたのプロフィール",
    gender_label: "性別",
    age_label: "年齢",
    height_label: "身長",
    weight_label: "体重",
    skin_label: "肌タイプ",
    goal_label: "目標",
    years: "歳",
    youll_get: "✨ あなたが得られるもの",
    benefit1: "顔の形に合ったヘアスタイル提案",
    benefit2: "年齢に合ったスキンケアルーティン",
    benefit3: "BMIベースのフィットネス＆食事プラン",
    benefit4: "パーソナライズされたファッション推薦",
    benefit5: "肌タイプに合った製品",
    error_msg: "プロフィールを保存できませんでした。もう一度お試しください。",
    saving: "保存中...",
    get_started: "始める →",
    next: "次へ →",
    go_back: "← 戻る",
    start: "🚀 GlowUpを始める！",
    male: "男性", female: "女性", other: "その他",
    search_lang: "言語を検索...",
  },
  ko: {
    welcome_title: "GlowUp AI에 오신 것을 환영합니다",
    welcome_sub: "2분 만에 프로필을 설정하고\n100% 맞춤화된 결과를 받아보세요!",
    choose_language: "언어를 선택하세요",
    choose_language_sub: "가장 편한 언어를 선택하세요",
    who_are_you: "당신은 누구인가요?",
    who_sub: "헤어스타일 및 패션 추천을 위해 필요",
    how_old: "나이가 어떻게 되세요?",
    how_old_sub: "나이에 맞는 추천을 위해",
    years_old: "세",
    height_weight: "키와 몸무게",
    hw_sub: "BMI와 피트니스 플랜을 위해 필요",
    height: "키 (cm)",
    weight: "몸무게 (kg)",
    your_bmi: "내 BMI",
    underweight: "저체중",
    normal: "정상 ✅",
    overweight: "과체중",
    obese: "비만",
    skin_type: "피부 타입이 어떻게 되세요?",
    skin_sub: "스킨케어 추천을 맞춤화해 드립니다",
    main_goal: "주요 목표가 무엇인가요?",
    goal_sub: "나만의 GlowUp 여정을 만들어보세요",
    all_set: "모두 준비됐어요",
    profile_complete: "프로필이 완성되었습니다 ✨",
    your_profile: "내 프로필",
    gender_label: "성별",
    age_label: "나이",
    height_label: "키",
    weight_label: "몸무게",
    skin_label: "피부 타입",
    goal_label: "목표",
    years: "세",
    youll_get: "✨ 받을 수 있는 것들",
    benefit1: "얼굴형에 맞는 헤어스타일 제안",
    benefit2: "나이에 맞는 스킨케어 루틴",
    benefit3: "BMI 기반 피트니스 & 식단 플랜",
    benefit4: "맞춤 패션 추천",
    benefit5: "피부 타입별 제품 추천",
    error_msg: "프로필을 저장할 수 없습니다. 다시 시도해 주세요.",
    saving: "저장 중...",
    get_started: "시작하기 →",
    next: "다음 →",
    go_back: "← 뒤로",
    start: "🚀 내 GlowUp 시작!",
    male: "남성", female: "여성", other: "기타",
    search_lang: "언어 검색...",
  },
};

// Fallback to English for languages without full translation
const getLang = (id) => T[id] || T["en"];

// ─── GOALS (translated dynamically) ─────────────────────────────────────────
const getGoals = (t) => [
  { id: "weight_loss", icon: "🔥", label: t.en?.goal_weight_loss || "Weight Loss", desc: "Lose body fat" },
  { id: "muscle_building", icon: "💪", label: "Muscle Build", desc: "Build strong body" },
  { id: "weight_gain", icon: "⬆️", label: "Weight Gain", desc: "Healthy weight gain" },
  { id: "skin_glow", icon: "✨", label: "Skin Glow", desc: "Improve skin health" },
  { id: "style_upgrade", icon: "👗", label: "Style Up", desc: "Upgrade fashion sense" },
  { id: "maintenance", icon: "⚖️", label: "Maintain", desc: "Maintain current level" },
];

const GOALS = [
  { id: "weight_loss", icon: "🔥", label: "Weight Loss", desc: "Lose body fat" },
  { id: "muscle_building", icon: "💪", label: "Muscle Build", desc: "Build strong body" },
  { id: "weight_gain", icon: "⬆️", label: "Weight Gain", desc: "Healthy weight gain" },
  { id: "skin_glow", icon: "✨", label: "Skin Glow", desc: "Improve skin health" },
  { id: "style_upgrade", icon: "👗", label: "Style Up", desc: "Upgrade fashion sense" },
  { id: "maintenance", icon: "⚖️", label: "Maintain", desc: "Maintain current level" },
];

const SKIN_TYPES = [
  { id: "oily", icon: "💧", label: "Oily", desc: "Shiny, prone to acne" },
  { id: "dry", icon: "🏜️", label: "Dry", desc: "Tight, flaky skin" },
  { id: "normal", icon: "✅", label: "Normal", desc: "Balanced skin" },
  { id: "combination", icon: "☯️", label: "Combination", desc: "Oily T-zone, dry cheeks" },
  { id: "sensitive", icon: "🌸", label: "Sensitive", desc: "Easily irritated" },
];

const FEATURES = [
  { icon: "✨", label: "Face Analysis", desc: "AI face shape & hairstyle recommendations", color: "#FF6B6B", bg: "rgba(255,107,107,0.12)" },
  { icon: "💪", label: "Fitness Coach", desc: "Custom workout & diet plan", color: "#4D96FF", bg: "rgba(77,150,255,0.12)" },
  { icon: "👗", label: "Fashion Advisor", desc: "Outfit ideas for any occasion", color: "#845EF7", bg: "rgba(132,94,247,0.12)" },
  { icon: "🧴", label: "Skin Analysis", desc: "Personalized skincare routine", color: "#51CF66", bg: "rgba(81,207,102,0.12)" },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("en");
  const [langSearch, setLangSearch] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [skinType, setSkinType] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { user, refreshUser } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const totalSteps = 8; // +1 for language step

  const t = getLang(language);
  const isRTL = ["ar", "ur", "fa", "he"].includes(language);

  const filteredLangs = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.native.toLowerCase().includes(langSearch.toLowerCase())
  );

  const canNext = () => {
    if (step === 1) return !!language;
    if (step === 2) return !!gender;
    if (step === 3) return !!age && parseInt(age) > 0 && parseInt(age) < 120;
    if (step === 4) return !!height && !!weight;
    if (step === 5) return !!skinType;
    if (step === 6) return !!goal;
    return true;
  };

  const handleNext = async () => {
    if (!canNext()) return;

    if (step === totalSteps - 1) {
      setSaving(true);
      setError("");
      try {
        const profileData = {};
        if (language) profileData.language = language;
        if (gender) profileData.gender = gender;
        if (age && parseInt(age) > 0) profileData.age = parseInt(age);
        if (height && parseFloat(height) > 0) profileData.height = parseFloat(height);
        if (weight && parseFloat(weight) > 0) profileData.weight = parseFloat(weight);
        if (skinType) profileData.skinType = skinType;
        if (goal) profileData.goal = goal;

        await userAPI.updateProfile({ profile: profileData });
        await refreshUser();

        localStorage.setItem("glowup_onboarded", "true");
        localStorage.setItem("glowup_user_gender", gender);
        localStorage.setItem("glowup_language", language);

        onComplete();
      } catch (e) {
        console.error("Profile save error:", e.response?.data || e.message);
        setError(t.error_msg);
      }
      setSaving(false);
      return;
    }

    setStep(s => s + 1);
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    textAlign: "center",
    direction: isRTL ? "rtl" : "ltr",
  };

  const bmiCategory = () => {
    const bmi = parseFloat(weight) / ((parseFloat(height) / 100) ** 2);
    if (bmi < 18.5) return t.underweight;
    if (bmi < 25) return t.normal;
    if (bmi < 30) return t.overweight;
    return t.obese;
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--bg)",
      zIndex: 2000, display: "flex", flexDirection: "column", overflow: "hidden",
      direction: isRTL ? "rtl" : "ltr"
    }}>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / totalSteps) * 100}%`,
          background: "linear-gradient(90deg, #FF6B6B, #845EF7, #4D96FF)",
          transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          borderRadius: 2
        }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "12px 0 0" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 3,
            width: i === step ? 20 : 5,
            background: i <= step
              ? "linear-gradient(90deg, #FF6B6B, #845EF7)"
              : "rgba(255,255,255,0.1)",
            transition: "all 0.3s ease"
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(132,94,247,0.35)"
              }}>✨</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
                color: "var(--text)", lineHeight: 1.2, marginBottom: 10
              }}>
                Welcome to{" "}
                <span style={{
                  background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>GlowUp AI</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                Set up your profile in just 2 minutes<br />and get 100% personalized results!
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 18, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    background: f.bg, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{f.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Language Selection */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #4D96FF, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🌍</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                Choose Your Language
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                Select the language you're most comfortable with
              </div>
            </div>

            {/* Search bar */}
            <input
              type="text"
              placeholder="🔍 Search language..."
              value={langSearch}
              onChange={e => setLangSearch(e.target.value)}
              style={{
                ...inputStyle,
                textAlign: "left",
                marginBottom: 12,
                fontSize: 14,
                padding: "12px 16px",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto" }}>
              {filteredLangs.map(l => (
                <div key={l.id} onClick={() => setLanguage(l.id)}
                  style={{
                    padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: language === l.id
                      ? "linear-gradient(135deg, rgba(77,150,255,0.12), rgba(132,94,247,0.12))"
                      : "var(--card)",
                    border: `2px solid ${language === l.id ? "#845EF7" : "var(--border)"}`,
                    transition: "all 0.2s",
                  }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{l.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                      color: language === l.id ? "#845EF7" : "var(--text)"
                    }}>{l.native}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{l.name}</div>
                  </div>
                  {language === l.id && (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", background: "#845EF7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#fff", flexShrink: 0
                    }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Gender */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #4D96FF, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>👤</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.who_are_you}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                {t.who_sub}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "male", icon: "👨", label: t.male, color: "#4D96FF" },
                { id: "female", icon: "👩", label: t.female, color: "#FF6B9D" },
                { id: "other", icon: "🧑", label: t.other, color: "#845EF7" },
              ].map(g => (
                <div key={g.id} onClick={() => setGender(g.id)}
                  style={{
                    flex: 1, padding: "22px 10px", borderRadius: 20,
                    cursor: "pointer", textAlign: "center",
                    background: gender === g.id ? `${g.color}15` : "var(--card)",
                    border: `2px solid ${gender === g.id ? g.color : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: gender === g.id ? "scale(1.04)" : "scale(1)"
                  }}>
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: gender === g.id ? g.color : "var(--text)"
                  }}>{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Age */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🎂</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.how_old}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                {t.how_old_sub}
              </div>
            </div>
            <input
              type="number" placeholder="25" value={age}
              onChange={e => setAge(e.target.value)}
              style={{ ...inputStyle, fontSize: 32, fontWeight: 800, padding: "20px" }}
            />
            <div style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
              {t.years_old}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[18, 20, 22, 25, 28, 30, 35].map(a => (
                <div key={a} onClick={() => setAge(String(a))}
                  style={{
                    padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                    background: age === String(a) ? "rgba(255,107,107,0.15)" : "var(--card)",
                    border: `1.5px solid ${age === String(a) ? "#FF6B6B" : "var(--border)"}`,
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: age === String(a) ? "#FF6B6B" : "var(--muted)"
                  }}>{a}</div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Height & Weight */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #51CF66, #20C997)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>📏</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.height_weight}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                {t.hw_sub}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>
                {t.height}
              </div>
              <input type="number" placeholder="170" value={height}
                onChange={e => setHeight(e.target.value)}
                style={{ ...inputStyle, fontSize: 28, fontWeight: 800 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[155, 160, 165, 170, 175, 180, 185].map(h => (
                  <div key={h} onClick={() => setHeight(String(h))}
                    style={{
                      padding: "6px 10px", borderRadius: 12, cursor: "pointer",
                      background: height === String(h) ? "rgba(81,207,102,0.15)" : "var(--card)",
                      border: `1.5px solid ${height === String(h) ? "#51CF66" : "var(--border)"}`,
                      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                      color: height === String(h) ? "#51CF66" : "var(--muted)"
                    }}>{h}</div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>
                {t.weight}
              </div>
              <input type="number" placeholder="70" value={weight}
                onChange={e => setWeight(e.target.value)}
                style={{ ...inputStyle, fontSize: 28, fontWeight: 800 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[50, 55, 60, 65, 70, 75, 80].map(w => (
                  <div key={w} onClick={() => setWeight(String(w))}
                    style={{
                      padding: "6px 10px", borderRadius: 12, cursor: "pointer",
                      background: weight === String(w) ? "rgba(81,207,102,0.15)" : "var(--card)",
                      border: `1.5px solid ${weight === String(w) ? "#51CF66" : "var(--border)"}`,
                      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                      color: weight === String(w) ? "#51CF66" : "var(--muted)"
                    }}>{w}</div>
                ))}
              </div>
            </div>

            {height && weight && (
              <div style={{
                marginTop: 16, padding: "12px 16px",
                background: "rgba(77,150,255,0.08)", borderRadius: 14,
                border: "1px solid rgba(77,150,255,0.2)", textAlign: "center"
              }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{t.your_bmi}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 800, color: "#4D96FF" }}>
                  {(parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
                  {bmiCategory()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Skin Type */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FF6B9D, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🧴</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.skin_type}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                {t.skin_sub}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SKIN_TYPES.map(s => (
                <div key={s.id} onClick={() => setSkinType(s.id)}
                  style={{
                    padding: "16px 18px", borderRadius: 16, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    background: skinType === s.id
                      ? "linear-gradient(135deg, rgba(255,107,157,0.1), rgba(132,94,247,0.1))"
                      : "var(--card)",
                    border: `2px solid ${skinType === s.id ? "#845EF7" : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: skinType === s.id ? "scale(1.02)" : "scale(1)"
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: skinType === s.id ? "rgba(132,94,247,0.15)" : "var(--surface)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                      color: skinType === s.id ? "#845EF7" : "var(--text)"
                    }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  {skinType === s.id && (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", background: "#845EF7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#fff", flexShrink: 0
                    }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Goal */}
        {step === 6 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🎯</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.main_goal}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                {t.goal_sub}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {GOALS.map(g => (
                <div key={g.id} onClick={() => setGoal(g.id)}
                  style={{
                    padding: "18px 14px", borderRadius: 18, cursor: "pointer", textAlign: "center",
                    background: goal === g.id
                      ? "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(132,94,247,0.15))"
                      : "var(--card)",
                    border: `2px solid ${goal === g.id ? "#845EF7" : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: goal === g.id ? "scale(1.04)" : "scale(1)"
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: goal === g.id ? "#845EF7" : "var(--text)", marginBottom: 4
                  }}>{g.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Ready */}
        {step === 7 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #51CF66, #20C997)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(81,207,102,0.35)"
              }}>🚀</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                {t.all_set},{" "}
                <span style={{
                  background: "linear-gradient(135deg, #51CF66, #20C997)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{firstName}!</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>
                {t.profile_complete}
              </div>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 20, marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
                {t.your_profile}
              </div>
              {[
                { icon: "🌍", label: "Language", value: LANGUAGES.find(l => l.id === language)?.native, color: "#4D96FF" },
                { icon: gender === "male" ? "👨" : gender === "female" ? "👩" : "🧑", label: t.gender_label, value: gender === "male" ? t.male : gender === "female" ? t.female : t.other, color: "#4D96FF" },
                { icon: "🎂", label: t.age_label, value: `${age} ${t.years}`, color: "#FFD93D" },
                { icon: "📏", label: t.height_label, value: `${height} cm`, color: "#51CF66" },
                { icon: "⚖️", label: t.weight_label, value: `${weight} kg`, color: "#FF6B6B" },
                { icon: "🧴", label: t.skin_label, value: SKIN_TYPES.find(s => s.id === skinType)?.label, color: "#845EF7" },
                { icon: GOALS.find(g => g.id === goal)?.icon || "🎯", label: t.goal_label, value: GOALS.find(g => g.id === goal)?.label, color: "#FF6B9D" },
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${item.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{item.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.value}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                </div>
              ))}
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,107,0.08), rgba(132,94,247,0.08))",
              border: "1px solid rgba(132,94,247,0.2)", borderRadius: 16, padding: "14px 16px"
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#845EF7", fontWeight: 700, marginBottom: 8 }}>
                {t.youll_get}
              </div>
              {[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5].map((item, i) => (
                <div key={i} style={{
                  fontFamily: "var(--font-body)", fontSize: 12,
                  color: "var(--muted)", marginBottom: 4, display: "flex", gap: 8
                }}>
                  <span style={{ color: "#51CF66" }}>✓</span> {item}
                </div>
              ))}
            </div>

            {error && (
              <div style={{
                marginTop: 12, padding: "10px 14px",
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                borderRadius: 12, fontFamily: "var(--font-body)",
                fontSize: 13, color: "#FF6B6B", textAlign: "center"
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* Bottom Button */}
      <div style={{
        padding: "16px 20px 32px", flexShrink: 0,
        background: "linear-gradient(to top, var(--bg) 80%, transparent)"
      }}>
        <button
          onClick={handleNext}
          disabled={!canNext() || saving}
          style={{
            width: "100%", padding: "16px", border: "none", borderRadius: 16,
            cursor: canNext() && !saving ? "pointer" : "not-allowed",
            background: canNext() && !saving
              ? "linear-gradient(135deg, #FF6B6B, #845EF7)"
              : "var(--surface)",
            color: "#fff",
            fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700,
            boxShadow: canNext() ? "0 8px 28px rgba(132,94,247,0.4)" : "none",
            transition: "all 0.2s",
            opacity: canNext() && !saving ? 1 : 0.5,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
          {saving ? (
            <>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                animation: "spin 0.75s linear infinite"
              }} />
              {t.saving}
            </>
          ) : step === 0 ? "Get Started →"
            : step === totalSteps - 1 ? t.start
            : t.next}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={saving}
            style={{
              width: "100%", marginTop: 10, padding: "12px", border: "none",
              background: "transparent", fontFamily: "var(--font-body)",
              fontSize: 13, color: "var(--muted)", cursor: "pointer"
            }}>
            {t.go_back}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}