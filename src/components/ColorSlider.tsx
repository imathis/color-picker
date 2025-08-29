import React from "react";
import { useTouchDetection } from "../hooks/useTouchDetection";
import { useTouchSlider } from "../hooks/useTouchSlider";
import type { ColorModel } from "../types";
import { useColorStore } from "../utils/colorStore";
import { background } from "../utils/gradientUtils";
import { Input } from "./Inputs";

interface ColorSliderProps {
	name: string;
	model: keyof ColorModel | "hex";
	onChange: (
		name: string,
		value: string,
		model: keyof ColorModel | "hex",
	) => void;
	max?: number | string;
	step?: number | string;
	min?: number | string;
	style?: React.CSSProperties;
}

/**
 * ColorSlider component renders a range slider with a numeric input
 * for adjusting individual color properties (hue, saturation, etc.).
 *
 * Features:
 * - Visual gradient background showing the color range
 * - Synchronized range slider and number input
 * - Subscribes only to the specific color property to minimize re-renders
 */
export const ColorSlider: React.FC<ColorSliderProps> = ({
	name,
	model,
	onChange,
	...props
}) => {
	// Subscribe to only the specific color property needed for this slider
	// This optimization prevents unnecessary re-renders when other color properties change
	const currentValue = useColorStore(
		(state) => state[name as keyof typeof state],
	);

	// Touch detection and enhancement
	const { needsEnhancedTouch } = useTouchDetection();
	const sliderRef = React.useRef<HTMLInputElement>(null);

	const handleChange = ([name, value]: [string, string]) => {
		onChange(name, value, model);
	};

	// Enhanced touch change handler
	const handleTouchChange = React.useCallback(
		(value: number) => {
			onChange(name, String(value), model);
		},
		[name, model, onChange],
	);

	// Extract specific props to avoid conflicts
	const { max = 100, min = 0, step = 1, style, ...restProps } = props;

	// CRITICAL: Handle positioning calculation for visual alignment with gradients
	// This formula: ((value - min) / (max - min)) * 100 must match gradient position calculations
	// Browser positions handles at percentage of track width, not element centers
	const numericValue = Number(currentValue);
	const numericMin = Number(min);
	const numericMax = Number(max);
	const percentage =
		((numericValue - numericMin) / (numericMax - numericMin)) * 100;

	// Enhanced touch handling for devices that need it
	// This provides better touch responsiveness and prevents scroll conflicts
	useTouchSlider({
		min: numericMin,
		max: numericMax,
		value: numericValue,
		step: Number(step),
		onChange: handleTouchChange,
		sliderRef,
		enabled: needsEnhancedTouch,
	});

	return (
		<div className="color-slider">
			<div className="slider-track" style={{ position: "relative" }}>
				<Input
					ref={sliderRef}
					type="range"
					data-model={model}
					name={name}
					min={min}
					max={max}
					step={step}
					value={String(currentValue)} // Ensure the input reflects the current value
					onChange={handleChange}
					style={{ background: background[model][name], ...style }}
					{...restProps}
				/>
				{/* Custom handle overlay */}
				<div
					className="custom-slider-handle"
					style={{
						left: `${percentage}%`,
					}}
				/>
			</div>
			<Input
				type="number"
				data-model={model}
				name={`${name}Num`}
				min={min}
				max={max}
				value={String(currentValue)} // Ensure the input reflects the current value
				onChange={handleChange}
				step={step}
				{...restProps}
			/>
		</div>
	);
};
