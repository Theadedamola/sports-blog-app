---
version: alpha
name: unitycup.com
description: Dark, match-day event marketing site for the Unity Cup football tournament, built around high-contrast cream typography, deep green surfaces, and bold ticketing calls to action.
colors:
  primary: "#fcf1da"
  secondary: "#0c1a12"
  tertiary: "#ffffff"
  neutral: "#374151"
  surface: "#0c1a12"
  on-surface: "#fcf1da"
  error: "#ff3b52"
typography:
  headline-display:
    fontFamily: "Stack Sans"
    fontFallbacks:
      - "Stack Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "-1px"
  headline-lg:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: "46px"
    letterSpacing: "5px"
  headline-md:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "29px"
    fontWeight: 500
    lineHeight: "35px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "25.2px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "25.2px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: "22px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Stack Sans"
    fontFallbacks:
      - "Stack Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "0px"
  label-md:
    fontFamily: "Stack Sans"
    fontFallbacks:
      - "Stack Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "DM Sans"
    fontFallbacks:
      - "DM Sans"
      - "Arial"
      - "sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "1"
    letterSpacing: "0px"
rounded:
  none: "0px"
  sm: "2px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "16px"
  md: "36px"
  lg: "48px"
  xl: "144px"
components:
  button:
    primary:
      backgroundColor: "{colors.primary}"
      color: "{colors.secondary}"
      borderColor: "{colors.primary}"
      borderRadius: "{rounded.sm}"
      borderWidth: "1px"
      borderStyle: "solid"
      padding: "12px 18px"
      fontSize: "{typography.label-lg.fontSize}"
      fontWeight: "{typography.label-lg.fontWeight}"
      minWidth: "138px"
      minHeight: "51px"
      textDecoration: "none"
      boxShadow: "none"
      fontFamily: "{typography.label-lg.fontFamily}"
    secondary:
      backgroundColor: "transparent"
      color: "{colors.primary}"
      borderColor: "{colors.primary}"
      borderRadius: "{rounded.sm}"
      borderWidth: "1px"
      borderStyle: "solid"
      padding: "12px 18px"
      fontSize: "{typography.label-lg.fontSize}"
      fontWeight: "{typography.label-lg.fontWeight}"
      minWidth: "138px"
      minHeight: "51px"
      textDecoration: "none"
      boxShadow: "none"
      fontFamily: "{typography.label-lg.fontFamily}"
    link:
      backgroundColor: "transparent"
      color: "{colors.primary}"
      borderColor: "transparent"
      borderRadius: "{rounded.none}"
      borderWidth: "0px"
      borderStyle: "none"
      padding: "0px"
      fontSize: "{typography.body-lg.fontSize}"
      fontWeight: "{typography.body-lg.fontWeight}"
      minWidth: "0px"
      minHeight: "0px"
      textDecoration: "none"
      boxShadow: "none"
      fontFamily: "{typography.body-lg.fontFamily}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.neutral}"
    borderRadius: "{rounded.md}"
    borderWidth: "1px"
    borderStyle: "solid"
    padding: "{spacing.sm}"
    boxShadow: "none"
    textColor: "{colors.on-surface}"
---

# Overview

Unitycup.com is a dark, cinematic event site for a football tournament. The UI pairs a full-bleed, blurred match-day hero image with centered ticketing CTAs, then transitions into deep green editorial sections with oversized team names and event details. The tone is premium, urgent, and celebratory.

Use this system for:
- event promotion and schedule surfaces
- ticketing and hospitality entry points
- team, match, and news content
- compact navigation and utility actions

Visual priorities:
- maximize contrast over photography
- keep the hero and match cards emotionally driven
- treat ticket actions as the primary conversion path
- use generous spacing and restrained chrome

# Colors

The palette is intentionally small and high-contrast.

## Core tokens
- `primary` — cream text and primary button fill: `#fcf1da`
- `secondary` — deep green background and inverse text base: `#0c1a12`
- `tertiary` — white used for logo, icons, and bright accents: `#ffffff`
- `neutral` — muted border and divider tone: `#374151`
- `surface` — main dark section background: `#0c1a12`
- `on-surface` — default foreground on dark surfaces: `#fcf1da`
- `error` — reserve for scores, warnings, or destructive states: `#ff3b52`

## Usage guidance
- Prefer cream text on dark green backgrounds.
- Use white sparingly for iconography and logo moments.
- Do not introduce extra accent colors unless they are brand-approved tournament colors.
- Keep overlays dark and photo treatments muted so text remains readable.

# Typography

Typography mixes two sans-serif voices:
- `Stack Sans` for the brand wordmark and strong CTAs
- `DM Sans` for editorial copy, labels, and event information

## Type hierarchy
- `headline-display`: 48/48, weight 500, -1px tracking; use for hero titles and major team names.
- `headline-lg`: 38/46, weight 500, 5px tracking; use for section labels and all-caps data like “SEMI FINAL 1”.
- `headline-md`: 29/35, weight 500; use for prominent subheads.
- `body-lg` and `body-md`: 18/25.2, weight 300; use for event metadata, descriptions, and utility text.
- `body-sm`: 16/22, weight 300; use for denser supporting copy.
- `label-lg`: 18/1, weight 500 in `Stack Sans`; use for primary and secondary buttons.
- `label-md`: 16/1, weight 500 in `Stack Sans`; use for compact UI labels.
- `label-sm`: 14/1, weight 300 in `DM Sans`; use for small meta labels where a lighter tone is needed.

## Rules
- Keep letter spacing tight for display titles unless the design explicitly uses all-caps tracking.
- Use sentence case for body copy and UI labels except for section kicker text.
- Avoid heavy weights in paragraph copy; the site reads best with light editorial text.
- Preserve the brand wordmark styling; do not substitute a generic bold sans.

# Layout

The layout is centered, vertical, and event-first.

## Hero
- Full viewport or near-full viewport image-led hero.
- Center-aligned content stack with logo, sponsor lockup, headline, CTA, and date/location details.
- Use a blurred crowd background with a sharper trophy focal point when available.
- The hero should feel immersive, but text must remain legible at first glance.

## Section structure
- Use large vertical spacing between sections.
- Alternate between photo-led and solid dark sections.
- Constrain primary content to a centered column on desktop while allowing full-bleed background treatments.
- Match cards should use a left-aligned text block with CTAs grouped on the right.

## Spacing
- Use `xs` for icon gaps and micro spacing.
- Use `sm` for button padding rhythm and card interior padding.
- Use `md` to separate content blocks within a section.
- Use `lg` between major rows or stacked regions.
- Use `xl` for section breaks and hero-to-content transitions.

# Elevation & Depth

Depth is subtle. The design relies more on photography, overlays, and color blocking than on layered UI shadows.

- Primary cards and sections should remain flat.
- Use `sm` shadow only where needed to keep a CTA legible over imagery.
- Avoid floating panels, heavy blur effects, or layered neumorphism.
- Hero overlays should darken or neutralize busy images rather than add obvious surface elevation.

# Shapes

The shape language is minimal and slightly softened.

- `rounded.none` is appropriate for text links and inline utility elements.
- `rounded.sm` is the default for buttons and controlled UI affordances.
- `rounded.md` is appropriate for cards and content containers.
- Avoid pill-shaped controls unless a specific social or icon-only pattern requires it.
- Borders are thin and clean; do not use thick strokes.

# Components

## Buttons
- Primary button: cream fill, dark text, 1px cream border, 2px radius, medium weight, minimum 138px wide.
- Secondary button: transparent fill, cream text, 1px cream border, 2px radius.
- Link button: transparent, borderless, lightweight text treatment for utility actions.
- Use buttons in pairs where one action is the main conversion and the other is informational.

## Cards
- Dark surface card with a 1px muted border, 8px radius, 16px padding, no shadow.
- Use for match summaries, news previews, and team content blocks.
- Keep content hierarchy clear: kicker, title, metadata, actions.

## Match modules
- Structure:
  1. competition label
  2. narrative subtitle
  3. large team-versus title
  4. date, time, venue
  5. action buttons
- Color team names by side only when the palette supports it; green and pink/red pairings are acceptable if kept inside the brand’s dark system.
- Keep the CTA cluster aligned and evenly spaced.

## Navigation and utility
- Top-left brand mark should remain compact.
- Top-right utility actions should use icon-only controls with minimal spacing.
- Use text like “Time’s up!” sparingly; it reads as a live urgency cue and should not become a persistent pattern.

## Content sections
- Team lists should be simple text links or tiles with minimal decoration.
- News listings should emphasize headline, short summary, and a “Read More” action.
- Hospitality and ticketing should be visually distinct from informational links.

# Do's and Don'ts

## Do
- Do keep the UI dark, cinematic, and football-event focused.
- Do prioritize ticketing CTAs above secondary navigation.
- Do use centered hero composition with clear hierarchy and ample breathing room.
- Do preserve the brand’s cream-on-green contrast.
- Do align match information into scannable blocks: date, time, venue, actions.
- Do use restrained borders and minimal decoration to support premium positioning.
- Do keep iconography thin, light, and consistent with the top utility bar.

## Don't
- Don't replace the dark green base with pure black or bright neutrals.
- Don't use saturated new accent colors outside the existing tournament palette.
- Don't overcrowd the hero with multiple competing CTAs.
- Don't use large drop shadows or glassmorphism effects.
- Don't make body copy heavy or overly condensed.
- Don't center every section; use left alignment where scannability matters, especially in match cards.
- Don't let buttons vary in radius, padding, or border weight across the site.
- Don't reduce contrast on text over photography; if needed, increase overlay darkness instead.