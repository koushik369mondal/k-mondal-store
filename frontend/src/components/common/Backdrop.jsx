import React from 'react';

/**
 * The chaicode.com page background: one SVG with a warm glow and faint
 * hexagons, centred at the top, behind everything. Place it once, as the
 * first child of the page wrapper.
 */
export function Backdrop({ src = '/chaiui/background.svg', className = '' }) {
    return (
        <img
            data-chai-backdrop=""
            src={src}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className={`chai-backdrop ${className}`}
        />
    );
}

export default Backdrop;
