import React, { type ReactNode } from 'react';

import styles from './styles.module.css';

export function ShowcaseAppList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}

export function ShowcaseAppListItem({
  name,
  author,
  image,
  link,
}: {
  name: string;
  author: string;
  image: string;
  link: string;
}) {
  return (
    <a href={link} target="_blank" className={styles.item}>
      <img src={image} alt={name} className={styles.thumbnail} />
      <span className={styles.content}>
        <span className={styles.title}>{name}</span>
        <span className={styles.byline}>{`By ${author}`}</span>
      </span>
      <span className={styles.action}>Try on Reddit</span>
    </a>
  );
}
