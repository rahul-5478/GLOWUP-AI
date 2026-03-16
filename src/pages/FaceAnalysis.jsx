import { useState } from "react";
import { faceAPI } from "../utils/api";
import { useCapacitorCamera } from "../hooks/useCapacitorCamera";
import { GlowButton, SectionTitle, Card, LoadingDots, ResultCard, ErrorMessage } from "../components/UI";
import { useLang } from "../hooks/useLanguage";

const HAIRSTYLE_IMAGES = {
  "undercut": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
  "fade": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80",
  "quiff": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80",
  "pompadour": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80",
  "buzz": "https://images.unsplash.com/photo-1593702288056-7cc68c0d1c96?w=400&q=80",
  "crew": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=400&q=80",
  "slick": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  "textured": "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=400&q=80",
  "french crop": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80",
  "side part": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  "messy": "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=400&q=80",
  "taper": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80",
  "mohawk": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80",
  "caesar": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80",
  "ivy league": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  "bob": "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=400&q=80",
  "pixie": "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&q=80",
  "layered": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80",
  "lob": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
  "bangs": "https://images.unsplash.com/photo-1523264653568-d3d4032d1476?w=400&q=80",
  "bun": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
  "braid": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  "straight": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  "curly": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400&q=80",
  "wavy": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80",
  "default_female": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80",
  "default_male": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
  "default": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80",
};

const MALE_HAIRSTYLES = {
  round: [
    { name: "Quiff", img: "quiff", reason: "Adds height on top, makes face look longer and leaner", maintenance: "Medium", time: "10-15 min", bestFor: "Thick hair", avoid: "Too much side volume" },
    { name: "High Fade Undercut", img: "undercut", reason: "Short sides reduce width, longer top creates vertical illusion", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Round styling on top" },
    { name: "Pompadour", img: "pompadour", reason: "Strong volume on top elongates round face perfectly", maintenance: "High", time: "20 min", bestFor: "Thick straight hair", avoid: "Flat styling" },
    { name: "Taper Fade", img: "taper", reason: "Clean sides with length on top — ideal combo for round faces", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Wide side parts" },
    { name: "French Crop", img: "french crop", reason: "Textured top with tight sides creates angular look", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Fluffy top" },
    { name: "Side Part Slick", img: "slick", reason: "Deep side part creates asymmetry that breaks round shape", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Center parting" },
    { name: "Mohawk Fade", img: "mohawk", reason: "Central strip of height makes face appear longer", maintenance: "Medium", time: "15 min", bestFor: "Medium thick hair", avoid: "Wide mohawk strips" },
  ],
  oval: [
    { name: "Textured Quiff", img: "quiff", reason: "Oval face suits almost everything — quiff shows off balance", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Nothing — you're lucky!" },
    { name: "Slick Back", img: "slick", reason: "Reveals your balanced proportions — classic and timeless", maintenance: "Medium", time: "10 min", bestFor: "Straight to wavy", avoid: "Too much product" },
    { name: "High Fade Undercut", img: "undercut", reason: "Modern clean look that works perfectly with oval face", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Nothing specific" },
    { name: "Crew Cut", img: "crew", reason: "Sharp and clean — highlights your well-balanced features", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Too long on top" },
    { name: "Ivy League", img: "ivy league", reason: "Sophisticated side-parted style for well-proportioned faces", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Messy application" },
    { name: "Pompadour", img: "pompadour", reason: "Dramatic style that oval faces carry perfectly", maintenance: "High", time: "20 min", bestFor: "Thick hair", avoid: "Flat sides" },
    { name: "Buzz Cut", img: "buzz", reason: "Confident minimal style — oval faces pull it off best", maintenance: "Low", time: "1 min", bestFor: "All hair types", avoid: "If you have scars/bumps" },
    { name: "Messy Textured", img: "messy", reason: "Effortless style that oval faces make look intentional", maintenance: "Low", time: "3 min", bestFor: "Wavy/curly hair", avoid: "Too much product" },
  ],
  square: [
    { name: "Textured Crop", img: "textured", reason: "Soft texture at top reduces the sharpness of strong jawline", maintenance: "Low", time: "5 min", bestFor: "Medium hair", avoid: "Geometric sharp lines" },
    { name: "Side Part", img: "side part", reason: "Asymmetry breaks the symmetrical squareness of face", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Very deep center part" },
    { name: "Messy Waves", img: "messy", reason: "Wavy texture adds natural softness to sharp angular jaw", maintenance: "Low", time: "5 min", bestFor: "Wavy hair", avoid: "Hard lines and sharp edges" },
    { name: "Caesar Cut", img: "caesar", reason: "Forward fringe softens strong forehead and jaw", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Very short fringe" },
    { name: "Long Top Undercut", img: "undercut", reason: "Length on top softens square shape with movement", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Blunt straight top" },
    { name: "Quiff", img: "quiff", reason: "Height on top distracts from wide jawline", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Wide flat quiff" },
    { name: "Curly Natural", img: "messy", reason: "Natural curls soften angular features beautifully", maintenance: "Low", time: "3 min", bestFor: "Curly/wavy hair", avoid: "Slicked back styles" },
  ],
  oblong: [
    { name: "Side Part", img: "side part", reason: "Horizontal line adds visual width to elongated face", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Center part" },
    { name: "Messy Textured Short", img: "messy", reason: "Volume on sides fills out narrow face width", maintenance: "Low", time: "3 min", bestFor: "Medium hair", avoid: "Long straight hair" },
    { name: "Crew Cut", img: "crew", reason: "Even length all around prevents further elongation", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Extra height on top" },
    { name: "Caesar Cut", img: "caesar", reason: "Fringe significantly shortens visible forehead length", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Swept back styles" },
    { name: "Buzz Cut with Fade", img: "buzz", reason: "Uniform length minimizes face length perception", maintenance: "Low", time: "1 min", bestFor: "All hair types", avoid: "Height boosting styles" },
    { name: "Side Swept Fringe", img: "french crop", reason: "Diagonal fringe breaks vertical length of face", maintenance: "Low", time: "5 min", bestFor: "Fine to medium", avoid: "Upward quiff" },
    { name: "Taper with Side Volume", img: "taper", reason: "Volume at sides adds width without height", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Very high top" },
  ],
  heart: [
    { name: "Side Swept Undercut", img: "undercut", reason: "Reduces wide forehead, draws attention to chin area", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Wide top volume" },
    { name: "Textured Crop with Fringe", img: "textured", reason: "Light fringe balances heart shaped forehead", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Extreme height" },
    { name: "Quiff", img: "quiff", reason: "Controlled height without too much forehead volume", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Very wide quiff" },
    { name: "Crew Cut", img: "crew", reason: "Neat and clean — works very well with heart face", maintenance: "Low", time: "2 min", bestFor: "All hair types", avoid: "Too much top height" },
    { name: "Side Part", img: "side part", reason: "Asymmetry balances wide forehead naturally", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Center part" },
    { name: "French Crop", img: "french crop", reason: "Textured fringe breaks forehead width", maintenance: "Low", time: "5 min", bestFor: "Fine hair", avoid: "Backward swept styles" },
    { name: "Taper Fade", img: "taper", reason: "Clean precise cut that balances heart shape", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Flared sides" },
  ],
  diamond: [
    { name: "Side Part Pompadour", img: "pompadour", reason: "Forehead volume balances narrow chin of diamond face", maintenance: "High", time: "20 min", bestFor: "Thick hair", avoid: "Cheekbone volume" },
    { name: "Quiff", img: "quiff", reason: "Height at forehead balances prominent cheekbones", maintenance: "Medium", time: "10 min", bestFor: "Thick hair", avoid: "Wide side volume" },
    { name: "Textured Crop", img: "textured", reason: "Width at top helps balance narrow forehead", maintenance: "Low", time: "5 min", bestFor: "Medium hair", avoid: "Tight sides only" },
    { name: "Slick Back", img: "slick", reason: "Reveals face structure elegantly for diamond shape", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Too flat application" },
    { name: "Caesar Crop", img: "caesar", reason: "Fringe adds width to narrow forehead area", maintenance: "Low", time: "5 min", bestFor: "Fine to medium", avoid: "High swept styles" },
    { name: "Side Swept", img: "side part", reason: "Diagonal adds width where diamond needs it most", maintenance: "Medium", time: "10 min", bestFor: "Straight hair", avoid: "Center parting" },
    { name: "Undercut", img: "undercut", reason: "Clean sides with top volume balances diamond proportions", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Middle volume" },
  ],
};

const FEMALE_HAIRSTYLES = {
  round: [
    { name: "Long Layers", img: "layered", reason: "Lengthens face and adds beautiful vertical movement", maintenance: "Medium", time: "15 min", bestFor: "Medium to thick hair", avoid: "Chin length blunt cuts" },
    { name: "Lob with Side Part", img: "lob", reason: "Below chin length with side part slims round face perfectly", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Center part" },
    { name: "Side Swept Bangs", img: "bangs", reason: "Creates diagonal line across forehead, reduces roundness", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
    { name: "Sleek Straight Long", img: "straight", reason: "Long straight hair visually elongates face shape", maintenance: "Medium", time: "20 min", bestFor: "Straight to wavy", avoid: "Lots of volume at sides" },
    { name: "Wavy Lob", img: "wavy", reason: "Waves below jaw create length illusion for round face", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Chin level volume" },
    { name: "High Ponytail", img: "bun", reason: "Lifts face appearance, adds height and length", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Low ponytail at ears" },
    { name: "Curtain Bangs", img: "bangs", reason: "Soft parted bangs frame face and reduce roundness", maintenance: "Medium", time: "10 min", bestFor: "Thin to medium hair", avoid: "Blunt straight fringe" },
    { name: "Long Curls", img: "curly", reason: "Long curls fall below jaw, adding beautiful elongation", maintenance: "High", time: "30 min", bestFor: "Naturally curly", avoid: "Short tight curls" },
  ],
  oval: [
    { name: "Layered Bob", img: "bob", reason: "Shows off your perfect oval proportions beautifully", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Nothing — try everything!" },
    { name: "Pixie Cut", img: "pixie", reason: "Bold and stunning — oval faces carry pixie cut best", maintenance: "Low", time: "5 min", bestFor: "Fine to medium hair", avoid: "Very long sides" },
    { name: "Wavy Long", img: "wavy", reason: "Any length works — waves add beautiful texture", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Nothing specific" },
    { name: "Blunt Bob", img: "bob", reason: "Clean strong lines complement balanced oval proportions", maintenance: "Medium", time: "15 min", bestFor: "Straight hair", avoid: "Too much layering" },
    { name: "Curtain Bangs", img: "bangs", reason: "Trendy style that oval faces pull off effortlessly", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Too thick bangs" },
    { name: "Natural Curls Medium", img: "curly", reason: "Natural curls frame oval face with gorgeous movement", maintenance: "High", time: "20 min", bestFor: "Naturally curly", avoid: "Over-straightening" },
    { name: "Sleek Ponytail", img: "bun", reason: "Versatile style that suits oval shape perfectly", maintenance: "Low", time: "5 min", bestFor: "All hair types", avoid: "Nothing specific" },
    { name: "Lob", img: "lob", reason: "Perfect medium length — oval faces look great at any length", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Nothing specific" },
  ],
  square: [
    { name: "Soft Wavy Long", img: "wavy", reason: "Waves naturally soften angular jawline beautifully", maintenance: "Medium", time: "20 min", bestFor: "All hair types", avoid: "Blunt geometric cuts" },
    { name: "Long Layered", img: "layered", reason: "Layers at face level soften strong square features", maintenance: "Medium", time: "20 min", bestFor: "Medium to thick", avoid: "Blunt one-length" },
    { name: "Side Swept Bangs", img: "bangs", reason: "Asymmetry softens the symmetrical squareness", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
    { name: "Soft Curly Bob", img: "curly", reason: "Curls at jaw level add softness to hard features", maintenance: "High", time: "25 min", bestFor: "Curly/wavy hair", avoid: "Straight blunt styles" },
    { name: "Lob with Waves", img: "lob", reason: "Wavy lob below jaw softens jaw width naturally", maintenance: "Medium", time: "20 min", bestFor: "All hair types", avoid: "Blunt lob" },
    { name: "Long Side Part", img: "straight", reason: "Side part breaks the symmetry of square jaw", maintenance: "Low", time: "10 min", bestFor: "Straight hair", avoid: "Center parting" },
    { name: "Curtain Bangs", img: "bangs", reason: "Soft curtain bangs reduce harsh forehead angles", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt straight bangs" },
    { name: "Loose Braid", img: "braid", reason: "Loose braids soften strong features gracefully", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Tight slick braids" },
  ],
  oblong: [
    { name: "Blunt Bob", img: "bob", reason: "Adds horizontal width, significantly reduces face length", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Very long styles" },
    { name: "Curly Short", img: "curly", reason: "Curls add width from sides and reduce elongated look", maintenance: "High", time: "20 min", bestFor: "Curly hair", avoid: "Long straight styles" },
    { name: "Bangs with Layers", img: "bangs", reason: "Fringe shortens forehead — biggest help for oblong face", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Swept back styles" },
    { name: "Wavy Bob", img: "wavy", reason: "Volume at sides reduces face length perception", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Center part with long hair" },
    { name: "Side Braid", img: "braid", reason: "Side braids add horizontal width to narrow face", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Top buns" },
    { name: "Shoulder Length with Bangs", img: "lob", reason: "Medium length with bangs perfectly balances oblong", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Extra long styles" },
    { name: "Voluminous Curls", img: "curly", reason: "Big curls add width at cheeks to balance length", maintenance: "High", time: "25 min", bestFor: "Curly hair", avoid: "Flat lifeless styles" },
  ],
  heart: [
    { name: "Chin Length Bob", img: "bob", reason: "Adds width at narrow chin to perfectly balance heart shape", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Top heavy styles" },
    { name: "Side Swept Bangs", img: "bangs", reason: "Reduces wide forehead — most effective for heart face", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Heavy straight bangs" },
    { name: "Lob with Waves", img: "lob", reason: "Length below chin balances pointed chin of heart shape", maintenance: "Medium", time: "20 min", bestFor: "All hair types", avoid: "Short above chin cuts" },
    { name: "Layered Medium", img: "layered", reason: "Volume below cheekbones widens narrow chin area", maintenance: "Medium", time: "20 min", bestFor: "Medium thick hair", avoid: "Very short layers" },
    { name: "Wavy Long", img: "wavy", reason: "Waves below jaw add width and balance to pointed chin", maintenance: "Medium", time: "20 min", bestFor: "Wavy hair", avoid: "Huge top volume" },
    { name: "Curtain Bangs", img: "bangs", reason: "Soft curtain bangs reduce wide forehead subtly", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Thick blunt bangs" },
    { name: "Low Bun", img: "bun", reason: "Low bun adds width at jaw to balance forehead", maintenance: "Low", time: "5 min", bestFor: "Long hair", avoid: "Top knot or high bun" },
    { name: "Loose Beach Waves", img: "wavy", reason: "Loose waves from cheekbone down balance heart beautifully", maintenance: "Medium", time: "15 min", bestFor: "Medium to long", avoid: "Volume at crown only" },
  ],
  diamond: [
    { name: "Chin Bob with Volume", img: "bob", reason: "Chin length adds width to narrow chin of diamond face", maintenance: "Medium", time: "15 min", bestFor: "All hair types", avoid: "Cheek level volume" },
    { name: "Side Swept Bangs", img: "bangs", reason: "Widens narrow forehead — very effective for diamond", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Center part" },
    { name: "Layered Long", img: "layered", reason: "Layers at chin level balance prominent cheekbones", maintenance: "Medium", time: "20 min", bestFor: "Medium thick hair", avoid: "Maximum cheek volume" },
    { name: "Bun with Side Bangs", img: "bun", reason: "Bun shows elegant neckline, bangs add forehead width", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Sleek no-volume bun" },
    { name: "Wavy Medium", img: "wavy", reason: "Volume at forehead and chin balances wide cheekbones", maintenance: "Medium", time: "15 min", bestFor: "Wavy hair", avoid: "Maximum volume at cheeks" },
    { name: "Curtain Bangs", img: "bangs", reason: "Adds width to narrow forehead of diamond shape", maintenance: "Medium", time: "10 min", bestFor: "All hair types", avoid: "Blunt bangs" },
    { name: "Pixie with Volume", img: "pixie", reason: "Volume at crown and sides balances diamond shape", maintenance: "Low", time: "10 min", bestFor: "Fine to medium", avoid: "Flat tight pixie" },
    { name: "Loose Braids", img: "braid", reason: "Braids add texture at forehead and chin to balance", maintenance: "Low", time: "10 min", bestFor: "Long hair", avoid: "Tight cheek-hugging braids" },
  ],
};

const getHairImage = (imgKey, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const img = HAIRSTYLE_IMAGES[imgKey];
  if (img) return img;
  return isFemale ? HAIRSTYLE_IMAGES.default_female : HAIRSTYLE_IMAGES.default_male;
};

const getHairstyles = (faceShape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const db = isFemale ? FEMALE_HAIRSTYLES : MALE_HAIRSTYLES;
  const shape = faceShape?.toLowerCase() || "oval";
  return db[shape] || db["oval"];
};

const getFaceShapeTips = (shape, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  const maleTips = {
    round: ["Add height on top to make face look longer", "Avoid bowl cuts — they emphasize roundness", "Side parts work better than center parts", "Textured layers on top reduce roundness", "Keep sides tight, volume only on top", "Avoid round curly styles at ear level"],
    oval: ["Lucky! Almost any hairstyle suits you", "Both short and long styles work great", "You can experiment with fringes freely", "Slick back, quiff, buzz — all look good", "Only avoid extremely wide side volume", "Show off your balanced features confidently"],
    square: ["Soften strong jawline with layers and waves", "Avoid blunt cuts that emphasize jaw width", "Side swept styles reduce angular sharpness", "Curls and waves are your best friends", "Avoid geometric or boxy haircuts", "Longer top with taper sides works great"],
    oblong: ["Add width with layers and side volume", "Avoid very long straight hairstyles", "Bangs/fringe can shorten face length", "Curls and waves add great width visually", "Avoid center parts with flat styles", "Side parts with volume at ears works best"],
    heart: ["Balance wide forehead with jaw-level volume", "Side swept bangs reduce forehead width", "Avoid top-heavy volume styles", "Textured crops with fringe work great", "Keep sides fuller around chin area", "Taper fade with textured top is ideal"],
    diamond: ["Add volume at forehead and chin area", "Avoid volume specifically at cheekbones", "Side swept styles work great for you", "Chin length cuts balance narrow proportions", "Quiff adds needed forehead width", "Undercut with longer top is perfect"],
  };
  const femaleTips = {
    round: ["Long layers below shoulders lengthen face", "Avoid chin-length blunt cuts — they widen", "Side parts create diagonal that slims face", "Curtain bangs frame without widening", "Stay away from high volume at sides", "Sleek straight long hair is your best friend", "Avoid short above-chin cuts"],
    oval: ["You can try literally any hairstyle!", "Short pixie to long waves — all work", "Blunt bobs, curtain bangs, curls — all great", "Show off your natural proportions", "Try bold styles other face shapes can't", "Experiment freely — you won the face shape lottery"],
    square: ["Soft waves and curls soften angular jaw", "Avoid blunt geometric cuts — they sharpen jaw", "Side swept bangs break strong symmetry", "Layered cuts at face level soften features", "Long hair past shoulders frames jaw softly", "Loose braids add elegant softness", "Avoid very straight one-length cuts"],
    oblong: ["Blunt bob adds width and reduces length", "Bangs are your best tool — always use them", "Avoid extra long straight styles", "Volume at sides is your friend", "Short to medium length works better than long", "Side braids add horizontal width", "Avoid top knots and high buns"],
    heart: ["Volume at chin level balances wide forehead", "Side swept or curtain bangs reduce forehead", "Chin length or below is your sweet spot", "Avoid top-heavy styles and high volume", "Layered lob below chin is perfect", "Low buns add width at jaw level", "Avoid very short above-chin styles"],
    diamond: ["Add volume at forehead AND chin simultaneously", "Side swept bangs widen narrow forehead", "Chin bob is your most flattering cut", "Avoid maximum volume only at cheekbones", "Curtain bangs frame your face beautifully", "Layered styles at chin level are ideal", "Loose waves from forehead to chin balance shape"],
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
  { name: "Himalaya Anti Dandruff Shampoo", price: "₹180", use: "Controls dandruff naturally", where: "Amazon" },
];

const getFemaleProducts = () => [
  { name: "Mamaearth Onion Shampoo", price: "₹299", use: "Reduces hair fall significantly", where: "Nykaa" },
  { name: "WOW Apple Cider Conditioner", price: "₹349", use: "Adds shine and softness", where: "Amazon" },
  { name: "Livon Hair Serum", price: "₹149", use: "Controls frizz instantly", where: "BigBasket" },
  { name: "Streax Walnut Hair Oil", price: "₹199", use: "Deep nourishment & growth", where: "Nykaa" },
  { name: "Tresemme Keratin Smooth Shampoo", price: "₹399", use: "Smoothens and de-frizzes", where: "Amazon" },
  { name: "Schwarzkopf Gliss Hair Repair", price: "₹450", use: "Repairs damaged hair", where: "Nykaa" },
];

const getMaintenanceTips = (level, gender) => {
  const isFemale = gender?.toLowerCase() === "female";
  if (level === "Low") return isFemale ? [
    "Wash 2-3 times a week with mild shampoo",
    "Air dry to avoid heat damage",
    "Use leave-in conditioner for moisture",
    "Trim every 8-10 weeks to maintain shape",
    "Light serum on damp hair for shine",
  ] : [
    "Wash 2-3 times a week",
    "Air dry — no heat styling needed",
    "Trim every 6-8 weeks",
    "Light wax or gel to set if needed",
    "Oil once a week for healthy scalp",
  ];
  if (level === "Medium") return isFemale ? [
    "Wash 3-4 times a week",
    "Always condition after shampooing",
    "Blow dry with round brush for shape",
    "Trim every 6-8 weeks",
    "Use heat protectant before blow drying",
    "Weekly hair mask for nourishment",
  ] : [
    "Wash 3-4 times a week",
    "Use conditioner on ends",
    "Blow dry for shape and volume",
    "Trim every 4-6 weeks",
    "Medium hold product to style",
    "Oil twice a week",
  ];
  return isFemale ? [
    "Wash every other day or daily",
    "Deep condition once a week",
    "Always use heat protectant spray",
    "Blow dry + iron or curler to finish",
    "Trim every 4-6 weeks for shape",
    "Use hold spray to set final style",
    "Overnight hair mask once a week",
    "Avoid excessive heat — use cool setting",
  ] : [
    "Wash daily or every other day",
    "Use heat protectant before styling",
    "Blow dry + product to set",
    "Trim every 3-4 weeks for shape",
    "Hold spray or pomade to finish",
    "Deep condition weekly",
    "Avoid over-washing — strips natural oils",
  ];
};

const getSkinScoreColor = (score) => score >= 70 ? "#51CF66" : score >= 50 ? "#FFD93D" : "#FF6B6B";
const getGradeColor = (grade) => ({ A: "#51CF66", B: "#4D96FF", C: "#FFD93D", D: "#FF9500", F: "#FF6B6B" })[grade] || "#888";

export default function FaceAnalysis() {
  const { t } = useLang();
  const { getPhoto } = useCapacitorCamera();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hair");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const handleCapture = async (source) => {
    setError("");
    setSelectedGender(null);
    setResult(null);
    const { base64, dataUrl, error: err } = await getPhoto(source);
    if (err || !base64) return;
    setImageBase64(base64);
    setImagePreview(dataUrl);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    if (!selectedGender) {
      setError("Please select Male or Female before analyzing.");
      return;
    }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await faceAPI.analyze(imageBase64, "image/jpeg");
      const data = res.data.result;
      data.detectedGender = selectedGender;
      setResult(data);
      const prev = parseInt(localStorage.getItem("glowup_face_count") || "0");
      localStorage.setItem("glowup_face_count", prev + 1);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try with a clearer selfie.");
    }
    setLoading(false);
  };

  const isFemale = selectedGender === "Female" || result?.detectedGender?.toLowerCase() === "female";

  const RESULT_TABS = [
    { id: "hair", label: isFemale ? "💇‍♀️ Hair" : "💇‍♂️ Hair" },
    { id: "style", label: "🎨 Style" },
  ];

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <SectionTitle icon="✨" title={t.faceTitle} subtitle={t.faceSubtitle} />

      {/* Upload Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <button onClick={() => handleCapture("gallery")}
          style={{ padding: "13px 10px", border: "1.5px solid var(--border)", borderRadius: 14, background: "var(--card)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          🖼️ Gallery
        </button>
        <button onClick={() => handleCapture("camera")}
          style={{ padding: "13px 10px", border: "none", borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#845EF7)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 16px rgba(255,107,107,0.4)" }}>
          📷 Camera
        </button>
      </div>

      {/* Preview */}
      {imagePreview && (
        <div style={{ position: "relative", marginBottom: 14, borderRadius: 20, overflow: "hidden" }}>
          <img src={imagePreview} alt="selfie"
            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 20, display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", borderRadius: 20, display: "flex", alignItems: "flex-end", padding: 16 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>✅ Photo ready!</div>
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      {/* Gender Selector + Analyze Button */}
      {imagePreview && !loading && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center" }}>
              Accurate results ke liye apna gender select karo:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Male", "Female"].map(g => (
                <div key={g} onClick={() => setSelectedGender(g)}
                  style={{ flex: 1, padding: "11px", borderRadius: 14, cursor: "pointer", textAlign: "center", background: selectedGender === g ? (g === "Female" ? "rgba(255,107,107,0.15)" : "rgba(77,150,255,0.15)") : "var(--card)", border: `2px solid ${selectedGender === g ? (g === "Female" ? "#FF6B6B" : "#4D96FF") : "var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: selectedGender === g ? (g === "Female" ? "#FF6B6B" : "#4D96FF") : "var(--muted)", transition: "all 0.2s" }}>
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

      {result && (
        <div style={{ marginTop: 16 }}>

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

          {/* ✅ Detected Problems REMOVED — skin issues section hata diya */}

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
                  {getHairstyles(result.faceShape, isFemale ? "female" : "male").length} personalized cuts — tap any to expand
                </div>
              </div>

              {getHairstyles(result.faceShape, isFemale ? "female" : "male").map((style, i) => {
                const maintenanceColor = style.maintenance === "Low" ? "#51CF66" : style.maintenance === "Medium" ? "#FFD93D" : "#FF6B6B";
                const isExpanded = expandedCard === i;
                return (
                  <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                      <img src={getHairImage(style.img, isFemale ? "female" : "male")} alt={style.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.src = isFemale ? HAIRSTYLE_IMAGES.default_female : HAIRSTYLE_IMAGES.default_male; }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }} />
                      <div style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderRadius: 10, background: isFemale ? "linear-gradient(135deg,#FF6B6B,#845EF7)" : "linear-gradient(135deg,#4D96FF,#845EF7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 800, color: "#fff" }}>{i + 1}</div>
                      <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 20, background: `${maintenanceColor}33`, border: `1px solid ${maintenanceColor}`, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: maintenanceColor }}>{style.maintenance} care</div>
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
                {getFaceShapeTips(result.faceShape, isFemale ? "female" : "male").map((tip, i) => {
                  const allTips = getFaceShapeTips(result.faceShape, isFemale ? "female" : "male");
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < allTips.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: isFemale ? "rgba(255,107,107,0.15)" : "rgba(77,150,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: isFemale ? "#FF6B6B" : "#4D96FF", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", paddingTop: 2, lineHeight: 1.5 }}>{tip}</div>
                    </div>
                  );
                })}
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
              <ResultCard title="🎨 Color Recommendations" items={result.colorRecommendations} gradient="var(--grad2)" icon="🎨" />
              <ResultCard title="✂️ Grooming Tips" items={result.grooming} gradient="var(--grad3)" icon="✂️" />
              <ResultCard title="⚠️ Styles to Avoid" items={result.stylesAvoid} gradient="linear-gradient(135deg,#555,#333)" icon="⚠️" />
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