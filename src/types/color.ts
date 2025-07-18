/**
 * Types for color models and color objects.
 */

/**
 * Interface defining the structure of color models (HSL, HSV, HWB, RGB, OKLCH).
 */
export interface ColorModel {
  hsl: string[];
  hwb: string[];
  hsv: string[];
  rgb: string[];
  oklch: string[];
}

/**
 * Interface for HSL color components.
 */
export interface HSLColor {
  hue: number;
  saturation: number;
  luminosity: number;
  alpha?: number;
}

/**
 * Interface for HSV color components.
 */
export interface HSVColor {
  hue: number;
  hsvSaturation: number;
  value: number;
  alpha?: number;
}

/**
 * Interface for HWB color components.
 */
export interface HWBColor {
  hue: number;
  whiteness: number;
  blackness: number;
  alpha?: number;
}

/**
 * Interface for RGB color components.
 */
export interface RGBColor {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

/**
 * Interface for HEX color representation.
 */
export interface HEXColor {
  hex: string;
}

/**
 * Interface for OKLCH color components.
 */
export interface OKLCHColor {
  oklchLightness: number;
  oklchChroma: number;
  oklchHue: number;
  alpha?: number;
}

/**
 * Union type for color parts (HSL, HSV, HWB, RGB, HEX, or OKLCH).
 */
export type ColorParts =
  | HSLColor
  | HSVColor
  | HWBColor
  | RGBColor
  | HEXColor
  | OKLCHColor;

/**
 * Interface for a comprehensive color object.
 * Includes properties for all color models and methods to manipulate the color.
 */
export interface ColorObject {
  model: keyof ColorModel | "hex";
  hue: number;
  saturation: number;
  luminosity: number;
  hsvSaturation: number;
  value: number;
  whiteness: number;
  blackness: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  oklchLightness: number;
  oklchChroma: number;
  hex: string;
  hsl: string;
  hsv: string;
  hwb: string;
  rgb: string;
  oklch: string;
  [key: string]: string | ((...args: unknown[]) => ColorObject | string); // Allow dynamic model key
  set: (
    args: Partial<ColorParts> & { model?: keyof ColorModel | "hex" },
  ) => ColorObject;
  toString: (model?: keyof ColorModel | "hex") => string;
}
