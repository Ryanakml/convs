import { cohere } from "@ai-sdk/cohere"; // Import Cohere
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const rag = new RAG((components as any).rag, {
  // Model v3.0 english atau multilingual
  textEmbeddingModel: cohere.embedding("embed-english-v3.0"),
  // PENTING: Cohere v3 biasanya menggunakan dimensi 1024
  embeddingDimension: 1024,
});

export default rag;
