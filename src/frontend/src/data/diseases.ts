export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Disease {
  id: number;
  name: string;
  description: string;
  symptoms: string[];
  treatment: string;
  affectedPlants: string[];
  severity: Severity;
}

export const diseases: Disease[] = [
  {
    id: 0,
    name: "Early Blight",
    description:
      "A common fungal disease caused by Alternaria solani that affects the leaves, stems, and fruits of tomato and potato plants.",
    symptoms: [
      "Dark brown spots with concentric rings on older leaves",
      "Yellowing around lesions",
      "Premature leaf drop",
      "Dark sunken lesions on stems",
    ],
    treatment:
      "Apply fungicides containing chlorothalonil or mancozeb. Remove infected leaves promptly. Ensure good air circulation. Practice crop rotation.",
    affectedPlants: ["Tomato", "Potato", "Eggplant"],
    severity: "High",
  },
  {
    id: 1,
    name: "Late Blight",
    description:
      "A devastating oomycete disease caused by Phytophthora infestans, responsible for the Irish Potato Famine. Spreads rapidly in cool, wet conditions.",
    symptoms: [
      "Water-soaked lesions on leaves that turn brown",
      "White mold growth on leaf undersides",
      "Rapid plant collapse in humid conditions",
      "Dark brown rot on tubers",
    ],
    treatment:
      "Apply copper-based fungicides or mefenoxam. Remove and destroy infected plants. Avoid overhead irrigation. Use resistant varieties.",
    affectedPlants: ["Tomato", "Potato"],
    severity: "Critical",
  },
  {
    id: 2,
    name: "Powdery Mildew",
    description:
      "A fungal disease appearing as white powdery coating on plant surfaces, caused by various species of obligate fungal parasites.",
    symptoms: [
      "White powdery spots on leaves and stems",
      "Yellowing and distortion of leaves",
      "Stunted growth",
      "Premature leaf drop in severe cases",
    ],
    treatment:
      "Apply sulfur-based fungicides or potassium bicarbonate. Improve air circulation. Avoid excessive nitrogen fertilization. Use neem oil as organic option.",
    affectedPlants: ["Cucumber", "Squash", "Grape", "Rose", "Wheat"],
    severity: "Medium",
  },
  {
    id: 3,
    name: "Leaf Rust",
    description:
      "A fungal disease caused by Puccinia species producing rust-colored pustules on leaves, weakening the plant and reducing yield.",
    symptoms: [
      "Orange-red to brown pustules on leaf surfaces",
      "Yellow halos around pustules",
      "Premature defoliation",
      "Reduced grain fill in cereals",
    ],
    treatment:
      "Apply triazole or strobilurin fungicides. Plant resistant varieties. Remove volunteer plants. Monitor and apply preventive fungicide sprays.",
    affectedPlants: ["Wheat", "Corn", "Barley", "Rye"],
    severity: "High",
  },
  {
    id: 4,
    name: "Mosaic Virus",
    description:
      "A viral disease transmitted primarily by aphids causing a characteristic mosaic pattern of light and dark green or yellow patches on leaves.",
    symptoms: [
      "Mosaic or mottled light and dark green pattern on leaves",
      "Leaf curling and distortion",
      "Stunted growth",
      "Reduced fruit quality and yield",
    ],
    treatment:
      "No cure exists; remove and destroy infected plants. Control aphid vectors with insecticides. Use virus-free certified seeds. Plant resistant varieties.",
    affectedPlants: ["Tomato", "Cucumber", "Pepper", "Bean", "Potato"],
    severity: "High",
  },
  {
    id: 5,
    name: "Bacterial Wilt",
    description:
      "A soil-borne bacterial disease caused by Ralstonia solanacearum that blocks water-conducting vessels, causing rapid wilting and death.",
    symptoms: [
      "Sudden wilting of entire plant or branches",
      "Brown discoloration of stem vascular tissue",
      "Bacterial ooze when stem is cut and placed in water",
      "No recovery even after watering",
    ],
    treatment:
      "No effective chemical treatment. Remove and destroy infected plants. Practice long crop rotation (3-4 years). Improve soil drainage. Use resistant varieties.",
    affectedPlants: ["Tomato", "Potato", "Eggplant", "Pepper", "Banana"],
    severity: "Critical",
  },
  {
    id: 6,
    name: "Downy Mildew",
    description:
      "An oomycete disease favored by cool, moist conditions causing yellowing on upper leaf surfaces and a gray-purple downy growth underneath.",
    symptoms: [
      "Yellow angular spots on upper leaf surface",
      "Gray-purple downy growth on leaf undersides",
      "Affected leaves turn brown and die",
      "Defoliation in severe cases",
    ],
    treatment:
      "Apply mancozeb, metalaxyl, or copper-based fungicides. Avoid overhead irrigation. Ensure good air circulation. Remove infected plant debris.",
    affectedPlants: ["Cucumber", "Lettuce", "Grape", "Spinach", "Basil"],
    severity: "Medium",
  },
  {
    id: 7,
    name: "Anthracnose",
    description:
      "A fungal disease caused by Colletotrichum species that causes dark, sunken lesions on fruits, leaves, and stems.",
    symptoms: [
      "Small dark water-soaked spots that enlarge and sink",
      "Salmon-colored spore masses in wet conditions",
      "Post-harvest fruit rot",
      "Dark irregular lesions on pods and stems",
    ],
    treatment:
      "Apply fungicides containing thiophanate-methyl or azoxystrobin. Harvest promptly at proper maturity. Handle fruits carefully. Store at appropriate temperature.",
    affectedPlants: ["Mango", "Avocado", "Strawberry", "Bean", "Pepper"],
    severity: "High",
  },
  {
    id: 8,
    name: "Root Rot",
    description:
      "A complex of soil-borne fungal and oomycete pathogens including Pythium and Phytophthora that attack roots, causing decay and plant death.",
    symptoms: [
      "Yellowing and wilting of foliage",
      "Brown water-soaked roots",
      "Easy separation of root outer layer",
      "Stunted growth and poor vigor",
    ],
    treatment:
      "Improve soil drainage. Reduce irrigation frequency. Apply biological controls like Trichoderma. Use fungicide drenches with metalaxyl. Avoid over-fertilization.",
    affectedPlants: ["Tomato", "Soybean", "Corn", "Ornamentals"],
    severity: "High",
  },
  {
    id: 9,
    name: "Gray Mold",
    description:
      "A fungal disease caused by Botrytis cinerea that thrives in cool, humid conditions, producing a distinctive gray fuzzy mold on infected tissue.",
    symptoms: [
      "Water-soaked lesions developing gray fuzzy mold",
      "Blossom blight and fruit rot",
      "Damping off of seedlings",
      "Cankers on stems",
    ],
    treatment:
      "Remove infected plant parts immediately. Improve air circulation and reduce humidity. Apply fungicides with iprodione or fenhexamid. Avoid wounding plants.",
    affectedPlants: ["Strawberry", "Grape", "Tomato", "Lettuce", "Rose"],
    severity: "Medium",
  },
  {
    id: 10,
    name: "Fusarium Wilt",
    description:
      "A soil-borne fungal disease caused by Fusarium oxysporum that colonizes the vascular system, causing characteristic one-sided wilting.",
    symptoms: [
      "One-sided yellowing and wilting of leaves",
      "Brown discoloration of vascular tissue in stem",
      "Stunted plant growth",
      "Plant death in severe infections",
    ],
    treatment:
      "Plant resistant varieties. Practice crop rotation with non-host crops. Solarize soil. Apply Trichoderma-based biological controls. Maintain proper soil pH.",
    affectedPlants: ["Tomato", "Banana", "Watermelon", "Carnation", "Cotton"],
    severity: "Critical",
  },
  {
    id: 11,
    name: "Corn Smut",
    description:
      "A fungal disease caused by Ustilago maydis that forms large tumor-like galls on corn kernels, tassels, and other plant parts.",
    symptoms: [
      "Large silvery-white galls on ears tassels and stems",
      "Galls turn black and powdery at maturity",
      "Distorted plant growth",
      "Reduced yield",
    ],
    treatment:
      "Remove and destroy galls before they rupture. Plant resistant hybrids. Avoid damaging plants during cultivation. Rotate crops.",
    affectedPlants: ["Corn", "Maize"],
    severity: "Medium",
  },
];
