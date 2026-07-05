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
import { lesson45 } from './phase4/lesson45'
import { lesson46 } from './phase4/lesson46'
import { lesson47 } from './phase4/lesson47'
import { lesson48 } from './phase4/lesson48'
import { lesson49 } from './phase4/lesson49'
import { lesson410 } from './phase4/lesson410'
import { lesson411 } from './phase4/lesson411'
import { lesson412 } from './phase4/lesson412'
import { lesson413 } from './phase4/lesson413'
import { lesson414 } from './phase4/lesson414'
import { lesson51 } from './phase5/lesson51'
import { lesson52 } from './phase5/lesson52'
import { lesson53 } from './phase5/lesson53'
import { lesson54 } from './phase5/lesson54'
import { lesson55 } from './phase5/lesson55'
import { lesson56 } from './phase5/lesson56'
import { lesson57 } from './phase5/lesson57'
import { lesson58 } from './phase5/lesson58'
import { lesson59 } from './phase5/lesson59'
import { lesson61 } from './phase6/lesson61'
import { lesson62 } from './phase6/lesson62'
import { lesson63 } from './phase6/lesson63'
import { lesson64 } from './phase6/lesson64'
import { lesson65 } from './phase6/lesson65'
import { lesson66 } from './phase6/lesson66'
import { lesson67 } from './phase6/lesson67'
import { lesson68 } from './phase6/lesson68'
import { lesson69 } from './phase6/lesson69'
import { lesson71 } from './phase7/lesson71'
import { lesson72 } from './phase7/lesson72'
import { lesson73 } from './phase7/lesson73'
import { lesson74 } from './phase7/lesson74'
import { lesson75 } from './phase7/lesson75'
import { lesson76 } from './phase7/lesson76'
import { lesson77 } from './phase7/lesson77'
import { lesson78 } from './phase7/lesson78'
import { lesson79 } from './phase7/lesson79'
import { lesson81 } from './phase8/lesson81'
import { lesson82 } from './phase8/lesson82'
import { lesson83 } from './phase8/lesson83'
import { lesson84 } from './phase8/lesson84'
import { lesson85 } from './phase8/lesson85'
import { lesson86 } from './phase8/lesson86'
import { lesson91 } from './phase9/lesson91'
import { lesson92 } from './phase9/lesson92'
import { lesson93 } from './phase9/lesson93'
import { lesson94 } from './phase9/lesson94'
import { lesson95 } from './phase9/lesson95'
import { lesson96 } from './phase9/lesson96'
import { lesson97 } from './phase9/lesson97'
import { lesson98 } from './phase9/lesson98'

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
  '4.5': lesson45,
  '4.6': lesson46,
  '4.7': lesson47,
  '4.8': lesson48,
  '4.9': lesson49,
  '4.10': lesson410,
  '4.11': lesson411,
  '4.12': lesson412,
  '4.13': lesson413,
  '4.14': lesson414,
  '5.1': lesson51,
  '5.2': lesson52,
  '5.3': lesson53,
  '5.4': lesson54,
  '5.5': lesson55,
  '5.6': lesson56,
  '5.7': lesson57,
  '5.8': lesson58,
  '5.9': lesson59,
  '6.1': lesson61,
  '6.2': lesson62,
  '6.3': lesson63,
  '6.4': lesson64,
  '6.5': lesson65,
  '6.6': lesson66,
  '6.7': lesson67,
  '6.8': lesson68,
  '6.9': lesson69,
  '7.1': lesson71,
  '7.2': lesson72,
  '7.3': lesson73,
  '7.4': lesson74,
  '7.5': lesson75,
  '7.6': lesson76,
  '7.7': lesson77,
  '7.8': lesson78,
  '7.9': lesson79,
  '8.1': lesson81,
  '8.2': lesson82,
  '8.3': lesson83,
  '8.4': lesson84,
  '8.5': lesson85,
  '8.6': lesson86,
  '9.1': lesson91,
  '9.2': lesson92,
  '9.3': lesson93,
  '9.4': lesson94,
  '9.5': lesson95,
  '9.6': lesson96,
  '9.7': lesson97,
  '9.8': lesson98,
}
