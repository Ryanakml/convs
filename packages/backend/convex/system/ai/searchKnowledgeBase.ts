import rag from "./rag";

export const MIN_SIMILARITY = 0.78;

export type KnowledgeResult =
  | {
      status: "FOUND";
      content: string;
      text: string;
      hit: true;
      score: number;
      numResults: number;
    }
  | {
      status: "NOT_FOUND";
      content: "";
      text: "";
      hit: false;
      score: number;
      numResults: number;
    };

export async function searchKnowledgeBase(
  ctx: Parameters<typeof rag.search>[0],
  args: {
    orgId: string;
    query: string;
    limit?: number;
  }
): Promise<KnowledgeResult> {
  // 1. Ambil output dari rag.search
  const searchOutput = await rag.search(ctx, {
    namespace: args.orgId,
    query: args.query,
    limit: args.limit ?? 3,
  });

  // 2. Akses array results di dalam objek tersebut
  const searchResults = searchOutput?.results;

  // 3. Validasi apakah array ada dan tidak kosong
  if (!searchResults || searchResults.length === 0) {
    return {
      status: "NOT_FOUND",
      content: "",
      text: "",
      hit: false,
      score: 0,
      numResults: 0,
    } as const;
  }

  // 4. Ambil hasil terbaik (index 0) dari array tersebut
  const best = searchResults[0];

  // 5. Cek similarity score
  if (best.score < MIN_SIMILARITY) {
    return {
      status: "NOT_FOUND",
      content: "",
      text: "",
      hit: false,
      score: best.score,
      numResults: searchResults.length,
    } as const;
  }

  /**
   * 6. Ambil teks dari konten.
   * Berdasarkan error TS, 'content' di dalam tiap result adalah array of objects
   * yang berisi property 'text'. Kita perlu melakukan flatMap atau nested map.
   */
  const content = searchResults
    .map((r) => r.content.map((c: { text: string }) => c.text).join("\n"))
    .join("\n---\n");

  return {
    status: "FOUND",
    content,
    text: content,
    hit: true,
    score: best.score,
    numResults: searchResults.length,
  } as const;
}
