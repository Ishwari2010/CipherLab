import React from 'react';

interface ToggleOptionProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    tooltip: string;
}

export function ToggleOption({ label, checked, onChange, tooltip }: ToggleOptionProps) {
    return (
        <div className="group relative flex items-center space-x-3 cursor-pointer py-1" onClick={() => onChange(!checked)}>
            <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${checked ? 'bg-purple-400' : 'bg-purple-100'}`}>
                <span className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-purple-800 select-none">
                {label}
            </span>

            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 hidden w-max max-w-xs group-hover:block bg-white text-purple-900 border-purple-200 text-xs rounded-md py-1.5 px-3 shadow-xl border z-10 transition-opacity">
                {tooltip}
                <div className="absolute top-full left-4 w-2 h-2 -mt-1 bg-white border-b border-r border-purple-200 transform rotate-45"></div>
            </div>
        </div>
    );
}
