import React from "react";

/**
 * Hook to detect touch capability and pointer precision
 * Returns whether the device has touch capability and pointer precision level
 */
export const useTouchDetection = () => {
	const [isTouchDevice, setIsTouchDevice] = React.useState(false);
	const [hasCoarsePointer, setHasCoarsePointer] = React.useState(false);

	React.useEffect(() => {
		// Check if device has touch capability
		const touchCapable =
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			(navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints >
				0;

		// Check pointer precision using media queries
		const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
		const noHover = window.matchMedia("(hover: none)").matches;

		setIsTouchDevice(touchCapable);
		setHasCoarsePointer(coarsePointer || (touchCapable && noHover));

		// Listen for changes in pointer capability (for hybrid devices)
		const handlePointerChange = () => {
			const updatedCoarsePointer =
				window.matchMedia("(pointer: coarse)").matches;
			const updatedNoHover = window.matchMedia("(hover: none)").matches;
			setHasCoarsePointer(
				updatedCoarsePointer || (touchCapable && updatedNoHover),
			);
		};

		const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
		const hoverQuery = window.matchMedia("(hover: none)");

		// Modern browsers support addEventListener on MediaQueryList
		if (coarsePointerQuery.addEventListener) {
			coarsePointerQuery.addEventListener("change", handlePointerChange);
			hoverQuery.addEventListener("change", handlePointerChange);
		} else {
			// Fallback for older browsers
			coarsePointerQuery.addListener(handlePointerChange);
			hoverQuery.addListener(handlePointerChange);
		}

		return () => {
			if (coarsePointerQuery.removeEventListener) {
				coarsePointerQuery.removeEventListener("change", handlePointerChange);
				hoverQuery.removeEventListener("change", handlePointerChange);
			} else {
				coarsePointerQuery.removeListener(handlePointerChange);
				hoverQuery.removeListener(handlePointerChange);
			}
		};
	}, []);

	return {
		isTouchDevice,
		hasCoarsePointer,
		// Convenience flags
		isLikelyMobile: isTouchDevice && hasCoarsePointer,
		needsEnhancedTouch: hasCoarsePointer,
	};
};
