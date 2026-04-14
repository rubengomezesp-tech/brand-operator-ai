export const PRODUCT_IMAGE_STYLE_PRESETS = {
  editorial: "editorial fashion photography, natural daylight, subtle film grain, matte finish, Vogue-style composition",
  studio: "clean studio lighting, seamless paper backdrop, soft shadow, product-focused composition, ultra sharp",
  cinematic: "cinematic lighting, shallow depth of field, anamorphic, moody color grading, film still quality",
  lookbook: "lookbook aesthetic, muted palette, 35mm photography, soft natural light, candid framing",
  campaign: "premium campaign photography, bold negative space, high-end art direction, magazine layout",
} as const;

export type ImageStylePreset = keyof typeof PRODUCT_IMAGE_STYLE_PRESETS;

export function enhanceImagePrompt(userPrompt: string, preset?: ImageStylePreset) {
  const style = preset ? PRODUCT_IMAGE_STYLE_PRESETS[preset] : PRODUCT_IMAGE_STYLE_PRESETS.editorial;
  return `${userPrompt.trim()}. ${style}. High detail, tasteful composition, no text, no watermark.`;
}
