import './Media.css';

// Framed image. While its section generates it goes grid placeholder -> pixelated -> real
// (see useGenerate); the image also drifts inside its frame on scroll (data-parallax).
// Explicit width/height + aspect-ratio keep the layout from shifting while it loads.
export default function Media({ image, alt, ratio, sizes = '100vw', eager = false, parallax = true, className = '' }) {
  const width = 1600;
  const height = Math.round(width / ratio);
  return (
    <div className={`media ${className}`} style={{ aspectRatio: String(ratio) }} data-gen="image">
      <span className="media__grid" aria-hidden="true" />
      {image.px && (
        <img
          className="media__px"
          src={image.px}
          alt=""
          aria-hidden="true"
          width="28"
          height={Math.max(1, Math.round(28 / ratio))}
        />
      )}
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
    </div>
  );
}
