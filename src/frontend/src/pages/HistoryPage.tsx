import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Clock, History, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { SeverityBadge } from "../components/app/SeverityBadge";
import {
  type ScanEntry,
  clearHistory,
  loadHistory,
} from "../utils/scanHistory";

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const [history, setHistory] = useState<ScanEntry[]>(() => loadHistory());

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Scan History
              </h1>
              <p className="text-muted-foreground">
                {history.length > 0
                  ? `${history.length} past scan${history.length !== 1 ? "s" : ""} — most recent first`
                  : "No scans yet"}
              </p>
            </motion.div>

            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    data-ocid="history.clear_button"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Scan History</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {history.length} scan
                      {history.length !== 1 ? "s" : ""} from your history. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="history.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      data-ocid="history.confirm_button"
                      onClick={handleClearHistory}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear History
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {history.length === 0 ? (
          <motion.div
            data-ocid="history.empty_state"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <History className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              No Scans Yet
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Upload a plant photo on the Scan page to analyze it. Your results
              will appear here automatically.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Start Scanning</Link>
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div data-ocid="history.list" className="space-y-4">
              {history.map((entry, idx) => {
                const topPred = entry.predictions[0];
                const altPreds = entry.predictions.slice(1);
                const displayIdx = idx + 1;

                return (
                  <motion.div
                    key={entry.id}
                    data-ocid={`history.item.${displayIdx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-botanical transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={entry.imageDataUrl}
                              alt={`Scan ${displayIdx}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <h3 className="font-display font-semibold text-foreground">
                                  {topPred?.disease.name ?? "Unknown"}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(entry.timestamp)}
                                  </span>
                                </div>
                              </div>
                              {topPred && (
                                <SeverityBadge
                                  severity={topPred.disease.severity}
                                />
                              )}
                            </div>

                            {/* Confidence */}
                            {topPred && (
                              <div className="flex items-center gap-3">
                                <div className="flex-1 max-w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full confidence-bar-fill rounded-full"
                                    style={{
                                      width: `${Math.round(topPred.confidence * 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-mono font-semibold text-primary">
                                  {Math.round(topPred.confidence * 100)}%
                                  confidence
                                </span>
                              </div>
                            )}

                            {/* Alt predictions */}
                            {altPreds.length > 0 && (
                              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                                <AlertCircle className="w-3 h-3" />
                                Also considered:{" "}
                                {altPreds.map((p) => p.disease.name).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
