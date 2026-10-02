import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import { Button, CircularProgress, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { Link, useParams, useSearchParams } from 'react-router'
import { EmptyState } from '../components/EmptyState'
import { useConnection } from '../features/connections/useConnections'
import { ContactsPanel } from '../features/contacts/ContactsPanel'
import { BroadcastPanel } from '../features/messages/BroadcastPanel'
import { ROUTES } from '../routes'

const TABS = ['contatos', 'broadcast'] as const
type TabValue = (typeof TABS)[number]

const toTab = (value: string | null): TabValue =>
  TABS.find((tab) => tab === value) ?? 'contatos'

export const ConnectionDetailPage = () => {
  const { connectionId = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = toTab(searchParams.get('aba'))
  const { connection, loading, error } = useConnection(connectionId)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    )
  }

  if (error || !connection) {
    return (
      <EmptyState
        icon={<ContactsOutlinedIcon fontSize="large" />}
        title="Conexão não encontrada"
        description="A conexão pode ter sido excluída ou não pertence à sua conta."
        action={
          <Button component={Link} to={ROUTES.connections} variant="outlined">
            Voltar para conexões
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <Tooltip title="Voltar">
          <IconButton component={Link} to={ROUTES.connections} aria-label="Voltar para conexões">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <div className="min-w-0">
          <Typography variant="overline" color="text.secondary" className="leading-none">
            Conexão
          </Typography>
          <Typography variant="h5" component="h1" className="truncate font-bold">
            {connection.name}
          </Typography>
        </div>
      </header>

      <Tabs
        value={tab}
        onChange={(_, value: TabValue) => setSearchParams({ aba: value }, { replace: true })}
        className="border-b border-slate-200"
      >
        <Tab value="contatos" label="Contatos" icon={<ContactsOutlinedIcon />} iconPosition="start" />
        <Tab value="broadcast" label="Broadcast" icon={<CampaignOutlinedIcon />} iconPosition="start" />
      </Tabs>

      {tab === 'contatos' ? (
        <ContactsPanel connectionId={connection.id} />
      ) : (
        <BroadcastPanel connectionId={connection.id} />
      )}
    </div>
  )
}
