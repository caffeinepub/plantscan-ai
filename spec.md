# PlantScan AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Plant disease catalog stored in backend (name, description, symptoms, treatment, affected plants, severity level)
- Simulated CNN image classification: accepts base64 image, returns top-3 disease predictions with confidence scores
- Scan history storage: timestamp, image reference, top result, all predictions
- Query scan history (most recent first)
- Chatbot endpoint: accepts a user question, matches against disease catalog, returns a relevant answer
- Landing/hero section explaining the tool
- Image upload area (drag & drop + file picker) with preview
- "Analyze" button triggering the backend classification call
- Results panel showing top predicted disease with confidence bar, description, symptoms, treatment advice
- Alternative predictions list (top-3 with confidence scores)
- Scan history tab showing past analyses with disease name, confidence, and timestamp
- Disease library page browsing all catalog diseases with search/filter
- Chatbox panel for asking plant disease questions, with conversation history

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend canister:
   - Define Disease type: id, name, description, symptoms (array), treatment, affectedPlants (array), severity (Low/Medium/High/Critical)
   - Define ScanResult type: id, timestamp, imageRef (text), topDisease, predictions (array of {diseaseId, name, confidence})
   - Define ChatMessage type: role (user/assistant), content, timestamp
   - Seed catalog with 12+ common plant diseases across tomato, potato, corn, wheat, rice
   - simulateCNNPrediction(imageBase64: Text): returns top-3 predictions with pseudo-random but deterministic confidence scores derived from image hash
   - saveScan(imageRef: Text, predictions: [Prediction]): saves scan to history, returns scan id
   - getScanHistory(): returns all scans ordered by most recent
   - getDiseases(): returns full disease catalog
   - getDiseaseById(id: Nat): returns single disease
   - chatQuery(question: Text): simple keyword matching against disease catalog, returns helpful answer

2. Frontend pages/components:
   - App shell with top nav (Home, Disease Library, History, Chat)
   - Hero page: headline, subheadline, call-to-action to scan
   - Scan page: drag-drop upload zone + file picker, image preview, Analyze button, loading state, results panel
   - Results panel: top disease card with confidence bar, full description/symptoms/treatment; secondary predictions list
   - Disease Library page: grid of disease cards, search input, severity filter
   - Scan History page: list of past scans with thumbnail, top disease, confidence, timestamp
   - Chatbox: floating chat panel or dedicated page with message list, input, send button; uses chatQuery backend
