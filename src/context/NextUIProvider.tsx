// app/providers.tsx

import {NextUIProvider} from '@nextui-org/react'


export function NextUiProvider({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}