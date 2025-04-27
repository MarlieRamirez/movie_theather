import React, { useEffect, useState } from 'react'
import { getAvailability } from '../../network/lib/cinema';
import { IconButton, Typography } from '@mui/material';
import { ChairRounded } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

export default function CinemaCapacity(props: { handleSaved(): Function, saved: {}[], cinema: Cinema }) {

  const searchParams = useSearchParams();
  const cinemaID = searchParams.get('cinema');
  const id = searchParams.get('id');



  const [seats, setSeats] = useState([{
    full_name: '',
    rows: 0,
    column: 0
  }]);


  useEffect(() => {
    if (id) {
      getAvailability(id).then((response) => {
        setSeats(response.data)
      })
    }

  }, []);


  const rows: [React.JSX.Element] = [];

  for (let i = 0; i < props.cinema.rows; i++) {
    const columns = []

    for (let c = 0; c < props.cinema.columns; c++) {
      const name = String.fromCharCode(65 + i) + '' + c;
      const index = seats.findIndex((e) => e.full_name == name)
      const check = props.saved.findIndex((e) => e.full_name == name);

      const color = index != -1 ? 'error' : check != -1 ? 'warning' : 'info'

      columns.push(
        <div key={'container' + i + c}>

          <IconButton type='button' onClick={() => { props.handleSaved(i, c) }} sx={index != -1 ? { 'pointer-events': 'none' } : {}} key={name} color={color} aria-disabled={index != -1} >
            <ChairRounded key={'icon' + i + '' + c} sx={{ width: '5pc', height: '5pc' }} />
          </IconButton>

          <Typography color={color} className='text-center'>{String.fromCharCode(65 + i) + '' + c}</Typography>

        </div>
      );

      // console.log('KEY: ' + String.fromCharCode(65 + i) + '' + c)
    }

    rows.push(
      <div key={i} className='d-flex justify-content-center row'>
        {columns}
      </div>
    );
  }


  return (
    <div>{rows}</div>
  )
}
