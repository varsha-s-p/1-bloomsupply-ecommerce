---
name: Botanical Heritage
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#434843'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#737872'
  outline-variant: '#c3c8c1'
  surface-tint: '#506354'
  primary: '#334537'
  on-primary: '#ffffff'
  primary-container: '#4a5d4e'
  on-primary-container: '#c0d5c2'
  inverse-primary: '#b7ccb9'
  secondary: '#80534c'
  on-secondary: '#ffffff'
  secondary-container: '#ffc3bb'
  on-secondary-container: '#7b4e48'
  tertiary: '#41423f'
  on-tertiary: '#ffffff'
  tertiary-container: '#595956'
  on-tertiary-container: '#d1d0cc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e8d5'
  primary-fixed-dim: '#b7ccb9'
  on-primary-fixed: '#0e1f13'
  on-primary-fixed-variant: '#394b3d'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#f3b8b0'
  on-secondary-fixed: '#32120e'
  on-secondary-fixed-variant: '#653c36'
  tertiary-fixed: '#e4e2de'
  tertiary-fixed-dim: '#c8c6c3'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.3'
  h3:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is rooted in the concept of "Curated Nature." It evokes the feeling of a high-end atelier, combining the organic beauty of floral arrangements with the precision of modern luxury. The brand personality is poised and dependable, avoiding flashiness in favor of understated elegance.

The chosen design style is **Minimalism with Tactile Refinement**. It utilizes heavy whitespace to allow high-quality photography to breathe, paired with thin, hairline borders and subtle depth to create a sense of physical layering. The interface should feel like a premium stationary set—high-contrast, legible, and intentionally spacious.

## Colors

The palette is anchored by the soft cream base, which provides a warmer, more inviting alternative to pure white. Deep charcoal is used for primary typography to maintain high legibility and a sense of authority. 

Moss Green serves as the primary action color, representing growth and freshness, while Blush Rose is used sparingly for secondary accents, notifications, or specific product categories (e.g., romantic collections). Use low-saturation transitions between sections to maintain the sophisticated aesthetic.

## Typography

This design system uses a high-contrast typographic pairing. **Noto Serif** provides the editorial authority required for a luxury brand, used exclusively for headlines and pull-quotes. To ensure a contemporary feel, headlines use tight letter spacing.

**Inter** handles all functional and long-form content. Its geometric clarity balances the traditional feel of the serif. For navigation and small labels, use uppercase Inter with increased letter spacing to create a sense of breathability and "prestige" labeling.

## Layout & Spacing

The system follows a **Fixed Grid** model for desktop, centered within the viewport to maintain a gallery-like feel. Use a 12-column grid with generous 24px gutters. 

Rhythm is maintained through an 8px incremental scale, but "Generous White Space" is the guiding principle. Negative space should be treated as a design element itself, particularly between unrelated sections (using `xxl` spacing) to prevent the UI from feeling cluttered or "salesy." Content should never feel cramped against the edges of its container.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layers**. Instead of harsh black shadows, this design system uses soft, diffused shadows with a slight Moss Green tint (`#4A5D4E` at 5-8% opacity) to ground elements in a natural way.

- **Level 0 (Base):** Soft Cream background.
- **Level 1 (Cards/Floating Elements):** Pure White surface with a 1px border (#1A1A1A at 10% opacity) and a large-radius blur shadow.
- **Level 2 (Modals/Overlays):** Increased shadow spread to create a distinct separation from the background.

Use thin borders (0.5pt to 1pt) to define shapes rather than heavy shadows, maintaining a "light" and "fresh" aesthetic.

## Shapes

The shape language is organic yet controlled. A **Rounded (12px-16px)** corner radius is applied to all primary containers, buttons, and input fields. This softens the charcoal and cream contrast, making the brand feel more approachable and "fresh."

Images should follow the same corner radius rules, except for hero imagery which may occasionally use a "soft arch" mask on the top edge to mirror architectural elegance.

## Components

### Buttons
- **Primary:** Solid Moss Green with white text. High padding (16px 32px), 12px border radius.
- **Secondary:** Transparent background with a thin Charcoal border. Text in Charcoal.
- **Tertiary/Text:** Blush Rose text, no background, with a subtle underline on hover.

### Cards
Cards are the primary vehicle for product display. They feature a 1px soft border and the standard 16px radius. The image occupies the top 70% of the card, with product details set in Noto Serif (Title) and Inter (Price) below.

### Input Fields
Inputs use the Soft Cream background slightly darkened, or a white background with a thin charcoal border. Focus states are indicated by a Moss Green border and a very subtle inner glow.

### Chips & Tags
Used for flower "Moods" (e.g., *Romantic*, *Sympathy*, *Celebration*). These are pill-shaped with a light Blush Rose background and dark charcoal text.

### Imagery Style
All photography must be professional, using natural "golden hour" lighting or soft studio light. Backgrounds in photos should be neutral or complementary to the Moss Green/Cream palette. Shallow depth-of-field is preferred to emphasize the delicate textures of the petals.