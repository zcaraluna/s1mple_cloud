'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const galaxyRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const aboutArrowRef = useRef<HTMLDivElement>(null)
  const projectsSectionRef = useRef<HTMLDivElement>(null)

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
                  if (glowElement && dividerRef.current.offsetWidth > 0) {
                    const startAnimation = () => {
                      if (!dividerRef.current) return
                      const dividerWidth = dividerRef.current.offsetWidth
                      if (dividerWidth === 0) return
                      
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
                          setTimeout(() => {
                            if (dividerRef.current && dividerRef.current.offsetWidth > 0) {
                              startAnimation()
                            }
                          }, 1000)
                        }
                      })
                    }
                    // Pequeño delay para asegurar que el elemento está renderizado
                    setTimeout(() => {
                      if (dividerRef.current && dividerRef.current.offsetWidth > 0) {
                        startAnimation()
                      }
                    }, 100)
                  }
                }
              }
            })
          }
        }
      })
    }

    // Mostrar flecha después de 3 segundos
    setTimeout(() => {
      if (arrowRef.current) {
        anime({
          targets: arrowRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutExpo',
        })

        // Animación continua de rebote
        const bounceAnimation = () => {
          anime({
            targets: arrowRef.current,
            translateY: [0, 10, 0],
            duration: 1500,
            easing: 'easeInOutSine',
            loop: true,
          })
        }
        setTimeout(bounceAnimation, 800)
      }
    }, 3000)
  }, [])

  const handleScrollDown = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleScrollToProjects = () => {
    if (projectsSectionRef.current) {
      projectsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    let isScrolling = false
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault()
        return
      }
      
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      const viewportHeight = window.innerHeight
      
      if (aboutSectionRef.current && projectsSectionRef.current) {
        const aboutTop = aboutSectionRef.current.offsetTop
        const projectsTop = projectsSectionRef.current.offsetTop
        const isInWelcomeZone = currentScroll < viewportHeight * 0.8
        const isInAboutZone = currentScroll >= aboutTop - viewportHeight * 0.2 && currentScroll < aboutTop + viewportHeight * 0.3
        const isInProjectsZone = currentScroll >= projectsTop - viewportHeight * 0.2 && currentScroll < projectsTop + viewportHeight * 0.3
        
        // Scroll hacia abajo
        if (e.deltaY > 0) {
          // Desde welcome a about
          if (isInWelcomeZone) {
            e.preventDefault()
            isScrolling = true
            window.scrollTo({ top: aboutTop, behavior: 'smooth' })
            setTimeout(() => { isScrolling = false }, 1000)
          }
          // Desde about a projects
          else if (isInAboutZone) {
            e.preventDefault()
            isScrolling = true
            window.scrollTo({ top: projectsTop, behavior: 'smooth' })
            setTimeout(() => { isScrolling = false }, 1000)
          }
        }
        // Scroll hacia arriba
        else if (e.deltaY < 0) {
          // Desde projects a about
          if (isInProjectsZone) {
            e.preventDefault()
            isScrolling = true
            window.scrollTo({ top: aboutTop, behavior: 'smooth' })
            setTimeout(() => { isScrolling = false }, 1000)
          }
          // Desde about a welcome
          else if (isInAboutZone) {
            e.preventDefault()
            isScrolling = true
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setTimeout(() => { isScrolling = false }, 1000)
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    // Intersection Observer para animar la sección cuando entra en vista
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            
            // Buscar elementos por clase (CSS Modules genera nombres únicos)
            const title = target.querySelector('[class*="aboutTitle"]') as HTMLElement
            const info = target.querySelector('[class*="infoGrid"]') as HTMLElement
            const dev = target.querySelector('[class*="devSection"]') as HTMLElement

            // Animar título
            if (title) {
              anime({
                targets: title,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutExpo',
              })
            }

            // Animar información
            if (info) {
              setTimeout(() => {
                anime({
                  targets: info,
                  opacity: [0, 1],
                  translateY: [30, 0],
                  duration: 800,
                  easing: 'easeOutExpo',
                })
              }, 200)
            }

            // Animar sección de desarrollo
            if (dev) {
              setTimeout(() => {
                anime({
                  targets: dev,
                  opacity: [0, 1],
                  translateY: [30, 0],
                  duration: 800,
                  easing: 'easeOutExpo',
                  complete: () => {
                    // Mostrar flecha después de la animación del contenido
                    if (aboutArrowRef.current) {
                      anime({
                        targets: aboutArrowRef.current,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 800,
                        easing: 'easeOutExpo',
                      })

                      // Animación continua de rebote
                      const bounceAnimation = () => {
                        anime({
                          targets: aboutArrowRef.current,
                          translateY: [0, 10, 0],
                          duration: 1500,
                          easing: 'easeInOutSine',
                          loop: true,
                        })
                      }
                      setTimeout(bounceAnimation, 800)
                    }
                  }
                })
              }, 300)
            }

            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (aboutSectionRef.current) {
      observer.observe(aboutSectionRef.current)
    }

    // Observer para proyectos
    const projectsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const projectsTitle = target.querySelector('[class*="projectsTitle"]') as HTMLElement
            const projectsGrid = target.querySelector('[class*="projectsGrid"]') as HTMLElement

            if (projectsTitle) {
              anime({
                targets: projectsTitle,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutExpo',
              })
            }

            if (projectsGrid) {
              const cards = projectsGrid.children
              Array.from(cards).forEach((card, index) => {
                setTimeout(() => {
                  anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutExpo',
                  })
                }, index * 100)
              })
            }

            projectsObserver.unobserve(target)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (projectsSectionRef.current) {
      projectsObserver.observe(projectsSectionRef.current)
    }

    return () => {
      if (aboutSectionRef.current) {
        observer.unobserve(aboutSectionRef.current)
      }
      if (projectsSectionRef.current) {
        projectsObserver.unobserve(projectsSectionRef.current)
      }
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
        <div 
          ref={arrowRef} 
          className={styles.scrollArrow}
          onClick={handleScrollDown}
        >
          <div className={styles.arrowIcon}></div>
        </div>
      </div>
      <section ref={aboutSectionRef} className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>Guillermo Andres Recalde Valdez</h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Edad</span>
              <span className={styles.infoValue}>28 años</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Profesión</span>
              <span className={styles.infoValue}>Oficial de policía</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estudios</span>
              <span className={styles.infoValue}>Criminalística</span>
            </div>
          </div>

          <div className={styles.devSection}>
            <h3 className={styles.sectionTitle}>Desarrollo</h3>
            <p className={styles.devText}>
              En mi tiempo libre desarrollo páginas web y web apps sobre gestión de negocios y/o personal
            </p>
          </div>

          <div 
            ref={aboutArrowRef} 
            className={styles.scrollArrow}
            onClick={handleScrollToProjects}
          >
            <div className={styles.arrowIcon}></div>
          </div>

        </div>
      </section>
      <section ref={projectsSectionRef} className={styles.projectsSection}>
        <div className={styles.projectsContent}>
          <h2 className={styles.projectsTitle}>Proyectos</h2>
          
          <div className={styles.projectsGrid}>
            <Link href="/proyectos/viktor" className={styles.projectCard}>
              <div className={styles.projectImagePlaceholder}>
                <span className={styles.placeholderText}>Imagen</span>
              </div>
              <h3 className={styles.projectName}>Viktor</h3>
              <p className={styles.projectDescription}>
                Un software destinado a la lucha contra la MASI.
              </p>
            </Link>

            <Link href="/proyectos/silco" className={styles.projectCard}>
              <div className={styles.projectImagePlaceholder}>
                <span className={styles.placeholderText}>Imagen</span>
              </div>
              <h3 className={styles.projectName}>SILCO</h3>
              <p className={styles.projectDescription}>
                Una web app destinada a la gestión y monitoreo de guardias de seguridad de empresas privadas
              </p>
            </Link>

            <Link href="/proyectos/quira" className={styles.projectCard}>
              <div className={styles.projectImagePlaceholder}>
                <span className={styles.placeholderText}>Imagen</span>
              </div>
              <h3 className={styles.projectName}>QUIRA</h3>
              <p className={styles.projectDescription}>
                Una web app destinada al registro e identificación de postulantes durante admisión ISEPOL
              </p>
            </Link>

            <Link href="/proyectos/cybeprol" className={styles.projectCard}>
              <div className={styles.projectImagePlaceholder}>
                <span className={styles.placeholderText}>Imagen</span>
              </div>
              <h3 className={styles.projectName}>CYBERPOL</h3>
              <p className={styles.projectDescription}>
                Un conjunto de web apps destinada a la atención al ciudadano en la DCHPEF
              </p>
            </Link>

            <Link href="/proyectos/bitcanpos" className={styles.projectCard}>
              <div className={styles.projectImagePlaceholder}>
                <span className={styles.placeholderText}>Imagen</span>
              </div>
              <h3 className={styles.projectName}>BitcanPOS</h3>
              <p className={styles.projectDescription}>
                Puntos de ventas para variados negocios
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

