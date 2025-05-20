import { Typography } from '@mui/material'
import React from 'react'
import dateFormat from "dateformat";

export default function ConfirmBill(props: {cinema:Cinema, saved: Seat[], card: Card, date:string }) {
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
      <div>
        <h3 className='h3'>Información de Facturación</h3>
        <div className='img-plain'>
          <Typography className='p'><b>Nombre en Tarjeta: </b> {props.card.name}</Typography>
          <Typography className='p'><b>Número de Tarjeta: </b> {props.card.number}</Typography>
          <Typography className='p'><b>Asientos: </b> {props.saved.map(e => e.full_name + ' ')}</Typography>
          <Typography className='p'><b>Fecha de pelicula: </b> {dateFormat(props.date, 'UTC:dd/mm/yyyy')}</Typography>
          <Typography className='p'><b>Horario: </b> 10 a.m</Typography>
        </div>

      </div>
    </div>
  )
}
