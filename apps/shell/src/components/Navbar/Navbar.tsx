import styles from './Navbar.module.scss';

export interface NavSection {
  id: string;
  label: string;
}

interface NavbarProps {
  sections: NavSection[];
}

export function Navbar({ sections }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <h1 className={styles.name}>
        <a href="#top">Stephanie Tuerk</a>
      </h1>
      <nav className={styles.items}>
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className={styles.item}>
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
