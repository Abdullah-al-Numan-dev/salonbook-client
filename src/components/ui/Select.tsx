import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import FormField, { fieldClass } from "./FormField";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, children, ...props },
  ref
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <FormField id={selectId} label={label} error={error} hint={hint}>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={cn(fieldClass, "pr-8", className)}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
});

export default Select;