'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function QuiraPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>QUIRA</h1>
        <p className={styles.construction}>EN CONSTRUCCIÓN</p>
        <Link href="/dev" className={styles.backLink}>
          Volver a desarrollo
        </Link>
      </div>
    </div>
  )
}

