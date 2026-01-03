'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function BastianPage() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Fecha de nacimiento: 26/12/2025 a las 16:24
    const birthDate = new Date(2025, 11, 26, 16, 24, 0) // Mes es 0-indexado, así que 11 = Diciembre

    const updateCounter = () => {
      const now = new Date()
      const diff = now.getTime() - birthDate.getTime()

      const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((Math.abs(diff) % (1000 * 60)) / 1000)

      setTimeElapsed({ days, hours, minutes, seconds })
    }

    // Actualizar inmediatamente
    updateCounter()

    // Actualizar cada segundo
    const interval = setInterval(updateCounter, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.counter}>
          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>{timeElapsed.days}</div>
            <div className={styles.timeLabel}>días</div>
          </div>
          <div className={styles.timeSeparator}>:</div>
          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>{timeElapsed.hours.toString().padStart(2, '0')}</div>
            <div className={styles.timeLabel}>horas</div>
          </div>
          <div className={styles.timeSeparator}>:</div>
          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>{timeElapsed.minutes.toString().padStart(2, '0')}</div>
            <div className={styles.timeLabel}>minutos</div>
          </div>
          <div className={styles.timeSeparator}>:</div>
          <div className={styles.timeUnit}>
            <div className={styles.timeValue}>{timeElapsed.seconds.toString().padStart(2, '0')}</div>
            <div className={styles.timeLabel}>segundos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
