import type { ComponentType } from 'react'
import { Phase0Lab } from './Phase0Lab'
import { Phase1Lab } from './Phase1Lab'

/**
 * Each phase gets its own lab — interactive demos of that phase's ideas,
 * shown on its phase page. Phases without an entry show a "being drawn" note.
 */
export const PHASE_LABS: Record<number, ComponentType> = {
  0: Phase0Lab,
  1: Phase1Lab,
}
