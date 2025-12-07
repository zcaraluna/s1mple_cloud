'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import styles from './page.module.css'

interface Bet {
  id: string
  name: string
  date: string // Formato: YYYY-MM-DD
  timestamp: number // Para ordenamiento
}

export default function BastianPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingBets, setLoadingBets] = useState(true)
  
  // Estados para el formulario de nacimiento
  const [showBirthForm, setShowBirthForm] = useState(false)
  const [birthDate, setBirthDate] = useState<string>('')
  const [birthTime, setBirthTime] = useState<string>('')
  const [birthWeight, setBirthWeight] = useState<string>('')
  const [birthHeight, setBirthHeight] = useState<string>('')
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  // Verificar permisos de notificaciones al cargar
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Función para pedir permisos de notificaciones
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setShowError('Tu navegador no soporta notificaciones')
      return
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      return
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === 'granted') {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        setShowError('Permisos de notificación denegados')
      }
    } else {
      setShowError('Los permisos de notificación fueron denegados. Por favor habilítalos manualmente en la configuración del navegador.')
    }
  }

  // Función para mostrar notificación del navegador
  const showBrowserNotification = (title: string, options: NotificationOptions & { vibrate?: number[] }) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options)
    }
  }

  // Función para probar las notificaciones
  const testNotification = () => {
    if (!('Notification' in window)) {
      setShowError('Tu navegador no soporta notificaciones')
      return
    }

    if (Notification.permission !== 'granted') {
      setShowError('Primero debes activar los permisos de notificaciones')
      return
    }

    showBrowserNotification('🎉 ¡Notificación de prueba!', {
      body: 'Si ves esta notificación, significa que todo funciona correctamente. ¡Las notificaciones están activas!',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: true,
      vibrate: [200, 100, 200],
    })

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  // Cargar apuestas desde la API
  useEffect(() => {
    const loadBets = async () => {
      try {
        setLoadingBets(true)
        const response = await fetch('/api/bastian')
        if (response.ok) {
          const data = await response.json()
          setBets(data)
        } else {
          console.error('Error cargando apuestas')
        }
      } catch (error) {
        console.error('Error cargando apuestas:', error)
      } finally {
        setLoadingBets(false)
      }
    }
    loadBets()
  }, [])

  // Detector de teclas para escribir "bastian" (modo admin)
  useEffect(() => {
    if (isAdminMode) return

    const targetWord = 'bastian'
    let currentSequence = ''

    const handleKeyPress = (e: KeyboardEvent) => {
      // Solo detectar si no está escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key.toLowerCase()
      
      // Solo procesar letras
      if (key.length === 1 && /[a-z]/.test(key)) {
        // Agregar letra a la secuencia actual
        currentSequence += key
        
        // Mantener solo los últimos caracteres que podrían formar "bastian"
        if (currentSequence.length > targetWord.length) {
          currentSequence = currentSequence.slice(-targetWord.length)
        }

        // Verificar si coincide con "bastian"
        if (currentSequence === targetWord) {
          setIsAdminMode(true)
          currentSequence = ''
        } else if (!targetWord.startsWith(currentSequence)) {
          // Si no coincide, empezar de nuevo desde esta letra si es el inicio
          currentSequence = targetWord.startsWith(key) ? key : ''
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAdminMode])

  // Animaciones al cargar
  useEffect(() => {
    anime({
      targets: `.${styles.title}`,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
    })

    anime({
      targets: `.${styles.subtitle}`,
      opacity: [0, 1],
      delay: 200,
      duration: 800,
      easing: 'easeOutExpo',
    })
  }, [])

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const handleDateSelect = (day: number) => {
    if (!day) return
    
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    setSelectedDate(dateString)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowError(null)
    setShowSuccess(false)

    if (!name.trim()) {
      setShowError('Por favor ingresa tu nombre')
      return
    }

    if (!selectedDate) {
      setShowError('Por favor selecciona una fecha')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/bastian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          date: selectedDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setShowError(data.error || 'Error al guardar la apuesta')
        return
      }

      // Recargar apuestas desde el servidor
      const betsResponse = await fetch('/api/bastian')
      if (betsResponse.ok) {
        const updatedBets = await betsResponse.json()
        setBets(updatedBets)
      }

      setName('')
      setSelectedDate('')
      setShowSuccess(true)
      
      // Invitar a activar notificaciones después de hacer una apuesta
      if (notificationPermission !== 'granted') {
        setTimeout(() => {
          setShowNotificationPrompt(true)
        }, 1500)
      }
      
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error guardando apuesta:', error)
      setShowError('Error al guardar la apuesta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBet = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta apuesta?')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/bastian?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        setShowError(data.error || 'Error al eliminar la apuesta')
        return
      }

      // Recargar apuestas desde el servidor
      const betsResponse = await fetch('/api/bastian')
      if (betsResponse.ok) {
        const updatedBets = await betsResponse.json()
        setBets(updatedBets)
      }
    } catch (error) {
      console.error('Error eliminando apuesta:', error)
      setShowError('Error al eliminar la apuesta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Obtener fecha actual en zona horaria de Paraguay
  const getTodayInParaguay = () => {
    const now = new Date()
    const paraguayOffset = -4 * 60 // UTC-4 en minutos
    const localOffset = now.getTimezoneOffset() // offset local en minutos
    const paraguayTime = new Date(now.getTime() + (localOffset - paraguayOffset) * 60 * 1000)
    return paraguayTime
  }

  // Crear fecha desde string YYYY-MM-DD en zona horaria de Paraguay
  const createDateInParaguay = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    // Crear fecha en hora local (sin conversión UTC)
    return new Date(year, month - 1, day)
  }

  const formatDate = (dateString: string) => {
    // Parsear la fecha correctamente desde YYYY-MM-DD
    // IMPORTANTE: Usar constructor local para evitar problemas de UTC
    const [year, month, day] = dateString.split('-').map(Number)
    
    // Crear fecha en hora local (no UTC) para evitar desfases de zona horaria
    const date = new Date(year, month - 1, day, 12, 0, 0) // Usar mediodía para evitar problemas de DST
    
    // Formatear en español de Paraguay
    return date.toLocaleDateString('es-PY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }


  // Verificar si una fecha está seleccionada
  const isDateSelected = (day: number | null) => {
    if (!day || !selectedDate) return false
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return dateString === selectedDate
  }

  // Verificar si una fecha tiene apuestas
  const getBetsForDate = (day: number | null) => {
    if (!day) return 0
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return bets.filter(bet => bet.date === dateString).length
  }

  // Verificar si una fecha es hoy o en el pasado (en zona horaria de Paraguay)
  const isPastDate = (day: number | null) => {
    if (!day) return false
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const date = new Date(year, month, day)
    date.setHours(0, 0, 0, 0)
    
    const today = getTodayInParaguay()
    today.setHours(0, 0, 0, 0)
    
    // Comparar solo la parte de fecha
    return date < today
  }

  // Función para marcar que Bastian nació y mostrar notificación del navegador
  const handleBirthNotification = (e: React.FormEvent) => {
    e.preventDefault()
    setShowError(null)
    setShowSuccess(false)

    if (!birthDate) {
      setShowError('Por favor selecciona la fecha de nacimiento')
      return
    }

    try {
      // Crear mensaje para la notificación (usando hora local del dispositivo)
      // Crear fecha desde los valores seleccionados
      const [year, month, day] = birthDate.split('-').map(Number)
      let date = new Date(year, month - 1, day)
      
      // Si hay hora, agregarla
      if (birthTime) {
        const [hours, minutes] = birthTime.split(':').map(Number)
        date.setHours(hours, minutes, 0, 0)
      } else {
        date.setHours(12, 0, 0, 0) // Mediodía por defecto para evitar problemas de zona horaria
      }
      
      // Formatear usando la configuración local del navegador
      const formattedDate = date.toLocaleDateString(navigator.language || 'es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const formattedTime = birthTime ? date.toLocaleTimeString(navigator.language || 'es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }) : ''
      const timeInfo = formattedTime ? ` a las ${formattedTime}` : ''
      const weightInfo = birthWeight ? `\nPeso: ${birthWeight}` : ''
      const heightInfo = birthHeight ? `\nAltura: ${birthHeight}` : ''
      
      // Mostrar notificación del navegador
      showBrowserNotification('🎉 ¡Bastian ha nacido!', {
        body: `Fecha: ${formattedDate}${timeInfo}${weightInfo}${heightInfo}`,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'bastian-birth',
        requireInteraction: true,
        vibrate: [200, 100, 200],
      })
      
      setShowSuccess(true)
      setBirthDate('')
      setBirthTime('')
      setBirthWeight('')
      setBirthHeight('')
      setShowBirthForm(false)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error('Error mostrando notificación:', error)
      setShowError('Error al mostrar la notificación. Asegúrate de haber activado los permisos.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>

        <h1 className={styles.title}>Apuestas para Bastian</h1>
        <p className={styles.subtitle}>
          ¿Cuándo crees que nacerá Bastian? Deja tu apuesta
        </p>

        <div className={styles.mainContent}>
          {/* Formulario de apuesta */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Hacer una apuesta</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Tu nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              {/* Calendario */}
              <div className={styles.calendarWrapper}>
                <div className={styles.calendarHeader}>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className={styles.calendarNav}
                    aria-label="Mes anterior"
                  >
                    ←
                  </button>
                  <h3 className={styles.calendarMonth}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className={styles.calendarNav}
                    aria-label="Mes siguiente"
                  >
                    →
                  </button>
                </div>

                <div className={styles.calendar}>
                  <div className={styles.weekDays}>
                    {weekDays.map(day => (
                      <div key={day} className={styles.weekDay}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className={styles.daysGrid}>
                    {days.map((day, index) => {
                      const isSelected = isDateSelected(day)
                      const betsCount = getBetsForDate(day)
                      const isPast = isPastDate(day)
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateSelect(day!)}
                          disabled={!day || isPast}
                          className={`${styles.day} ${
                            isSelected ? styles.daySelected : ''
                          } ${!day ? styles.dayEmpty : ''} ${isPast ? styles.dayPast : ''} ${
                            betsCount > 0 ? styles.dayWithBets : ''
                          }`}
                          title={
                            day && betsCount > 0
                              ? `${betsCount} apuesta${betsCount > 1 ? 's' : ''}`
                              : undefined
                          }
                        >
                          {day}
                          {betsCount > 0 && (
                            <span className={styles.betIndicator}>{betsCount}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Fecha seleccionada */}
              {selectedDate && (
                <div className={styles.selectedDateDisplay}>
                  <span className={styles.selectedDateLabel}>Fecha seleccionada:</span>
                  <span className={styles.selectedDateValue}>
                    {formatDate(selectedDate)}
                  </span>
                </div>
              )}


              {showError && (
                <div className={styles.errorMessage}>{showError}</div>
              )}

              {showSuccess && (
                <div className={styles.successMessage}>
                  ¡Apuesta registrada exitosamente! 🎉
                </div>
              )}

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Enviar apuesta'}
              </button>
            </form>
          </div>

          {/* Lista de apuestas */}
          <div className={styles.betsSection}>
            <h2 className={styles.sectionTitle}>
              Apuestas ({bets.length})
            </h2>
            
            {loadingBets ? (
              <div className={styles.emptyState}>
                <p>Cargando apuestas...</p>
              </div>
            ) : bets.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Aún no hay apuestas. ¡Sé el primero en apostar!</p>
              </div>
            ) : (
              <div className={styles.betsList}>
                {bets.map((bet, index) => (
                  <div key={bet.id} className={styles.betCard}>
                    <div className={styles.betHeader}>
                      <span className={styles.betNumber}>#{index + 1}</span>
                      <span className={styles.betName}>{bet.name}</span>
                      {isAdminMode && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBet(bet.id)}
                          className={styles.deleteButton}
                          title="Eliminar apuesta"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className={styles.betDate}>
                      <span className={styles.betDateLabel}>Fecha:</span>
                      <span>{formatDate(bet.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Notificación de Nacimiento - Solo visible en modo admin */}
          {isAdminMode && (
            <div className={styles.birthSection}>
              <h2 className={styles.sectionTitle}>Notificación de Nacimiento</h2>
              
              {/* Botón para activar notificaciones del navegador */}
              {notificationPermission !== 'granted' && (
                <div className={styles.notificationSetup}>
                  <p className={styles.notificationText}>
                    Activa las notificaciones del navegador para recibir un aviso cuando nazca Bastian
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className={styles.enableNotificationsButton}
                  >
                    {notificationPermission === 'denied' ? '🔒 Notificaciones bloqueadas' : '🔔 Activar notificaciones'}
                  </button>
                  {notificationPermission === 'denied' && (
                    <p className={styles.helpText}>
                      Los permisos están bloqueados. Ve a la configuración de tu navegador para habilitarlos.
                    </p>
                  )}
                </div>
              )}

              {notificationPermission === 'granted' && (
                <div className={styles.notificationStatus}>
                  <span className={styles.statusIcon}>✅</span>
                  <span className={styles.statusText}>Notificaciones activadas</span>
                </div>
              )}

              {notificationPermission === 'granted' && (
                <button
                  onClick={testNotification}
                  className={styles.testButton}
                  title="Probar notificación"
                >
                  🧪 Probar notificación
                </button>
              )}

              {!showBirthForm && (
                <button
                  onClick={() => setShowBirthForm(true)}
                  className={styles.birthButton}
                >
                  👶 Marcar que Bastian nació
                </button>
              )}

            {showBirthForm && (
              <form onSubmit={handleBirthNotification} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="birthDate" className={styles.label}>
                    Fecha de nacimiento *
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={styles.input}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="birthTime" className={styles.label}>
                    Hora de nacimiento (opcional)
                  </label>
                  <input
                    type="time"
                    id="birthTime"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="birthWeight" className={styles.label}>
                    Peso (opcional, ej: 3.5 kg)
                  </label>
                  <input
                    type="text"
                    id="birthWeight"
                    value={birthWeight}
                    onChange={(e) => setBirthWeight(e.target.value)}
                    className={styles.input}
                    placeholder="Ej: 3.5 kg"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="birthHeight" className={styles.label}>
                    Altura (opcional, ej: 50 cm)
                  </label>
                  <input
                    type="text"
                    id="birthHeight"
                    value={birthHeight}
                    onChange={(e) => setBirthHeight(e.target.value)}
                    className={styles.input}
                    placeholder="Ej: 50 cm"
                  />
                </div>

                {showError && (
                  <div className={styles.errorMessage}>{showError}</div>
                )}

                {showSuccess && (
                  <div className={styles.successMessage}>
                    ¡Notificaciones enviadas exitosamente! 🎉
                  </div>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBirthForm(false)
                      setShowError(null)
                      setShowSuccess(false)
                    }}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                  >
                    Mostrar notificación
                  </button>
                </div>
              </form>
            )}
            
            <div className={styles.notificationInfo}>
              <p className={styles.infoText}>
                💡 Las notificaciones del navegador aparecerán automáticamente cuando marques que Bastian nació (si los permisos están activados).
              </p>
              {notificationPermission !== 'granted' && (
                <p className={styles.infoText}>
                  Recuerda activar las notificaciones arriba para recibir el aviso.
                </p>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Prompt para activar notificaciones después de hacer apuesta */}
      {showNotificationPrompt && notificationPermission !== 'granted' && (
        <div className={styles.notificationPromptOverlay} onClick={() => setShowNotificationPrompt(false)}>
          <div 
            className={styles.notificationPrompt}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.promptHeader}>
              <h3 className={styles.promptTitle}>🔔 Activa las notificaciones</h3>
              <button
                className={styles.promptClose}
                onClick={() => setShowNotificationPrompt(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.promptContent}>
              <p className={styles.promptText}>
                ¡Gracias por tu apuesta! 🎉
              </p>
              <p className={styles.promptText}>
                Activa las notificaciones para recibir un aviso cuando nazca Bastian.
              </p>
              <button
                onClick={() => {
                  requestNotificationPermission()
                  setShowNotificationPrompt(false)
                }}
                className={styles.promptButton}
              >
                Activar notificaciones
              </button>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                className={styles.promptCancel}
              >
                Más tarde
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

