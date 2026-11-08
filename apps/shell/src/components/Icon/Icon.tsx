export type IconName = 'bluesky' | 'linkedin';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}
