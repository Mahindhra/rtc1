import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Check device capability
    const isMobile = window.innerWidth < 768
    const prefersReduced = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050914, 0.028)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 3.8, 14)
    camera.lookAt(0, 1.2, -10)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // Highway Grid Floor
    const gridHelper = new THREE.GridHelper(80, 40, 0x06b6d4, 0x0f1d3a)
    gridHelper.position.y = -0.05
    scene.add(gridHelper)

    // Highway Light Trails (Dual Direction)
    const TRAIL_COUNT = isMobile ? 35 : 70
    const trailGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(TRAIL_COUNT * 6)
    const colors = new Float32Array(TRAIL_COUNT * 6)
    const speeds = new Float32Array(TRAIL_COUNT)

    // Left lanes (oncoming white/cyan), Right lanes (receding red/amber)
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const isRight = i % 2 === 0
      const laneOffset = isRight ? 1.2 + Math.random() * 4 : -1.2 - Math.random() * 4
      const y = 0.2 + Math.random() * 0.4
      const z = (Math.random() - 0.5) * 60
      const len = 3 + Math.random() * 5

      positions[i * 6] = laneOffset
      positions[i * 6 + 1] = y
      positions[i * 6 + 2] = z

      positions[i * 6 + 3] = laneOffset
      positions[i * 6 + 4] = y
      positions[i * 6 + 5] = isRight ? z - len : z + len

      speeds[i] = (isRight ? 0.35 : -0.4) * (0.8 + Math.random() * 0.4)

      // Colors
      if (isRight) {
        // Red / Amber taillights
        const isAmber = Math.random() > 0.6
        const r = isAmber ? 0.98 : 0.95
        const g = isAmber ? 0.6 : 0.12
        const b = isAmber ? 0.1 : 0.25
        colors[i * 6] = r
        colors[i * 6 + 1] = g
        colors[i * 6 + 2] = b
        colors[i * 6 + 3] = r * 0.3
        colors[i * 6 + 4] = g * 0.3
        colors[i * 6 + 5] = b * 0.3
      } else {
        // Cyan / White headlights
        const isCyan = Math.random() > 0.4
        const r = isCyan ? 0.1 : 0.9
        const g = isCyan ? 0.8 : 0.95
        const b = 1.0
        colors[i * 6] = r
        colors[i * 6 + 1] = g
        colors[i * 6 + 2] = b
        colors[i * 6 + 3] = r * 0.3
        colors[i * 6 + 4] = g * 0.3
        colors[i * 6 + 5] = b * 0.3
      }
    }

    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    const trails = new THREE.LineSegments(trailGeometry, trailMaterial)
    scene.add(trails)

    // Andhra Pradesh Glowing Transit Hub Nodes & Laser Route Lines
    const HUB_NODES = [
      { name: 'Vijayawada HQ', x: 0, y: 1.5, z: -8, color: 0x00f0ff },
      { name: 'Visakhapatnam', x: 3.5, y: 2.2, z: -16, color: 0x38bdf8 },
      { name: 'Tirupati', x: -3.8, y: 1.2, z: -12, color: 0xf59e0b },
      { name: 'Guntur Hub', x: -1.2, y: 1.0, z: -6, color: 0x10b981 },
      { name: 'Kurnool Depot', x: -4.5, y: 1.8, z: -18, color: 0xa855f7 },
      { name: 'Nellore Express', x: -2.0, y: 1.4, z: -14, color: 0xf43f5e },
      { name: 'Rajahmundry', x: 2.2, y: 1.9, z: -11, color: 0x06b6d4 },
    ]

    const nodeGroup = new THREE.Group()
    HUB_NODES.forEach((hub) => {
      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16)
      const sphereMat = new THREE.MeshBasicMaterial({ color: hub.color })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(hub.x, hub.y, hub.z)
      nodeGroup.add(mesh)

      // Glowing outer ring
      const ringGeo = new THREE.RingGeometry(0.25, 0.32, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.set(hub.x, hub.y, hub.z)
      ringMesh.rotation.x = Math.PI / 4
      nodeGroup.add(ringMesh)
    })

    // Connect nodes with laser lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const routePoints = []
    for (let i = 0; i < HUB_NODES.length; i++) {
      for (let j = i + 1; j < HUB_NODES.length; j++) {
        if (Math.abs(HUB_NODES[i].z - HUB_NODES[j].z) < 10) {
          routePoints.push(
            new THREE.Vector3(HUB_NODES[i].x, HUB_NODES[i].y, HUB_NODES[i].z),
            new THREE.Vector3(HUB_NODES[j].x, HUB_NODES[j].y, HUB_NODES[j].z)
          )
        }
      }
    }
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints)
    const routeLines = new THREE.LineSegments(routeGeo, lineMat)
    nodeGroup.add(routeLines)
    scene.add(nodeGroup)

    // Floating Atmospheric Data Particles
    const PARTICLE_COUNT = isMobile ? 80 : 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 35
      particlePos[i + 1] = Math.random() * 12
      particlePos[i + 2] = (Math.random() - 0.5) * 45
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const particleCloud = new THREE.Points(particleGeo, particleMat)
    scene.add(particleCloud)

    // Animation loop with visibility pausing
    let animationFrameId
    let clock = new THREE.Clock()

    const animate = () => {
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Animate Highway trails along Z axis
      const posAttr = trailGeometry.attributes.position
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const speed = speeds[i]
        posAttr.array[i * 6 + 2] += speed
        posAttr.array[i * 6 + 5] += speed

        // Wrap around
        if (speed > 0 && posAttr.array[i * 6 + 2] > 20) {
          posAttr.array[i * 6 + 2] = -40
          posAttr.array[i * 6 + 5] = -45
        } else if (speed < 0 && posAttr.array[i * 6 + 2] < -40) {
          posAttr.array[i * 6 + 2] = 20
          posAttr.array[i * 6 + 5] = 25
        }
      }
      posAttr.needsUpdate = true

      // Gentle orbital sway for nodeGroup and particles
      nodeGroup.position.y = Math.sin(time * 0.8) * 0.15
      nodeGroup.rotation.y = Math.sin(time * 0.2) * 0.04
      particleCloud.rotation.y = time * 0.02

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId)
      } else {
        clock.start()
        animate()
      }
    }

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('resize', handleResize)

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      trailGeometry.dispose()
      trailMaterial.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  )
}
