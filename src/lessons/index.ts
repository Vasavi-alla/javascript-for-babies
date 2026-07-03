import type { LessonDef } from '../engine/lesson/types'
import { lesson01 } from './phase0/lesson01'
import { lesson02 } from './phase0/lesson02'
import { lesson03 } from './phase0/lesson03'
import { lesson04 } from './phase0/lesson04'
import { lesson05 } from './phase0/lesson05'
import { lesson11 } from './phase1/lesson11'
import { lesson12 } from './phase1/lesson12'
import { lesson13 } from './phase1/lesson13'
import { lesson14 } from './phase1/lesson14'
import { lesson15 } from './phase1/lesson15'
import { lesson16 } from './phase1/lesson16'
import { lesson17 } from './phase1/lesson17'
import { lesson18 } from './phase1/lesson18'
import { lesson19 } from './phase1/lesson19'
import { lesson110 } from './phase1/lesson110'
import { lesson111 } from './phase1/lesson111'
import { lesson21 } from './phase2/lesson21'
import { lesson22 } from './phase2/lesson22'
import { lesson23 } from './phase2/lesson23'
import { lesson24 } from './phase2/lesson24'
import { lesson25 } from './phase2/lesson25'
import { lesson26 } from './phase2/lesson26'
import { lesson27 } from './phase2/lesson27'
import { lesson28 } from './phase2/lesson28'
import { lesson31 } from './phase3/lesson31'
import { lesson32 } from './phase3/lesson32'
import { lesson33 } from './phase3/lesson33'
import { lesson34 } from './phase3/lesson34'
import { lesson35 } from './phase3/lesson35'
import { lesson36 } from './phase3/lesson36'
import { lesson37 } from './phase3/lesson37'
import { lesson38 } from './phase3/lesson38'
import { lesson39 } from './phase3/lesson39'
import { lesson310 } from './phase3/lesson310'
import { lesson311 } from './phase3/lesson311'
import { lesson41 } from './phase4/lesson41'
import { lesson42 } from './phase4/lesson42'
import { lesson43 } from './phase4/lesson43'
import { lesson44 } from './phase4/lesson44'

/** Built lessons, by id. A lesson must also be 'available' in content/registry.ts. */
export const LESSON_DEFS: Record<string, LessonDef> = {
  '0.1': lesson01,
  '0.2': lesson02,
  '0.3': lesson03,
  '0.4': lesson04,
  '0.5': lesson05,
  '1.1': lesson11,
  '1.2': lesson12,
  '1.3': lesson13,
  '1.4': lesson14,
  '1.5': lesson15,
  '1.6': lesson16,
  '1.7': lesson17,
  '1.8': lesson18,
  '1.9': lesson19,
  '1.10': lesson110,
  '1.11': lesson111,
  '2.1': lesson21,
  '2.2': lesson22,
  '2.3': lesson23,
  '2.4': lesson24,
  '2.5': lesson25,
  '2.6': lesson26,
  '2.7': lesson27,
  '2.8': lesson28,
  '3.1': lesson31,
  '3.2': lesson32,
  '3.3': lesson33,
  '3.4': lesson34,
  '3.5': lesson35,
  '3.6': lesson36,
  '3.7': lesson37,
  '3.8': lesson38,
  '3.9': lesson39,
  '3.10': lesson310,
  '3.11': lesson311,
  '4.1': lesson41,
  '4.2': lesson42,
  '4.3': lesson43,
  '4.4': lesson44,
}
