import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

const ICONS = {
  situation: MapOutlinedIcon,
  command: AccountTreeOutlinedIcon,
  plans: EditNoteOutlinedIcon,
  control: TuneOutlinedIcon,
  picture: MapOutlinedIcon,
  desk: AccountTreeOutlinedIcon,
  review: EditNoteOutlinedIcon,
}

export function DutyIcon({ name }) {
  const Icon = ICONS[name] || MapOutlinedIcon
  return <Icon />
}
