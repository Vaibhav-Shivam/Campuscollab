# Design System Master File — CampusCollab

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** CampusCollab  
**Tagline:** Find People · Build Projects · Grow Together  
**Visual Style:** Editorial Nature-Inspired · Organic Warmth · Tactile Soft UI  
**Design Reference:** Premium editorial composition, deep greens (`#0F3D2E`), earthy browns (`#8B6F47`), warm cream surfaces (`#F5F1E6`), sand accents (`#D9C3A5`), subtle botanical motifs, rounded cards (`16–24px`), soft layered shadows, bold Poppins typography.  

---

## 1. Color Palette System

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary / Deep Green | `#0F3D2E` | `--color-primary` | Main dark background, header/navigation, deep hero cards |
| Secondary / Forest Green | `#2E7058` | `--color-secondary` | Buttons, active navigation pills, hover states |
| Accent Green / Sage | `#A3C9AB` | `--color-accent` | Highlight badges, tag borders, subtle icon backings |
| Warm Cream | `#F5F1E6` | `--color-background` | Main page background, primary light content surfaces |
| Sand | `#D9C3A5` | `--color-sand` | Secondary card surfaces, warm category chips, borders |
| Earth Brown | `#8B6F47` | `--color-earth` | Supporting accents, category icons, warm card variants |
| Dark Text | `#17231D` | `--color-foreground` | High-contrast body & heading text on light cream surfaces |
| White | `#FFFFFF` | `--color-card-light` | Elevated cards, inputs, text on dark green surfaces |
| Muted Foreground | `#56655D` | `--color-muted-foreground` | Subtitles, meta tags, timestamps (min 4.5:1 on cream) |
| Border Cream | `#E6DFD1` | `--color-border` | Subtle dividers and card outlines on cream surfaces |
| Border Green | `#1F5341` | `--color-border-dark` | Subtle dividers on deep green surfaces |
| Destructive | `#DC2626` | `--color-destructive` | Decline requests, danger actions |
| Success / Available | `#10B981` | `--color-status-available` | 🟢 Available for Projects indicator |
| Amber / Looking | `#F59E0B` | `--color-status-looking` | 🟠 Looking for Teammates indicator |

---

## 2. Typography

* **Primary Font:** [Poppins](https://fonts.google.com/specimen/Poppins) (`sans-serif`)
* **Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
```

| Element | Weight | Suggested Size | Line Height | Tracking |
|---------|--------|----------------|-------------|----------|
| Hero Heading | Bold (700/800) | 56–72px (`text-5xl` to `text-6xl`) | 1.1 | `-0.02em` |
| Section Heading | Bold (700) | 36–44px (`text-3xl` to `text-4xl`) | 1.2 | `-0.01em` |
| Page Heading | SemiBold (600) | 28–32px (`text-2xl` to `text-3xl`) | 1.3 | Normal |
| Card Heading | SemiBold (600) | 20–24px (`text-xl`) | 1.3 | Normal |
| Body Text | Regular (400) | 16px (`text-base`) | 1.6 | Normal |
| Small / Meta | Medium (500) | 13–14px (`text-sm`) | 1.5 | `+0.01em` |
| Button Text | SemiBold (600) | 15–16px | 1.0 | `+0.02em` |

---

## 3. Spacing & Shape Tokens

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--radius-sm` | `10px` | `rounded-lg` | Badges, small pills |
| `--radius-md` | `16px` | `rounded-2xl` | Buttons, inputs, standard cards |
| `--radius-lg` | `24px` | `rounded-3xl` | Hero cards, featured banners |
| `--radius-full`| `9999px`| `rounded-full` | Pill tags, status badges, avatars |
| `--shadow-soft`| `0 8px 30px rgba(15, 61, 46, 0.08)` | `shadow-soft` | Cream surface cards |
| `--shadow-elevated`| `0 14px 40px rgba(15, 61, 46, 0.14)` | `shadow-elevated` | Modal dialogs, dropdowns |
| `--shadow-inset`| `inset 0 2px 4px rgba(0,0,0,0.06)` | `shadow-inner` | Debossed icon pockets |

---

## 4. Tactile Component Patterns

### A. Primary Pill Button
```html
<button class="bg-[#2E7058] hover:bg-[#245946] text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#A3C9AB]/40 cursor-pointer flex items-center gap-2">
  <span>Get Started</span>
  <ArrowRight class="w-4 h-4" />
</button>
```

### B. Warm Pill Button (Sand / Cream style from Reference)
```html
<button class="bg-[#D9C3A5] hover:bg-[#CBB08E] text-[#17231D] font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
  Explore Students
</button>
```

### C. Rounded Editorial Card (Cream Surface)
```html
<div class="bg-white border border-[#E6DFD1] rounded-3xl p-6 shadow-[0_8px_30px_rgb(15,61,46,0.06)] hover:shadow-[0_12px_36px_rgb(15,61,46,0.1)] transition-all duration-200 hover:-translate-y-1">
  <!-- Content -->
</div>
```

### D. Dark Green Feature Banner Strip (Reference Hero Strip)
```html
<div class="bg-[#0F3D2E] text-white rounded-3xl p-8 border border-[#1F5341] grid grid-cols-1 md:grid-cols-4 gap-6">
  <!-- 4 Columns with circular icon badges and descriptions -->
</div>
```

### E. Status Indicators
* **🟢 Available for Projects:**
  `bg-[#10B981]/15 text-[#0F3D2E] border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`
* **🟠 Looking for Teammates:**
  `bg-[#F59E0B]/15 text-[#92400E] border border-[#F59E0B]/30 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`

---

## 5. Anti-Patterns & Pro-Max Rules

- ❌ **No emojis as interface icons:** Always use Lucide-React SVG icons (`Leaf`, `Users`, `Sparkles`, `Compass`, `Briefcase`, `Calendar`, etc.).
- ❌ **No generic gray-on-gray admin panels:** Use the rich cream (`#F5F1E6`), deep green (`#0F3D2E`), and earthy sand tones.
- ❌ **No abrupt hover state jumps:** Use smooth 150–250ms transitions (`transition-all duration-200`).
- ❌ **No low-contrast text:** Ensure all text passes WCAG AA 4.5:1 (e.g. `#17231D` on cream, `#FFFFFF` or `#A3C9AB` on deep green).
- ❌ **Touch Targets & Focus:** Touch targets ≥ 44px with visible focus rings (`focus:ring-2 focus:ring-[#A3C9AB]`).
- ❌ **No emoji status bullets:** Use SVG indicator dots.

---

## 6. Pre-Delivery Checklist
- [ ] No emojis used as icons (use SVG Lucide icons)
- [ ] `cursor-pointer` on all clickable interactive items
- [ ] Poppins typography loaded and set as primary font family
- [ ] Color palette strictly follows design tokens
- [ ] Cards have rounded 16–24px corners and soft organic shadows
- [ ] Status chips (Available vs Looking) are clearly differentiated
- [ ] Mobile responsive layout tested without horizontal overflow
- [ ] Accessible focus states on all form controls and buttons
