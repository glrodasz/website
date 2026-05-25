import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../atoms/Button';
import { InputText } from '../InputText';
import './WaitlistForm.css';

export interface WaitlistFormProps {
  /** POST target for the subscription request */
  endpoint?: string;
  /** Optional extra class on the form wrapper */
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_BREAKPOINT = '(max-width: 640px)';

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  endpoint = '/api/subscribe',
  className,
}) => {
  const { t, i18n } = useTranslation('waitlistForm');
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
        <p className="qd-waitlist-form__success-message">{t('success')}</p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!isMobile && !trimmedFirstName) {
      setFieldError('firstName');
      setErrorMessage(t('errors.firstName'));
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setFieldError('email');
      setErrorMessage(t('errors.email'));
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
          lang: i18n.language,
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
      setErrorMessage(data.message || t('errors.subscription'));
    } catch {
      setStatus('error');
      setErrorMessage(t('errors.network'));
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate>
      <div className="qd-waitlist-form__fields">
        <div className="qd-waitlist-form__name-field">
          <InputText
            label={t('firstName.label')}
            placeholder={t('firstName.placeholder')}
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            error={fieldError === 'firstName'}
          />
        </div>
        <InputText
          label={t('email.label')}
          placeholder={t('email.placeholder')}
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
          {isSubmitting ? t('submitting') : t('submit')}
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
