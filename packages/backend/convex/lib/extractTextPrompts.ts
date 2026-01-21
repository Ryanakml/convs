export const EXTRACT_TEXT_SYSTEM_PROMPTS = {
  image:
    "You turn images into text. If it is a photo of a document, transcribe it exactly. If it is not a document, describe only what is visible. Do not add or infer details.",
  pdf: "You transform PDF files into text. Do not add or infer content that is not present.",
  html: "You transform content into markdown. Do not add or infer any text.",
} as const;

export const EXTRACT_TEXT_HTML_INSTRUCTION =
  "Extract the text and print it in markdown format without explaining that you'll do so.";

export const EXTRACT_TEXT_PDF_INSTRUCTION =
  "Extract the text from the PDF and print it without explaining you'll do so.";
