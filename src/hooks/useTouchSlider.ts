import React from "react";

interface UseTouchSliderProps {
	min: number;
	max: number;
	value: number;
	step: number;
	onChange: (value: number) => void;
	sliderRef: React.RefObject<HTMLInputElement>;
	enabled?: boolean;
}

/**
 * Hook for enhanced touch handling on range sliders
 * Provides better touch responsiveness and prevents scroll conflicts
 */
export const useTouchSlider = ({
	min,
	max,
	value,
	step,
	onChange,
	sliderRef,
	enabled = true,
}: UseTouchSliderProps) => {
	const isDragging = React.useRef(false);
	const touchStartValue = React.useRef<number>(value);

	// Calculate value from touch position
	const getValueFromTouch = React.useCallback(
		(clientX: number): number => {
			if (!sliderRef.current) return value;

			const rect = sliderRef.current.getBoundingClientRect();
			const percentage = Math.max(
				0,
				Math.min(1, (clientX - rect.left) / rect.width),
			);
			const rawValue = min + percentage * (max - min);

			// Round to nearest step
			const steppedValue = Math.round(rawValue / step) * step;
			return Math.max(min, Math.min(max, steppedValue));
		},
		[min, max, step, value, sliderRef],
	);

	const handleTouchStart = React.useCallback(
		(e: TouchEvent) => {
			if (!sliderRef.current?.contains(e.target as Node)) return;

			isDragging.current = true;
			touchStartValue.current = value;

			// Prevent scrolling during slider interaction
			e.preventDefault();

			// Update value based on touch position
			const touch = e.touches[0];
			if (touch) {
				const newValue = getValueFromTouch(touch.clientX);
				onChange(newValue);
			}
		},
		[value, onChange, getValueFromTouch, sliderRef],
	);

	const handleTouchMove = React.useCallback(
		(e: TouchEvent) => {
			if (!isDragging.current) return;

			// Prevent scrolling during slider interaction
			e.preventDefault();

			const touch = e.touches[0];
			if (touch) {
				const newValue = getValueFromTouch(touch.clientX);
				onChange(newValue);
			}
		},
		[onChange, getValueFromTouch],
	);

	const handleTouchEnd = React.useCallback((e: TouchEvent) => {
		if (!isDragging.current) return;

		isDragging.current = false;
		e.preventDefault();
	}, []);

	// Set up touch event listeners
	React.useEffect(() => {
		const slider = sliderRef.current;
		if (!slider || !enabled) return;

		// Add touch event listeners with passive: false to allow preventDefault
		slider.addEventListener("touchstart", handleTouchStart, { passive: false });
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd, { passive: false });

		return () => {
			slider.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [handleTouchStart, handleTouchMove, handleTouchEnd, sliderRef, enabled]);
};
