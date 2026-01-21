export type Intent =
  | "FACTUAL_KB"
  | "TROUBLESHOOTING"
  | "PRICING_NEGOTIATION"
  | "SENSITIVE_ACCOUNT_ACTION"
  | "GENERAL_CONVERSATION"
  | "REQUEST_HUMAN"
  | "CONFIRMATION_YES"
  | "CONFIRMATION_NO"
  | "OTHER";

export interface ClassificationResult {
  intent: Intent;
  confidence: number; // 0-1 score
  reason: string;
}

const LOCALE_PATTERNS: Record<string, RegExp[]> = {
  id: [/kamu|kami|saya|tolong|bantuan|masalah|error/i],
  en: [/you|we|please|help|issue|error|problem/i],
};

const GREETING_PATTERNS = {
  id: [
    /^(hai|halo|hello|selamat pagi|selamat siang|selamat sore|selamat malam|apa kabar|apa khabar|gimana kabar|bagaimana kabar|assalamualaikum|assalamu'alaikum)$/i,
  ],
  en: [
    /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|how are you|what's up|howdy|hiya)$/i,
  ],
};

const REQUEST_HUMAN_PATTERNS = {
  id: [
    /^(hubungi manusia|bicara dengan manusia|berbicara dengan orang|operator|agen|admin|human|staff|support|bantuan langsung|person|orang)$/i,
    /bicara dengan (manusia|orang|operator|agen|admin)/i,
    /hubungi (tim|operator|support|admin)/i,
    /ingin berbicara/i,
  ],
  en: [
    /^(speak with human|talk to human|speak to a human|agent|operator|support staff|customer service|person|representative)$/i,
    /speak with (a |the )?(human|person|agent|operator)/i,
    /talk to (a |the )?(human|person|agent|operator)/i,
    /connect (me |)to (human|person|agent)/i,
  ],
};

const CONFIRMATION_YES_PATTERNS = {
  id: [
    /^(ya|yes|yup|iya|ok|okay|boleh|setuju|sepakat|lanjutkan|lanjut|mulai)$/i,
  ],
  en: [/^(yes|yup|yeah|ok|okay|alright|sure|go ahead|proceed)$/i],
};

const CONFIRMATION_NO_PATTERNS = {
  id: [/^(tidak|no|nope|enggak|jangan|tidak perlu|tidak usah|tidak mau)$/i],
  en: [/^(no|nope|not|nah|don't|didn't|negative|not interested)$/i],
};

const GENERAL_CONVERSATION_PATTERNS = [
  /^(terima kasih|thanks|thank you|understood|paham|mengerti)$/i,
  /^(maaf|sorry|apologies|excuse me|permisi|mohon maaf)$/i,
  /^(betul|benar|correct|right|yang benar|sebenarnya)$/i,
];

export function detectLocale(message: string): "id" | "en" {
  for (const [locale, patterns] of Object.entries(LOCALE_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(message))) {
      return locale as "id" | "en";
    }
  }
  return "en";
}

export function classifyIntent(message: string): ClassificationResult {
  const lowerMessage = message.toLowerCase().trim();

  // Check for REQUEST_HUMAN (HIGHEST PRIORITY - explicit user request)
  const humanMatch = Object.entries(REQUEST_HUMAN_PATTERNS).find(
    ([_, patterns]) => patterns.some((pattern) => pattern.test(lowerMessage))
  );
  if (humanMatch) {
    return {
      intent: "REQUEST_HUMAN",
      confidence: 0.95,
      reason: "human_request_detected",
    };
  }

  // Check for CONFIRMATION_YES (HIGH PRIORITY - explicit confirmation)
  const yesMatch = Object.entries(CONFIRMATION_YES_PATTERNS).find(
    ([_, patterns]) => patterns.some((pattern) => pattern.test(lowerMessage))
  );
  if (yesMatch) {
    return {
      intent: "CONFIRMATION_YES",
      confidence: 0.95,
      reason: "confirmation_yes_detected",
    };
  }

  // Check for CONFIRMATION_NO (HIGH PRIORITY - explicit rejection)
  const noMatch = Object.entries(CONFIRMATION_NO_PATTERNS).find(
    ([_, patterns]) => patterns.some((pattern) => pattern.test(lowerMessage))
  );
  if (noMatch) {
    return {
      intent: "CONFIRMATION_NO",
      confidence: 0.95,
      reason: "confirmation_no_detected",
    };
  }

  // Check for GREETING
  const greetingMatch = Object.entries(GREETING_PATTERNS).find(
    ([_, patterns]) => patterns.some((pattern) => pattern.test(lowerMessage))
  );
  if (greetingMatch) {
    return {
      intent: "GENERAL_CONVERSATION",
      confidence: 0.95,
      reason: "greeting_detected",
    };
  }

  // Check for GENERAL_CONVERSATION (short acknowledgments)
  if (
    GENERAL_CONVERSATION_PATTERNS.some((pattern) => pattern.test(lowerMessage))
  ) {
    return {
      intent: "GENERAL_CONVERSATION",
      confidence: 0.9,
      reason: "conversation_ack",
    };
  }

  // Check for PRICING_NEGOTIATION
  if (
    /harga|biaya|pricing|berapa|cost|discount|diskon|tarif/i.test(lowerMessage)
  ) {
    return {
      intent: "PRICING_NEGOTIATION",
      confidence: 0.85,
      reason: "pricing_keywords",
    };
  }

  // Check for SENSITIVE_ACCOUNT_ACTION
  if (
    /akun|password|login|reset|delete account|hapus akun|security/i.test(
      lowerMessage
    )
  ) {
    return {
      intent: "SENSITIVE_ACCOUNT_ACTION",
      confidence: 0.85,
      reason: "account_keywords",
    };
  }

  // Check for TROUBLESHOOTING
  if (
    /error|tidak bekerja|crash|hang|freeze|bug|masalah|tidak bisa/i.test(
      lowerMessage
    )
  ) {
    return {
      intent: "TROUBLESHOOTING",
      confidence: 0.8,
      reason: "troubleshooting_keywords",
    };
  }

  // Default: FACTUAL_KB with lower confidence for uncertain queries
  const confidence = lowerMessage.length < 5 ? 0.3 : 0.5;
  return {
    intent: "FACTUAL_KB",
    confidence,
    reason: "default_kb_fallback",
  };
}

export function hasEscalationTrigger(message: string): boolean {
  const triggers = [
    /angry|marah|kesal/i,
    /urgent|segera|cepat/i,
    /legal|lawyer|pengadilan/i,
    /refund|pengembalian dana/i,
  ];

  return triggers.some((trigger) => trigger.test(message));
}

const RESPONSES = {
  id: {
    escalation:
      "Saya memahami situasinya. Mari saya hubungkan Anda dengan tim support kami yang lebih berpengalaman.",
    requestHuman:
      "Baik, saya akan menghubungkan Anda dengan operator kami sekarang.",
    clarifying:
      "Bisakah Anda memberikan lebih banyak detail tentang masalah Anda?",
    troubleshooting:
      "Mari kita coba langkah-langkah troubleshooting berikut...",
    pricing: "Untuk pertanyaan harga, silakan hubungi tim sales kami.",
    sensitive:
      "Untuk keamanan akun Anda, kami perlu eskalasi ini ke tim support khusus.",
    other:
      "Terima kasih atas pertanyaannya. Ada yang lain yang bisa saya bantu?",
    greeting: "Halo! Selamat datang. Ada yang bisa saya bantu Anda hari ini?",
    lastResort:
      "Saya tidak menemukan informasi spesifik tentang topik tersebut di knowledge base kami. Apakah Anda bisa memberikan detail lebih lanjut, atau saya bisa eskalasikan ke tim support kami?",
  },
  en: {
    escalation:
      "I understand. Let me connect you with our support team for better assistance.",
    requestHuman: "Of course, I'll connect you with an operator right away.",
    clarifying: "Could you provide more details about your issue?",
    troubleshooting: "Let's try these troubleshooting steps...",
    pricing: "For pricing inquiries, please contact our sales team.",
    sensitive:
      "For your account security, I need to escalate this to our specialized support team.",
    other:
      "Thank you for your question. Is there anything else I can help with?",
    greeting: "Hi there! Welcome. How can I help you today?",
    lastResort:
      "I couldn't find specific information about that topic in our knowledge base. Could you provide more details, or would you like me to escalate this to our support team?",
  },
};

export function getGreetingResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].greeting;
}

export function getRequestHumanResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].requestHuman;
}

export function getLastResortResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].lastResort;
}

export function getEscalationResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].escalation;
}

export function getClarifyingQuestion(
  message: string,
  locale: "id" | "en"
): string {
  return RESPONSES[locale].clarifying;
}

export function getTroubleshootingResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].troubleshooting;
}

export function getPricingResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].pricing;
}

export function getSensitiveEscalationResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].sensitive;
}

export function getOtherResponse(locale: "id" | "en"): string {
  return RESPONSES[locale].other;
}

export function scoreIntent(message: string): number {
  let score = 0;

  if (/harga|biaya|pricing/i.test(message)) score += 0.5;
  if (/refund|tagihan|invoice/i.test(message)) score += 0.3;
  if (message.length > 10) score += 0.2;

  return Math.min(score, 1);
}

/**
 * Detects if the last bot message offered escalation options
 * Used for context-aware confirmation handling
 * Expanded keywords for better detection
 */
export function isLastBotMessageLastResort(
  botMessages: Array<{ role: string; content: string }>
): boolean {
  if (!botMessages || botMessages.length === 0) return false;

  const lastBotMessage = [...botMessages]
    .reverse()
    .find((m: any) => m.role === "assistant");
  if (!lastBotMessage) return false;

  const lastBotContent = lastBotMessage.content.toLowerCase();

  // Comprehensive keywords for escalation offers
  const lastResortKeywords = [
    // Indonesian
    "eskalasikan",
    "eskalasi",
    "hubungkan",
    "tim support",
    "tim kami",
    "support team",
    // English
    "escalate",
    "escalation",
    "connect you",
    "support team",
    "support staff",
    // Operators/specialists
    "operator",
    "specialist",
    "ahli",
    // Request for info before escalating
    "detail lebih lanjut",
    "more details",
    "detail lagi",
    "provide more",
    "would you like me to",
    "apakah anda",
    "ingin saya",
  ];

  return lastResortKeywords.some((keyword) => lastBotContent.includes(keyword));
}

/**
 * Detects if response seems to be offering escalation
 * More aggressive pattern matching
 */
export function hasEscalationOffer(
  botMessages: Array<{ role: string; content: string }>
): boolean {
  if (!botMessages || botMessages.length === 0) return false;

  const lastBotMessage = [...botMessages]
    .reverse()
    .find((m: any) => m.role === "assistant");
  if (!lastBotMessage) return false;

  const content = lastBotMessage.content.toLowerCase();

  // Check for escalation-related patterns
  const escalationPatterns = [
    /escalat/i,
    /hubungkan.*operator/i,
    /hubungkan.*tim/i,
    /connect.*support/i,
    /connect.*operator/i,
    /ingin.*escalat/i,
    /would you like.*escalat/i,
  ];

  return escalationPatterns.some((pattern) => pattern.test(content));
}

/**
 * Detects if the last bot message asked for clarification
 * Used for context-aware handling
 */
export function isLastBotMessageClarification(
  botMessages: Array<{ role: string; content: string }>
): boolean {
  if (!botMessages || botMessages.length === 0) return false;

  const lastBotMessage = [...botMessages]
    .reverse()
    .find((m: any) => m.role === "assistant");
  if (!lastBotMessage) return false;

  const clarificationKeywords = [
    "detail",
    "detail lebih lanjut",
    "lebih spesifik",
    "lebih jelas",
    "bisa jelaskan",
    "apa maksud",
    "more details",
    "could you",
    "clarify",
  ];

  return clarificationKeywords.some((keyword) =>
    lastBotMessage.content.toLowerCase().includes(keyword)
  );
}
