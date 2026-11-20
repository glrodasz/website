import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../atoms/Button';
import { BioCard, markdownToPlainText } from '../../molecules/BioCard';
import { Modal } from '../../molecules/Modal';
import './BioModal.css';

type BioId = 'veryShort' | 'short' | 'full';
type Person = 'first' | 'third';

const BIO_IDS: BioId[] = ['veryShort', 'short', 'full'];

const DEFAULT_PERSON: Record<BioId, Person> = {
  veryShort: 'first',
  short: 'third',
  full: 'third',
};

export interface BioModalProps {
  /**
   * Additional CSS class names on the trigger button wrapper
   */
  className?: string;
}

/**
 * BioModal organism - a trigger button that opens a dialog with ready-to-copy
 * bios in three lengths, each switchable between first and third person.
 */
export const BioModal: React.FC<BioModalProps> = ({ className }) => {
  const { t } = useTranslation('bio');
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState<Record<BioId, Person>>(DEFAULT_PERSON);

  const personOptions: { value: Person; label: string }[] = [
    { value: 'first', label: t('person.first') },
    { value: 'third', label: t('person.third') },
  ];

  const classNames = ['qd-bio-modal', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <Button variant="secondary" size="small" onClick={() => setOpen(true)}>
        {t('trigger')}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('modal.title')}
        description={t('modal.description')}
        closeLabel={t('modal.close')}
      >
        {BIO_IDS.map((id) => {
          const markdown = t(`bios.${id}.${person[id]}`);
          return (
            <BioCard
              key={id}
              title={t(`bios.${id}.title`)}
              hint={t(`bios.${id}.hint`)}
              characterCount={t('characters', { count: markdownToPlainText(markdown).length })}
              markdown={markdown}
              personOptions={personOptions}
              person={person[id]}
              onPersonChange={(next) => setPerson((current) => ({ ...current, [id]: next }))}
              personLabel={t('person.label')}
              copyLabel={t('copy')}
              copyMarkdownLabel={t('copyMarkdown')}
              copiedLabel={t('copied')}
            />
          );
        })}
      </Modal>
    </div>
  );
};

export default BioModal;
