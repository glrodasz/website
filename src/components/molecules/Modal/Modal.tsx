import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'phosphor-react';
import { Icon } from '../../atoms/Icon';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import './Modal.css';

export interface ModalProps {
  /**
   * Whether the dialog is shown
   */
  open: boolean;
  /**
   * Called when the user dismisses the dialog (close button, backdrop, Escape)
   */
  onClose: () => void;
  /**
   * Dialog heading, also the accessible name
   */
  title: string;
  /**
   * Optional supporting line under the title
   */
  description?: string;
  /**
   * Accessible label for the close button
   */
  closeLabel: string;
  /**
   * Dialog body
   */
  children: React.ReactNode;
  /**
   * Additional CSS class names on the dialog panel
   */
  className?: string;
}

/**
 * Modal molecule - a centered dialog over a dimmed backdrop.
 *
 * Renders into document.body, traps focus while open, restores it to the
 * trigger on close, locks page scroll, and closes on Escape or backdrop click.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  closeLabel,
  children,
  className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const classNames = ['qd-modal__panel', className].filter(Boolean).join(' ');

  return createPortal(
    <div className="qd-modal">
      <div className="qd-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={classNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="qd-modal__header">
          <div className="qd-modal__heading">
            <h2 id={titleId} className="qd-modal__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="qd-modal__description">
                {description}
              </p>
            )}
          </div>
          <button type="button" className="qd-modal__close" onClick={onClose} aria-label={closeLabel}>
            <Icon icon={X} size="sm" aria-hidden="true" />
          </button>
        </div>
        <div className="qd-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
