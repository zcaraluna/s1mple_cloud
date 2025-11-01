'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'
import styles from './page.module.css'

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const galaxyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animación tipo Star Wars: perspectiva 3D moviendo de arriba hacia abajo
    if (galaxyRef.current) {
      anime({
        targets: galaxyRef.current,
        rotateX: [0, 360],
        duration: 300000,
        easing: 'linear',
        loop: true,
      })
    }

    // Animaciones de brillo intermitente para estrellas aleatorias
    if (starsRef.current) {
      const stars = starsRef.current.children
      Array.from(stars).forEach((star, index) => {
        const delay = index * 500 + Math.random() * 2000
        const duration = 3000 + Math.random() * 4000
        
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
      })
    }

    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('span')
      
      anime({
        targets: letters,
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => {
          // Animación del divider (solo aparición, sin fade)
          if (dividerRef.current) {
            anime({
              targets: dividerRef.current,
              scaleX: [0, 1],
              duration: 500,
              easing: 'easeOutExpo',
              complete: () => {
                // Animación de iluminación que recorre la línea periódicamente
                if (dividerRef.current) {
                  const glowElement = dividerRef.current.firstElementChild as HTMLElement
                  if (glowElement) {
                    const startAnimation = () => {
                      const dividerWidth = dividerRef.current!.offsetWidth
                      const endPosition = dividerWidth * 0.60 
                      glowElement.style.left = '-30px'
                      glowElement.style.opacity = '0'
                      
                      anime({
                        targets: glowElement,
                        left: `${endPosition}px`,
                        opacity: [0, 1, 1, 0],
                        offset: [0, 0.1, 0.7, 1],
                        duration: 2000,
                        easing: 'easeInOutSine',
                        complete: () => {
                          // Reiniciar después de un breve delay
                          setTimeout(startAnimation, 1000)
                        }
                      })
                    }
                    startAnimation()
                  }
                }
              }
            })
          }
        }
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
    <main className={styles.container}>
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
      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          {'s1mple'.split('').map((char, index) => (
            <span key={index} className={styles.letter}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <div ref={dividerRef} className={styles.divider}>
          <span className={styles.glow}></span>
        </div>
      </div>
    </main>
  )
}

