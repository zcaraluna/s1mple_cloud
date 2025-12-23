'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import styles from './page.module.css'

export default function PhotographyPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const galaxyRef = useRef<HTMLDivElement>(null)

  // Galería de fotografías
  const photos = [
    {
      id: 1,
      src: '/IMG_1584.jpg',
      alt: 'Fotografía 1',
    },
    {
      id: 2,
      src: '/IMG_1875.jpg',
      alt: 'Fotografía 2',
    },
    {
      id: 3,
      src: '/IMG_1890.jpg',
      alt: 'Fotografía 3',
    },
    {
      id: 4,
      src: '/IMG_2086.jpg',
      alt: 'Fotografía 4',
    },
    {
      id: 5,
      src: '/IMG_1679.jpg',
      alt: 'Fotografía 5',
    },
    {
      id: 6,
      src: '/IMG_1804-2.jpg',
      alt: 'Fotografía 6',
    },
  ]

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === 0 ? photos.length - 1 : selectedImage - 1
      setSelectedImage(newIndex)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === photos.length - 1 ? 0 : selectedImage + 1
      setSelectedImage(newIndex)
    }
  }

  const goToImage = (index: number) => {
    setSelectedImage(index)
  }

  useEffect(() => {
    // Navegación con teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (selectedImage === 0) {
          setSelectedImage(photos.length - 1)
        } else {
          setSelectedImage(selectedImage - 1)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (selectedImage === photos.length - 1) {
          setSelectedImage(0)
        } else {
          setSelectedImage(selectedImage + 1)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedImage(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, photos.length])

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
            duration: 60000 + Math.random() * 30000,
            easing: 'linear',
            complete: () => {
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
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
        <h1 className={styles.title}>s1mple fotografía</h1>
        <p className={styles.subtitle}>
          Capturando momentos únicos en Central y Asunción
        </p>
        <div className={styles.navLinks}>
          <Link href="/dev" className={styles.navLink}>
            desarrollo
          </Link>
          <span className={styles.linkSeparator}>·</span>
          <Link href="/bastian" className={styles.navLink}>
            bastian
          </Link>
        </div>
      </div>

      <section className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>Galería</h2>
        <p className={styles.sectionDescription}>
          Algunas de mis fotografías favoritas
        </p>
        <div className={styles.gallery}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={styles.photoCard}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className={styles.photoImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.pricingSection}>
        <h2 className={styles.sectionTitle}>Precios</h2>
        <p className={styles.sectionDescription}>
          Servicios de fotografía
        </p>

        <div className={styles.coverageInfo}>
          <p className={styles.coverageText}>
            Cobertura: Departamento Central y Asunción
          </p>
          <p className={styles.coverageText}>
            Sesiones en exteriores y eventos (no contamos con estudio)
          </p>
        </div>

        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>Sesión Express</h3>
              <div className={styles.pricingDuration}>30 minutos</div>
            </div>
            <div className={styles.pricingPrice}>
              <span className={styles.priceAmount}>200.000</span>
              <span className={styles.priceCurrency}>Gs</span>
            </div>
            <div className={styles.pricingDetails}>
              <p className={styles.pricingPhotos}>10 a 20 fotos</p>
            </div>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>Sesión Estándar</h3>
              <div className={styles.pricingDuration}>1 hora</div>
            </div>
            <div className={styles.pricingPrice}>
              <span className={styles.priceAmount}>350.000</span>
              <span className={styles.priceCurrency}>Gs</span>
            </div>
            <div className={styles.pricingDetails}>
              <p className={styles.pricingPhotos}>25 a 30 fotos</p>
            </div>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>Sesión Extendida</h3>
              <div className={styles.pricingDuration}>2 horas</div>
            </div>
            <div className={styles.pricingPrice}>
              <span className={styles.priceAmount}>500.000</span>
              <span className={styles.priceCurrency}>Gs</span>
            </div>
            <div className={styles.pricingDetails}>
              <p className={styles.pricingPhotos}>35 a 45 fotos</p>
            </div>
          </div>

          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>Cobertura de Eventos</h3>
              <div className={styles.pricingDuration}>3 horas</div>
            </div>
            <div className={styles.pricingPrice}>
              <span className={styles.priceAmount}>600.000</span>
              <span className={styles.priceCurrency}>Gs</span>
            </div>
            <div className={styles.pricingDetails}>
              <p className={styles.pricingPhotos}>75 a 100 fotos</p>
              <div className={styles.pricingExtra}>
                <p className={styles.extraInfo}>
                  ⏱️ Hora extra: 150.000 Gs
                </p>
                <p className={styles.extraInfo}>
                  📷 +10 fotos por hora adicional
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.paymentNotice}>
          <div className={styles.noticeIcon}>⚠️</div>
          <div className={styles.noticeContent}>
            <h3 className={styles.noticeTitle}>Condiciones de Pago</h3>
            <p className={styles.noticeText}>
              Se requiere una seña del <strong>50%</strong> del total para
              reservar la fecha. Esta seña <strong>no es reembolsable</strong>.
            </p>
          </div>
        </div>
      </section>

      {selectedImage !== null && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeModal}>
              ×
            </button>
            <button 
              className={styles.modalArrow} 
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              ←
            </button>
            <div className={styles.modalImage}>
              <img
                src={photos[selectedImage].src}
                alt={photos[selectedImage].alt}
                className={styles.modalImageContent}
              />
            </div>
            <button 
              className={`${styles.modalArrow} ${styles.modalArrowRight}`} 
              onClick={goToNext}
              aria-label="Imagen siguiente"
            >
              →
            </button>
            <div className={styles.modalThumbnails}>
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  className={`${styles.thumbnail} ${
                    index === selectedImage ? styles.thumbnailActive : ''
                  }`}
                  onClick={() => goToImage(index)}
                  aria-label={`Ver ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

