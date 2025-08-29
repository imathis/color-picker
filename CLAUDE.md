# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

HSL Color Picker (https://colorpicker.dev) is a web-based color picker application supporting multiple color models: HSL, HSV, HWB, RGB, HEX, and OKLCH. Built with TypeScript, React, and Vite, it provides an interactive interface for color selection with real-time updates and wide gamut support.

## Development Commands

```bash
# Development
bun dev              # Start development server
bun build            # Build for production (TypeScript check + Vite build)
bun preview          # Preview production build

# Testing
bun test             # Run all tests
bun test:watch       # Run tests in watch mode
bun test <pattern>   # Run specific tests (e.g., bun test colorConversion)
bun test:coverage    # Run tests with coverage report

# Code Quality
bun lint             # Run Biome linter with max 0 diagnostics

# Deployment
./deploy.sh          # Deploy to production
```

## Architecture & Key Components

### State Management

- **Zustand** store in `src/utils/colorStore.ts` manages global color state
- Central `ColorObject` contains all color representations and conversion methods
- URL hash syncing for shareable colors

### Color System Architecture

#### Core Data Flow

1. **User Input** → `ColorSlider`/`CodeInput` components
2. **Parse & Validate** → `colorParsing.ts` functions
3. **Create ColorObject** → `colorConversion.ts::createColorObject()`
4. **Update Store** → `colorStore.ts` via `setColor()` or `adjustColor()`
5. **Update UI** → `uiUtils.ts::updateUiColor()` sets CSS variables
6. **Render Gradients** → `gradientUtils.ts` generates slider backgrounds

#### Key Color Concepts

**ColorObject** (`src/types/color.ts`):

- Single source of truth containing all color model values
- Immutable - `set()` method returns new ColorObject
- Handles cross-model conversions via RGB intermediary
- Special OKLCH precision preservation to avoid RGB roundtrip losses

**Color Models**:

- **HSL/HSV/HWB**: Share same hue wheel (0-360°)
- **OKLCH**: Perceptual color space with different hue mapping
- **RGB/HEX**: Standard web colors
- All models maintain consistent alpha channel

**Hue Preservation**:

- Non-hue adjustments preserve hue values across related models
- Achromatic colors (very low saturation/chroma) maintain source hue
- Prevents unwanted hue shifts during slider adjustments

### Gradient System

Slider backgrounds use CSS variables for dynamic updates without re-rendering:

- `gradientUtils.ts` generates gradient strings with CSS variable placeholders
- Browser recalculates gradients when CSS variables change
- OKLCH gradients support gamut boundaries visualization

### Wide Gamut Support

**OKLCH** enables P3 color space:

- Colors outside sRGB show dual swatches (P3 + sRGB fallback)
- Gamut detection in `ColorSwatch.tsx`
- Browser auto-fallback for unsupported displays

### Touch & Mobile Optimization

**Enhanced touch handling** for precise color selection:

- **Touch detection via CSS media queries**: `@media (hover: hover) and (pointer: fine)` for precision devices
- **Dynamic thumb sizing**: 44x44px for touch devices, 1px width for precision alignment
- **Enhanced touch events**: Custom `useTouchSlider` hook prevents scroll conflicts and improves responsiveness
- **Cross-device support**: Hybrid devices automatically detected and handled appropriately

Key files:
- `src/hooks/useTouchDetection.ts` - Device capability detection
- `src/hooks/useTouchSlider.ts` - Enhanced touch event handling
- `src/styles/components/slider.css` - Touch-based media queries instead of screen width

### Component Structure

```
src/
├── components/
│   ├── Picker.tsx         # Main container coordinating all controls
│   ├── ColorSlider.tsx    # Reusable slider for any color property
│   ├── ColorSwatch.tsx    # Visual color display with gamut detection
│   └── Inputs.tsx         # Text inputs for color codes
├── utils/
│   ├── colorConversion.ts # Core color math and ColorObject creation
│   ├── colorParsing.ts    # String parsing for all color formats
│   ├── colorStore.ts      # Zustand store for global state
│   ├── gradientUtils.ts   # Slider background generation
│   └── uiUtils.ts         # CSS variable updates
└── config/
    └── colorModelConfig.ts # Slider ranges, steps, and patterns
```

## Testing Approach

Tests use Vitest with focus on:

- Color conversion accuracy
- Hue preservation logic
- Parsing edge cases
- Gradient generation

Run specific test files with `bun test <filename>` for rapid development.

## Key Implementation Details

### OKLCH Precision

- Hue supports 3 decimal places (e.g., 292.759)
- Direct OKLCH adjustments bypass RGB conversion to preserve precision
- Original OKLCH values preserved when source model is OKLCH

### CSS Variable System

All color values exposed as CSS variables for gradient calculations:

- `--picker-hue`, `--picker-saturation`, etc.
- Enables performant gradient updates without React re-renders
- Used by `gradientUtils.ts` for slider backgrounds

### Color Parsing

- Flexible regex patterns in `colorParsing.ts`
- Supports multiple formats per model (e.g., `oklch(50% 0.2 180)` or `oklch(0.5 0.2 180)`)
- HSV parsing despite no CSS support (useful for graphics app users)

## Dependencies

- **culori**: Color conversion math (OKLCH, gamut detection, color space transforms)
- **zustand**: Lightweight state management with persist middleware
- **react/react-dom**: UI framework
- **vite**: Build tool and dev server

## Critical Architecture Insights

### Slider Handle Positioning

- **Native handles are invisible** (`opacity: 0.01`) for precise positioning
- **Custom handles** use `::after` pseudo-elements positioned with `left: percentage%`
- **Transform separation**: Positioning (`translateX(-50%)`) separate from rotation (`rotate: 45deg`)
- **Prevents browser positioning quirks** where handle width affects positioning accuracy

### Gradient-Slider Alignment

- **Coordinate system mismatch**: Browser handles position by left edge, gradients by percentage
- **Solution**: Position-based gradients where `position = (value/max) * 100%` not step-based
- **OKLCH gap alignment**: High resolution (360+ steps) prevents discretization misalignment

### URL Format Strategy

- **Dual format**: Hex for sRGB models, OKLCH format for wide gamut colors
- **Format switching**: `updateUrl(color, useOklch)` where `useOklch = activeModel === 'oklch'`
- **OKLCH URLs auto-enable OKLCH picker** on load for better sharing UX

### State Persistence vs UI Control

- **Zustand persist** for user preferences (visibleModels, showP3, gamutGaps)
- **UI order independence**: `MODEL_DISPLAY_ORDER` array controls checkbox order, not localStorage structure
- **URL takes precedence**: Color from URL overrides any stored color state

### OKLCH Precision Issues

- **RGB roundtrip losses**: Direct OKLCH-to-OKLCH adjustments bypass RGB conversion
- **Hue preservation**: Achromatic colors retain original hue across model conversions
- **3 decimal precision**: OKLCH hue supports values like `292.759` for precision
