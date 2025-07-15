# CSS Architecture

This directory contains organized, modular CSS files for the Color Picker application.

## Structure

```
src/styles/
├── globals/
│   ├── variables.css         # CSS custom properties and theme variables
│   ├── reset.css            # Global resets and base styles
│   ├── typography.css       # Font families and text styling
│   └── themes.css           # Light/dark theme media queries
├── layout/
│   ├── app.css             # Main application layout and grid
│   └── footer.css          # Footer layout and explainer styles
└── components/
    ├── banner.css          # Header/banner styling with dynamic text effects
    ├── inputs.css          # Input fields, validation states, and copy buttons
    ├── slider.css          # Range sliders, tracks, and custom handles
    ├── color-swatch.css    # Color display with P3/sRGB split view
    └── color-model-picker.css # Color model selection checkboxes
```

## Import Order

Styles are imported in `src/index.css` in this specific order:

1. **Global Styles** - Variables, resets, typography, themes
2. **Layout Styles** - App structure and footer
3. **Component Styles** - Individual component styling

## Design Principles

- **CSS Custom Properties** for dynamic theming and color adaptation
- **Responsive Design** with mobile-first approach
- **Component Isolation** with clear style boundaries
- **Theme Support** for light and dark modes
- **Performance** optimized for wide gamut displays and smooth interactions

## Maintenance

- Component styles should stay with their respective components
- Global styles affect the entire application
- CSS variables enable dynamic color theming based on picker state
- Media queries handle responsive behavior and theme switching