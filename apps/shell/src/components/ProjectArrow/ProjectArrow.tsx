import styles from './ProjectArrow.module.scss';

interface ProjectArrowProps {
  hovered: boolean;
  className?: string;
}

export function ProjectArrow({ hovered, className }: ProjectArrowProps) {
  const classes = [styles.icon, hovered && styles.hovered, className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg className={classes} viewBox="0 0 61 19" aria-hidden="true">
      <path
        className={styles.leader}
        stroke="currentColor"
        fill="currentColor"
        strokeLinejoin="miter"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={2.9091}
        d="M0 2.909h46.545"
      />
      <path
        className={styles.head}
        stroke="currentColor"
        fill="currentColor"
        d="M34.618 16.291l2.036-2.036 9.891 10.473 9.891-10.473 2.036 2.036-11.927 12.8z"
      />
    </svg>
  );
}
