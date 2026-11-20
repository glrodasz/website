import { useId } from 'react';
import './SegmentedControl.css';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /**
   * Choices, rendered in order as a single-select toggle
   */
  options: SegmentedControlOption<T>[];
  /**
   * Currently selected value
   */
  value: T;
  /**
   * Called with the newly selected value
   */
  onChange: (value: T) => void;
  /**
   * Accessible name for the group (screen readers announce it with the options)
   */
  ariaLabel: string;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * SegmentedControl atom - a compact single-select toggle.
 *
 * Built on native radio inputs, so arrow-key navigation and form semantics
 * come for free; the inputs are visually hidden behind the styled labels.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  const classNames = ['qd-segmented-control', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <label key={option.value} className="qd-segmented-control__option">
          <input
            className="qd-segmented-control__input"
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span className="qd-segmented-control__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default SegmentedControl;
