import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

export function renderWithMantine(ui: React.ReactElement) {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>
  )
}