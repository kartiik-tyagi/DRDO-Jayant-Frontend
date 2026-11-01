import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

const ICONS = {
  layers: LayersOutlinedIcon,
  extent: MyLocationOutlinedIcon,
  resources: Inventory2OutlinedIcon,
  plans: AssignmentOutlinedIcon,
  control: TuneOutlinedIcon,
}

export function NavIcon({ name }) {
  const Icon = ICONS[name] || LayersOutlinedIcon
  return <Icon fontSize="small" />
}
