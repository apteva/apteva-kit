import { ImageWidget } from '../../../types/widgets';

interface ImageProps {
  widget: ImageWidget;
}

export function Image({ widget }: ImageProps) {
  const { src, alt, caption } = widget.props;

  return (
    <figure className="overflow-hidden rounded-xl">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain bg-neutral-100 dark:bg-neutral-800"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
