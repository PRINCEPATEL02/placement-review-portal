import React from 'react';
import './Button.css';

/**
 * Reusable Button component with loading state and click animation.
 * 
 * @param {boolean} loading - Shows a spinner and disables button when true
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Standard disabled state
 * @returns {JSX.Element}
 */
const Button = ({
    loading = false,
    variant = 'primary',
    className = '',
    children,
    disabled,
    ...props
}) => {
    // Map variants to specific classes defined in App.css or Tailwind
    const getVariantClass = (v) => {
        switch (v) {
            case 'primary': return 'btn-primary';
            case 'secondary': return 'btn-secondary';
            case 'danger': return 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
            case 'ghost': return 'text-secondary-600 hover:text-secondary-900 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none';
            default: return 'btn-primary';
        }
    };

    const baseClasses = `flex items-center justify-center gap-2 btn-animate-click ${getVariantClass(variant)} ${className}`;

    return (
        <button
            className={`${baseClasses} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && (
                <span className="btn-loader-spinner" aria-hidden="true" />
            )}
            <span>{loading ? 'Loading...' : children}</span>
        </button>
    );
};

export default Button;
