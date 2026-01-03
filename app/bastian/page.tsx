'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import styles from './page.module.css'

export default function BastianPage() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const starsRef = useRef<HTMLDivElement>(null)
  const galaxyRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    // Animación 2D: fondo moviéndose hacia arriba en bucle infinito
    if (galaxyRef.current) {
      anime({
        targets: galaxyRef.current,
        backgroundPosition: ['0% 0%', '0% 100%'],
        duration: 60000,
        easing: 'linear',
        loop: true,
      })
    }

    // Animaciones de brillo intermitente para estrellas aleatorias y movimiento hacia arriba
    if (starsRef.current) {
      const stars = starsRef.current.children
      Array.from(stars).forEach((star, index) => {
        const delay = index * 500 + Math.random() * 2000
        const duration = 3000 + Math.random() * 4000
        
        // Animación de twinkle
        setTimeout(() => {
          const twinkleAnimation = () => {
            anime({
              targets: star,
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.8, 1],
              duration: duration,
              easing: 'easeInOutSine',
              complete: () => {
                setTimeout(twinkleAnimation, Math.random() * 5000 + 3000)
              }
            })
          }
          twinkleAnimation()
        }, delay)
        
        // Animación de movimiento hacia arriba en bucle
        const starElement = star as HTMLElement
        const initialTop = starElement.style.top
        const moveAnimation = () => {
          const currentTop = parseFloat(initialTop) || 50
          anime({
            targets: starElement,
            top: [`${currentTop}%`, `${currentTop - 100}%`],
            duration: 60000 + Math.random() * 30000, // Velocidad variable para profundidad
            easing: 'linear',
            complete: () => {
              // Resetear posición y continuar
              starElement.style.top = `${currentTop + 100}%`
              moveAnimation()
            }
          })
        }
        setTimeout(moveAnimation, index * 2000)
      })
    }
  }, [])

  const starPositions = [
    { top: '20%', left: '30%' },
    { top: '50%', left: '50%' },
    { top: '80%', left: '10%' },
    { top: '40%', left: '70%' },
    { top: '10%', left: '80%' },
    { top: '90%', left: '20%' },
    { top: '15%', left: '50%' },
    { top: '60%', left: '90%' },
    { top: '35%', left: '25%' },
    { top: '70%', left: '60%' },
    { top: '25%', left: '15%' },
    { top: '85%', left: '75%' },
    { top: '55%', left: '40%' },
    { top: '45%', left: '85%' },
    { top: '75%', left: '35%' },
    { top: '30%', left: '60%' },
    { top: '65%', left: '5%' },
    { top: '5%', left: '45%' },
    { top: '95%', left: '55%' },
    { top: '50%', left: '95%' },
    { top: '12%', left: '25%' },
    { top: '28%', left: '40%' },
    { top: '42%', left: '15%' },
    { top: '58%', left: '65%' },
    { top: '72%', left: '45%' },
    { top: '88%', left: '80%' },
    { top: '8%', left: '70%' },
    { top: '18%', left: '12%' },
    { top: '32%', left: '88%' },
    { top: '48%', left: '22%' },
    { top: '62%', left: '78%' },
    { top: '78%', left: '28%' },
    { top: '92%', left: '62%' },
    { top: '14%', left: '58%' },
    { top: '26%', left: '35%' },
    { top: '38%', left: '82%' },
    { top: '52%', left: '8%' },
    { top: '66%', left: '52%' },
    { top: '82%', left: '92%' },
    { top: '6%', left: '18%' },
    { top: '22%', left: '72%' },
    { top: '46%', left: '48%' },
    { top: '68%', left: '38%' },
    { top: '84%', left: '58%' },
    { top: '96%', left: '28%' },
  ]

  return (
    <div className={styles.container}>
      <div ref={galaxyRef} className={styles.galaxyWrapper}>
        <div ref={starsRef} className={styles.starsContainer}>
          {starPositions.map((pos, index) => (
            <div
              key={index}
              className={styles.star}
              style={{
                top: pos.top,
                left: pos.left,
                width: index % 4 === 0 ? '3px' : '2px',
                height: index % 4 === 0 ? '3px' : '2px',
                background: index % 5 === 0 ? '#2E5090' : 'white',
                boxShadow: index % 5 === 0 ? '0 0 3px rgba(46, 80, 144, 0.8)' : '0 0 2px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </div>
      </div>
      <Link href="/" className={styles.backLink}>
        ← Volver al inicio
      </Link>
      <div className={styles.content}>
        <div className={styles.navLinks}>
          <Link href="/ph" className={styles.navLink}>
            fotografía
          </Link>
          <span className={styles.linkSeparator}>·</span>
          <Link href="/dev" className={styles.navLink}>
            desarrollo
          </Link>
        </div>
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
