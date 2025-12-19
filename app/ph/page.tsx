'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function PhotographyPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Array de placeholder para las fotos - puedes reemplazar con tus imágenes reales
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder-photo-${i + 1}.jpg`, // Reemplazar con rutas reales
    alt: `Fotografía ${i + 1}`,
  }))

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
        <h1 className={styles.title}>Fotografía</h1>
        <p className={styles.subtitle}>
          Capturando momentos únicos en Central y Asunción
        </p>
      </div>

      <section className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>Galería</h2>
        <p className={styles.sectionDescription}>
          Algunas de mis mejores fotografías
        </p>
        <div className={styles.gallery}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={styles.photoCard}
              onClick={() => handleImageClick(index)}
            >
              <div className={styles.photoPlaceholder}>
                <span className={styles.photoPlaceholderText}>
                  Foto {photo.id}
                </span>
                <span className={styles.photoPlaceholderHint}>
                  Click para ampliar
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.pricingSection}>
        <h2 className={styles.sectionTitle}>Precios</h2>
        <p className={styles.sectionDescription}>
          Servicios de fotografía profesional
        </p>

        <div className={styles.coverageInfo}>
          <p className={styles.coverageText}>
            📍 Cobertura: Departamento Central y Asunción
          </p>
          <p className={styles.coverageText}>
            📸 Sesiones en exteriores y eventos (no contamos con estudio)
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
            <div className={styles.modalImage}>
              <div className={styles.photoPlaceholder}>
                <span className={styles.photoPlaceholderText}>
                  Foto {photos[selectedImage].id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

