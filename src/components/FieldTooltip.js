import React, { useState } from 'react';

const FieldTooltip = ({ fieldType, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getTooltipContent = (type) => {
    switch (type) {
      case 'email':
        return {
          title: 'Email Requirements',
          rules: [
            'Must be a valid email format',
            'Example: user@example.com',
            'Maximum 254 characters'
          ]
        };
      case 'name':
        return {
          title: 'Name Requirements',
          rules: [
            'Letters, spaces, hyphens, and apostrophes only',
            'Minimum 2 characters',
            'Maximum 50 characters',
            'Example: John Smith, Mary-Jane, O\'Connor'
          ]
        };
      case 'zipCode':
        return {
          title: 'ZIP Code Requirements',
          rules: [
            'Numbers only (no letters or special characters)',
            'Exactly 5 digits',
            'Must be a valid US ZIP code',
            'Example: 12345'
          ]
        };
      case 'password':
        return {
          title: 'Password Requirements',
          rules: [
            'Minimum 6 characters',
            'Maximum 128 characters',
            'Avoid common passwords like "password123"',
            'Use a mix of letters, numbers, and symbols'
          ]
        };
      case 'gardenName':
        return {
          title: 'Garden Name Requirements',
          rules: [
            'Letters, numbers, spaces, hyphens, and apostrophes only',
            'Minimum 2 characters',
            'Maximum 50 characters',
            'Example: My Vegetable Garden, Herb-Garden, Tom\'s Garden'
          ]
        };
      case 'taskTitle':
        return {
          title: 'Task Title Requirements',
          rules: [
            'Any characters allowed',
            'Minimum 2 characters',
            'Maximum 100 characters',
            'Example: Water tomato plants, Harvest lettuce'
          ]
        };
      case 'taskNotes':
        return {
          title: 'Notes Requirements',
          rules: [
            'Optional field',
            'Any characters allowed',
            'Maximum 500 characters',
            'Example: Water in the morning, Check for pests'
          ]
        };
      default:
        return {
          title: 'Field Requirements',
          rules: ['Please check the field requirements']
        };
    }
  };

  const tooltipContent = getTooltipContent(fieldType);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label={`Show ${tooltipContent.title}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg left-0 top-full">
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 left-4"></div>
          <h4 className="font-semibold text-white mb-2">{tooltipContent.title}</h4>
          <ul className="space-y-1">
            {tooltipContent.rules.map((rule, index) => (
              <li key={index} className="text-gray-200 text-xs">
                • {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FieldTooltip;
