import { Icon, type IconName } from '@/components/Icon/Icon';
import styles from './ContactSection.module.scss';

const socialLinks: { label: string; icon: IconName; url: string }[] = [
  {
    label: 'Bluesky',
    icon: 'bluesky',
    url: 'https://bsky.app/profile/stephanietuerk.net',
  },
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/stephanie-tuerk/',
  },
];

export function ContactSection({ id }: { id: string }) {
  return (
    <section id={id} className={styles.contact}>
      <h2 className={styles.header}>contact</h2>
      <div className={styles.group}>
        <p className={styles.type}>email</p>
        <p className={styles.text}>stephanie dot tuerk at gmail</p>
      </div>
      <div className={styles.group}>
        <p className={styles.type}>other</p>
        <div className={styles.socialLinks}>
          {socialLinks.map((link) => (
            <a
              key={link.icon}
              className={styles.socialLink}
              href={link.url}
              target="_blank"
              rel="noopener"
              aria-label={link.label}
            >
              <Icon name={link.icon} className={styles.socialIcon} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
