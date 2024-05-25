import React from 'react'
import styles from "../page.module.css";

export default function GenTextArea({ gt }) {
  return (
    <article className={styles.genTextArea}>
        {gt}
    </article>
  );
}