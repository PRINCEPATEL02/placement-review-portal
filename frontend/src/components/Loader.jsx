import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ show = true }) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            // Allow fade-out animation to finish before unmounting (if controlled by parent)
            // Since this component is usually unmounted conditionally, this logic is for 
            // when 'show' prop toggles instead of unmounting.
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <div className={`global-loader-overlay ${!show ? 'fade-out' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;
