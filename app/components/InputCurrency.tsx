import React from "react";
import { Input } from "./ui/input";

const CurrencyInput = ({
  value: initialValue = "",
  onChange,
}: {
  value: string;
  onChange: (value: string | null) => void;
  className?: string;
}) => {
  const [displayValue, setDisplayValue] = React.useState(
    formatForDisplay(initialValue)
  );
  const [rawValue, setRawValue] = React.useState(String(initialValue || ""));
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isSelected, setIsSelected] = React.useState(false);

  function formatForDisplay(value: number | string) {
    if (!value && value !== 0) return "";

    // Handle case when value is just a decimal point
    if (value === ".") return "$ 0.";

    // Split number into integer and decimal parts
    const [intPart, decPart] = String(value).split(".");

    // Add commas to integer part
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine parts
    let formatted = `$ ${formattedInt}`;
    if (typeof decPart !== "undefined") {
      formatted += `.${decPart}`;
    }

    return formatted;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Remove all formatting characters
    newValue = newValue.replace(/[$\s,]/g, "");

    // Validate input
    if (!/^\d*\.?\d*$/.test(newValue)) {
      return;
    }

    // Handle all text selected case
    if (isSelected && /^\d$/.test(newValue)) {
      setRawValue(newValue);
      setDisplayValue(formatForDisplay(newValue));
      // onChange(Number.parseFloat(newValue) || null);
      onChange(String(Number.parseFloat(newValue) || null));
      setIsSelected(false);
      return;
    }

    setRawValue(newValue);
    setDisplayValue(formatForDisplay(newValue));

    // Call onChange with numeric value or null
    const numericValue = newValue ? Number.parseFloat(newValue) : null;
    // onChange(Number.isNaN(numericValue) ? null : numericValue);
    onChange(Number.isNaN(numericValue) ? null : String(numericValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Ctrl+A (or Command+A on Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      inputRef.current?.setSelectionRange(0, displayValue.length);
      setIsSelected(true);
      return;
    }

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior

      if (isSelected) {
        // If all text is selected, clear everything
        setRawValue("");
        setDisplayValue("");
        onChange?.(null);
        setIsSelected(false);
        return;
      }

      // Get cursor position and handle backspace manually
      const cursorPos = inputRef.current?.selectionStart || 0;
      // const displayLen = displayValue.length;

      // Don't do anything if cursor is at the start
      if (cursorPos === 0) return;

      // Remove one character from raw value
      const newRawValue = rawValue.slice(0, -1);
      setRawValue(newRawValue);

      // Format and update display
      const newDisplayValue = formatForDisplay(newRawValue);
      setDisplayValue(newDisplayValue);

      // Update parent with numeric value
      const numericValue = newRawValue ? Number.parseFloat(newRawValue) : null;
      // onChange(Number.isNaN(numericValue) ? null : numericValue);
      onChange(Number.isNaN(numericValue) ? null : String(numericValue));

      // Set cursor position
      setTimeout(() => {
        const newCursorPos = Math.max(0, newDisplayValue.length);
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const isFullySelected =
      target.selectionStart === 0 &&
      target.selectionEnd === displayValue.length;
    setIsSelected(isFullySelected);
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelect}
      onBlur={handleBlur}
      placeholder="$ 0.00"
      inputMode="decimal"
    />
  );
};

export default CurrencyInput;
