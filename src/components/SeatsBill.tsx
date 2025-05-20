import { TextField, Typography } from '@mui/material'
import React from 'react'
import dateFormat from "dateformat";

export default function SeatsBill(props: { 
  cinema: Cinema, 
  saved: {}[], 
  handleChange(value: any, id: string): void, 
  values:{
    name: string,
    number: string,
    code: string
  } }) {
  

  return (
    <div className='d-grid '>
      <div className='text-center'>
        <h3 className='h3'>{props.cinema.movie}</h3>
        <img
          className='img-plain'
          width={400}
          src={props.cinema.img}
          alt=''
          loading="lazy"
        />
        <h3 className=''>Comprando {props.saved.length} asiento(s)</h3>
      </div>
      <div className='text-center'>
        <h3 className='h3'>Ingrese su información para continuar</h3>
        <form className='img-plain'>
          <div className='w-100 p'>
            <TextField onChange={(e) => props.handleChange(e.target.value, e.target.id)} value={props.values.name} className='w-100' id="name" label="Nombre en la tarjeta" variant="outlined" />
          </div>
          <div className='w-100 p'>
            <TextField onChange={(e) => props.handleChange(e.target.value, e.target.id)} value={props.values.number} className='w-100' id="number" label="Numero de Tarjeta" variant="outlined" />
          </div>
          <div className='w-100 p'>
            <TextField onChange={(e) => props.handleChange(e.target.value, e.target.id)} value={props.values.code} className='w-100' id="code" type='password' label="Codigo de seguridad" variant="outlined" />
          </div>
          {/* 1955 */}
          <Typography>Fecha de facturación: {dateFormat(new Date(), 'UTC:dd/mm/yyyy')}</Typography>
        </form>
      </div>
    </div>
  )
}
