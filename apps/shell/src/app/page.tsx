import { AboutSection } from '@/components/AboutSection/AboutSection';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { Navbar, type NavSection } from '@/components/Navbar/Navbar';
import { ProjectsSection } from '@/components/ProjectsSection/ProjectsSection';
import { projects } from '@/data/projects';
import styles from './page.module.scss';

const sections = {
  about: { id: 'about', label: 'about' },
  projects: { id: 'projects', label: 'project log' },
  contact: { id: 'contact', label: 'contact' },
} satisfies Record<string, NavSection>;

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar sections={Object.values(sections)} />
      <main className={styles.container}>
        <AboutSection id={sections.about.id} />
        <ProjectsSection id={sections.projects.id} projects={projects} />
        <ContactSection id={sections.contact.id} />
      </main>
    </div>
  );
}
