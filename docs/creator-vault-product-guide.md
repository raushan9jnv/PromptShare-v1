# PromptShare V2 Guide

## Product purpose
PromptShare is a creator-first prompt library focused on visible output quality.

The product exists to help people:
- discover strong prompts fast
- understand what kind of result a prompt is meant to create
- preview creator-style outcomes before copying
- reuse working prompt systems instead of starting from blank pages

The site is intentionally not a generic AI content dump.
It is designed as a premium creator vault where prompts feel curated, visual, and reusable.

## Primary audience
The main audience is creators and public users who want stronger visual or content results quickly.

Primary lanes:
- image transformation prompts
- image prompt systems
- social media prompt packs
- YouTube hooks, scripts, and thumbnail prompts
- marketing and design prompt workflows

Secondary lanes:
- software engineering prompts
- prompting guides in blog/learn sections
- UPSC/study frameworks
- productivity and business prompts

## Current product direction
PromptShare is free-first right now.

Current value:
- browse prompts
- search prompts
- open prompt pages
- preview media when available
- copy prompt text
- submit prompts

Future premium direction:
- saved prompts
- private collections
- better organization
- premium prompt packs
- creator-focused workflow tools
- advanced search and filtering

The core library should remain genuinely useful even before premium features exist.

## V2 design goals
This version is focused on 4 big improvements:
- make the site feel premium and alive immediately
- reduce messy UI and improve hierarchy
- make image-heavy prompt pages much clearer
- seed the experience with dummy content so the product feels real before database depth is high

## Visual system
### Brand tone
The intended look is:
- warm
- premium
- editorial
- creator-focused
- visual-first

### Fonts
- UI/body: `Inter`
- display/headlines: `Fraunces`
- prompt/code text: `JetBrains Mono`

### Color direction
The site standard stays warm orange editorial.

Main accent range:
- `accent-50`: `#fff2ea`
- `accent-100`: `#ffe2d1`
- `accent-200`: `#ffc39f`
- `accent-300`: `#ff9b69`
- `accent-400`: `#fb7a43`
- `accent-500`: `#f25a2c`
- `accent-600`: `#df4722`
- `accent-700`: `#b73618`

Light surface base:
- primary bg: `#f7f3ed`
- secondary bg: `#fff9f4`
- card bg: `#fffdfa`
- text primary: `#1f160f`
- text secondary: `#6f5b4e`
- text muted: `#9b8779`

Dark theme exists, but light mode is still the main branded presentation.

## V2 content strategy
The homepage now leads with creator-first use cases.

Priority homepage categories:
- Image Transform
- Image Prompts
- Social Media
- YouTube
- Marketing
- Design

Secondary categories remain available deeper in browse flows.
Software/dev and study content are still part of the product, but they should be presented more through browse pages and blog/learn areas than through the homepage hero story.

## Seeded dummy content strategy
V2 adds a temporary seeded content layer.

Why:
- the site should not feel empty before the database fills up
- design quality needs believable content to work well
- homepage and prompt pages should feel useful on day one

Seeded prompt examples include:
- old photo cinematic restoration
- golden-god fantasy portrait generation
- luxury product campaign remix
- viral reel hook prompt pack
- Instagram carousel remix system
- YouTube thumbnail angle pack
- software debugging playbook
- UPSC answer framework

The seeded content is shaped like real prompt data so it can later be swapped or merged with live database content.

## Sidebar strategy
The sidebar is intentionally reduced in V2.

Primary items:
- Home
- Trending
- Image Transform
- Social Media
- Prompt Packs
- Blog / Learn
- Submit

Secondary expandable areas:
- more categories
- models
- content types

The goal is to make the rail feel like a premium browse guide instead of a long admin-style taxonomy list.

## Prompt detail strategy
Prompt pages are now organized around a clearer sequence:
- prompt hero
- visual result story
- prompt text
- creator/context utilities
- related prompts

### Media logic
V2 introduces media roles in the UI layer:
- `input`
- `output`
- `reference`
- `gallery`

Prompt page behavior:
- if input and output both exist, show comparison-first
- if only output exists, show showcase-first
- if multiple outputs exist, show them as alternate outputs
- reference images can appear separately

### Why this matters
This is especially important for creator prompts where the result is the whole reason someone clicks.
A prompt page should not feel like random text plus scattered images.
It should feel like a result story.

## Submit experience strategy
The submit page is now a guided creator upload flow.

Sections:
- prompt basics
- use case and fit
- media story
- review and publish

The UX is built to encourage better contributions such as:
- stronger titles
- clearer categories/models
- better media uploads
- more obvious input/output story

The UI already hints at future media-role labeling even if persistence is still a follow-up concern.

## Current implementation status
Implemented in V2:
- creator-first homepage restructure
- seeded prompt layer mixed with live prompt browsing
- new creator-focused sidebar
- better prompt detail hierarchy
- media viewer with role-aware input/output behavior
- stronger submit page structure
- cleaner browse pages for category/model/content type/search

Still future work:
- persist media roles in the database
- improve auth page visual consistency
- upgrade blog UX further
- add saved collections and premium features
- improve creator profiles and analytics

## Data model direction
Current prompt pages can now consume role-aware asset data in the UI.

Current UI roles:
- input
- output
- reference
- gallery

Recommended future DB extension:
- add optional asset role persistence for prompt assets
- support ordering by role priority
- optionally support explicit cover selection

## New joiner quickstart
If you are new to this project, read these files first:
- `src/app/page.tsx`
- `src/app/p/[slug]/page.tsx`
- `src/components/MediaShowcase.tsx`
- `src/components/PromptCard.tsx`
- `src/components/Sidebar.tsx`
- `src/app/submit/page.tsx`
- `src/lib/prompts.ts`
- `src/lib/seeded-prompts.ts`
- `src/lib/taxonomy.ts`
- `src/app/globals.css`

## Product principle summary
When making future changes, optimize for this:
- creators first
- visible payoff matters
- previews build trust
- free value should stay strong
- premium should add organization and power later, not replace the core usefulness of the library
