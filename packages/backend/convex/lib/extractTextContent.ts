import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  image: groq("llama-3.1-8b-instant"),
  pdf: groq("llama-3.1-8b-instant"),
  html: groq("llama-3.1-8b-instant"),
} as const;

const SUPPORT_IMAGE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPT = {
  image:
    "You turn image into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.",
  pdf: "You transform PDF files into text.",
  html: "You transform content into markdown",
};

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

  if (mimeType.toLowerCase().includes("pdf")){
    return extractPdfText(url, mimeType, filename)
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType)
  }

  throw new Error(`unsupported MIME type: ${mimeType}`)
}

async function extractTextFileContent(
    ctx: { 
        storage: StorageActionWriter
    },
    storageId: Id<"_storage">,
    bytes: ArrayBuffer | undefined,
    mimeType: string
): Promise<string> {
    const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer())

    if (!arrayBuffer) {
        throw new Error("failed to get file content")
    }

    const text = new TextDecoder().decode(arrayBuffer)

    if (mimeType.toLowerCase() !== "text/plain") {
        const result = await generateText({
            model: AI_MODELS.html,
            system: SYSTEM_PROMPT.html,
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
                            text: "Extract the text and print it in markdown format without explaining that you'll do so."
                        }
                    ]
                }
            ]
        })

        return result.text
    }

    return text
}

async function extractPdfText(
    url: string,
    mimeType: string,
    filename: string
): Promise<string> {
    const result = await generateText({
        model: AI_MODELS.pdf,
        system: SYSTEM_PROMPT.pdf,
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
                        text: "Extract the text from the PDF and print it without explaining you'll do so.",
                    }
                ]
            }
        ]
    })

    return result.text
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPT.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text
}
