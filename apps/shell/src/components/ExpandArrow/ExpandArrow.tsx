import styles from './ExpandArrow.module.scss';

interface ExpandArrowProps {
  expanded: boolean;
  hovered: boolean;
  className?: string;
}

const paths = {
  collapsed: {
    leader: 'M0 2.909h46.545',
    shaft: 'M46.545 2.909v22.982',
    head: 'M34.618 16.291l2.036-2.036 9.891 10.473 9.891-10.473 2.036 2.036-11.927 12.8z',
  },
  expanded: {
    leader: 'M0 29.091h46.545',
    shaft: 'M46.545 29.091v-22.982',
    head: 'M58.473 15.709l-2.036 2.036-9.891-10.473-9.891 10.473-2.036-2.036 11.927-12.8z',
  },
};

const lineProps = {
  stroke: 'currentColor',
  fill: 'currentColor',
  strokeLinejoin: 'miter',
  strokeLinecap: 'square',
  strokeMiterlimit: 10,
  strokeWidth: 2.9091,
} as const;

export function ExpandArrow({
  expanded,
  hovered,
  className,
}: ExpandArrowProps) {
  const state = expanded ? 'expanded' : 'collapsed';
  const d = paths[state];
  const classes = [
    styles.icon,
    styles[state],
    hovered && styles.hovered,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // Keyed by state so toggling swaps in a fresh arrow rather than
    // animating the hover offsets of one shape into the other.
    <svg key={state} className={classes} viewBox="0 0 61 32" aria-hidden="true">
      <path {...lineProps} d={d.leader} />
      <path {...lineProps} className={styles.shaft} d={d.shaft} />
      <path
        className={styles.head}
        stroke="currentColor"
        fill="currentColor"
        d={d.head}
      />
    </svg>
  );
}
