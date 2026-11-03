import pineNight from './pine/night'
import pineDay from './pine/day'
import cobaltNight from './cobalt/night'
import cobaltDay from './cobalt/day'
import amberNight from './amber/night'
import amberDay from './amber/day'
import graphiteNight from './graphite/night'
import graphiteDay from './graphite/day'
import lagoonNight from './lagoon/night'
import lagoonDay from './lagoon/day'
import irisNight from './iris/night'
import irisDay from './iris/day'
import copperNight from './copper/night'
import copperDay from './copper/day'
import mossNight from './moss/night'
import mossDay from './moss/day'
import crimsonNight from './crimson/night'
import crimsonDay from './crimson/day'
import contrastNight from './contrast/night'
import contrastDay from './contrast/day'
import { assertContrast } from './check'

export const palettes = [
  pineNight,
  pineDay,
  cobaltNight,
  cobaltDay,
  amberNight,
  amberDay,
  graphiteNight,
  graphiteDay,
  lagoonNight,
  lagoonDay,
  irisNight,
  irisDay,
  copperNight,
  copperDay,
  mossNight,
  mossDay,
  crimsonNight,
  crimsonDay,
  contrastNight,
  contrastDay,
]

palettes.forEach(assertContrast)

export function paletteById(id) {
  return palettes.find((item) => item.id === id) || null
}

export const loginPalette = paletteById('field-night')
