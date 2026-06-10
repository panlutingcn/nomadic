'use client'
import { useEffect, useRef } from 'react'

const TREE_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4vivfuTEGxNuDFlJjRrJJQzNhqMuRzw5x9O42zzxRt0Wri8sLVSq9Mb4KxkYBN85VeA4l2RjE4tl69K0lpv8SeJ02eBP6Jix26XwN9wMgYG-0AV0ltaaCilSOC-OQNRhH7rkjsjOGWxqbaPPR9ia9KxSf0uMZQnU-I6vRgm7TxKhaAsm07bZ9OLeUZ2gdJYTXmgeXAVpir8jkxlJMY60vpjoTWf0kZ7-78NkylTRoYYH-oEI_4J4d3l094GtZJX0e5q34MYYbGDY'

const LEAF_COLORS = ['#107a66', '#2e8b57', '#4caf50', '#6fae6f']
const LEAF_COUNT = 40

class Leaf {
  x = 0
  y = 0
  size = 0
  speedX = 0
  speedY = 0
  rotation = 0
  rotationSpeed = 0
  oscillation = 0
  oscillationSpeed = 0
  color = ''
  opacity = 0
  width = 0
  height = 0

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.init()
  }

  init() {
    this.x = this.width + Math.random() * 200
    this.y = Math.random() * this.height
    this.size = 4 + Math.random() * 8
    this.speedX = -(1 + Math.random() * 2)
    this.speedY = (Math.random() - 0.5) * 1
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.05
    this.oscillation = Math.random() * Math.PI * 2
    this.oscillationSpeed = 0.02 + Math.random() * 0.03
    this.color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
    this.opacity = 0.4 + Math.random() * 0.4
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY + Math.sin(this.oscillation) * 0.5
    this.oscillation += this.oscillationSpeed
    this.rotation += this.rotationSpeed
    if (this.x < -20) this.init()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(this.size, this.size, 0, this.size * 2)
    ctx.quadraticCurveTo(-this.size, this.size, 0, 0)
    ctx.fill()
    ctx.restore()
  }
}

export default function TreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let leaves: Leaf[] = []
    let frameId: number

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      leaves.forEach(leaf => {
        leaf.width = width
        leaf.height = height
      })
    }

    resize()
    leaves = Array.from({ length: LEAF_COUNT }, () => new Leaf(width, height))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      leaves.forEach(leaf => {
        leaf.update()
        leaf.draw(ctx)
      })
      frameId = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#f9f9f7',
          backgroundImage: `url('${TREE_IMAGE_URL}')`,
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: -3,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.40)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: -2,
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="tree-leaf-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
