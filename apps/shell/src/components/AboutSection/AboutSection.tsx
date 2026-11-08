import styles from './AboutSection.module.scss';

export function AboutSection({ id }: { id: string }) {
  return (
    <section id={id} className={styles.about}>
      <h2 className={styles.header}>about</h2>
      <p className={styles.text}>
        I am a designer-developer whose favorite design tool is code. I design
        and build interfaces that aim to make information discoverable,
        intelligible, and useful. I love translating between quantitative data,
        language, and visual representation, and developing systematic solutions
        to both engineering and design challenges. My approach to this work
        draws significantly on my training as an architect and historian.
      </p>
    </section>
  );
}
