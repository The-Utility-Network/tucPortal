'use client'
import { ThirdwebProvider } from 'thirdweb/react'
import VRBackground from '../../components/VRbg'

export default function Canvas() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <ThirdwebProvider>
        <VRBackground />
      </ThirdwebProvider>
    </>
  )
}