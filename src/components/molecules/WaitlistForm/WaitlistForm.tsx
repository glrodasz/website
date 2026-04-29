import React, { useEffect, useState } from 'react';
import { Button } from '../../atoms/Button';
import { InputText } from '../InputText';
import './WaitlistForm.css';

export interface WaitlistFormProps {
  /** POST target for the subscription request */
  endpoint?: string;
  /** Optional extra class on the form wrapper */
  className?: string;
  /** CTA label on the submit button */
  submitLabel?: string;
  /** Message shown after a successful subscription */
  successMessage?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_BREAKPOINT = '(max-width: 640px)';

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  endpoint = '/api/subscribe',
  className,
  submitLabel = 'Join waitlist',
  successMessage = "You're on the list — I'll email you when the course opens.",
}) => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState<'firstName' | 'email' | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const classNames = [
    'qd-waitlist-form',
    status === 'success' && 'qd-waitlist-form--success',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (status === 'success') {
    return (
      <div className={classNames} role="status">
        <p className="qd-waitlist-form__success-message">{successMessage}</p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!isMobile && !trimmedFirstName) {
      setFieldError('firstName');
      setErrorMessage('Please enter your first name.');
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setFieldError('email');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setFieldError(null);
    setErrorMessage('');
    setStatus('submitting');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...(!isMobile && { firstName: trimmedFirstName }),
          email: trimmedEmail,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && data.ok) {
        setStatus('success');
        return;
      }

      setStatus('error');
      setErrorMessage(data.message || 'Subscription failed, please try again.');
    } catch {
      setStatus('error');
      setErrorMessage('Network error — please try again.');
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate>
      <div className="qd-waitlist-form__fields">
        <div className="qd-waitlist-form__name-field">
          <InputText
            label="First name"
            placeholder="Ada"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            error={fieldError === 'firstName'}
          />
        </div>
        <InputText
          label="Email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          error={fieldError === 'email'}
        />
      </div>
      <div className="qd-waitlist-form__submit">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Joining…' : submitLabel}
        </Button>
      </div>
      {errorMessage && !isSubmitting && (
        <p className="qd-waitlist-form__error-message" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default WaitlistForm;
