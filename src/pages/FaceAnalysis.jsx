import { useState, useRef, useCallback } from "react";
import { GlowButton, SectionTitle, Card, LoadingDots, ErrorMessage } from "../components/UI";
import { useLang } from "../hooks/useLanguage";
import { useMediaPipeFace } from "../hooks/useMediaPipeFace";

// ─── 🔑 APNI PEXELS API KEY YAHAN LAGAO ──────────────────────────────────────
const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY_HERE";

// ─── Pexels se real-time image fetch karne wala function ─────────────────────
const fetchPexelsImage = async (query) => {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " hairstyle")}&per_page=1&orientation=portrait`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    }
  } catch (e) {
    console.warn("Pexels fetch failed for:", query);
  }
  return null;
};

// ─── Pexels images cache (baar baar same query na ho) ────────────────────────
const pexelsCache = {};

const getOrFetchPexels = async (query) => {
  if (pexelsCache[query]) return pexelsCache[query];
  const url = await fetchPexelsImage(query);
  if (url) pexelsCache[query] = url;
  return url;
};

// ─── Fallback images (agar Pexels fail ho) ───────────────────────────────────
const FALLBACK_IMAGES = {
  male: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
  female: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80",
};

// ─── Hairstyle Databases ──────────────────────────────────────────────────────
const MALE_HAIRSTYLES = {
  round: [
    { name: "Quiff", pexelsQuery: "men quiff hairstyle", reason: "Adds height on top, makes face look longer and leaner", maintenance: "Medium", time: "10-15 min", bestFor: "Thick hair", avoid: "Too much side volume" },
    { name: "High Fade Undercut", pexelsQuery: "men fade undercut haircut", reason: "Short sides reduce width, longer top creates vertical illusion", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Round styling on top" },
    { name: "Pompadour", pexelsQuery: "men pompadour hairstyle", reason: "Strong volume on top elongates round face perfectly", maintenance: "High", time: "20 min", bestFor: "Thick straight hair", avoid: "Flat styling" },
    { name: "Taper Fade", pexelsQuery: "men taper fade haircut", reason: "Clean sides with length on top — ideal combo for round faces", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Wide side parts" },
    { name: "French Crop", pexelsQuery: "men french crop haircut", reason: "Textured top with tight sides creates angular look", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Fluffy top" },
    { name: "Mohawk Fade", pexelsQuery: "men mohawk fade haircut", reason: "Central strip of height makes face appear longer", maintenance: "Medium", time: "15 min", bestFor: "Medium thick hair", avoid: "Wide mohawk strips" },
  ],
  oval: [
    { name: "Textured Quiff", pexelsQuery: "men textured quiff haircut", reason: "Oval face suits almost everything — quiff shows off balance", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Nothing — you're lucky!" },
    { name: "Slick Back", pexelsQuery: "men slick back hair", reason: "Reveals your balanced proportions — classic and timeless", maintenance: "Medium", time: "10 min", bestFor: "Straight to wavy", avoid: "Too much product" },
    { name: "High Fade Undercut", pexelsQuery: "men fade undercut haircut", reason: "Modern clean look that works perfectly with oval face", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Nothing specific" },
    { name: "Crew Cut", pexelsQuery: "men crew cut hairstyle", reason: "Sharp and clean — highlights your well-balanced features", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Too long on top" },
    { name: "Pompadour", pexelsQuery: "men pompadour hairstyle", reason: "Dramatic style that oval faces carry perfectly", maintenance: "High", time: "20 min", bestFor: "Thick hair", avoid: "Flat sides" },
    { name: "Buzz Cut", pexelsQuery: "men buzz cut short hair", reason: "Confident minimal style — oval faces pull it off best", maintenance: "Low", time: "1 min", bestFor: "All hair types", avoid: "If you have scars/bumps" },
  ],
  square: [
    { name: "Textured Crop", pexelsQuery: "men textured crop haircut", reason: "Soft texture at top reduces the sharpness of strong jawline", maintenance: "Low", time: "5 min", bestFor: "Medium hair", avoid: "Geometric sharp lines" },
    { name: "Side Part", pexelsQuery: "men side part hairstyle", reason: "Asymmetry breaks the symmetrical squareness of face", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Very deep center part" },
    { name: "Messy Waves", pexelsQuery: "men messy wavy hair", reason: "Wavy texture adds natural softness to sharp angular jaw", maintenance: "Low", time: "5 min", bestFor: "Wavy hair", avoid: "Hard lines and sharp edges" },
    { name: "Caesar Cut", pexelsQuery: "men caesar cut haircut", reason: "Forward fringe softens strong forehead and jaw", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Very short fringe" },
    { name: "Quiff", pexelsQuery: "men quiff hairstyle", reason: "Height on top distracts from wide jawline", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Wide flat quiff" },
  ],
  oblong: [
    { name: "Side Part", pexelsQuery: "men side part hairstyle", reason: "Horizontal line adds visual width to elongated face", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Center part" },
    { name: "Crew Cut", pexelsQuery: "men crew cut hairstyle", reason: "Even length all around prevents further elongation", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Extra height on top" },
    { name: "Caesar Cut", pexelsQuery: "men caesar cut haircut", reason: "Fringe significantly shortens visible forehead length", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Swept back styles" },
    { name: "Taper with Side Volume", pexelsQuery: "men taper fade side volume", reason: "Volume at sides adds width without height", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Very high top" },
    { name: "Buzz Cut", pexelsQuery: "men buzz cut short hair", reason: "Uniform length minimizes face length perception", maintenance: "Low", time: "1 min", bestFor: "All hair types", avoid: "Height boosting styles" },
  ],
  heart: [
    { name: "Side Swept Undercut", pexelsQuery: "men side swept undercut", reason: "Reduces wide forehead, draws attention to chin area", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Wide top volume" },
    { name: "Textured Crop with Fringe", pexelsQuery: "men textured crop fringe", reason: "Light fringe balances heart shaped forehead", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Extreme height" },
    { name: "Crew Cut", pexelsQuery: "men crew cut hairstyle", reason: "Neat and clean — works very well with heart face", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Too much top height" },
    { name: "French Crop", pexelsQuery: "men french crop haircut", reason: "Textured fringe breaks forehead width", maintenance: "Low", time: "5 min", bestFor: "Fine hair", avoid: "Backward swept styles" },
    { name: "Taper Fade", pexelsQuery: "men taper fade haircut", reason: "Clean precise cut that balances heart shape", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Flared sides" },
  ],
  diamond: [
    { name: "Side Part Pompadour", pexelsQuery: "men side part pompadour", reason: "Forehead volume balances narrow chin of diamond face", maintenance: "High", time: "20 min", bestFor: "Thick hair", avoid: "Cheekbone volume" },
    { name: "Quiff", pexelsQuery: "men quiff hairstyle", reason: "Height at forehead balances prominent cheekbones", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Wide side volume" },
    { name: "Caesar Crop", pexelsQuery: "men caesar cut haircut", reason: "Fringe adds width to narrow forehead area", maintenance: "Low", time: "5 min", bestFor: "Fine to medium", avoid: "High swept styles" },
    { name: "Undercut", pexelsQuery: "men undercut hairstyle", reason: "Clean sides with top volume balances diamond proportions", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Middle volume" },
    { name: "Slick Back", pexelsQuery: "men slick back hair", reason: "Reveals face structure elegantly for diamond shape", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Too flat application" },
  ],
};

const FEMALE_HAIRSTYLES = {
  round: [
    { name: "Long Layers", pexelsQuery: "women long layered hair", reason: "Lengthens face and adds beautiful vertical movement", maintenance: "Medium", time: "15 min", bestFor: "Medium to thick hair", avoid: "Chin length blunt cuts" },
    { name: "Lob with Side Part", pexelsQuery: "women lob side part hairstyle", reason: "Below chin length with side part slims round face perfectly", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Center part" },
    { name: "Side Swept Bangs", pexelsQuery: "women side swept bangs", reason: "Creates diagonal line across forehead, reduces roundness", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
    { name: "Curtain Bangs", pexelsQuery: "women curtain bangs hairstyle", reason: "Soft parted bangs frame face and reduce roundness", maintenance: "Medium", time: "10 min", bestFor: "Thin to medium hair", avoid: "Blunt straight fringe" },
    { name: "High Ponytail", pexelsQuery: "women high ponytail hairstyle", reason: "Lifts face appearance, adds height and length", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Low ponytail at ears" },
    { name: "Wavy Lob", pexelsQuery: "women wavy lob haircut", reason: "Waves below jaw create length illusion for round face", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Chin level volume" },
  ],
  oval: [
    { name: "Layered Bob", pexelsQuery: "women layered bob haircut", reason: "Shows off your perfect oval proportions beautifully", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Nothing — try everything!" },
    { name: "Pixie Cut", pexelsQuery: "women pixie cut short hair", reason: "Bold and stunning — oval faces carry pixie cut best", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Very long sides" },
    { name: "Wavy Long", pexelsQuery: "women long wavy hair", reason: "Any length works — waves add beautiful texture", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Nothing specific" },
    { name: "Blunt Bob", pexelsQuery: "women blunt bob haircut", reason: "Clean strong lines complement balanced oval proportions", maintenance: "Medium", time: "15 min", bestFor: "Straight hair", avoid: "Too much layering" },
    { name: "Curtain Bangs", pexelsQuery: "women curtain bangs hairstyle", reason: "Trendy style that oval faces pull off effortlessly", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Too thick bangs" },
    { name: "Natural Curls", pexelsQuery: "women natural curly hair medium", reason: "Natural curls frame oval face with gorgeous movement", maintenance: "High", time: "20 min", bestFor: "Naturally curly", avoid: "Over-straightening" },
  ],
  square: [
    { name: "Soft Wavy Long", pexelsQuery: "women soft wavy long hair", reason: "Waves naturally soften angular jawline beautifully", maintenance: "Medium", time: "20 min", bestFor: "All hair types", avoid: "Blunt geometric cuts" },
    { name: "Long Layered", pexelsQuery: "women long layered hair", reason: "Layers at face level soften strong square features", maintenance: "Medium", time: "20 min", bestFor: "Medium to thick", avoid: "Blunt one-length" },
    { name: "Side Swept Bangs", pexelsQuery: "women side swept bangs", reason: "Asymmetry softens the symmetrical squareness", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
    { name: "Loose Braid", pexelsQuery: "women loose braid hairstyle", reason: "Loose braids soften strong features gracefully", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Tight slick braids" },
    { name: "Curtain Bangs", pexelsQuery: "women curtain bangs hairstyle", reason: "Soft curtain bangs reduce harsh forehead angles", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
  ],
  oblong: [
    { name: "Blunt Bob", pexelsQuery: "women blunt bob haircut", reason: "Adds horizontal width, significantly reduces face length", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Very long styles" },
    { name: "Bangs with Layers", pexelsQuery: "women bangs layered haircut", reason: "Fringe shortens forehead — biggest help for oblong face", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Swept back styles" },
    { name: "Wavy Bob", pexelsQuery: "women wavy bob haircut", reason: "Volume at sides reduces face length perception", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Center part with long hair" },
    { name: "Side Braid", pexelsQuery: "women side braid hairstyle", reason: "Side braids add horizontal width to narrow face", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Top buns" },
    { name: "Voluminous Curls", pexelsQuery: "women voluminous curly hair", reason: "Big curls add width at cheeks to balance length", maintenance: "High", time: "25 min", bestFor: "Curly hair", avoid: "Flat lifeless styles" },
  ],
  heart: [
    { name: "Chin Length Bob", pexelsQuery: "women chin length bob haircut", reason: "Adds width at narrow chin to perfectly balance heart shape", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Top heavy styles" },
    { name: "Side Swept Bangs", pexelsQuery: "women side swept bangs", reason: "Reduces wide forehead — most effective for heart face", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Heavy straight bangs" },
    { name: "Wavy Long", pexelsQuery: "women long wavy hair", reason: "Waves below jaw add width and balance to pointed chin", maintenance: "Medium", time: "20 min", bestFor: "Wavy hair", avoid: "Huge top volume" },
    { name: "Curtain Bangs", pexelsQuery: "women curtain bangs hairstyle", reason: "Soft curtain bangs reduce wide forehead subtly", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Thick blunt bangs" },
    { name: "Low Bun", pexelsQuery: "women low bun hairstyle", reason: "Low bun adds width at jaw to balance forehead", maintenance: "Low", time: "5 min", bestFor: "Long hair", avoid: "Top knot or high bun" },
  ],
  diamond: [
    { name: "Chin Bob with Volume", pexelsQuery: "women chin bob voluminous hair", reason: "Chin length adds width to narrow chin of diamond face", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Cheek level volume" },
    { name: "Side Swept Bangs", pexelsQuery: "women side swept bangs", reason: "Widens narrow forehead — very effective for diamond", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Center part" },
    { name: "Wavy Medium", pexelsQuery: "women medium wavy hair", reason: "Volume at forehead and chin balances wide cheekbones", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Maximum volume at cheeks" },
    { name: "Curtain Bangs", pexelsQuery: "women curtain bangs hairstyle", reason: "Adds width to narrow forehead of diamond shape", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt bangs" },
    { name: "Pixie with Volume", pexelsQuery: "women pixie cut volume", reason: "Volume at crown and sides balances diamond shape", maintenance: "Low", time: "10 min", bestFor: "Fine to medium", avoid: "Flat tight pixie" },
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getHairstyles = (faceShape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const db = isFemale ? FEMALE_HAIRSTYLES : MALE_HAIRSTYLES;
  const shape = faceShape?.toLowerCase() || "oval";
  return db[shape] || db["oval"];
};

const getFaceShapeTips = (shape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const maleTips = {
    round: ["Add height on top to make face look longer", "Avoid bowl cuts — they emphasize roundness", "Side parts work better than center parts", "Textured layers on top reduce roundness", "Keep sides tight, volume only on top"],
    oval: ["Lucky! Almost any hairstyle suits you", "Both short and long styles work great", "You can experiment with fringes freely", "Slick back, quiff, buzz — all look good", "Show off your balanced features confidently"],
    square: ["Soften strong jawline with layers and waves", "Avoid blunt cuts that emphasize jaw width", "Side swept styles reduce angular sharpness", "Curls and waves are your best friends", "Longer top with taper sides works great"],
    oblong: ["Add width with layers and side volume", "Avoid very long straight hairstyles", "Bangs/fringe can shorten face length", "Curls and waves add great width visually", "Side parts with volume at ears works best"],
    heart: ["Balance wide forehead with jaw-level volume", "Side swept bangs reduce forehead width", "Avoid top-heavy volume styles", "Textured crops with fringe work great", "Taper fade with textured top is ideal"],
    diamond: ["Add volume at forehead and chin area", "Avoid volume specifically at cheekbones", "Side swept styles work great for you", "Chin length cuts balance narrow proportions", "Undercut with longer top is perfect"],
  };
  const femaleTips = {
    round: ["Long layers below shoulders lengthen face", "Avoid chin-length blunt cuts — they widen", "Side parts create diagonal that slims face", "Curtain bangs frame without widening", "Sleek straight long hair is your best friend"],
    oval: ["You can try literally any hairstyle!", "Short pixie to long waves — all work", "Blunt bobs, curtain bangs, curls — all great", "Show off your natural proportions", "Experiment freely — you won the face shape lottery"],
    square: ["Soft waves and curls soften angular jaw", "Avoid blunt geometric cuts — they sharpen jaw", "Side swept bangs break strong symmetry", "Layered cuts at face level soften features", "Loose braids add elegant softness"],
    oblong: ["Blunt bob adds width and reduces length", "Bangs are your best tool — always use them", "Avoid extra long straight styles", "Volume at sides is your friend", "Side braids add horizontal width"],
    heart: ["Volume at chin level balances wide forehead", "Side swept or curtain bangs reduce forehead", "Chin length or below is your sweet spot", "Avoid top-heavy styles and high volume", "Low buns add width at jaw level"],
    diamond: ["Add volume at forehead AND chin simultaneously", "Side swept bangs widen narrow forehead", "Chin bob is your most flattering cut", "Curtain bangs frame your face beautifully", "Layered styles at chin level are ideal"],
  };
  const tips = isFemale ? femaleTips : maleTips;
  return tips[shape?.toLowerCase()] || tips["oval"];
};

const getMaleProducts = () => [
  { name: "Beardo Activated Charcoal Shampoo", price: "₹349", use: "Deep cleanses oily scalp", where: "Nykaa" },
  { name: "The Man Company Hair Wax", price: "₹299", use: "Medium hold for daily styling", where: "Amazon" },
  { name: "Ustraa Hair Serum", price: "₹249", use: "Tames flyaways & frizz", where: "Ustraa.com" },
  { name: "Beardo Hair & Beard Oil", price: "₹299", use: "Nourishes & strengthens roots", where: "Nykaa" },
  { name: "Set Wet Hair Gel", price: "₹99", use: "Strong hold for styled looks", where: "BigBasket" },
];

const getFemaleProducts = () => [
  { name: "Mamaearth Onion Shampoo", price: "₹299", use: "Reduces hair fall significantly", where: "Nykaa" },
  { name: "WOW Apple Cider Conditioner", price: "₹349", use: "Adds shine and softness", where: "Amazon" },
  { name: "Livon Hair Serum", price: "₹149", use: "Controls frizz instantly", where: "BigBasket" },
  { name: "Streax Walnut Hair Oil", price: "₹199", use: "Deep nourishment & growth", where: "Nykaa" },
  { name: "Tresemme Keratin Smooth Shampoo", price: "₹399", use: "Smoothens and de-frizzes", where: "Amazon" },
];

const getMaintenanceTips = (level, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  if (level === "Low") return isFemale
    ? ["Wash 2-3 times a week with mild shampoo", "Air dry to avoid heat damage", "Use leave-in conditioner for moisture", "Trim every 8-10 weeks to maintain shape", "Light serum on damp hair for shine"]
    : ["Wash 2-3 times a week", "Air dry — no heat styling needed", "Trim every 6-8 weeks", "Light wax or gel to set if needed", "Oil once a week for healthy scalp"];
  if (level === "Medium") return isFemale
    ? ["Wash 3-4 times a week", "Always condition after shampooing", "Blow dry with round brush for shape", "Trim every 6-8 weeks", "Use heat protectant before blow drying"]
    : ["Wash 3-4 times a week", "Use conditioner on ends", "Blow dry for shape and volume", "Trim every 4-6 weeks", "Medium hold product to style"];
  return isFemale
    ? ["Wash every other day or daily", "Deep condition once a week", "Always use heat protectant spray", "Blow dry + iron or curler to finish", "Trim every 4-6 weeks for shape"]
    : ["Wash daily or every other day", "Use heat protectant before styling", "Blow dry + product to set", "Trim every 3-4 weeks for shape", "Hold spray or pomade to finish"];
};

const getSkinScoreColor = (score) => score >= 70 ? "#51CF66" : score >= 50 ? "#FFD93D" : "#FF6B6B";
const getGradeColor = (grade) => ({ A: "#51CF66", B: "#4D96FF", C: "#FFD93D", D: "#FF9500", F: "#FF6B6B" })[grade] || "#888";

const getFaceShapeDetails = (shape) => {
  const details = {
    round: "Tumhara chehra round shape ka hai — cheekbones wide hain aur jawline aur forehead almost same width ke hain. Hairstyles jo height add karein best hain.",
    oval: "Oval face shape sabse balanced maana jaata hai — forehead thoda wide, jawline slightly narrow. Almost sabhi hairstyles suit karte hain!",
    square: "Tumhara jawline strong aur defined hai. Soft layers aur waves sharp features ko balance karte hain.",
    oblong: "Tumhara chehra lambe shape ka hai — length width se zyada. Side volume aur bangs chehra balance karte hain.",
    heart: "Wide forehead aur narrow pointed chin — heart shape elegant hota hai. Chin level pe volume add karo.",
    diamond: "Prominent cheekbones ke saath narrow forehead aur chin — rare aur unique shape. Forehead aur chin pe volume add karo.",
  };
  return details[shape?.toLowerCase()] || details["oval"];
};

const getColorRecs = (shape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  return isFemale
    ? ["Warm earth tones — browns, terracottas, burnt orange", "Soft pastels for everyday — blush, lavender", "Bold jewel tones for evening — emerald, sapphire", "Avoid neon colors near the face", "Neutrals like beige and cream suit most skin tones"]
    : ["Navy, charcoal, deep greens for shirts", "Earth tones — brown, olive, rust for casual wear", "White and light blue for formal look", "Avoid very bright neon colors", "Black always works — versatile and classic"];
};

const getGroomingTips = (gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  return isFemale
    ? ["Moisturize daily — morning and night routine", "SPF 30+ sunscreen every single day", "Remove makeup before sleeping always", "Exfoliate 2x a week for glowing skin", "Drink 8 glasses of water daily"]
    : ["Wash face 2x daily with face wash", "Moisturize after washing — oily skin bhi needs it", "Use SPF 30+ daily — sun damage is real", "Trim beard regularly for clean look", "Exfoliate 1-2x a week to avoid ingrown hair"];
};

const getStylesAvoid = (shape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const male = {
    round: ["Bowl cuts that add width", "Very short buzz without fade", "Curly styles at ear level"],
    oval: ["Extremely wide side volume only", "Styles that hide your balanced features"],
    square: ["Blunt geometric cuts", "Styles that emphasize jaw width"],
    oblong: ["Very long straight styles", "High quiff adding more height", "Center part with flat hair"],
    heart: ["Very wide top volume", "High fade with nothing on top"],
    diamond: ["Maximum volume only at cheekbones"],
  };
  const female = {
    round: ["Chin length blunt bobs", "Lots of volume at sides", "Center part with flat hair"],
    oval: ["Styles that completely hide face shape"],
    square: ["Blunt geometric cuts", "Straight bangs across forehead"],
    oblong: ["Very long straight styles", "High top knots adding height"],
    heart: ["Top heavy volume styles", "High buns that emphasize forehead"],
    diamond: ["Maximum cheek volume only", "Slicked back tight styles"],
  };
  const db = isFemale ? female : male;
  return db[shape?.toLowerCase()] || db["oval"];
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FaceAnalysis() {
  const { t } = useLang();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hair");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [mode, setMode] = useState("upload");
  const [hairstyleImages, setHairstyleImages] = useState({});
  const [showFaceShapePicker, setShowFaceShapePicker] = useState(false);
  const [selectedFaceShape, setSelectedFaceShape] = useState(null);
  const [capturedFaceShape, setCapturedFaceShape] = useState(null);
  const [capturedJawline, setCapturedJawline] = useState(null);

  // ─── Real-time browser camera refs ──────────────────────────────────────────
  const browserVideoRef = useRef(null);
  const browserStreamRef = useRef(null);
  const [browserCamActive, setBrowserCamActive] = useState(false);
  const [browserCamError, setBrowserCamError] = useState("");

  const {
    videoRef, canvasRef,
    isLoading: mpLoading, isReady, faceDetected,
    liveFaceShape, liveJawline, error: mpError,
    startCamera, stopCamera, captureFrame, getFaceAnalysis,
  } = useMediaPipeFace();

  // ─── Browser camera — uses MediaPipe's videoRef directly ───────────────────
  const startBrowserCamera = useCallback(async () => {
    setBrowserCamError("");
    // Just trigger MediaPipe startCamera — it handles getUserMedia internally
    // This ensures MediaPipe can detect face shape on the same video element
    setBrowserCamActive(true);
  }, []);

  const stopBrowserCamera = useCallback(() => {
    setBrowserCamActive(false);
  }, []);

  // ─── Capture frame from browser camera ──────────────────────────────────────
  const captureBrowserFrame = useCallback(() => {
    const video = browserVideoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = dataUrl.split(",")[1];
    stopBrowserCamera();
    setImageBase64(base64);
    setImagePreview(dataUrl);
    setMode("captured");
  }, [stopBrowserCamera]);

  // ─── Detect if running in Capacitor (native) or browser ─────────────────────
  const isNative = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();

  // ─── Handle Live Camera Mode ─────────────────────────────────────────────────
  const handleLiveMode = async () => {
    setMode("live");
    setResult(null);
    setImagePreview(null);
    setImageBase64(null);
    setError("");
    setBrowserCamError("");
    setCapturedFaceShape(null);
    setCapturedJawline(null);
    setSelectedFaceShape(null);
    setShowFaceShapePicker(false);
    setBrowserCamActive(false);

    // Always use MediaPipe camera — works on both browser and native
    // MediaPipe handles getUserMedia internally and detects face shape
    await startCamera();
    setBrowserCamActive(true);
  };

  // ─── Capture from live camera ────────────────────────────────────────────────
  const handleCaptureLive = () => {
    if (isNative) {
      // Save face shape BEFORE stopping camera
      const mpData = getFaceAnalysis();
      if (mpData?.faceShape) {
        setCapturedFaceShape(mpData.faceShape);
        setCapturedJawline(mpData.jawlineType);
        console.log("✅ Face shape saved:", mpData.faceShape);
      }
      const frame = captureFrame();
      if (frame) {
        setImageBase64(frame.base64);
        setImagePreview(frame.dataUrl);
        stopCamera();
        setMode("captured");
      }
    } else {
      // Browser: save face shape from live state BEFORE capture
      const mpData = getFaceAnalysis();
      if (mpData?.faceShape) {
        setCapturedFaceShape(mpData.faceShape);
        setCapturedJawline(mpData.jawlineType);
        console.log("✅ Face shape from getFaceAnalysis:", mpData.faceShape);
      } else if (liveFaceShape) {
        setCapturedFaceShape(liveFaceShape);
        setCapturedJawline(liveJawline);
        console.log("✅ Face shape from live state:", liveFaceShape);
      }
      captureBrowserFrame();
      stopCamera();
    }
  };

  // ─── Pexels images load karo results ke baad ────────────────────────────────
  const loadPexelsImages = async (hairstyles) => {
    const imgs = {};
    await Promise.all(
      hairstyles.map(async (style) => {
        const url = await getOrFetchPexels(style.pexelsQuery);
        if (url) imgs[style.name] = url;
      })
    );
    setHairstyleImages(imgs);
  };

  // ─── Analyze — sirf MediaPipe, koi backend nahi ─────────────────────────────
  const analyze = async () => {
    if (!imageBase64) return;
    if (!selectedGender) {
      setError("Please select Male or Female before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setHairstyleImages({});

    try {
      // MediaPipe se face analysis lo
      let mpAnalysis = getFaceAnalysis();

      if (!mpAnalysis || !mpAnalysis.faceShape) {
        if (!selectedFaceShape) {
          setLoading(false);
          setShowFaceShapePicker(true);
          setError("Face shape not detected automatically. Please select your face shape below to continue.");
          return;
        }
        mpAnalysis = { faceShape: selectedFaceShape, jawlineType: "Defined" };
      }

      // Step 3: Backend ko MediaPipe data + image bhejo → Gemini AI analyze karega
      const token = localStorage.getItem("glowup_token");
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiUrl}/api/face/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64,
          mediapipe: {
            faceShape: mpAnalysis.faceShape,
            jawlineType: mpAnalysis.jawlineType,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const json = await res.json();
      const data = json.result;
      data.detectedGender = selectedGender;

      setResult(data);

      // Step 4: Pexels hairstyle images load karo
      if (data.topHairstyles?.length > 0) {
        loadPexelsImages(data.topHairstyles);
      } else {
        const styles = getHairstyles(data.faceShape, selectedGender === "Female" ? "female" : "male");
        loadPexelsImages(styles);
      }

      const prev = parseInt(localStorage.getItem("glowup_face_count") || "0");
      localStorage.setItem("glowup_face_count", prev + 1);

    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const isFemale = selectedGender === "Female" ||
    result?.detectedGender?.toLowerCase() === "female";

  const getDisplayHairstyles = () => {
    if (result?.topHairstyles && result.topHairstyles.length > 0) {
      return result.topHairstyles.map(style => ({
        name: style.name,
        pexelsQuery: style.name + " hairstyle",
        reason: style.reason,
        maintenance: style.maintenance || "Medium",
        time: "10-15 min",
        bestFor: "All hair types",
        avoid: "Styles that add unwanted volume",
      }));
    }
    return getHairstyles(result?.faceShape, isFemale ? "female" : "male");
  };

  // Image URL: Pexels fetched > fallback Unsplash
  const getStyleImage = (styleName, gender) => {
    if (hairstyleImages[styleName]) return hairstyleImages[styleName];
    return gender === "female" ? FALLBACK_IMAGES.female : FALLBACK_IMAGES.male;
  };

  const RESULT_TABS = [
    { id: "hair", label: isFemale ? "💇‍♀️ Hair" : "💇‍♂️ Hair" },
    { id: "style", label: "🎨 Style" },
  ];

  // ─── Is live camera ready? ────────────────────────────────────────────────────
  const liveCamReady = isNative ? (isReady && faceDetected) : browserCamActive;
  const showLiveOverlay = isNative; // MediaPipe overlay only on native

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <SectionTitle icon="✨" title={t.faceTitle} subtitle={t.faceSubtitle} />

      {/* Start Screen — show only when no image captured */}
      {mode !== "live" && mode !== "captured" && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
            Face Shape Analysis
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
            MediaPipe AI will detect your face shape in real-time and Gemini AI will recommend the best haircuts for you
          </div>
          <div onClick={handleLiveMode}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, background: "linear-gradient(135deg,#51CF66,#20C997)", fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 8px 24px rgba(81,207,102,0.3)" }}>
            🔴 Start Live Camera Scan
          </div>
          <div style={{ marginTop: 12, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
            Allow camera permission when asked
          </div>
        </div>
      )}

      {/* Back to camera button when in captured mode */}
      {mode === "captured" && (
        <div onClick={handleLiveMode} style={{ marginBottom: 10, padding: "10px 14px", borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", cursor: "pointer", textAlign: "center" }}>
          🔄 Scan Again with Live Camera
        </div>
      )}

      {/* ─── LIVE CAMERA MODE ──────────────────────────────────────────────────── */}
      {mode === "live" && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#000", minHeight: 280 }}>

            {/* MediaPipe camera — works for both browser and native */}
            <video ref={videoRef} autoPlay playsInline muted
              style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }} />
            <canvas ref={canvasRef}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

            {/* MediaPipe Loading */}
            {mpLoading && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ fontSize: 32 }}>🔍</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", fontWeight: 700 }}>Starting MediaPipe AI...</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Detecting face shape in real-time</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0,1,2].map(i => <div key={i} className="loading-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            )}

            {/* Face detection status */}
            {isReady && (
              <div style={{ position: "absolute", top: 12, left: 12, padding: "6px 12px", borderRadius: 20, background: faceDetected ? "rgba(81,207,102,0.9)" : "rgba(255,107,107,0.9)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {faceDetected ? "✅ Face Detected" : "❌ No Face — Move closer"}
              </div>
            )}

            {/* MediaPipe AI badge */}
            {isReady && (
              <div style={{ position: "absolute", top: 12, right: 12, padding: "5px 10px", borderRadius: 20, background: "rgba(77,150,255,0.85)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                MediaPipe AI
              </div>
            )}

            {/* Live face shape overlay */}
            {faceDetected && liveFaceShape && (
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, padding: "12px 16px", borderRadius: 16, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>MediaPipe Detected</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#51CF66", fontWeight: 800 }}>
                    📐 {liveFaceShape.charAt(0).toUpperCase() + liveFaceShape.slice(1)} Face
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Jawline</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#4D96FF", fontWeight: 700 }}>{liveJawline}</div>
                </div>
              </div>
            )}

            {/* Instruction when no face detected */}
            {isReady && !faceDetected && (
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, padding: "8px 14px", borderRadius: 12, background: "rgba(0,0,0,0.7)", fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                😊 Keep your face in the frame — looking for face shape...
              </div>
            )}
          </div>

          {/* Capture Button — show when face is detected */}
          {isReady && (
            <button
              onClick={handleCaptureLive}
              disabled={!faceDetected}
              style={{
                width: "100%", marginTop: 10, padding: "14px", border: "none", borderRadius: 16,
                background: faceDetected ? "linear-gradient(135deg,#51CF66,#20C997)" : "var(--card)",
                color: faceDetected ? "#fff" : "var(--muted)",
                fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700,
                cursor: faceDetected ? "pointer" : "not-allowed",
                boxShadow: faceDetected ? "0 8px 24px rgba(81,207,102,0.35)" : "none",
                transition: "all 0.3s",
              }}>
              {faceDetected
                ? `📸 Capture ${liveFaceShape ? liveFaceShape.charAt(0).toUpperCase() + liveFaceShape.slice(1) : ""} Face & Continue`
                : "😊 Waiting for face detection..."}
            </button>
          )}

          {/* Errors */}
          {(mpError || browserCamError) && (
            <div style={{ marginTop: 10, padding: "12px 16px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6B6B", textAlign: "center" }}>
              ⚠️ {mpError || browserCamError}
            </div>
          )}
        </div>
      )}

      {/* Captured photo preview */}
      {mode === "captured" && imagePreview && (
        <div style={{ position: "relative", marginBottom: 14, borderRadius: 20, overflow: "hidden" }}>
          <img src={imagePreview} alt="selfie" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 20, display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", borderRadius: 20, display: "flex", alignItems: "flex-end", padding: 16, justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>✅ Photo ready!</div>
            {(capturedFaceShape || liveFaceShape) && (
              <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(81,207,102,0.9)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                📐 {capturedFaceShape || liveFaceShape} Face Detected
              </div>
            )}
          </div>
        </div>
      )}

      {/* Face shape detected info box */}
      {capturedFaceShape && mode === "captured" && (
        <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(81,207,102,0.08)", border: "1px solid rgba(81,207,102,0.25)", borderRadius: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📐</span>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#51CF66" }}>
              {capturedFaceShape.charAt(0).toUpperCase() + capturedFaceShape.slice(1)} Face Shape Detected
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
              MediaPipe AI · {capturedJawline} jawline · Sending to Gemini AI...
            </div>
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      {/* Manual Face Shape Picker — shown when MediaPipe cannot detect */}
      {showFaceShapePicker && imagePreview && (
        <div style={{ background: "var(--card)", border: "1px solid rgba(77,150,255,0.3)", borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            📐 Select Your Face Shape
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
            MediaPipe could not detect automatically — select manually and Gemini AI will recommend the best haircuts
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { name: "Oval", emoji: "🥚" },
              { name: "Round", emoji: "⭕" },
              { name: "Square", emoji: "🟦" },
              { name: "Heart", emoji: "❤️" },
              { name: "Oblong", emoji: "📏" },
              { name: "Diamond", emoji: "💎" },
            ].map(({ name, emoji }) => (
              <div key={name}
                onClick={() => {
                  setSelectedFaceShape(name.toLowerCase());
                  setCapturedFaceShape(name.toLowerCase());
                  setCapturedJawline("defined");
                  setShowFaceShapePicker(false);
                  setError("");
                }}
                style={{
                  padding: "10px 16px", borderRadius: 20, cursor: "pointer",
                  background: selectedFaceShape === name.toLowerCase() ? "rgba(77,150,255,0.15)" : "var(--surface)",
                  border: `1.5px solid ${selectedFaceShape === name.toLowerCase() ? "#4D96FF" : "var(--border)"}`,
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                  color: selectedFaceShape === name.toLowerCase() ? "#4D96FF" : "var(--muted)",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                {emoji} {name}
              </div>
            ))}
          </div>
          {selectedFaceShape && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(77,150,255,0.08)", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 12, color: "#4D96FF", textAlign: "center" }}>
              ✅ {selectedFaceShape.charAt(0).toUpperCase() + selectedFaceShape.slice(1)} face selected — now click Analyze!
            </div>
          )}
        </div>
      )}

      {/* Gender + Analyze — only show after live camera capture */}
      {imagePreview && mode === "captured" && !loading && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center" }}>
              Select your gender for accurate results:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Male", "Female"].map(g => (
                <div key={g} onClick={() => setSelectedGender(g)}
                  style={{
                    flex: 1, padding: "11px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                    background: selectedGender === g ? (g === "Female" ? "rgba(255,107,107,0.15)" : "rgba(77,150,255,0.15)") : "var(--card)",
                    border: `2px solid ${selectedGender === g ? (g === "Female" ? "#FF6B6B" : "#4D96FF") : "var(--border)"}`,
                    fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                    color: selectedGender === g ? (g === "Female" ? "#FF6B6B" : "#4D96FF") : "var(--muted)", transition: "all 0.2s",
                  }}>
                  {g === "Female" ? "👩 Female" : "👨 Male"}
                </div>
              ))}
            </div>
          </div>
          <GlowButton onClick={analyze} style={{ marginTop: 4 }}>{t.analyzeBtn}</GlowButton>
        </div>
      )}

      {loading && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>{t.analyzing}</div>
          <LoadingDots />
        </Card>
      )}

      {/* ─── RESULTS ────────────────────────────────────────────────────────────── */}
      {result && (
        <div style={{ marginTop: 16 }}>

          {/* Analysis source badge */}
          <div style={{
            marginBottom: 12, padding: "8px 14px",
            background: result.analyzedWith?.includes("MediaPipe") ? "rgba(81,207,102,0.1)" : "rgba(77,150,255,0.1)",
            border: `1px solid ${result.analyzedWith?.includes("MediaPipe") ? "rgba(81,207,102,0.3)" : "rgba(77,150,255,0.3)"}`,
            borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 12, textAlign: "center", fontWeight: 700,
            color: result.analyzedWith?.includes("MediaPipe") ? "#51CF66" : "#4D96FF",
          }}>
            {result.analyzedWith?.includes("MediaPipe")
              ? "✅ MediaPipe + Gemini AI — 97% accurate face shape & haircut analysis"
              : "🔍 Face++ + Gemini AI — face shape & haircut analysis"}
          </div>

          {/* Face Profile Card */}
          <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 24, padding: 20, border: "1px solid rgba(132,94,247,0.3)", marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "radial-gradient(circle, rgba(132,94,247,0.2), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#fff", fontWeight: 800, lineHeight: 1 }}>{result.faceShape} Face</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{result.jawlineType} jawline · {result.skinTone} tone</div>
                <div style={{ marginTop: 8, display: "inline-block", padding: "4px 12px", borderRadius: 20, background: isFemale ? "rgba(255,107,107,0.2)" : "rgba(77,150,255,0.2)", border: `1px solid ${isFemale ? "#FF6B6B" : "#4D96FF"}`, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: isFemale ? "#FF6B6B" : "#4D96FF" }}>
                  {isFemale ? "👩 Female" : "👨 Male"} · Age {result.detectedAge}
                </div>
              </div>
              <div style={{ background: `${getGradeColor(result.skinGrade)}22`, border: `2px solid ${getGradeColor(result.skinGrade)}`, borderRadius: 14, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 800, color: getGradeColor(result.skinGrade) }}>{result.skinGrade}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "rgba(255,255,255,0.5)" }}>SKIN GRADE</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Skin Health</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: getSkinScoreColor(result.skinScore) }}>{result.skinScore}/100</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${result.skinScore}%`, height: "100%", background: getSkinScoreColor(result.skinScore), borderRadius: 6, transition: "width 1s ease" }} />
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "10px 0 0", lineHeight: 1.6 }}>{result.faceShapeDetails}</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {RESULT_TABS.map(tab => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 14, cursor: "pointer", textAlign: "center", background: activeTab === tab.id ? "var(--grad1)" : "var(--card)", border: `1px solid ${activeTab === tab.id ? "transparent" : "var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: activeTab === tab.id ? "#fff" : "var(--muted)", transition: "all 0.2s" }}>
                {tab.label}
              </div>
            ))}
          </div>

          {/* HAIR TAB */}
          {activeTab === "hair" && (
            <div>
              <div style={{ background: isFemale ? "linear-gradient(135deg, rgba(255,107,107,0.1), rgba(132,94,247,0.1))" : "linear-gradient(135deg, rgba(77,150,255,0.1), rgba(132,94,247,0.1))", border: `1px solid ${isFemale ? "rgba(255,107,107,0.2)" : "rgba(77,150,255,0.2)"}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                  {isFemale ? "👩‍🦱 Female Hairstyles" : "👨‍🦱 Male Hairstyles"} for {result.faceShape} Face
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
                  {getDisplayHairstyles().length} personalized cuts — tap any to expand
                  <span style={{ color: "#51CF66", marginLeft: 6 }}>✅ Pexels real photos</span>
                </div>
              </div>

              {getDisplayHairstyles().map((style, i) => {
                const maintenanceColor = style.maintenance === "Low" ? "#51CF66" : style.maintenance === "Medium" ? "#FFD93D" : "#FF6B6B";
                const isExpanded = expandedCard === i;
                const imgSrc = getStyleImage(style.name, isFemale ? "female" : "male");
                const isPexels = !!hairstyleImages[style.name];
                return (
                  <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                      <img
                        src={imgSrc}
                        alt={style.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.src = isFemale ? FALLBACK_IMAGES.female : FALLBACK_IMAGES.male; }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }} />
                      <div style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderRadius: 10, background: isFemale ? "linear-gradient(135deg,#FF6B6B,#845EF7)" : "linear-gradient(135deg,#4D96FF,#845EF7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 800, color: "#fff" }}>{i + 1}</div>
                      <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 20, background: `${maintenanceColor}33`, border: `1px solid ${maintenanceColor}`, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: maintenanceColor }}>{style.maintenance} care</div>
                      {/* Pexels badge */}
                      {isPexels && (
                        <div style={{ position: "absolute", top: 44, right: 12, padding: "3px 8px", borderRadius: 20, background: "rgba(81,207,102,0.85)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                          📸 Pexels Live
                        </div>
                      )}
                      {/* Loading indicator for images still fetching */}
                      {!isPexels && Object.keys(hairstyleImages).length < getDisplayHairstyles().length && (
                        <div style={{ position: "absolute", top: 44, right: 12, padding: "3px 8px", borderRadius: 20, background: "rgba(255,211,61,0.85)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "#000" }}>
                          ⏳ Loading...
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#fff" }}>{style.name}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>⏱ {style.time} · Best for {style.bestFor}</div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: `3px solid ${isFemale ? "#FF6B6B" : "#4D96FF"}`, marginBottom: 10 }}>
                        💡 {style.reason}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,107,107,0.06)", borderRadius: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 14 }}>🚫</span>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#FF6B6B" }}>Avoid: {style.avoid}</div>
                      </div>
                      <div onClick={() => setExpandedCard(isExpanded ? null : i)}
                        style={{ textAlign: "center", padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                        {isExpanded ? "▲ Show less" : "▼ Show maintenance + products"}
                      </div>
                      {isExpanded && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>✂️ How to maintain ({style.maintenance})</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                            {getMaintenanceTips(style.maintenance, isFemale ? "female" : "male").map((tip, j) => (
                              <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: maintenanceColor, marginTop: 5, flexShrink: 0 }} />
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{tip}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>🛒 Recommended products</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {(isFemale ? getFemaleProducts() : getMaleProducts()).map((prod, j) => (
                              <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
                                <div>
                                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{prod.name}</div>
                                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{prod.use} · {prod.where}</div>
                                </div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#51CF66", marginLeft: 10 }}>{prod.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Face Shape Guide */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: 16, marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
                  📚 {result.faceShape} face — {isFemale ? "women's" : "men's"} guide
                </div>
                {getFaceShapeTips(result.faceShape, isFemale ? "female" : "male").map((tip, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: isFemale ? "rgba(255,107,107,0.15)" : "rgba(77,150,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: isFemale ? "#FF6B6B" : "#4D96FF", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", paddingTop: 2, lineHeight: 1.5 }}>{tip}</div>
                  </div>
                ))}
              </div>

              {/* Salon Tips */}
              <div style={{ background: isFemale ? "rgba(255,107,107,0.06)" : "rgba(81,207,102,0.06)", border: `1px solid ${isFemale ? "rgba(255,107,107,0.2)" : "rgba(81,207,102,0.2)"}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: isFemale ? "#FF6B6B" : "#51CF66", marginBottom: 10 }}>
                  {isFemale ? "💅 Salon tips for women" : "💈 Barbershop tips for men"}
                </div>
                {(isFemale ? [
                  "Show this analysis to your hairstylist",
                  "Ask for cuts that suit your face shape specifically",
                  "Get a trim every 6-8 weeks to maintain style",
                  "Ask for Olaplex or Kerastase treatment for damage",
                  "Deep condition every 2 weeks at home",
                  "Avoid heat styling more than 3 times a week",
                ] : [
                  "Show this analysis to your barber",
                  "Ask specifically for cuts that add height/structure",
                  "Get a trim every 3-4 weeks for clean look",
                  "Try Schwarzkopf or L'Oreal professional products",
                  "Oil your scalp 2-3 times a week",
                  "Ask barber about skin fade vs taper fade",
                ]).map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
                    <span style={{ color: isFemale ? "#FF6B6B" : "#51CF66", fontSize: 14, flexShrink: 0 }}>✓</span>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === "style" && (
            <div>
              {[
                { title: "🎨 Color Recommendations", items: result.colorRecommendations, color: "#845EF7" },
                { title: "✂️ Grooming Tips", items: result.grooming, color: "#4D96FF" },
                { title: "⚠️ Styles to Avoid", items: result.stylesAvoid, color: "#FF6B6B" },
              ].map((section, si) => (
                <div key={si} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: section.color, marginBottom: 12 }}>{section.title}</div>
                  {section.items?.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < section.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ color: section.color, flexShrink: 0 }}>•</span>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{item}</div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ background: "var(--card)", borderRadius: 18, padding: 16, border: "1px solid var(--border)", marginTop: 12 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
                  📅 Next scan in <span style={{ color: "var(--accent)", fontWeight: 700 }}>{result.nextScanIn}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}