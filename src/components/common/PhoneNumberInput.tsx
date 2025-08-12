import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { MessageCircle, Phone } from 'lucide-react';

export interface PhoneNumberInputProps {
  /** Current phone number value */
  value: string;
  /** Callback when phone number changes */
  onChange: (value: string) => void;
  /** Field label */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Whether this is a WhatsApp number field */
  isWhatsApp?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Help text to display below the input */
  helpText?: string;
  /** Default country code (defaults to India) */
  defaultCountry?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  placeholder = "Enter phone number",
  error,
  isWhatsApp = false,
  className = "",
  disabled = false,
  helpText,
  defaultCountry = "IN"
}) => {
  const inputId = React.useId();
  
  return (
    <>
      <style jsx global>{`
        /* Global Phone Input Styling */
        .phone-input-wrapper {
          position: relative;
          width: 100%;
        }
        
        .phone-input-wrapper .PhoneInput {
          display: flex;
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background-color: white;
          transition: all 0.2s;
          overflow: hidden;
        }
        
        .phone-input-wrapper.error .PhoneInput {
          border-color: #ef4444;
          background-color: #fef2f2;
        }
        
        .phone-input-wrapper.disabled .PhoneInput {
          background-color: #f9fafb;
          border-color: #d1d5db;
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .phone-input-wrapper .PhoneInput:hover:not(.disabled) {
          border-color: #9ca3af;
        }
        
        .phone-input-wrapper.error .PhoneInput:hover {
          border-color: #ef4444;
        }
        
        .phone-input-wrapper .PhoneInput:focus-within:not(.disabled) {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect {
          border: none;
          border-right: 1px solid #e5e7eb;
          border-radius: 0;
          padding: 12px 8px 12px 12px;
          background-color: transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          min-width: 70px;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect:hover:not(:disabled) {
          background-color: #f9fafb;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect:focus {
          outline: none;
          background-color: #f3f4f6;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect:disabled {
          cursor: not-allowed;
        }
        
        .phone-input-wrapper .PhoneInputInput {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 0;
          font-size: 16px;
          background-color: transparent;
          outline: none;
          flex: 1;
        }
        
        .phone-input-wrapper .PhoneInputInput:disabled {
          cursor: not-allowed;
          color: #6b7280;
        }
        
        .phone-input-wrapper .PhoneInputInput::placeholder {
          color: #9ca3af;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelectArrow {
          border-color: #6b7280;
          border-width: 1px 1px 0 0;
          width: 4px;
          height: 4px;
          margin-left: 4px;
          transform: rotate(45deg);
        }
        
        .phone-input-wrapper .PhoneInputCountryFlag {
          width: 20px;
          height: 15px;
          margin-right: 4px;
          border-radius: 2px;
        }
        
        /* Remove default phone input styles */
        .phone-input-wrapper .PhoneInput--focus {
          box-shadow: none !important;
        }
        
        /* Ensure proper height matching other inputs */
        .phone-input-wrapper .PhoneInput {
          min-height: 48px;
        }
      `}</style>
      
      <div className={`phone-number-input ${className}`}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isWhatsApp && <MessageCircle className="w-4 h-4 inline mr-1" />}
            {!isWhatsApp && <Phone className="w-4 h-4 inline mr-1" />}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className={`phone-input-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
          <PhoneInput
            id={inputId}
            international
            defaultCountry={defaultCountry as any}
            value={value}
            onChange={(val) => onChange(val || '')}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        
        {helpText && !error && (
          <p className="text-gray-500 text-xs mt-1">{helpText}</p>
        )}
      </div>
    </>
  );
};

export default PhoneNumberInput;