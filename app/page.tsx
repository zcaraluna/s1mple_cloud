'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import Select from 'react-select'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const galaxyRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  
  const [showSnake, setShowSnake] = useState(false)
  const [showPong, setShowPong] = useState(false)
  const [showConverter, setShowConverter] = useState(false)
  const [selectedConverterType, setSelectedConverterType] = useState<string | null>(null)
  const sKeySequenceRef = useRef<number[]>([])
  const pKeySequenceRef = useRef<number[]>([])
  const cKeySequenceRef = useRef<number[]>([])
  

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
          
          // Animación de los enlaces sutiles
          if (linksRef.current) {
            setTimeout(() => {
              anime({
                targets: linksRef.current,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo',
              })
            }, 800)
          }
        }
      })
    }

  }, [])

  // Detector de tecla "S" presionada 3 veces (Snake)
  useEffect(() => {
    if (showSnake) return

    const RESET_TIME = 2000

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        const now = Date.now()
        sKeySequenceRef.current = sKeySequenceRef.current.filter(
          time => now - time < RESET_TIME
        )
        sKeySequenceRef.current.push(now)
        
        if (sKeySequenceRef.current.length >= 3) {
          setShowSnake(true)
          sKeySequenceRef.current = []
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showSnake])

  // Detector de tecla "P" presionada 3 veces (Pong)
  useEffect(() => {
    if (showPong) return

    const RESET_TIME = 2000

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') {
        const now = Date.now()
        pKeySequenceRef.current = pKeySequenceRef.current.filter(
          time => now - time < RESET_TIME
        )
        pKeySequenceRef.current.push(now)
        
        if (pKeySequenceRef.current.length >= 3) {
          setShowPong(true)
          pKeySequenceRef.current = []
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showPong])

  // Detector de tecla "C" presionada 3 veces (Currency Converter)
  useEffect(() => {
    if (showConverter) return

    const RESET_TIME = 2000

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        const now = Date.now()
        cKeySequenceRef.current = cKeySequenceRef.current.filter(
          time => now - time < RESET_TIME
        )
        cKeySequenceRef.current.push(now)
        
        if (cKeySequenceRef.current.length >= 3) {
          setShowConverter(true)
          cKeySequenceRef.current = []
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showConverter])

  // Prevenir scroll del body cuando hay modales abiertos
  useEffect(() => {
    const anyModalOpen = showSnake || showPong || showConverter
    if (anyModalOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      // Permitir scroll en elementos específicos (menús de react-select)
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showSnake, showPong, showConverter])


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
        <form 
          className={styles.googleSearch}
          action="https://www.google.com/search"
          method="get"
          target="_blank"
          onSubmit={(e) => {
            const form = e.currentTarget
            const input = form.querySelector('input[type="text"]') as HTMLInputElement
            if (!input?.value.trim()) {
              e.preventDefault()
            }
          }}
        >
          <div className={styles.searchWrapper}>
            <div className={styles.googleIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <input
              type="text"
              name="q"
              placeholder="Buscar en Google..."
              className={styles.searchInput}
              autoComplete="off"
            />
            <button type="submit" className={styles.searchButton} aria-label="Buscar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
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
        <div ref={linksRef} className={styles.subtleLinks}>
          <Link href="/ph" className={styles.subtleLink}>
            fotografías
          </Link>
          <span className={styles.linkSeparator}>·</span>
          <Link href="/bastian" className={styles.subtleLink}>
            bastian
          </Link>
        </div>
      </div>
      
      {showSnake && (
        <SnakeGame onClose={() => setShowSnake(false)} />
      )}
      
      {showPong && (
        <PongGame onClose={() => setShowPong(false)} />
      )}
      
      {showConverter && !selectedConverterType && (
        <ConverterMenu 
          onSelect={(type) => setSelectedConverterType(type)} 
          onClose={() => {
            setShowConverter(false)
            setSelectedConverterType(null)
          }} 
        />
      )}
      
      {showConverter && selectedConverterType && (
        <ConverterContainer 
          type={selectedConverterType}
          onClose={() => {
            setShowConverter(false)
            setSelectedConverterType(null)
          }}
          onBack={() => setSelectedConverterType(null)}
        />
      )}
      
      <button 
        className={styles.mobileConverterBtn}
        onClick={() => setShowConverter(true)}
        title="Conversores"
      >
        🧮
      </button>
    </main>
  )
}

// Componente del juego Snake
function SnakeGame({ onClose }: { onClose: () => void }) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right')
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<number | null>(null)

  const GRID_SIZE = 20
  const CELL_SIZE = 20

  const generateFood = (currentSnake: Array<{ x: number; y: number }>): { x: number; y: number } => {
    let newFood: { x: number; y: number }
    let attempts = 0
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      attempts++
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y) && attempts < 100)
    return newFood
  }

  // Inicializar comida al montar
  useEffect(() => {
    setFood(generateFood([{ x: 10, y: 10 }]))
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] }
        const currentDirection = direction

        switch (currentDirection) {
          case 'up':
            head.y -= 1
            break
          case 'down':
            head.y += 1
            break
          case 'left':
            head.x -= 1
            break
          case 'right':
            head.x += 1
            break
        }

        // Colisión con paredes
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          return prevSnake
        }

        // Colisión con el cuerpo
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          return prevSnake
        }

        // Verificar si come la comida
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 1)
          setFood(() => generateFood([head, ...prevSnake]))
          return [head, ...prevSnake] // La serpiente crece
        }

        // Mover la serpiente (eliminar la cola si no come)
        return [head, ...prevSnake].slice(0, -1)
      })
    }

    gameLoopRef.current = window.setInterval(moveSnake, 150)
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [direction, food, gameStarted, gameOver])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && e.key === ' ') {
        e.preventDefault()
        setGameStarted(true)
        return
      }

      if (gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (direction !== 'down') setDirection('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          if (direction !== 'up') setDirection('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (direction !== 'right') setDirection('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          if (direction !== 'left') setDirection('right')
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    gameRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [direction, gameStarted, gameOver, onClose])

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setDirection('right')
    setFood(generateFood(initialSnake))
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
  }

  return (
    <div className={styles.snakeOverlay} onClick={onClose}>
      <div 
        className={styles.snakeContainer} 
        onClick={(e) => e.stopPropagation()}
        ref={gameRef}
        tabIndex={0}
      >
        <div className={styles.snakeHeader}>
          <h2 className={styles.snakeTitle}>Snake</h2>
          <button className={styles.snakeClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.snakeScore}>
          Puntuación: {score}
        </div>

        <div className={styles.snakeGameArea}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const isSnake = snake.some(segment => segment.x === x && segment.y === y)
            const isFood = food.x === x && food.y === y
            const isHead = snake[0]?.x === x && snake[0]?.y === y

            return (
              <div
                key={index}
                className={`${styles.snakeCell} ${
                  isSnake ? (isHead ? styles.snakeHead : styles.snakeBody) : ''
                } ${isFood ? styles.snakeFood : ''}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            )
          })}
        </div>

        {!gameStarted && (
          <div className={styles.snakeModal}>
            <p className={styles.snakeModalText}>Presiona ESPACIO para empezar</p>
            <p className={styles.snakeInstructions}>Usa las flechas para moverte</p>
          </div>
        )}

        {gameOver && (
          <div className={styles.snakeModal}>
            <h3 className={styles.snakeModalTitle}>Game Over</h3>
            <p className={styles.snakeModalText}>Puntuación final: {score}</p>
            <div className={styles.snakeModalButtons}>
              <button className={styles.snakeModalBtn} onClick={resetGame}>
                Jugar de nuevo
              </button>
              <button className={styles.snakeModalBtn} onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente del juego Pong
function PongGame({ onClose }: { onClose: () => void }) {
  const [player1Y, setPlayer1Y] = useState(50)
  const [player2Y, setPlayer2Y] = useState(50)
  const [ballX, setBallX] = useState(50)
  const [ballY, setBallY] = useState(50)
  const [ballSpeedX, setBallSpeedX] = useState(0.5)
  const [ballSpeedY, setBallSpeedY] = useState(0.3)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [gameMode, setGameMode] = useState<1 | 2 | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [winner, setWinner] = useState<1 | 2 | null>(null)
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const gameRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  const PADDLE_HEIGHT = 15
  const PADDLE_WIDTH = 2
  const BALL_SIZE = 2
  const GAME_WIDTH = 100
  const GAME_HEIGHT = 100
  const PADDLE_SPEED = 0.8
  const INITIAL_BALL_SPEED = 0.5

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (!gameStarted && gameMode !== null) {
          setGameStarted(true)
          // Iniciar la pelota en dirección aleatoria
          const randomAngle = (Math.random() - 0.5) * Math.PI / 3
          setBallSpeedX(Math.cos(randomAngle) * INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1))
          setBallSpeedY(Math.sin(randomAngle) * INITIAL_BALL_SPEED)
        } else if (gameStarted && !winner) {
          setGamePaused(prev => !prev)
        }
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      setKeys(prev => new Set(prev).add(e.key.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key.toLowerCase())
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    gameRef.current?.focus()

      return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameStarted, gameMode, winner, onClose])

  useEffect(() => {
    if (!gameStarted || gamePaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const gameLoop = () => {
      // Mover jugador 1 (W/S)
      setPlayer1Y(prev => {
        let newY = prev
        if (keys.has('w') && newY > PADDLE_HEIGHT / 2) {
          newY = Math.max(PADDLE_HEIGHT / 2, newY - PADDLE_SPEED)
        }
        if (keys.has('s') && newY < GAME_HEIGHT - PADDLE_HEIGHT / 2) {
          newY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT / 2, newY + PADDLE_SPEED)
        }
        return newY
      })

      // Mover jugador 2 (ArrowUp/ArrowDown o IA simple)
      setPlayer2Y(prev => {
        let newY = prev
        if (gameMode === 2) {
          // Modo 2 jugadores: controles con flechas
          if (keys.has('arrowup') && newY > PADDLE_HEIGHT / 2) {
            newY = Math.max(PADDLE_HEIGHT / 2, newY - PADDLE_SPEED)
          }
          if (keys.has('arrowdown') && newY < GAME_HEIGHT - PADDLE_HEIGHT / 2) {
            newY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT / 2, newY + PADDLE_SPEED)
          }
        } else {
          // Modo 1 jugador: IA que sigue la pelota
          const diff = ballY - newY
          if (Math.abs(diff) > 1) {
            newY += Math.sign(diff) * PADDLE_SPEED * 0.6
            newY = Math.max(PADDLE_HEIGHT / 2, Math.min(GAME_HEIGHT - PADDLE_HEIGHT / 2, newY))
          }
        }
        
        return newY
      })

      // Mover pelota
      setBallX(prevX => {
        let newX = prevX + ballSpeedX
        setBallY(prevY => {
          let newY = prevY + ballSpeedY
          let newSpeedX = ballSpeedX
          let newSpeedY = ballSpeedY

          // Rebote en top y bottom
          if (newY <= BALL_SIZE / 2 || newY >= GAME_HEIGHT - BALL_SIZE / 2) {
            newSpeedY = -newSpeedY
            newY = newY <= BALL_SIZE / 2 ? BALL_SIZE / 2 : GAME_HEIGHT - BALL_SIZE / 2
          }

          // Rebote en paleta izquierda (jugador 1)
          if (newX <= PADDLE_WIDTH + BALL_SIZE / 2 && 
              newY >= player1Y - PADDLE_HEIGHT / 2 && 
              newY <= player1Y + PADDLE_HEIGHT / 2 &&
              newSpeedX < 0) {
            newSpeedX = -newSpeedX
            // Aumentar velocidad ligeramente
            newSpeedX *= 1.05
            newSpeedY *= 1.05
            newX = PADDLE_WIDTH + BALL_SIZE / 2
          }

          // Rebote en paleta derecha (jugador 2)
          if (newX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2 && 
              newY >= player2Y - PADDLE_HEIGHT / 2 && 
              newY <= player2Y + PADDLE_HEIGHT / 2 &&
              newSpeedX > 0) {
            newSpeedX = -newSpeedX
            // Aumentar velocidad ligeramente
            newSpeedX *= 1.05
            newSpeedY *= 1.05
            newX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE / 2
          }

          // Punto para jugador 2 (pelota sale por la izquierda)
          if (newX < 0) {
            setPlayer2Score(prev => {
              const newScore = prev + 1
              if (newScore >= 10) {
                setWinner(2)
                setGameStarted(false)
              }
              return newScore
            })
            newX = 50
            newY = 50
            const randomAngle = (Math.random() - 0.5) * Math.PI / 3
            newSpeedX = Math.cos(randomAngle) * INITIAL_BALL_SPEED
            newSpeedY = Math.sin(randomAngle) * INITIAL_BALL_SPEED
          }

          // Punto para jugador 1 (pelota sale por la derecha)
          if (newX > GAME_WIDTH) {
            setPlayer1Score(prev => {
              const newScore = prev + 1
              if (newScore >= 10) {
                setWinner(1)
                setGameStarted(false)
              }
              return newScore
            })
            newX = 50
            newY = 50
            const randomAngle = (Math.random() - 0.5) * Math.PI / 3
            newSpeedX = -Math.cos(randomAngle) * INITIAL_BALL_SPEED
            newSpeedY = Math.sin(randomAngle) * INITIAL_BALL_SPEED
          }

          setBallSpeedX(newSpeedX)
          setBallSpeedY(newSpeedY)
          return newY
        })
        return newX
      })

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameStarted, gamePaused, keys, ballSpeedX, ballSpeedY, player1Y, player2Y, gameMode])

  const resetGame = () => {
    setBallX(50)
    setBallY(50)
    setBallSpeedX(0)
    setBallSpeedY(0)
    setPlayer1Y(50)
    setPlayer2Y(50)
    setPlayer1Score(0)
    setPlayer2Score(0)
    setGameStarted(false)
    setGamePaused(false)
    setWinner(null)
    setGameMode(null)
  }

  return (
    <div className={styles.pongOverlay} onClick={onClose}>
      <div 
        className={styles.pongContainer} 
        onClick={(e) => e.stopPropagation()}
        ref={gameRef}
        tabIndex={0}
      >
        <div className={styles.pongHeader}>
          <h2 className={styles.pongTitle}>Pong</h2>
          <button className={styles.pongClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.pongScore}>
          <div className={styles.pongScorePlayer}>
            <span className={styles.pongScoreLabel}>Jugador 1</span>
            <span className={styles.pongScoreValue}>{player1Score}</span>
          </div>
          <div className={styles.pongScoreDivider}>-</div>
          <div className={styles.pongScorePlayer}>
            <span className={styles.pongScoreLabel}>{gameMode === 1 ? 'IA' : 'Jugador 2'}</span>
            <span className={styles.pongScoreValue}>{player2Score}</span>
          </div>
        </div>

        <div className={styles.pongGameArea}>
          {/* Paleta izquierda (Jugador 1) */}
          <div 
            className={styles.pongPaddle}
            style={{
              left: '1%',
              top: `${player1Y - PADDLE_HEIGHT / 2}%`,
              width: `${PADDLE_WIDTH}%`,
              height: `${PADDLE_HEIGHT}%`,
            }}
          />

          {/* Pelota */}
          <div 
            className={styles.pongBall}
            style={{
              left: `${ballX - BALL_SIZE / 2}%`,
              top: `${ballY - BALL_SIZE / 2}%`,
              width: `${BALL_SIZE}%`,
              height: `${BALL_SIZE}%`,
            }}
          />

          {/* Paleta derecha (Jugador 2) */}
          <div 
            className={styles.pongPaddle}
            style={{
              right: '1%',
              top: `${player2Y - PADDLE_HEIGHT / 2}%`,
              width: `${PADDLE_WIDTH}%`,
              height: `${PADDLE_HEIGHT}%`,
            }}
          />

          {/* Línea central */}
          <div className={styles.pongCenterLine} />
        </div>

        {gameMode === null && (
          <div className={styles.pongModal}>
            <p className={styles.pongModalText}>Selecciona el modo de juego</p>
            <div className={styles.pongModeButtons}>
              <button 
                className={styles.pongModeBtn}
                onClick={() => setGameMode(1)}
              >
                1 Jugador
              </button>
              <button 
                className={styles.pongModeBtn}
                onClick={() => setGameMode(2)}
              >
                2 Jugadores
              </button>
            </div>
          </div>
        )}

        {gameMode !== null && !gameStarted && !winner && (
          <div className={styles.pongModal}>
            <p className={styles.pongModalText}>Presiona ESPACIO para empezar</p>
            <p className={styles.pongInstructions}>
              Jugador 1: W/S {gameMode === 2 && '| Jugador 2: ↑/↓'}
            </p>
            <p className={styles.pongInstructions}>
              Primero en llegar a 10 gana
            </p>
          </div>
        )}

        {gamePaused && !winner && (
          <div className={styles.pongModal}>
            <p className={styles.pongModalText}>Pausa</p>
            <p className={styles.pongInstructions}>Presiona ESPACIO para continuar</p>
          </div>
        )}

        {winner && (
          <div className={styles.pongModal}>
            <h3 className={styles.pongModalTitle}>
              ¡{winner === 1 ? 'Jugador 1' : (gameMode === 1 ? 'IA' : 'Jugador 2')} gana!
            </h3>
            <p className={styles.pongModalText}>
              Puntuación final: {player1Score} - {player2Score}
            </p>
            <div className={styles.pongModalButtons}>
              <button className={styles.pongModalBtn} onClick={resetGame}>
                Jugar de nuevo
              </button>
              <button className={styles.pongModalBtn} onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        <div className={styles.pongControls}>
          <button className={styles.pongBtn} onClick={resetGame}>
            Reiniciar
          </button>
          <button className={styles.pongBtn} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de menú de selección de conversores
function ConverterMenu({ onSelect, onClose }: { onSelect: (type: string) => void, onClose: () => void }) {
  const converterTypes = [
    { id: 'length', name: 'Longitudes' },
    { id: 'volume', name: 'Volumen' },
    { id: 'speed', name: 'Velocidad' },
    { id: 'mass', name: 'Masa' },
    { id: 'currency', name: 'Monedas' },
    { id: 'time', name: 'Horario' },
  ]

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div className={styles.converterOverlay} onClick={onClose}>
      <div 
        className={styles.converterMenuContainer} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.converterMenuHeader}>
          <h2 className={styles.converterMenuTitle}>Conversores</h2>
          <button className={styles.converterMenuClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.converterMenuGrid}>
          {converterTypes.map((converter) => (
            <button
              key={converter.id}
              className={styles.converterMenuCard}
              onClick={() => onSelect(converter.id)}
            >
              <span className={styles.converterMenuName}>{converter.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente contenedor que muestra el conversor seleccionado
function ConverterContainer({ type, onClose, onBack }: { type: string, onClose: () => void, onBack?: () => void }) {
  const handleBack = () => {
    onClose()
  }

  switch (type) {
    case 'currency':
      return <CurrencyConverter onClose={onClose} onBack={onBack} />
    case 'length':
      return <LengthConverter onClose={onClose} onBack={onBack} />
    case 'volume':
      return <VolumeConverter onClose={onClose} onBack={onBack} />
    case 'speed':
      return <SpeedConverter onClose={onClose} onBack={onBack} />
    case 'mass':
      return <MassConverter onClose={onClose} onBack={onBack} />
    case 'time':
      return <TimeConverter onClose={onClose} onBack={onBack} />
    default:
      return (
        <div className={styles.converterOverlay} onClick={handleBack}>
          <div 
            className={styles.converterContainer} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.converterHeader}>
              <h2 className={styles.converterTitle}>Conversor no implementado</h2>
              <button className={styles.converterClose} onClick={handleBack}>×</button>
            </div>
            <div className={styles.converterContent}>
              <p>El conversor {type} está en desarrollo.</p>
            </div>
          </div>
        </div>
      )
  }
}

// Componente del conversor de monedas
function CurrencyConverter({ onClose, onBack }: { onClose: () => void, onBack?: () => void }) {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [menuOpen, setMenuOpen] = useState(false)

  const currencies = [
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
    { code: 'JPY', name: 'Yen Japonés', symbol: '¥' },
    { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
    { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
    { code: 'PYG', name: 'Guaraní Paraguayo', symbol: '₲' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
    { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
    { code: 'CNY', name: 'Yuan Chino', symbol: '¥' },
    { code: 'KRW', name: 'Won Surcoreano', symbol: '₩' },
    { code: 'INR', name: 'Rupia India', symbol: '₹' },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
    { code: 'CAD', name: 'Dólar Canadiense', symbol: 'C$' },
    { code: 'CHF', name: 'Franco Suizo', symbol: 'Fr' },
    { code: 'NZD', name: 'Dólar Neozelandés', symbol: 'NZ$' },
    { code: 'SEK', name: 'Corona Sueca', symbol: 'kr' },
    { code: 'NOK', name: 'Corona Noruega', symbol: 'kr' },
    { code: 'DKK', name: 'Corona Danesa', symbol: 'kr' },
  ]

  // Cargar tasas de cambio al montar
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      setError(null)
      try {
        // Probar exchangerate-api.com primero
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        if (data.rates) {
          // Añadir USD con tasa 1 ya que es la moneda base
          setRates({ ...data.rates, USD: 1 })
        } else {
          setError('No se pudieron cargar las tasas de cambio')
        }
      } catch (err) {
        console.error('Error cargando tasas:', err)
        // Si falla, no mostramos error inmediatamente, el usuario puede seguir
        setError('Advertencia: No se pudieron cargar tasas actualizadas, pero puedes usar el conversor igualmente')
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
  }, [])

  const handleSwap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    if (result !== null) {
      const swapResult = parseFloat(amount.replace(/\./g, '').replace(/,/g, '.'))
      // Formatear el resultado con puntos para miles y coma para decimales
      const parts = result.toFixed(2).split('.')
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      const formattedResult = `${integerPart},${parts[1]}`
      setAmount(formattedResult)
      setResult(swapResult)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Permitir scroll en menús cuando están abiertos
  useEffect(() => {
    if (menuOpen) {
      // Permitir scroll en los elementos del menú de react-select
      const handleMenuScroll = () => {
        const menuElements = document.querySelectorAll('[id*="react-select"]')
        menuElements.forEach((element) => {
          const menuList = element.querySelector('[class*="menuList"]') || 
                          element.querySelector('[class*="MenuList"]')
          if (menuList) {
            const menuListEl = menuList as HTMLElement
            menuListEl.style.overflowY = 'auto'
            menuListEl.style.maxHeight = '300px'
            ;(menuListEl.style as any).WebkitOverflowScrolling = 'touch'
          }
        })
      }
      
      // Ejecutar inmediatamente y después de un pequeño delay para asegurar que el DOM está actualizado
      handleMenuScroll()
      const timeout = setTimeout(handleMenuScroll, 100)
      
      return () => clearTimeout(timeout)
    }
  }, [menuOpen])

  // Convertir automáticamente cuando cambia el monto o las monedas
  useEffect(() => {
    if (!amount || !rates[fromCurrency] || !rates[toCurrency]) {
      return
    }

    const normalizedAmount = amount.replace(/\./g, '').replace(/,/g, '.')
    const numericAmount = parseFloat(normalizedAmount)
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor ingresa un monto válido')
      setResult(null)
      return
    }

    setError(null)
    const fromRate = rates[fromCurrency]
    const toRate = rates[toCurrency]
    
    // Convertir a USD primero, luego a la moneda destino
    const inUSD = numericAmount / fromRate
    const convertedAmount = inUSD * toRate
    setResult(convertedAmount)
  }, [amount, fromCurrency, toCurrency, rates])

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Preparar opciones para react-select
  const currencyOptions = currencies.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`
  }))

  const fromOption = currencyOptions.find(opt => opt.value === fromCurrency)
  const toOption = currencyOptions.find(opt => opt.value === toCurrency)

  // Estilos personalizados para react-select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'rgba(160, 160, 160, 0.05)',
      borderColor: state.isFocused ? '#a0a0a0' : 'rgba(160, 160, 160, 0.3)',
      '&:hover': {
        borderColor: 'rgba(160, 160, 160, 0.5)'
      },
      boxShadow: state.isFocused ? '0 0 0 1px #a0a0a0' : 'none',
      cursor: 'pointer'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(20, 20, 20, 0.98)',
      border: '1px solid rgba(160, 160, 160, 0.3)',
      zIndex: 10000,
      maxHeight: '300px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth'
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 10000
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? 'rgba(160, 160, 160, 0.15)' 
        : state.isSelected 
        ? 'rgba(160, 160, 160, 0.25)'
        : 'transparent',
      color: '#a0a0a0',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(160, 160, 160, 0.25)'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#a0a0a0'
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#a0a0a0'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#888'
    })
  }

  return (
    <div className={styles.converterOverlay} onClick={onClose}>
      <div 
        className={styles.converterContainer} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.converterHeader}>
          {onBack && (
            <button className={styles.converterBack} onClick={onBack} title="Volver al menú">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <h2 className={styles.converterTitle}>Conversor de Monedas</h2>
          <button className={styles.converterClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.converterContent}>
          <div className={styles.converterInputGroup}>
            <Select
              value={fromOption}
              onChange={(option) => option && setFromCurrency(option.value)}
              options={currencyOptions}
              styles={selectStyles}
              isSearchable
              placeholder="De..."
              className={styles.converterSelectWrapper}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
              menuShouldScrollIntoView={true}
            />
          </div>

          <button 
            className={styles.converterSwapBtn}
            onClick={handleSwap}
            title="Intercambiar monedas"
          >
            ⇄
          </button>

          <div className={styles.converterInputGroup}>
            <Select
              value={toOption}
              onChange={(option) => option && setToCurrency(option.value)}
              options={currencyOptions}
              styles={selectStyles}
              isSearchable
              placeholder="A..."
              className={styles.converterSelectWrapper}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
              menuShouldScrollIntoView={true}
            />
          </div>

          <div className={styles.converterInputGroup}>
            <input
              type="text"
              className={styles.converterInput}
              value={amount}
              onChange={(e) => {
                let value = e.target.value
                // Remover todos los puntos para el cálculo
                const cleanValue = value.replace(/\./g, '')
                // Permitir solo números y comas
                if (/^[\d,]*$/.test(cleanValue) || cleanValue === '') {
                  // Formatear con puntos cada 3 dígitos
                  if (cleanValue) {
                    const parts = cleanValue.split(',')
                    const integerPart = parts[0]
                    const decimalPart = parts[1] || ''
                    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    setAmount(decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger)
                  } else {
                    setAmount('')
                  }
                  setError(null)
                }
              }}
              placeholder="Monto..."
            />
          </div>

          {loading && (
            <div className={styles.converterLoading}>
              Cargando tasas de cambio...
            </div>
          )}

          {error && (
            <div className={styles.converterError}>
              {error}
            </div>
          )}

          {result !== null && !error && (
            <div className={styles.converterResult}>
              <span className={styles.converterResultLabel}>Resultado:</span>
              <span className={styles.converterResultValue}>
                {formatNumber(result)} {toCurrency}
              </span>
            </div>
          )}
        </div>

        <div className={styles.converterInfo}>
          <p className={styles.converterInfoText}>
            Tasas de cambio actualizadas desde exchangerate-api.com
          </p>
        </div>
      </div>
    </div>
  )
}

// Función helper para crear conversores genéricos
function createGenericConverter(
  title: string,
  units: Array<{ code: string; name: string; factor: number }>,
  defaultFrom: string,
  defaultTo: string,
  placeholder: string = 'Cantidad...'
) {
  return function Converter({ onClose, onBack }: { onClose: () => void, onBack?: () => void }) {
    const [amount, setAmount] = useState('')
    const [fromUnit, setFromUnit] = useState(defaultFrom)
    const [toUnit, setToUnit] = useState(defaultTo)
    const [result, setResult] = useState<number | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
      if (!amount) {
        setResult(null)
        return
      }

      const normalizedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
      
      if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
        setResult(null)
        return
      }

      const fromUnitData = units.find(u => u.code === fromUnit)
      const toUnitData = units.find(u => u.code === toUnit)
      
      if (!fromUnitData || !toUnitData) return
      
      const inBaseUnit = normalizedAmount * fromUnitData.factor
      const converted = inBaseUnit / toUnitData.factor
      setResult(converted)
    }, [amount, fromUnit, toUnit])

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    // Permitir scroll en menús cuando están abiertos
    useEffect(() => {
      if (menuOpen) {
        const handleMenuScroll = () => {
          const menuElements = document.querySelectorAll('[id*="react-select"]')
          menuElements.forEach((element) => {
            const menuList = element.querySelector('[class*="menuList"]') || 
                            element.querySelector('[class*="MenuList"]')
            if (menuList) {
              const menuListEl = menuList as HTMLElement
              menuListEl.style.overflowY = 'auto'
              menuListEl.style.maxHeight = '300px'
              ;(menuListEl.style as any).WebkitOverflowScrolling = 'touch'
            }
          })
        }
        handleMenuScroll()
        const timeout = setTimeout(handleMenuScroll, 100)
        return () => clearTimeout(timeout)
      }
    }, [menuOpen])

    const formatNumber = (num: number) => {
      return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
    }

    const unitOptions = units.map(unit => ({
      value: unit.code,
      label: `${unit.code} - ${unit.name}`
    }))

    const fromOption = unitOptions.find(opt => opt.value === fromUnit)
    const toOption = unitOptions.find(opt => opt.value === toUnit)

    const selectStyles = {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: 'rgba(160, 160, 160, 0.05)',
        borderColor: state.isFocused ? '#a0a0a0' : 'rgba(160, 160, 160, 0.3)',
        '&:hover': { borderColor: 'rgba(160, 160, 160, 0.5)' },
        boxShadow: state.isFocused ? '0 0 0 1px #a0a0a0' : 'none',
        cursor: 'pointer'
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'rgba(20, 20, 20, 0.98)',
        border: '1px solid rgba(160, 160, 160, 0.3)',
        zIndex: 10000,
        maxHeight: '300px'
      }),
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: '300px',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }),
      menuPortal: (provided: any) => ({
        ...provided,
        zIndex: 10000
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'rgba(160, 160, 160, 0.15)' : state.isSelected ? 'rgba(160, 160, 160, 0.25)' : 'transparent',
        color: '#a0a0a0',
        cursor: 'pointer',
        '&:active': { backgroundColor: 'rgba(160, 160, 160, 0.25)' }
      }),
      singleValue: (provided: any) => ({ ...provided, color: '#a0a0a0' }),
      input: (provided: any) => ({ ...provided, color: '#a0a0a0' }),
      placeholder: (provided: any) => ({ ...provided, color: '#888' })
    }

    const handleSwap = () => {
      const temp = fromUnit
      setFromUnit(toUnit)
      setToUnit(temp)
      if (result !== null && amount) {
        const swapResult = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
        const parts = result.toFixed(2).split('.')
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        const formattedResult = `${integerPart},${parts[1]}`
        setAmount(formattedResult)
        setResult(swapResult)
      }
    }

    return (
      <div className={styles.converterOverlay} onClick={onClose}>
        <div className={styles.converterContainer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.converterHeader}>
            {onBack && (
              <button className={styles.converterBack} onClick={onBack} title="Volver al menú">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
            )}
            <h2 className={styles.converterTitle}>{title}</h2>
            <button className={styles.converterClose} onClick={onClose}>×</button>
          </div>

          <div className={styles.converterContent}>
            <div className={styles.converterInputGroup}>
              <Select value={fromOption} onChange={(option) => option && setFromUnit(option.value)} options={unitOptions} styles={selectStyles} isSearchable placeholder="De..." className={styles.converterSelectWrapper} menuPortalTarget={document.body} menuPosition="fixed" onMenuOpen={() => setMenuOpen(true)} onMenuClose={() => setMenuOpen(false)} menuShouldScrollIntoView={true} />
            </div>

            <button className={styles.converterSwapBtn} onClick={handleSwap} title="Intercambiar unidades">⇄</button>

            <div className={styles.converterInputGroup}>
              <Select value={toOption} onChange={(option) => option && setToUnit(option.value)} options={unitOptions} styles={selectStyles} isSearchable placeholder="A..." className={styles.converterSelectWrapper} menuPortalTarget={document.body} menuPosition="fixed" onMenuOpen={() => setMenuOpen(true)} onMenuClose={() => setMenuOpen(false)} menuShouldScrollIntoView={true} />
            </div>

            <div className={styles.converterInputGroup}>
              <input type="text" className={styles.converterInput} value={amount} onChange={(e) => {
                let value = e.target.value
                const cleanValue = value.replace(/\./g, '')
                if (/^[\d,]*$/.test(cleanValue) || cleanValue === '') {
                  if (cleanValue) {
                    const parts = cleanValue.split(',')
                    const integerPart = parts[0]
                    const decimalPart = parts[1] || ''
                    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    setAmount(decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger)
                  } else {
                    setAmount('')
                  }
                }
              }} placeholder={placeholder} />
            </div>

            {result !== null && (
              <div className={styles.converterResult}>
                <span className={styles.converterResultLabel}>Resultado:</span>
                <span className={styles.converterResultValue}>{formatNumber(result)} {toUnit}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

// Conversor de Longitudes
const LengthConverter = createGenericConverter(
  'Conversor de Longitudes',
  [
    { code: 'mm', name: 'Milímetro', factor: 0.001 },
    { code: 'cm', name: 'Centímetro', factor: 0.01 },
    { code: 'm', name: 'Metro', factor: 1 },
    { code: 'km', name: 'Kilómetro', factor: 1000 },
    { code: 'in', name: 'Pulgada', factor: 0.0254 },
    { code: 'ft', name: 'Pie', factor: 0.3048 },
    { code: 'yd', name: 'Yarda', factor: 0.9144 },
    { code: 'mi', name: 'Milla', factor: 1609.34 },
  ],
  'm',
  'km'
)

// Conversor de Volumen
const VolumeConverter = createGenericConverter(
  'Conversor de Volumen',
  [
    { code: 'ml', name: 'Mililitro', factor: 0.001 },
    { code: 'l', name: 'Litro', factor: 1 },
    { code: 'm3', name: 'Metro cúbico', factor: 1000 },
    { code: 'fl oz', name: 'Onza líquida', factor: 0.0295735 },
    { code: 'cup', name: 'Taza', factor: 0.236588 },
    { code: 'pt', name: 'Pinta', factor: 0.473176 },
    { code: 'qt', name: 'Cuarto', factor: 0.946353 },
    { code: 'gal', name: 'Galón', factor: 3.78541 },
  ],
  'l',
  'ml'
)

// Conversor de Velocidad
const SpeedConverter = createGenericConverter(
  'Conversor de Velocidad',
  [
    { code: 'm/s', name: 'Metro por segundo', factor: 1 },
    { code: 'km/h', name: 'Kilómetro por hora', factor: 0.277778 },
    { code: 'mph', name: 'Milla por hora', factor: 0.44704 },
    { code: 'knot', name: 'Nudo', factor: 0.514444 },
    { code: 'ft/s', name: 'Pie por segundo', factor: 0.3048 },
    { code: 'in/s', name: 'Pulgada por segundo', factor: 0.0254 },
  ],
  'km/h',
  'mph'
)

// Conversor de Masa
const MassConverter = createGenericConverter(
  'Conversor de Masa',
  [
    { code: 'mg', name: 'Miligramo', factor: 0.000001 },
    { code: 'g', name: 'Gramo', factor: 0.001 },
    { code: 'kg', name: 'Kilogramo', factor: 1 },
    { code: 't', name: 'Tonelada', factor: 1000 },
    { code: 'oz', name: 'Onza', factor: 0.0283495 },
    { code: 'lb', name: 'Libra', factor: 0.453592 },
    { code: 'st', name: 'Stone', factor: 6.35029 },
  ],
  'kg',
  'g'
)

// Conversor de Horario
function TimeConverter({ onClose, onBack }: { onClose: () => void, onBack?: () => void }) {
  const [time, setTime] = useState('')
  const [fromCity, setFromCity] = useState('PY_ASU')
  const [toCity, setToCity] = useState('KR_SEO')
  const [result, setResult] = useState<{ hours: number; minutes: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const cities = [
    { code: 'AR_BAI', name: 'Buenos Aires, Argentina', offset: -3 },
    { code: 'BO_LAP', name: 'La Paz, Bolivia', offset: -4 },
    { code: 'BR_BRA', name: 'Brasilia, Brasil', offset: -3 },
    { code: 'PY_ASU', name: 'Asunción, Paraguay', offset: -4 },
    { code: 'UY_MON', name: 'Montevideo, Uruguay', offset: -3 },
    { code: 'CL_SAN', name: 'Santiago, Chile', offset: -3 },
    { code: 'CO_BOG', name: 'Bogotá, Colombia', offset: -5 },
    { code: 'MX_MEX', name: 'Ciudad de México, México', offset: -6 },
    { code: 'US_NYC', name: 'Nueva York, EE.UU.', offset: -5 },
    { code: 'US_LAX', name: 'Los Ángeles, EE.UU.', offset: -8 },
    { code: 'ES_MAD', name: 'Madrid, España', offset: 1 },
    { code: 'FR_PAR', name: 'París, Francia', offset: 1 },
    { code: 'GB_LON', name: 'Londres, Reino Unido', offset: 0 },
    { code: 'DE_BER', name: 'Berlín, Alemania', offset: 1 },
    { code: 'IT_ROM', name: 'Roma, Italia', offset: 1 },
    { code: 'RU_MOS', name: 'Moscú, Rusia', offset: 3 },
    { code: 'CN_BEI', name: 'Beijing, China', offset: 8 },
    { code: 'JP_TOK', name: 'Tokio, Japón', offset: 9 },
    { code: 'KR_SEO', name: 'Seúl, Corea del Sur', offset: 9 },
    { code: 'AU_SYD', name: 'Sídney, Australia', offset: 10 },
    { code: 'NZ_AUC', name: 'Auckland, Nueva Zelanda', offset: 12 },
    { code: 'ZA_CAP', name: 'Ciudad del Cabo, Sudáfrica', offset: 2 },
    { code: 'EG_CAI', name: 'El Cairo, Egipto', offset: 2 },
    { code: 'IN_DEL', name: 'Delhi, India', offset: 5.5 },
    { code: 'TH_BAN', name: 'Bangkok, Tailandia', offset: 7 },
    { code: 'SG_SIN', name: 'Singapur', offset: 8 },
  ]

  useEffect(() => {
    if (!time) {
      setResult(null)
      return
    }

    const timeMatch = time.match(/^(\d{1,2}):(\d{2})$/)
    if (!timeMatch) {
      setResult(null)
      return
    }

    const hours = parseInt(timeMatch[1])
    const minutes = parseInt(timeMatch[2])
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setResult(null)
      return
    }

    const fromCityData = cities.find(c => c.code === fromCity)
    const toCityData = cities.find(c => c.code === toCity)
    
    if (!fromCityData || !toCityData) return
    
    const timeDifference = toCityData.offset - fromCityData.offset
    const totalMinutes = hours * 60 + minutes
    let newTotalMinutes = totalMinutes + timeDifference * 60
    
    while (newTotalMinutes < 0) {
      newTotalMinutes += 24 * 60
    }
    while (newTotalMinutes >= 24 * 60) {
      newTotalMinutes -= 24 * 60
    }
    
    const newHours = Math.floor(newTotalMinutes / 60)
    const newMinutes = Math.floor(newTotalMinutes % 60)
    
    setResult({ hours: newHours, minutes: newMinutes })
  }, [time, fromCity, toCity])

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Permitir scroll en menús cuando están abiertos
  useEffect(() => {
    if (menuOpen) {
      const handleMenuScroll = () => {
        const menuElements = document.querySelectorAll('[id*="react-select"]')
        menuElements.forEach((element) => {
          const menuList = element.querySelector('[class*="menuList"]') || 
                          element.querySelector('[class*="MenuList"]')
          if (menuList) {
            const menuListEl = menuList as HTMLElement
            menuListEl.style.overflowY = 'auto'
            menuListEl.style.maxHeight = '300px'
            ;(menuListEl.style as any).WebkitOverflowScrolling = 'touch'
          }
        })
      }
      handleMenuScroll()
      const timeout = setTimeout(handleMenuScroll, 100)
      return () => clearTimeout(timeout)
    }
  }, [menuOpen])

  const cityOptions = cities.map(city => ({
    value: city.code,
    label: city.name
  }))

  const fromOption = cityOptions.find(opt => opt.value === fromCity)
  const toOption = cityOptions.find(opt => opt.value === toCity)

  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'rgba(160, 160, 160, 0.05)',
      borderColor: state.isFocused ? '#a0a0a0' : 'rgba(160, 160, 160, 0.3)',
      '&:hover': { borderColor: 'rgba(160, 160, 160, 0.5)' },
      boxShadow: state.isFocused ? '0 0 0 1px #a0a0a0' : 'none',
      cursor: 'pointer'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(20, 20, 20, 0.98)',
      border: '1px solid rgba(160, 160, 160, 0.3)',
      zIndex: 10000,
      maxHeight: '300px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth'
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 10000
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'rgba(160, 160, 160, 0.15)' : state.isSelected ? 'rgba(160, 160, 160, 0.25)' : 'transparent',
      color: '#a0a0a0',
      cursor: 'pointer',
      '&:active': { backgroundColor: 'rgba(160, 160, 160, 0.25)' }
    }),
    singleValue: (provided: any) => ({ ...provided, color: '#a0a0a0' }),
    input: (provided: any) => ({ ...provided, color: '#a0a0a0' }),
    placeholder: (provided: any) => ({ ...provided, color: '#888' })
  }

  const handleSwap = () => {
    const temp = fromCity
    setFromCity(toCity)
    setToCity(temp)
    if (result !== null) {
      const formattedResult = `${result.hours.toString().padStart(2, '0')}:${result.minutes.toString().padStart(2, '0')}`
      setTime(formattedResult)
    }
  }

  return (
    <div className={styles.converterOverlay} onClick={onClose}>
      <div className={styles.converterContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.converterHeader}>
          {onBack && (
            <button className={styles.converterBack} onClick={onBack} title="Volver al menú">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <h2 className={styles.converterTitle}>Conversor de Horario</h2>
          <button className={styles.converterClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.converterContent}>
          <div className={styles.converterInputGroup}>
            <Select value={fromOption} onChange={(option) => option && setFromCity(option.value)} options={cityOptions} styles={selectStyles} isSearchable placeholder="De..." className={styles.converterSelectWrapper} menuPortalTarget={document.body} menuPosition="fixed" onMenuOpen={() => setMenuOpen(true)} onMenuClose={() => setMenuOpen(false)} menuShouldScrollIntoView={true} />
          </div>

          <button className={styles.converterSwapBtn} onClick={handleSwap} title="Intercambiar ciudades">⇄</button>

          <div className={styles.converterInputGroup}>
            <Select value={toOption} onChange={(option) => option && setToCity(option.value)} options={cityOptions} styles={selectStyles} isSearchable placeholder="A..." className={styles.converterSelectWrapper} menuPortalTarget={document.body} menuPosition="fixed" onMenuOpen={() => setMenuOpen(true)} onMenuClose={() => setMenuOpen(false)} menuShouldScrollIntoView={true} />
          </div>

          <div className={styles.converterInputGroup}>
            <input type="text" className={styles.converterInput} value={time} onChange={(e) => {
              const value = e.target.value
              if (/^(\d{0,2}(:(\d{0,2})?)?)?$/.test(value)) {
                setTime(value)
              }
            }} placeholder="23:00" />
          </div>

          {result !== null && (
            <div className={styles.converterResult}>
              <span className={styles.converterResultLabel}>Resultado:</span>
              <span className={styles.converterResultValue}>
                {result.hours.toString().padStart(2, '0')}:{result.minutes.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

