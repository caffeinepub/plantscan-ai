import { type Disease, diseases } from "../data/diseases";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function formatDiseaseResponse(disease: Disease): string {
  return `**${disease.name}** (Severity: ${disease.severity})

📋 **Description**
${disease.description}

🌿 **Affected Plants**
${disease.affectedPlants.join(", ")}

🔍 **Key Symptoms**
${disease.symptoms.map((s) => `• ${s}`).join("\n")}

💊 **Treatment**
${disease.treatment}`;
}

function matchDiseases(query: string): Disease[] {
  const q = normalize(query);
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);

  return diseases.filter((disease) => {
    const nameNorm = normalize(disease.name);
    const descNorm = normalize(disease.description);
    const symptomsNorm = disease.symptoms.map(normalize).join(" ");
    const plantsNorm = disease.affectedPlants.map(normalize).join(" ");
    const treatmentNorm = normalize(disease.treatment);

    // Exact disease name match — strong hit
    if (q.includes(nameNorm) || nameNorm.includes(q)) return true;

    // Token matching across fields
    const fullText = [
      nameNorm,
      descNorm,
      symptomsNorm,
      plantsNorm,
      treatmentNorm,
    ].join(" ");
    const matchedTokens = tokens.filter((t) => fullText.includes(t));
    return matchedTokens.length >= Math.min(2, tokens.length);
  });
}

function detectIntent(
  query: string,
): "symptoms" | "treatment" | "plants" | "general" | "severity" {
  const q = normalize(query);
  if (q.includes("symptom") || q.includes("sign") || q.includes("look like"))
    return "symptoms";
  if (
    q.includes("treat") ||
    q.includes("cure") ||
    q.includes("control") ||
    q.includes("manage") ||
    q.includes("fungicide") ||
    q.includes("pesticide")
  )
    return "treatment";
  if (
    q.includes("plant") ||
    q.includes("crop") ||
    q.includes("affect") ||
    q.includes("which")
  )
    return "plants";
  if (q.includes("severe") || q.includes("danger") || q.includes("serious"))
    return "severity";
  return "general";
}

export function generateResponse(userMessage: string): string {
  const q = normalize(userMessage);

  // Greeting
  if (
    q.match(/^(hi|hello|hey|greetings|howdy|good morning|good afternoon|sup)/)
  ) {
    return "Hello! 👋 I'm PlantBot, your plant disease expert. I can help you identify diseases, understand symptoms, and find treatments. What would you like to know?";
  }

  // Help request
  if (q.includes("help") || q.includes("what can you do")) {
    return `I can help you with:

🌱 **Disease Information** — Ask about any disease like "Tell me about Early Blight"
🔍 **Symptoms** — "What are the symptoms of Leaf Rust?"
💊 **Treatment** — "How do I treat Powdery Mildew?"
🌿 **Affected Plants** — "Which plants get Mosaic Virus?"
📊 **Severity** — "How dangerous is Late Blight?"

I know about ${diseases.length} common plant diseases. Just ask!`;
  }

  // All diseases list
  if (
    q.includes("list") ||
    (q.includes("all") && (q.includes("disease") || q.includes("know")))
  ) {
    const bySeverity: Record<string, Disease[]> = {};
    for (const d of diseases) {
      if (!bySeverity[d.severity]) bySeverity[d.severity] = [];
      bySeverity[d.severity].push(d);
    }
    const lines = ["Here are all the plant diseases I know about:\n"];
    const order = ["Critical", "High", "Medium", "Low"] as const;
    for (const sev of order) {
      if (bySeverity[sev]) {
        lines.push(
          `🔴 **${sev} Severity:** ${bySeverity[sev].map((d) => d.name).join(", ")}`,
        );
      }
    }
    return lines.join("\n");
  }

  // Match diseases to the query
  const matched = matchDiseases(userMessage);
  const intent = detectIntent(userMessage);

  if (matched.length === 0) {
    // Check for plant name mentions
    const plantMentioned = diseases
      .flatMap((d) => d.affectedPlants)
      .find((p) => q.includes(normalize(p)));

    if (plantMentioned) {
      const plantDiseases = diseases.filter((d) =>
        d.affectedPlants.some(
          (p) => normalize(p) === normalize(plantMentioned),
        ),
      );
      return `**Diseases affecting ${plantMentioned}:**\n\n${plantDiseases
        .map(
          (d) =>
            `• **${d.name}** (${d.severity} severity) — ${d.description.split(".")[0]}.`,
        )
        .join("\n")}`;
    }

    return `I couldn't find information matching your query. Try asking about a specific disease like "Early Blight", "Powdery Mildew", or "Mosaic Virus". You can also ask me to list all diseases I know about!`;
  }

  if (matched.length === 1) {
    const disease = matched[0];
    if (intent === "symptoms") {
      return `**Symptoms of ${disease.name}:**\n\n${disease.symptoms.map((s) => `• ${s}`).join("\n")}`;
    }
    if (intent === "treatment") {
      return `**Treatment for ${disease.name}:**\n\n${disease.treatment}`;
    }
    if (intent === "plants") {
      return `**${disease.name}** affects the following plants:\n\n${disease.affectedPlants.map((p) => `• ${p}`).join("\n")}`;
    }
    if (intent === "severity") {
      const icons: Record<string, string> = {
        Low: "🟢",
        Medium: "🟡",
        High: "🟠",
        Critical: "🔴",
      };
      return `${icons[disease.severity]} **${disease.name}** has **${disease.severity}** severity.\n\n${disease.description}`;
    }
    return formatDiseaseResponse(disease);
  }

  // Multiple matches
  if (matched.length <= 3) {
    return `I found ${matched.length} diseases matching your query:\n\n${matched
      .map(
        (d) =>
          `**${d.name}** (${d.severity} severity)\n${d.description.split(".")[0]}.`,
      )
      .join("\n\n---\n\n")}`;
  }

  // Too many — summarize
  return `I found several diseases related to your query. Here's a summary:\n\n${matched
    .slice(0, 5)
    .map(
      (d) =>
        `• **${d.name}** (${d.severity}) — affects ${d.affectedPlants.slice(0, 2).join(", ")}`,
    )
    .join("\n")}\n\nAsk about a specific disease for detailed information!`;
}

export const SUGGESTIONS = [
  "What are the symptoms of Early Blight?",
  "How do I treat Powdery Mildew?",
  "Which diseases affect tomatoes?",
  "What is the most dangerous plant disease?",
];
