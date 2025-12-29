import React from 'react';

/**
 * IntroTilePanel - a reusable two-tile panel for intro pages.
 * @param {Array} tiles - Array of tile configs: { image, alt, title, href, background, textColor, imageSide ('left'|'right'), ariaLabel }
 * @param {string|number} gap - CSS gap between tiles (default: '2.5rem')
 * @param {ReactNode} children - Optional children to override tile hrefs via <a> elements
 */
export default function IntroTilePanel({ tiles, gap = '2.5rem', children }) {
  // So, for the links we're given, we want to allow the user to override the hrefs via children <a> elements.
  // This allows MDX users to use relative links like [Learn More](./more) instead of hardcoding absolute URLs in the
  // tile config, which makes versioned docs work way better & prevents trailing slash issues from mattering.
  const titleToHRef = {};
  if(children) {
    for(const child of React.Children.toArray(children.props.children)) {
      // This works for both MDX <a> and regular <a> elements, as the browser will render both as <a>
      if(child?.type?.name === 'a' || child?.type?.name === 'MDXA') {
        const href = child.props.href;
        const title = child.props.children;
        titleToHRef[title] = href;
      }
    }
  }
  return (
    <div style={{ padding: '0 2.5vw' }}>
      <div
        className="row"
        style={{
          marginBottom: '1.5rem',
          gap,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {tiles.map((tile) => {
          const isImageLeft = tile.imageSide === 'left';
          const href = titleToHRef[tile.title] ?? tile.href;
          return (
            <a
              key={tile.title}
              href={href}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                flex: '1 1 200px',
                maxWidth: '450px',
              }}
              aria-label={tile.ariaLabel || `Go to ${tile.title}`}
            >
              <div
                className={`col col--6 themed-col themed-col--${tile.title.toLowerCase().replace(/\s/g, '')}`}
                style={{
                  position: 'relative',
                  background: tile.background,
                  borderRadius: 12,
                  overflow: 'hidden',
                  minHeight: 150,
                  maxHeight: 150,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '1.2rem 0.8rem',
                  maxWidth: '100%',
                }}
              >
                {isImageLeft && (
                  <img
                    src={tile.image}
                    alt={tile.alt || tile.title}
                    style={{
                      position: 'relative',
                      width: 88,
                      height: 88,
                      objectFit: 'contain',
                      opacity: 0.8,
                      zIndex: 1,
                      borderRadius: 12,
                      marginRight: '1.5rem',
                      background: 'none',
                      ...(tile.imageFlip ? { transform: 'scaleX(-1)' } : {}),
                      flexShrink: 0,
                    }}
                  />
                )}
                <h2
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    color: tile.textColor,
                    fontWeight: 'bold',
                    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                    borderRadius: 8,
                    padding: '0.5em 1em',
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    minWidth: 0,
                    textAlign: tile.textAlign || (isImageLeft ? 'right' : 'left'),
                    margin: 0,
                    ...(isImageLeft ? { marginRight: '1.5rem' } : { marginLeft: '1.5rem' }),
                    background: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    wordBreak: 'keep-all',
                    hyphens: 'none',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tile.title}
                </h2>
                {!isImageLeft && (
                  <img
                    src={tile.image}
                    alt={tile.alt || tile.title}
                    style={{
                      position: 'relative',
                      width: 88,
                      height: 88,
                      objectFit: 'contain',
                      opacity: 0.8,
                      zIndex: 1,
                      borderRadius: 12,
                      marginLeft: '1.5rem',
                      background: 'none',
                      ...(tile.imageFlip ? { transform: 'scaleX(-1)' } : {}),
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
