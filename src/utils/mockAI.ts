// Mock AI chat response generator — simulates an AI assistant responding to a protected prompt

const RESPONSES: string[] = [
  "Based on your request, here's what I found: the information you provided has been processed successfully. However, I notice that some details have been redacted with placeholders, so I'll work with what's available.",
  "I've analyzed your input. The placeholders in your message indicate that sensitive information was intentionally removed for privacy. Here's my response based on the non-sensitive portions of your query:",
  "Thank you for your privacy-conscious prompt. I can see that personal identifiers have been replaced with safe placeholders. This is a great practice! Here's what I can help you with based on the sanitized input:",
  "I received your message with privacy protections in place. The redacted fields ([NAME], [PHONE], etc.) tell me you're being careful about sharing personal data. Let me assist you with the general context of your request:",
  "Your protected prompt has been processed. Since sensitive details are masked, I'll provide a general response that doesn't require the specific personal information that was filtered out.",
];

export function generateMockResponse(prompt: string): string {
  const prefix =
    RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

  const hasPlaceholders = /\[(?:NAME|PHONE|EMAIL|ADDRESS|CNIC)\]/.test(
    prompt
  );

  const privacyNote = hasPlaceholders
    ? '\n\nNote: Your prompt contained privacy placeholders, so no sensitive data was transmitted. The AI firewall successfully protected your personal information.'
    : '\n\nNote: No sensitive data was detected in your prompt, so it was sent as-is.';

  const wordCount = prompt.trim().split(/\s+/).length;
  const summary = `\n\nI processed approximately ${wordCount} words from your input and generated this response without accessing any personally identifiable information.`;

  return prefix + summary + privacyNote;
}

export function simulateTypingDelay(): Promise<void> {
  const delay = 800 + Math.random() * 1200;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
