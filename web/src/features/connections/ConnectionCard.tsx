import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import { Card, CardActionArea, IconButton, Tooltip, Typography } from '@mui/material'
import { Link } from 'react-router'
import { formatDate } from '../../lib/format'
import { connectionPath } from '../../routes'
import type { Connection } from '../../types'

type ConnectionCardProps = {
  connection: Connection
  onEdit: () => void
  onDelete: () => void
}

export const ConnectionCard = ({ connection, onEdit, onDelete }: ConnectionCardProps) => (
  <Card className="flex items-stretch border border-slate-200 transition-shadow hover:shadow-md">
    <CardActionArea
      component={Link}
      to={connectionPath(connection.id)}
      className="flex min-w-0 flex-1 items-center justify-start gap-3 p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ">
        <HubOutlinedIcon />
      </div>
      <div className="min-w-0">
        <Typography className="truncate font-semibold">{connection.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          Criada em {formatDate(connection.createdAt)}
        </Typography>
      </div>
    </CardActionArea>
    <div className="flex items-center pr-2">
      <Tooltip title="Editar">
        <IconButton onClick={onEdit} aria-label={`Editar ${connection.name}`}>
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton onClick={onDelete} aria-label={`Excluir ${connection.name}`}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  </Card>
)
