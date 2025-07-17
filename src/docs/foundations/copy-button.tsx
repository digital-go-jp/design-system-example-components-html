import React from "react";

import "../../components/button/button.css";

interface CopyButtonProps {
  text: string;
  label: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
      // Optionally, provide user feedback here, e.g., alert("Copy failed");
    }
  };

  return (
    <button
      className="dads-button"
      type="button"
      data-size="xs"
      data-type="text"
      onClick={handleCopy}
    >
      {label}
    </button>
  );
};
