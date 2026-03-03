import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  Loader2,
  RotateCcw,
  Scan,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { SeverityBadge } from "../components/app/SeverityBadge";
import { type Prediction, simulateCNN } from "../utils/cnnSimulator";
import { saveEntry } from "../utils/scanHistory";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type PageState = "idle" | "analyzing" | "results";

export function ScanPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const dataUrl = await fileToDataUrl(file);
    setPreviewUrl(dataUrl);
    setPageState("idle");
    setPredictions([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;
    setPageState("analyzing");

    // Simulated 1.5s CNN processing
    await new Promise((r) => setTimeout(r, 1500));
    const results = await simulateCNN(selectedFile);
    setPredictions(results);
    setPageState("results");

    // Save to history
    saveEntry({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      imageDataUrl: previewUrl,
      predictions: results,
    });
  };

  const handleReset = () => {
    setPageState("idle");
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictions([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const topPrediction = predictions[0];
  const altPredictions = predictions.slice(1);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/60 via-background to-background border-b border-border">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                CNN-Powered Analysis
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-5">
                Identify Plant <span className="text-primary">Diseases</span>{" "}
                Instantly
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
                Upload a photo of your plant and our AI-powered CNN model will
                analyze it against 12 common diseases with confidence scores and
                treatment recommendations.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {["12 Diseases", "Top-3 Predictions", "Treatment Advice"].map(
                  (feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {feat}
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <img
                  src="/assets/generated/hero-plant.dim_1200x600.jpg"
                  alt="Healthy plant leaves"
                  className="w-full h-72 object-cover rounded-2xl shadow-botanical-lg"
                />
                <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-botanical flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scan className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      AI Analysis
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Results in seconds
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload / Results Section */}
      <section className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <AnimatePresence mode="wait">
          {pageState !== "results" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Drop Zone — div wrapper required for drag-and-drop events */}
              <div
                data-ocid="scan.dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !selectedFile) {
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={selectedFile ? -1 : 0}
                aria-label="Drop plant image here or click to upload"
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : selectedFile
                      ? "border-primary/40 bg-secondary/30 cursor-default"
                      : "border-border hover:border-primary/50 hover:bg-secondary/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                  aria-label="Upload plant image"
                />

                {previewUrl ? (
                  <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={previewUrl}
                        alt="Selected plant"
                        className="w-48 h-48 object-cover rounded-xl shadow-card"
                      />
                      <div className="absolute inset-0 rounded-xl ring-2 ring-primary/30" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-semibold text-foreground mb-1">
                        {selectedFile?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : ""}{" "}
                        · Ready for analysis
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        data-ocid="scan.upload_button"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                        isDragOver
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isDragOver ? (
                        <Upload className="w-8 h-8" />
                      ) : (
                        <ImageIcon className="w-8 h-8" />
                      )}
                    </div>
                    <p className="font-display font-semibold text-xl text-foreground mb-2">
                      {isDragOver
                        ? "Drop to upload"
                        : "Drop your plant photo here"}
                    </p>
                    <p className="text-muted-foreground text-sm mb-5">
                      or click to browse · JPG, PNG, WEBP supported
                    </p>
                    <Button
                      data-ocid="scan.upload_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Analyze button */}
              <div className="flex justify-center">
                <Button
                  data-ocid="scan.analyze_button"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || pageState === "analyzing"}
                  className="px-10 py-6 text-base font-semibold shadow-botanical"
                >
                  {pageState === "analyzing" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 mr-2" />
                      Analyze Plant
                    </>
                  )}
                </Button>
              </div>

              {/* Loading state indicator */}
              {pageState === "analyzing" && (
                <div
                  data-ocid="scan.loading_state"
                  className="flex flex-col items-center gap-3 py-4"
                >
                  <div className="w-full max-w-xs">
                    <Progress
                      value={undefined}
                      className="h-1.5 animate-pulse"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Running CNN inference...
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              data-ocid="scan.results_panel"
              className="space-y-6"
            >
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Analysis Results
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    CNN model identified {predictions.length} potential
                    conditions
                  </p>
                </div>
                <Button
                  data-ocid="scan.reset_button"
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Another
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: image thumbnail */}
                <div className="lg:col-span-1">
                  <Card className="overflow-hidden shadow-card">
                    <div className="aspect-square relative">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Analyzed plant"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-xs font-medium truncate">
                          {selectedFile?.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right: main prediction */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Top prediction card */}
                  {topPrediction && (
                    <Card
                      data-ocid="scan.top_disease_card"
                      className="border-primary/20 shadow-botanical"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                Primary Detection
                              </span>
                            </div>
                            <CardTitle className="font-display text-2xl">
                              {topPrediction.disease.name}
                            </CardTitle>
                          </div>
                          <SeverityBadge
                            severity={topPrediction.disease.severity}
                          />
                        </div>

                        {/* Confidence bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground font-medium">
                              Confidence
                            </span>
                            <span className="font-mono font-semibold text-primary">
                              {Math.round(topPrediction.confidence * 100)}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${topPrediction.confidence * 100}%`,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full confidence-bar-fill rounded-full"
                            />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {topPrediction.disease.description}
                        </p>

                        {/* Symptoms */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Key Symptoms
                          </h4>
                          <ul className="space-y-1.5">
                            {topPrediction.disease.symptoms.map((s) => (
                              <li
                                key={s}
                                className="flex items-start gap-2 text-sm"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Treatment */}
                        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                            Treatment Advice
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {topPrediction.disease.treatment}
                          </p>
                        </div>

                        {/* Affected plants */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Commonly Affects
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {topPrediction.disease.affectedPlants.map((p) => (
                              <span
                                key={p}
                                className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full font-medium"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Alternative predictions */}
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                  Alternative Possibilities
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {altPredictions.map((pred, idx) => (
                    <Card
                      key={pred.disease.id}
                      data-ocid={`scan.alternative.item.${idx + 1}`}
                      className="hover:shadow-botanical transition-shadow"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground font-mono mb-0.5">
                              #{idx + 2} match
                            </p>
                            <h4 className="font-display font-semibold text-foreground">
                              {pred.disease.name}
                            </h4>
                          </div>
                          <SeverityBadge severity={pred.disease.severity} />
                        </div>

                        {/* Confidence */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              Confidence
                            </span>
                            <span className="font-mono font-semibold">
                              {Math.round(pred.confidence * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${pred.confidence * 100}%`,
                              }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2 * (idx + 1),
                                ease: "easeOut",
                              }}
                              className="h-full bg-muted-foreground/40 rounded-full"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {pred.disease.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
