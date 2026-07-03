import { InkButton } from '../../design/InkButton'
import type { Step } from './types'
import type { StepperState } from './useStepper'

/** Prev/next buttons with hand-drawn progress dots. */
export function StepperControls({ stepper, steps }: { stepper: StepperState; steps: Step[] }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <InkButton id="stepper-prev" onClick={stepper.prev} disabled={stepper.isFirst}>
        ◀ back
      </InkButton>

      <div className="flex items-center gap-2.5">
        {steps.map((s, i) => (
          <span
            key={s.id}
            className="ink-dot inline-block h-3 w-3 border-2 transition-colors duration-300"
            style={{
              borderColor: 'var(--color-ink)',
              background:
                i < stepper.index
                  ? 'var(--color-ink)'
                  : i === stepper.index
                    ? 'var(--color-marker-yellow)'
                    : 'transparent',
            }}
          />
        ))}
      </div>

      <InkButton
        id="stepper-next"
        variant="primary"
        onClick={stepper.next}
        disabled={stepper.isLast || stepper.gated}
      >
        {stepper.gated ? 'predict first!' : 'next ▶'}
      </InkButton>
    </div>
  )
}
