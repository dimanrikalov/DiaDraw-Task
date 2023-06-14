import { useState, useEffect, useRef } from 'react';

export const useLoadingEffect = (width) => {
	const timeoutRef = useRef(null);
    const [style, setStyle] = useState({});

	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			setStyle({ width: width });
		}, 100);

		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [width]);

	return {style, timeoutRef};
};
