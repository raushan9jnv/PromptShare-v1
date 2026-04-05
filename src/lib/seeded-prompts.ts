import type { ContentTypeSlug } from "@/lib/taxonomy";

export type PromptAssetRole = "input" | "output" | "reference" | "gallery";

export type SeededPromptAsset = {
  id: string;
  prompt_id: string;
  kind: "image" | "video" | "audio";
  public_url: string;
  sort_order: number;
  role?: PromptAssetRole;
  label?: string;
};

export type SeededPrompt = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorHandle: string;
  categorySlugs: string[];
  modelSlugs: string[];
  tags: string[];
  contentType: ContentTypeSlug;
  previewImageUrl: string | null;
  assets: SeededPromptAsset[];
};

function createPrompt(prompt: Omit<SeededPrompt, "previewImageUrl"> & { previewImageUrl?: string | null }): SeededPrompt {
  return {
    ...prompt,
    previewImageUrl: prompt.previewImageUrl ?? prompt.assets.find((asset) => asset.kind === "image")?.public_url ?? null,
  };
}

export const seededPromptDetails: SeededPrompt[] = [
  createPrompt({
    id: "seed-old-photo-restore",
    slug: "old-photo-cinematic-restore",
    title: "Turn this old 1980 photo into a cinematic restored portrait",
    excerpt: "A creator-first restoration prompt that preserves the subject identity while lifting detail, skin texture, color, and cinematic warmth.",
    body: `You are a premium photo restoration and cinematic enhancement artist.\n\nGoal:\nTransform the input image into a restored portrait that still feels authentic to the original person, but elevate it with modern cinematic color, realistic skin texture, sharp facial details, and elegant lighting.\n\nDirections:\n- Preserve face identity, pose, and emotional tone\n- Remove scratches, haze, low-resolution blur, and age damage\n- Restore natural skin texture without plastic smoothing\n- Improve lighting with warm golden highlights and soft contrast\n- Keep wardrobe and styling period-correct unless it harms realism\n- Make the final result feel like a restored frame from a prestige film\n\nOutput style:\nclean, cinematic, realistic, premium, emotionally warm`,
    authorHandle: "restoreroom",
    categorySlugs: ["image-transform", "image-prompts"],
    modelSlugs: ["chatgpt", "gemini", "stable-diffusion"],
    tags: ["restoration", "1980s", "portrait"],
    contentType: "image",
    assets: [
      { id: "seed-old-photo-restore-input", prompt_id: "seed-old-photo-restore", kind: "image", public_url: "/seeded/old-photo-input.svg", sort_order: 0, role: "input", label: "Input" },
      { id: "seed-old-photo-restore-output", prompt_id: "seed-old-photo-restore", kind: "image", public_url: "/seeded/old-photo-output.svg", sort_order: 1, role: "output", label: "Output" },
    ],
  }),
  createPrompt({
    id: "seed-golden-god",
    slug: "golden-god-fantasy-portrait",
    title: "Generate a divine golden-god fantasy scene from this face photo",
    excerpt: "Use a portrait input to generate a mythic high-drama fantasy visual with glowing gold armor, celestial light, and premium poster energy.",
    body: `Use the uploaded face as the identity anchor.\n\nCreate a fantasy portrait of the same person as a divine golden god standing in radiant light.\n\nRequirements:\n- preserve facial identity and facial proportions\n- dramatic gold armor with premium ornament detail\n- soft divine glow, cinematic haze, volumetric god rays\n- rich cloud backdrop with epic scale\n- no cartoon look, no plastic CGI face\n- premium poster quality, highly detailed, mythic but believable\n\nMood:\nmajestic, sacred, cinematic, luxurious`,
    authorHandle: "visualalchemy",
    categorySlugs: ["image-transform", "image-prompts", "design"],
    modelSlugs: ["midjourney", "dalle", "stable-diffusion"],
    tags: ["fantasy", "god-mode", "portrait"],
    contentType: "image",
    assets: [
      { id: "seed-golden-god-input", prompt_id: "seed-golden-god", kind: "image", public_url: "/seeded/golden-god-input.svg", sort_order: 0, role: "input", label: "Input" },
      { id: "seed-golden-god-output", prompt_id: "seed-golden-god", kind: "image", public_url: "/seeded/golden-god-output.svg", sort_order: 1, role: "output", label: "Output" },
      { id: "seed-golden-god-alt", prompt_id: "seed-golden-god", kind: "image", public_url: "/seeded/golden-god-alt.svg", sort_order: 2, role: "gallery", label: "Alternate output" },
    ],
  }),
  createPrompt({
    id: "seed-product-luxury",
    slug: "luxury-product-campaign-remix",
    title: "Transform product shots into luxury campaign visuals",
    excerpt: "A product-image transformation prompt for taking plain ecommerce shots into glossy luxury campaign art with high-end mood and ad polish.",
    body: `Transform the uploaded product image into a premium luxury campaign visual.\n\nKeep the product shape, brand marks, and true silhouette intact.\nAdd:\n- dramatic studio lighting\n- rich reflective surfaces\n- expensive editorial mood\n- refined shadow control\n- luxury color palette\n- high-end campaign framing\n\nAvoid:\n- fake text\n- brand distortion\n- unrealistic proportions\n- cluttered background noise`,
    authorHandle: "brandglowup",
    categorySlugs: ["image-transform", "marketing", "design"],
    modelSlugs: ["chatgpt", "midjourney"],
    tags: ["product", "luxury", "ads"],
    contentType: "image",
    assets: [
      { id: "seed-product-luxury-input", prompt_id: "seed-product-luxury", kind: "image", public_url: "/seeded/product-shot-input.svg", sort_order: 0, role: "input", label: "Input" },
      { id: "seed-product-luxury-output", prompt_id: "seed-product-luxury", kind: "image", public_url: "/seeded/product-shot-output.svg", sort_order: 1, role: "output", label: "Output" },
    ],
  }),
  createPrompt({
    id: "seed-viral-hooks",
    slug: "viral-reel-hook-prompt-pack",
    title: "Create viral reel hooks from one boring topic",
    excerpt: "A compact prompt pack that turns weak topics into high-retention social hooks, scroll-stoppers, and short-form opening lines.",
    body: `You are a short-form content strategist.\n\nTake the user's topic and generate 15 reel/video hooks.\n\nHook mix required:\n- curiosity hooks\n- contrarian hooks\n- pain-point hooks\n- personal-story hooks\n- authority hooks\n\nRules:\n- keep each hook under 14 words\n- avoid clichés\n- make the first 3 words strong enough to stop the scroll\n- write like a creator who understands attention and platform rhythm`,
    authorHandle: "hookfoundry",
    categorySlugs: ["social-media", "prompt-packs", "marketing"],
    modelSlugs: ["chatgpt", "claude", "gemini"],
    tags: ["hooks", "reels", "prompt-pack"],
    contentType: "text",
    assets: [
      { id: "seed-viral-hooks-cover", prompt_id: "seed-viral-hooks", kind: "image", public_url: "/seeded/reel-hooks-cover.svg", sort_order: 0, role: "output", label: "Cover" },
    ],
  }),
  createPrompt({
    id: "seed-carousel",
    slug: "instagram-carousel-remix-system",
    title: "Turn long thoughts into carousel-ready Instagram slides",
    excerpt: "A creator workflow prompt that restructures messy ideas into slide-by-slide carousel copy with headline rhythm and CTA flow.",
    body: `Convert the user's raw thought dump into an Instagram carousel.\n\nOutput format:\n- Slide 1: scroll-stopping headline\n- Slide 2-6: concise insight progression\n- Slide 7: actionable summary\n- Final slide: CTA\n\nWriting style:\n- clear and punchy\n- creator voice, not corporate\n- each slide must be easy to read in under 3 seconds\n- avoid generic filler`,
    authorHandle: "carousellab",
    categorySlugs: ["instagram", "social-media", "prompt-packs"],
    modelSlugs: ["chatgpt", "claude"],
    tags: ["carousel", "instagram", "content-system"],
    contentType: "text",
    assets: [
      { id: "seed-carousel-cover", prompt_id: "seed-carousel", kind: "image", public_url: "/seeded/carousel-cover.svg", sort_order: 0, role: "output", label: "Cover" },
    ],
  }),
  createPrompt({
    id: "seed-thumbnail-pack",
    slug: "youtube-thumbnail-angle-pack",
    title: "YouTube thumbnail angle prompt pack",
    excerpt: "Generate multiple thumbnail concepts with emotion, contrast, framing, and curiosity built for high-click creator videos.",
    body: `Generate 12 YouTube thumbnail concepts for the topic.\n\nFor each concept include:\n- core visual idea\n- facial expression direction\n- background style\n- text overlay suggestion\n- why it increases curiosity\n\nOptimize for:\n- strong contrast\n- emotional readability at small size\n- visual story in one frame\n- no clutter`,
    authorHandle: "clickframe",
    categorySlugs: ["youtube", "prompt-packs", "design"],
    modelSlugs: ["chatgpt", "gemini"],
    tags: ["thumbnail", "youtube", "ctr"],
    contentType: "text",
    assets: [
      { id: "seed-thumbnail-cover", prompt_id: "seed-thumbnail-pack", kind: "image", public_url: "/seeded/thumbnail-pack-cover.svg", sort_order: 0, role: "output", label: "Cover" },
    ],
  }),
  createPrompt({
    id: "seed-dev-debug",
    slug: "debug-playbook-for-software-engineers",
    title: "Debug playbook prompt for software engineers",
    excerpt: "A structured engineering prompt that turns vague bug reports into hypotheses, reproduction steps, instrumentation ideas, and fix candidates.",
    body: `Act as a senior software engineer debugging a production issue.\n\nGiven:\n- observed behavior\n- expected behavior\n- known logs\n- code context\n\nReturn:\n1. likely root-cause hypotheses\n2. missing diagnostics\n3. fastest reproduction path\n4. minimal safe fix options\n5. regression risks\n6. test plan\n\nBe concise, technical, and decision-oriented.`,
    authorHandle: "devsignal",
    categorySlugs: ["software", "productivity"],
    modelSlugs: ["claude", "chatgpt", "copilot"],
    tags: ["debugging", "engineering", "analysis"],
    contentType: "text",
    assets: [
      { id: "seed-dev-debug-cover", prompt_id: "seed-dev-debug", kind: "image", public_url: "/seeded/dev-prompt-cover.svg", sort_order: 0, role: "output", label: "Cover" },
    ],
  }),
  createPrompt({
    id: "seed-upsc",
    slug: "upsc-answer-structuring-framework",
    title: "UPSC answer structuring framework",
    excerpt: "A study prompt that turns raw topic notes into UPSC-style answers with intro, body flow, balanced framing, and conclusion discipline.",
    body: `You are a UPSC answer writing mentor.\n\nTake the user's topic and create a model answer structure with:\n- a sharp intro\n- 3 to 5 core body points\n- balanced analysis\n- relevant examples where possible\n- a concise future-oriented conclusion\n\nKeep the structure exam-friendly and memory-friendly.`,
    authorHandle: "studysignal",
    categorySlugs: ["education", "productivity"],
    modelSlugs: ["chatgpt", "gemini"],
    tags: ["upsc", "study", "answer-writing"],
    contentType: "text",
    assets: [
      { id: "seed-upsc-cover", prompt_id: "seed-upsc", kind: "image", public_url: "/seeded/study-framework-cover.svg", sort_order: 0, role: "output", label: "Cover" },
    ],
  }),
];

export const seededPromptList = seededPromptDetails.map(({ assets: _assets, ...prompt }) => prompt);

export function getSeededPromptBySlug(slug: string) {
  return seededPromptDetails.find((prompt) => prompt.slug === slug) ?? null;
}

export function searchSeededPrompts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return seededPromptList;

  return seededPromptList.filter((prompt) => {
    const haystack = [
      prompt.title,
      prompt.excerpt,
      prompt.body,
      prompt.authorHandle,
      prompt.tags.join(" "),
      prompt.categorySlugs.join(" "),
      prompt.modelSlugs.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
