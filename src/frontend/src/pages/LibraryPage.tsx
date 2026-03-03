import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SeverityBadge } from "../components/app/SeverityBadge";
import { type Disease, type Severity, diseases } from "../data/diseases";

const ALL_SEVERITIES: (Severity | "All")[] = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
];

export function LibraryPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All");
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  const filtered = diseases.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.affectedPlants.some((p) => p.toLowerCase().includes(q)) ||
      d.description.toLowerCase().includes(q);
    const matchesSeverity =
      severityFilter === "All" || d.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Disease Library
            </h1>
            <p className="text-muted-foreground">
              Browse and search {diseases.length} documented plant diseases with
              symptoms and treatments
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="library.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diseases or affected plants..."
              className="pl-9 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Severity tabs */}
          <Tabs
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as Severity | "All")}
          >
            <TabsList data-ocid="library.severity_tab" className="h-10">
              {ALL_SEVERITIES.map((sev) => (
                <TabsTrigger key={sev} value={sev} className="text-xs px-3">
                  {sev}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "disease" : "diseases"}
        </p>

        {/* Disease grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="font-display font-semibold text-xl text-foreground mb-2">
              No diseases found
            </p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((disease, idx) => {
              // Compute display index (1-based, for deterministic marker)
              const displayIdx = diseases.indexOf(disease) + 1;
              return (
                <motion.div
                  key={disease.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <Card
                    data-ocid={`library.disease_card.item.${displayIdx}`}
                    className="cursor-pointer hover:shadow-botanical transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col"
                    onClick={() => setSelectedDisease(disease)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="font-display text-lg leading-tight">
                          {disease.name}
                        </CardTitle>
                        <SeverityBadge severity={disease.severity} />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {disease.description}
                      </p>

                      {/* Affected plants */}
                      <div className="flex flex-wrap gap-1.5">
                        {disease.affectedPlants.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                          >
                            {p}
                          </span>
                        ))}
                        {disease.affectedPlants.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                            +{disease.affectedPlants.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-primary text-xs font-medium">
                        View details
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedDisease}
        onOpenChange={(open) => !open && setSelectedDisease(null)}
      >
        <DialogContent
          data-ocid="library.disease_detail.dialog"
          className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {selectedDisease && (
            <>
              <DialogHeader className="flex-shrink-0">
                <div className="flex items-start justify-between gap-3 pr-8">
                  <div>
                    <DialogTitle className="font-display text-2xl">
                      {selectedDisease.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDisease.description.split(".")[0]}.
                    </p>
                  </div>
                  <SeverityBadge severity={selectedDisease.severity} />
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-5 pb-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedDisease.description}
                  </p>

                  {/* Affected Plants */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Affected Plants
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.affectedPlants.map((p) => (
                        <span
                          key={p}
                          className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Symptoms
                    </h3>
                    <ul className="space-y-2">
                      {selectedDisease.symptoms.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      Treatment & Management
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedDisease.treatment}
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 pt-2 border-t border-border">
                <Button
                  data-ocid="library.disease_detail.close_button"
                  variant="outline"
                  onClick={() => setSelectedDisease(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
