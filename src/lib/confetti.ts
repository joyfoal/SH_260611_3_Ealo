import type confetti from 'canvas-confetti'

type ConfettiFn = (options?: confetti.Options) => Promise<null> | null

let scoped: ConfettiFn | null = null

// 앱은 body가 430px 폭 컬럼으로 고정되어 있음(globals.css). canvas-confetti를 옵션 없이
// 쓰면 라이브러리가 자체적으로 뷰포트 전체 크기의 캔버스를 만들어버려 데스크톱에서
// 컨페티가 430px 컬럼 밖으로 퍼진다. 이 헬퍼는 그 컬럼 폭에 맞춘 전용 캔버스를 하나
// 만들어 재사용한다.
function createScopedCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'bottom:0', 'left:50%',
    'transform:translateX(-50%)', 'width:100%', 'max-width:430px',
    'height:100%', 'pointer-events:none', 'z-index:9999',
  ].join(';')
  document.body.appendChild(canvas)

  const sizeCanvas = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  sizeCanvas()
  window.addEventListener('resize', sizeCanvas)

  return canvas
}

async function getScopedConfetti(): Promise<ConfettiFn | null> {
  if (typeof window === 'undefined') return null
  if (scoped) return scoped

  const { default: confettiLib } = await import('canvas-confetti')
  const canvas = createScopedCanvas()
  // resize:false(기본값) — canvas-confetti의 resize 옵션은 캔버스를 window.innerWidth/
  // innerHeight(진짜 뷰포트)에 맞추므로, 우리가 이미 430px로 잘라놓은 크기와 어긋나
  // 컨페티가 찌그러져 보인다. 크기는 위 sizeCanvas()가 직접 관리한다.
  scoped = confettiLib.create(canvas, { useWorker: true })
  return scoped
}

export async function fireConfetti(options?: confetti.Options) {
  const fn = await getScopedConfetti()
  fn?.(options)
}
