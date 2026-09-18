# Design System Master File — CampusCollab (Neo-Brutalism Edition)

> **VISUAL DIRECTION:** Neo-Brutalism inspired by the user reference images (Neo Brutalism UI Component Library & Gumroad Redesign).
> **Characteristics:** Bold solid black borders (`2px - 2.5px solid #000`), hard offset drop shadows (`4px 4px 0px #000`), vibrant energetic color blocks (Electric Yellow, Bubblegum Pink, Neo Mint, Lavender), warm retro paper canvas (`#FAF8F5`), high-impact bold typography, sticker badges, and tactile click feedback.

---

## 1. Color Palette System

| Token | Hex | Tailwind Utility | Role |
|---|---|---|---|
| Background Canvas | `#FAF8F5` | `bg-[#FAF8F5]` | Warm retro paper background |
| Pure Black | `#000000` | `bg-black`, `border-black` | Heavy structural borders & hard drop shadows |
| Pure White | `#FFFFFF` | `bg-white` | Elevated card surfaces |
| Electric Yellow | `#FFDE59` | `bg-[#FFDE59]` | Primary callouts, highlight blocks, buttons |
| Bubblegum Pink | `#FF70A6` | `bg-[#FF70A6]` | Action accents, floating coins, CTAs |
| Neo Mint | `#4FD1C5` | `bg-[#4FD1C5]` | 🟢 Available for Projects, success chips |
| Neo Green | `#38E54D` | `bg-[#38E54D]` | Verified proofs, badges |
| Electric Lavender | `#9B87F5` | `bg-[#9B87F5]` | AI Matcher, Hackathon tags |
| Neo Coral / Orange | `#FF6B6B` | `bg-[#FF6B6B]` | 🟠 Looking for Teammates, alerts |

---

## 2. Structural & Shadow Rules

- **Borders:** All cards, buttons, badges, inputs, and modals MUST have a solid black border:
  `border-2 border-black` or `border-[2.5px] border-black`.
- **Hard Drop Shadows (No Blur):**
  - Standard cards & buttons: `shadow-[4px_4px_0px_0px_#000000]`
  - Large featured bento cards: `shadow-[6px_6px_0px_0px_#000000]`
  - Small pills & chips: `shadow-[2px_2px_0px_0px_#000000]`
- **Tactile Hover/Active Dynamics:**
  - On hover: `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000]`
  - On active / click: `active:translate-x-1 active:translate-y-1 active:shadow-none`

---

## 3. Typography
- **Primary:** Poppins (Extra Bold / Black for headlines, SemiBold for buttons, Medium for body).
- **Headlines:** Large, high-impact, uppercase or confident title-case with tight tracking (`tracking-tight`).
- **Playful Elements:** Retro asterisks `★`, sparkles `✦`, diagonal arrows `↗`.
