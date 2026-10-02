const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

export const formatDateTime = (date: Date) => dateTimeFormatter.format(date)

export const formatDate = (date: Date) => dateFormatter.format(date)

export const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`
