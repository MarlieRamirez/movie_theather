'use client'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getAvailability, getCinema } from '../../../network/lib/cinema';
import { ChairRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';

function capacity() {
  //var chr = String.fromCharCode(65 + n);
  const searchParams = useSearchParams();
  const cinemaID = searchParams.get('cinema');
  const id = searchParams.get('id');
  const user = localStorage.getItem('user')

  const [cinema, setCinema] = useState({
    rows: 0,
    columns: 0
  });

  const [seats, setSeats] = useState([{
    full_name: '',
    rows: 0,
    column: 0
  }]);

  const [saved, setSaved] = useState([{
    full_name: '',
    rows: 0,
    column: 0,
    id_user: 0,
    id_schedule: id
  }]);

  const handleSaved = (row: number, column: number) => {
    if (saved[0].full_name == '') {
      setSaved([{
        full_name: String.fromCharCode(65 + row) + '' + column,
        rows: row,
        column: column,
        id_user: JSON.parse(user!).id,
        id_schedule: id
      }])
    } else {
      const prev = saved.findIndex((e) => e.full_name === String.fromCharCode(65 + row) + '' + column)
      
      if (prev != -1) { //if found
        setSaved(saved.filter((e)=>e.full_name != String.fromCharCode(65 + row) + '' + column))
      } else {
        setSaved([...saved, {
          full_name: String.fromCharCode(65 + row) + '' + column,
          rows: row,
          column: column,
          id_user: JSON.parse(user!).id,
          id_schedule: id
        }])
      }

    }
  }


  if (cinemaID && id) {
    useEffect(() => {
      getCinema(cinemaID).then((response) => {
        setCinema(response.data)
      });

      getAvailability(id).then((response) => {
        setSeats(response.data)
      })
    }, []);


  }

  const rows = [];
  for (let i = 0; i < cinema.rows; i++) {
    const columns = []

    for (let c = 0; c < cinema.columns; c++) {
      const name = String.fromCharCode(65 + i) + '' + c;
      const index = seats.findIndex((e) => e.full_name == name)
      const check = saved.findIndex((e) => e.full_name == name);

      const color = index != -1 ? 'error' : check != -1 ? 'warning' : 'info'

      columns.push(
        <div key={'container' + i + c}>

          <Button onClick={() => { handleSaved(i, c) }} sx={index != -1 ? { 'pointer-events': 'none' } : {}} key={name} variant='contained' color={color} aria-disabled={index != -1} className='rounded-circle py-3'>
            <ChairRounded key={'icon' + i + '' + c} sx={{ width: '5pc', height: '5pc' }} />
          </Button>

          <p className='text-center'>{String.fromCharCode(65 + i) + '' + c}</p>
        </div>
      );

      // console.log('KEY: ' + String.fromCharCode(65 + i) + '' + c)
    }

    rows.push(
      <div key={i} className='d-flex flex-row justify-content-center gap-3 mb-4'>
        {columns}
      </div>
    );
  }
  return rows;
}

export default function page() {

  return (
    <div className='m-4 p-4'>
      {capacity()}

    </div>
  )
}