import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Char "mo:core/Char";
import BlobStorageMixin "blob-storage/Mixin";

persistent actor Main {

  type Severity = { #Low; #Medium; #High; #Critical };

  type Disease = {
    id : Nat;
    name : Text;
    description : Text;
    symptoms : [Text];
    treatment : Text;
    affectedPlants : [Text];
    severity : Severity;
  };

  type Prediction = {
    diseaseId : Nat;
    diseaseName : Text;
    confidence : Float;
  };

  type ScanResult = {
    id : Nat;
    timestamp : Int;
    imageRef : Text;
    topDisease : Text;
    topConfidence : Float;
    predictions : [Prediction];
  };

  let diseaseCatalog : [Disease] = [
    {
      id = 0;
      name = "Early Blight";
      description = "A common fungal disease caused by Alternaria solani affecting leaves, stems, and fruits of tomato and potato plants.";
      symptoms = ["Dark brown spots with concentric rings on older leaves", "Yellowing around lesions", "Premature leaf drop", "Dark sunken lesions on stems"];
      treatment = "Apply fungicides containing chlorothalonil or mancozeb. Remove infected leaves promptly. Ensure good air circulation. Practice crop rotation.";
      affectedPlants = ["Tomato", "Potato", "Eggplant"];
      severity = #High;
    },
    {
      id = 1;
      name = "Late Blight";
      description = "A devastating oomycete disease caused by Phytophthora infestans, responsible for the Irish Potato Famine. Spreads rapidly in cool wet conditions.";
      symptoms = ["Water-soaked lesions on leaves that turn brown", "White mold growth on leaf undersides", "Rapid plant collapse in humid conditions", "Dark brown rot on tubers"];
      treatment = "Apply copper-based fungicides or mefenoxam. Remove and destroy infected plants. Avoid overhead irrigation. Use resistant varieties.";
      affectedPlants = ["Tomato", "Potato"];
      severity = #Critical;
    },
    {
      id = 2;
      name = "Powdery Mildew";
      description = "A fungal disease appearing as white powdery coating on plant surfaces caused by various obligate fungal parasites.";
      symptoms = ["White powdery spots on leaves and stems", "Yellowing and distortion of leaves", "Stunted growth", "Premature leaf drop in severe cases"];
      treatment = "Apply sulfur-based fungicides or potassium bicarbonate. Improve air circulation. Avoid excessive nitrogen fertilization. Use neem oil.";
      affectedPlants = ["Cucumber", "Squash", "Grape", "Rose", "Wheat"];
      severity = #Medium;
    },
    {
      id = 3;
      name = "Leaf Rust";
      description = "A fungal disease caused by Puccinia species producing rust-colored pustules on leaves weakening the plant and reducing yield.";
      symptoms = ["Orange-red to brown pustules on leaf surfaces", "Yellow halos around pustules", "Premature defoliation", "Reduced grain fill in cereals"];
      treatment = "Apply triazole or strobilurin fungicides. Plant resistant varieties. Remove volunteer plants. Apply preventive fungicide sprays.";
      affectedPlants = ["Wheat", "Corn", "Barley", "Rye"];
      severity = #High;
    },
    {
      id = 4;
      name = "Mosaic Virus";
      description = "A viral disease transmitted by aphids causing a mosaic pattern of light and dark green or yellow patches on leaves.";
      symptoms = ["Mosaic mottled light and dark green pattern on leaves", "Leaf curling and distortion", "Stunted growth", "Reduced fruit quality and yield"];
      treatment = "No cure; remove and destroy infected plants. Control aphid vectors with insecticides. Use virus-free certified seeds. Plant resistant varieties.";
      affectedPlants = ["Tomato", "Cucumber", "Pepper", "Bean", "Potato"];
      severity = #High;
    },
    {
      id = 5;
      name = "Bacterial Wilt";
      description = "A soil-borne bacterial disease caused by Ralstonia solanacearum that blocks water-conducting vessels causing rapid wilting and death.";
      symptoms = ["Sudden wilting of entire plant or branches", "Brown discoloration of stem vascular tissue", "Bacterial ooze when stem is cut in water", "No recovery even after watering"];
      treatment = "No effective chemical treatment. Remove and destroy infected plants. Practice long crop rotation of 3-4 years. Improve soil drainage. Use resistant varieties.";
      affectedPlants = ["Tomato", "Potato", "Eggplant", "Pepper", "Banana"];
      severity = #Critical;
    },
    {
      id = 6;
      name = "Downy Mildew";
      description = "An oomycete disease favored by cool moist conditions causing yellowing on upper leaf surfaces and gray-purple downy growth underneath.";
      symptoms = ["Yellow angular spots on upper leaf surface", "Gray-purple downy growth on leaf undersides", "Affected leaves turn brown and die", "Defoliation in severe cases"];
      treatment = "Apply mancozeb metalaxyl or copper-based fungicides. Avoid overhead irrigation. Ensure good air circulation. Remove infected plant debris.";
      affectedPlants = ["Cucumber", "Lettuce", "Grape", "Spinach", "Basil"];
      severity = #Medium;
    },
    {
      id = 7;
      name = "Anthracnose";
      description = "A fungal disease caused by Colletotrichum species causing dark sunken lesions on fruits leaves and stems often after harvest.";
      symptoms = ["Small dark water-soaked spots that enlarge and sink", "Salmon-colored spore masses in wet conditions", "Post-harvest fruit rot", "Dark irregular lesions on pods and stems"];
      treatment = "Apply fungicides containing thiophanate-methyl or azoxystrobin. Harvest promptly. Handle fruits carefully. Store at appropriate temperature.";
      affectedPlants = ["Mango", "Avocado", "Strawberry", "Bean", "Pepper"];
      severity = #High;
    },
    {
      id = 8;
      name = "Root Rot";
      description = "A complex of soil-borne fungal and oomycete pathogens including Pythium and Phytophthora that attack roots causing decay and plant death.";
      symptoms = ["Yellowing and wilting of foliage", "Brown water-soaked roots", "Easy separation of root outer layer", "Stunted growth and poor vigor"];
      treatment = "Improve soil drainage. Reduce irrigation frequency. Apply biological controls like Trichoderma. Use fungicide drenches with metalaxyl.";
      affectedPlants = ["Tomato", "Soybean", "Corn", "Ornamentals"];
      severity = #High;
    },
    {
      id = 9;
      name = "Gray Mold";
      description = "A fungal disease caused by Botrytis cinerea thriving in cool humid conditions producing distinctive gray fuzzy mold on infected tissue.";
      symptoms = ["Water-soaked lesions developing gray fuzzy mold", "Blossom blight and fruit rot", "Damping off of seedlings", "Cankers on stems"];
      treatment = "Remove infected plant parts immediately. Improve air circulation and reduce humidity. Apply fungicides with iprodione or fenhexamid.";
      affectedPlants = ["Strawberry", "Grape", "Tomato", "Lettuce", "Rose"];
      severity = #Medium;
    },
    {
      id = 10;
      name = "Fusarium Wilt";
      description = "A soil-borne fungal disease caused by Fusarium oxysporum that colonizes the vascular system causing one-sided wilting and yellowing.";
      symptoms = ["One-sided yellowing and wilting of leaves", "Brown discoloration of vascular tissue in stem", "Stunted plant growth", "Plant death in severe infections"];
      treatment = "Plant resistant varieties. Practice crop rotation with non-host crops. Solarize soil. Apply Trichoderma-based biological controls.";
      affectedPlants = ["Tomato", "Banana", "Watermelon", "Carnation", "Cotton"];
      severity = #Critical;
    },
    {
      id = 11;
      name = "Corn Smut";
      description = "A fungal disease caused by Ustilago maydis forming large tumor-like galls on corn kernels tassels and other plant parts.";
      symptoms = ["Large silvery-white galls on ears tassels and stems", "Galls turn black and powdery at maturity", "Distorted plant growth", "Reduced yield"];
      treatment = "Remove and destroy galls before they rupture. Plant resistant hybrids. Avoid damaging plants during cultivation. Rotate crops.";
      affectedPlants = ["Corn", "Maize"];
      severity = #Medium;
    }
  ];

  var scanHistory : [ScanResult] = [];
  var nextScanId : Nat = 0;

  func textToSeed(t : Text) : Nat {
    var hash : Nat = 5381;
    for (c in t.chars()) {
      let code = c.toNat32().toNat();
      hash := (hash * 33 + code) % 1_000_000_007;
    };
    hash
  };

  func textContainsIgnoreCase(haystack : Text, needle : Text) : Bool {
    let h = haystack.toLower();
    let n = needle.toLower();
    h.contains(#text n)
  };

  public query func getDiseases() : async [Disease] {
    diseaseCatalog
  };

  public query func getDiseaseById(id : Nat) : async ?Disease {
    diseaseCatalog.find(func(d : Disease) : Bool { d.id == id })
  };

  public query func getScanHistory() : async [ScanResult] {
    let size = scanHistory.size();
    Array.tabulate<ScanResult>(size, func(i) { scanHistory[size - 1 - i] })
  };

  public query func chatQuery(question : Text) : async Text {
    var matched : ?Disease = null;

    label search for (disease in diseaseCatalog.vals()) {
      if (textContainsIgnoreCase(question, disease.name)) {
        matched := ?disease;
        break search;
      };
      for (plant in disease.affectedPlants.vals()) {
        if (textContainsIgnoreCase(question, plant)) {
          matched := ?disease;
          break search;
        };
      };
    };

    switch (matched) {
      case (?disease) {
        let symptomList = disease.symptoms.vals().join(", ");
        "Based on your question about " # disease.name # ": " # disease.description #
        " Common symptoms include: " # symptomList # ". " #
        "Recommended treatment: " # disease.treatment
      };
      case null {
        "I can help with plant diseases like Early Blight, Late Blight, Powdery Mildew, Leaf Rust, Mosaic Virus, Bacterial Wilt, Downy Mildew, Anthracnose, Root Rot, Gray Mold, Fusarium Wilt, and Corn Smut. Ask about a specific disease or describe your plant symptoms."
      };
    }
  };

  public func analyzePlantImage(imageBase64 : Text) : async [Prediction] {
    let seed = textToSeed(imageBase64);
    let n = diseaseCatalog.size();

    let idx0 = seed % n;
    var idx1 = (seed * 31 + 7) % n;
    var idx2 = (seed * 97 + 13) % n;

    if (idx1 == idx0) { idx1 := (idx1 + 1) % n };
    if (idx2 == idx0 or idx2 == idx1) { idx2 := (idx2 + 2) % n };
    if (idx2 == idx0 or idx2 == idx1) { idx2 := (idx2 + 1) % n };

    let d0 = diseaseCatalog[idx0];
    let d1 = diseaseCatalog[idx1];
    let d2 = diseaseCatalog[idx2];

    let varSeed : Int = seed % 10;
    let variation : Float = varSeed.toFloat() / 100.0;
    let c0 : Float = 0.55 + variation;
    let c1 : Float = 0.28 - (variation / 2.0);
    let c2 : Float = 1.0 - c0 - c1;

    [
      { diseaseId = d0.id; diseaseName = d0.name; confidence = c0 },
      { diseaseId = d1.id; diseaseName = d1.name; confidence = c1 },
      { diseaseId = d2.id; diseaseName = d2.name; confidence = c2 }
    ]
  };

  public func saveScan(imageRef : Text, predictions : [Prediction]) : async Nat {
    if (predictions.size() == 0) { return 0 };
    let top = predictions[0];
    let result : ScanResult = {
      id = nextScanId;
      timestamp = Time.now();
      imageRef;
      topDisease = top.diseaseName;
      topConfidence = top.confidence;
      predictions;
    };
    scanHistory := scanHistory.concat([result]);
    let id = nextScanId;
    nextScanId += 1;
    id
  };

  include BlobStorageMixin ();
};
