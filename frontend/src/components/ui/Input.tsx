import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="flex flex-col gap-1.5" htmlFor={inputId}>
        {label && (
          <span className="font-label text-xs font-semibold text-primary-700">{label}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "rounded-lg border px-3 py-2.5 text-sm focus:outline-none",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-neutral-200 focus:border-secondary-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
