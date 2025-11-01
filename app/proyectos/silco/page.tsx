'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function SilcoPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>SILCO</h1>
        <p className={styles.construction}>EN CONSTRUCCIÓN</p>
        <Link href="/" className={styles.backLink}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

