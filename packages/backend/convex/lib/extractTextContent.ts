import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";
import {
  EXTRACT_TEXT_HTML_INSTRUCTION,
  EXTRACT_TEXT_PDF_INSTRUCTION,
  EXTRACT_TEXT_SYSTEM_PROMPTS,
} from "./extractTextPrompts";

const AI_MODELS = {
  // Use a vision-capable model for binary/image inputs.
  image: groq("llama-3.2-11b-vision-preview"),
  pdf: groq("llama-3.2-11b-vision-preview"),
  // Text-only model for HTML/plain text cleanup.
  html: groq("llama-3.1-8b-instant"),
} as const;

const SUPPORT_IMAGE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type extractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: extractTextContentArgs
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get storage URL");

  if (SUPPORT_IMAGE_TYPE.some((type) => type === mimeType)) {
    return extractImageText(url);
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }

  throw new Error(`unsupported MIME type: ${mimeType}`);
}

async function extractTextFileContent(
  ctx: {
    storage: StorageActionWriter;
  },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: EXTRACT_TEXT_SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text,
            },
            {
              type: "text",
              text: EXTRACT_TEXT_HTML_INSTRUCTION,
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: EXTRACT_TEXT_SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(url),
            filename,
            mediaType: mimeType,
          },
          {
            type: "text",
            text: EXTRACT_TEXT_PDF_INSTRUCTION,
          },
        ],
      },
    ],
  });

  return result.text;
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: EXTRACT_TEXT_SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text;
}
