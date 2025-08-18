/**
 * Neural network and data flow ASCII animations for fal.ai
 * Creates animated patterns representing AI inference and data processing
 */

export interface NeuralOptions {
  style?: 'matrix' | 'flow' | 'network' | 'pulse'
  density?: number // 0-1
  speed?: number // Animation speed multiplier
  color?: 'mono' | 'gradient'
  direction?: 'up' | 'down' | 'left' | 'right' | 'radial'
}

const NEURAL_CHARS = {
  nodes: ['◉', '○', '●', '◯', '⦿', '◎', '◈', '◊'],
  connections: ['─', '│', '╱', '╲', '┼', '╳', '═', '║'],
  data: ['▪', '▫', '▬', '▭', '◾', '◽', '▰', '▱'],
  flow: ['⟶', '⟵', '⟷', '↑', '↓', '↕', '⇢', '⇠'],
  matrix: ['0', '1', '⦾', '⦿', '◉', '○', '█', '▓'],
  pulse: ['∙', '·', '•', '●', '◉', '◎', '○', '◯']
}

function createGrid(width: number, height: number): string[][] {
  return Array(height).fill(null).map(() => Array(width).fill(' '))
}

function gridToString(grid: string[][]): string {
  return grid.map(row => row.join('')).join('\n')
}

/**
 * Generate matrix rain effect (like the Matrix movie)
 */
export function generateMatrixFrames(
  width: number,
  height: number,
  frameCount: number,
  options: NeuralOptions = {}
): string[] {
  const frames: string[] = []
  const columns: number[] = Array(width).fill(0).map(() => Math.floor(Math.random() * height))
  
  for (let f = 0; f < frameCount; f++) {
    const grid = createGrid(width, height)
    
    // Update each column
    for (let x = 0; x < width; x++) {
      const y = columns[x]
      
      // Draw the trail
      for (let dy = 0; dy < 10; dy++) {
        const py = y - dy
        if (py >= 0 && py < height) {
          const intensity = 1 - (dy / 10)
          const charIndex = Math.floor(intensity * NEURAL_CHARS.matrix.length)
          grid[py][x] = NEURAL_CHARS.matrix[Math.min(charIndex, NEURAL_CHARS.matrix.length - 1)]
        }
      }
      
      // Move column down
      columns[x] = (columns[x] + 1) % (height + 10)
    }
    
    frames.push(gridToString(grid))
  }
  
  return frames
}

/**
 * Generate neural network connection visualization
 */
export function generateNetworkFrames(
  width: number,
  height: number,
  frameCount: number,
  options: NeuralOptions = {}
): string[] {
  const frames: string[] = []
  const density = options.density || 0.3
  
  // Create network nodes
  const nodes: Array<{x: number, y: number}> = []
  const layers = 5
  const nodesPerLayer = Math.floor(height / 4)
  
  for (let layer = 0; layer < layers; layer++) {
    const x = Math.floor((width / (layers + 1)) * (layer + 1))
    for (let i = 0; i < nodesPerLayer; i++) {
      const y = Math.floor((height / (nodesPerLayer + 1)) * (i + 1))
      nodes.push({ x, y })
    }
  }
  
  for (let f = 0; f < frameCount; f++) {
    const grid = createGrid(width, height)
    const time = (f / frameCount) * Math.PI * 2
    
    // Draw connections with animation
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 5, nodes.length); j++) {
        if (Math.random() < density) {
          const n1 = nodes[i]
          const n2 = nodes[j]
          
          // Animate connection intensity
          const intensity = (Math.sin(time + i * 0.1) + 1) / 2
          if (intensity > 0.3) {
            drawLine(grid, n1.x, n1.y, n2.x, n2.y, intensity)
          }
        }
      }
    }
    
    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const pulse = (Math.sin(time + i * 0.2) + 1) / 2
      const charIndex = Math.floor(pulse * NEURAL_CHARS.nodes.length)
      if (node.x >= 0 && node.x < width && node.y >= 0 && node.y < height) {
        grid[node.y][node.x] = NEURAL_CHARS.nodes[charIndex]
      }
    }
    
    frames.push(gridToString(grid))
  }
  
  return frames
}

/**
 * Generate data flow visualization
 */
export function generateDataFlowFrames(
  width: number,
  height: number,
  frameCount: number,
  options: NeuralOptions = {}
): string[] {
  const frames: string[] = []
  const particles: Array<{x: number, y: number, vx: number, vy: number}> = []
  
  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    })
  }
  
  for (let f = 0; f < frameCount; f++) {
    const grid = createGrid(width, height)
    const time = f / frameCount
    
    // Draw flow field
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 6) {
        const angle = Math.sin(x * 0.1 + time * Math.PI * 2) * Math.cos(y * 0.1)
        const charIndex = Math.floor(((angle + 1) / 2) * NEURAL_CHARS.flow.length)
        if (x < width && y < height) {
          grid[y][x] = NEURAL_CHARS.flow[Math.min(charIndex, NEURAL_CHARS.flow.length - 1)]
        }
      }
    }
    
    // Update and draw particles
    for (const particle of particles) {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Wrap around edges
      if (particle.x < 0) particle.x = width - 1
      if (particle.x >= width) particle.x = 0
      if (particle.y < 0) particle.y = height - 1
      if (particle.y >= height) particle.y = 0
      
      // Draw particle with trail
      const px = Math.floor(particle.x)
      const py = Math.floor(particle.y)
      if (px >= 0 && px < width && py >= 0 && py < height) {
        grid[py][px] = NEURAL_CHARS.data[Math.floor(Math.random() * NEURAL_CHARS.data.length)]
      }
    }
    
    frames.push(gridToString(grid))
  }
  
  return frames
}

/**
 * Generate pulsing neural activity
 */
export function generatePulseFrames(
  width: number,
  height: number,
  frameCount: number,
  options: NeuralOptions = {}
): string[] {
  const frames: string[] = []
  
  for (let f = 0; f < frameCount; f++) {
    const grid = createGrid(width, height)
    const time = (f / frameCount) * Math.PI * 2
    
    // Create pulsing circles from center
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX
        const dy = y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Create pulse waves
        const wave = Math.sin(distance * 0.3 - time * 2)
        if (wave > 0.5) {
          const intensity = (wave - 0.5) * 2
          const charIndex = Math.floor(intensity * NEURAL_CHARS.pulse.length)
          grid[y][x] = NEURAL_CHARS.pulse[Math.min(charIndex, NEURAL_CHARS.pulse.length - 1)]
        }
      }
    }
    
    frames.push(gridToString(grid))
  }
  
  return frames
}

/**
 * Helper function to draw a line between two points
 */
function drawLine(
  grid: string[][],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  intensity: number
) {
  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  const sx = x1 < x2 ? 1 : -1
  const sy = y1 < y2 ? 1 : -1
  let err = dx - dy
  
  const charIndex = Math.floor(intensity * NEURAL_CHARS.connections.length)
  const char = NEURAL_CHARS.connections[Math.min(charIndex, NEURAL_CHARS.connections.length - 1)]
  
  while (true) {
    if (x1 >= 0 && x1 < grid[0].length && y1 >= 0 && y1 < grid.length) {
      grid[y1][x1] = char
    }
    
    if (x1 === x2 && y1 === y2) break
    
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x1 += sx
    }
    if (e2 < dx) {
      err += dx
      y1 += sy
    }
  }
}

/**
 * Main generator function that combines all effects
 */
export function generateNeuralFrames(
  width: number,
  height: number,
  frameCount: number,
  options: NeuralOptions = {}
): string[] {
  const style = options.style || 'network'
  
  switch (style) {
    case 'matrix':
      return generateMatrixFrames(width, height, frameCount, options)
    case 'flow':
      return generateDataFlowFrames(width, height, frameCount, options)
    case 'network':
      return generateNetworkFrames(width, height, frameCount, options)
    case 'pulse':
      return generatePulseFrames(width, height, frameCount, options)
    default:
      return generateNetworkFrames(width, height, frameCount, options)
  }
}