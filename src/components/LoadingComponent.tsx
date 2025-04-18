import { Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import loading from '../../public/loading.gif';

export default function LoadingComponent() {
  return (
    <>
      <div>
        <Typography variant='h6'>Recuperando información</Typography>
        <Image src={loading} alt='Data is loading' />
      </div>

    </>
  )
}
