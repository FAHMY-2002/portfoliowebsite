import './Media.css';

// Framed image with a reveal wipe and scroll parallax (both wired up by useReveal).
// Explicit width/height + aspect-ratio keep the layout from shifting while it loads.
export default function Media({ image, alt, ratio, sizes = '100vw', eager = false, reveal = true, parallax = true, className = '' }) {
  const width = 1600;
  const height = Math.round(width / ratio);
  return (
    <div className={`media ${className}`} style={{ aspectRatio: String(ratio) }} data-reveal={reveal ? 'image' : undefined}>
      <div className="media__inner">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          data-parallax={parallax ? '' : undefined}
        />
      </div>
      <span className="media__cover" aria-hidden="true" />
    </div>
  );
}
