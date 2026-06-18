-- Seed categories, models, and a starter tag list from the previously-hardcoded
-- src/lib/taxonomy.ts arrays. Slugs/names/descriptions/colors/hrefs are copied
-- exactly so existing prompts referencing these slugs keep working.
-- Idempotent via ON CONFLICT (slug) DO NOTHING.

insert into public.categories (slug, name, description, color, sort_order) values
  ('trending', 'Trending', 'What is getting opened and copied most.', '#E8883A', 0),
  ('image-transform', 'Image Transform', 'Before-after edits, restoration, fantasy, glow-ups.', '#1E9D8B', 1),
  ('social-media', 'Social Media', 'Hooks, captions, carousels, and short-form ideas.', '#E8883A', 2),
  ('prompt-packs', 'Prompt Packs', 'Grouped prompt bundles for repeatable workflows.', '#8B5CF6', 3),
  ('youtube', 'YouTube', 'Titles, scripts, thumbnails, retention angles.', '#E4572E', 4),
  ('marketing', 'Marketing', 'Ads, offers, funnels, and campaign copy.', '#D97706', 5),
  ('design', 'Design', 'Creative direction, brand voice, and interface copy.', '#EC4899', 6),
  ('software', 'Software / Dev', 'Code reviews, debugging, and engineering prompts.', '#3B82F6', 7),
  ('education', 'Education', 'Study help, UPSC framing, and structured learning.', '#F59E0B', 8),
  ('image-prompts', 'Image Prompts', 'Direct prompts for Midjourney, DALL-E, and similar tools.', '#14B8A6', 9),
  ('productivity', 'Productivity', 'Summaries, rewrites, and everyday accelerators.', '#6366F1', 10),
  ('instagram', 'Instagram', 'Reels, captions, and carousel copy.', '#F97316', 11),
  ('linkedin', 'LinkedIn', 'Thought leadership and professional writing.', '#0EA5E9', 12),
  ('sql', 'SQL', 'Query building and optimization.', '#0F766E', 13),
  ('business', 'Business', 'Research, proposals, and execution docs.', '#7C3AED', 14)
on conflict (slug) do nothing;

insert into public.models (slug, name, href, sort_order) values
  ('gemini', 'Gemini', 'https://gemini.google.com/app', 0),
  ('chatgpt', 'ChatGPT', 'https://chat.openai.com/', 1),
  ('claude', 'Claude', 'https://claude.ai/', 2),
  ('copilot', 'Copilot', 'https://github.com/features/copilot', 3),
  ('midjourney', 'Midjourney', 'https://www.midjourney.com/', 4),
  ('dalle', 'DALL-E', 'https://labs.openai.com/', 5),
  ('stable-diffusion', 'Stable Diffusion', 'https://stability.ai/', 6)
on conflict (slug) do nothing;

insert into public.tags (slug, name) values
  ('marketing', 'Marketing'),
  ('productivity', 'Productivity'),
  ('coding', 'Coding'),
  ('writing', 'Writing'),
  ('image-editing', 'Image Editing'),
  ('social-media', 'Social Media'),
  ('seo', 'SEO'),
  ('branding', 'Branding'),
  ('email', 'Email'),
  ('video-editing', 'Video Editing'),
  ('storytelling', 'Storytelling'),
  ('research', 'Research'),
  ('education', 'Education'),
  ('business', 'Business'),
  ('ux-design', 'UX Design'),
  ('copywriting', 'Copywriting'),
  ('automation', 'Automation'),
  ('data-analysis', 'Data Analysis'),
  ('photography', 'Photography'),
  ('music', 'Music')
on conflict (slug) do nothing;
