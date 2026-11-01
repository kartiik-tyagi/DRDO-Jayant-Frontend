import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'

const ICONS = {
  Dashboard: DashboardOutlinedIcon,
  Groups: GroupsOutlinedIcon,
  Map: MapOutlinedIcon,
  Settings: SettingsOutlinedIcon,
  Timeline: TimelineOutlinedIcon,
}

export function IconFor({ name, ...props }) {
  const Icon = ICONS[name] || DashboardOutlinedIcon
  return <Icon {...props} />
}
