'use client'
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getAvailability, getCinema } from '../../../network/lib/cinema';
import { ChairRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';

function capacity(){
  //var chr = String.fromCharCode(65 + n);
  const searchParams = useSearchParams();
  const cinemaID = searchParams.get('cinema');
  const id = searchParams.get('id');
  const [user, setUser, removeUser] = useLocalStorage('user', '')

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
    if (saved.length == 0 || saved[0].full_name == ''  ) {
      setSaved([{
        full_name: String.fromCharCode(65 + row) + '' + column,
        rows: row,
        column: column,
        id_user: user ? JSON.parse(user).id : 0,
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
          id_user: user ? JSON.parse(user).id : 0,
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

          <IconButton type='button' onClick={() => { handleSaved(i, c) }} sx={index != -1 ? { 'pointer-events': 'none' } : {}} key={name} color={color} aria-disabled={index != -1} >
            <ChairRounded key={'icon' + i + '' + c} sx={{ width: '5pc', height: '5pc' }} />
          </IconButton>

          <p className='text-center'>{String.fromCharCode(65 + i) + '' + c}</p>
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
  return [saved, rows];
}



export default function page() {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [saved, rows] = capacity()
  
  const handleButton = ()=>{
    if(user){
      console.log(saved);
    }else{
      redirect('/login')
    }
    
  }
  return (
    <div className='m-4 p-4'>
      {rows}
      <div className='d-flex justify-content-center p'>
      <Button variant='contained' color='secondary' className='w-50 p' onClick={handleButton}>Comprar</Button>
      </div>
      
    </div>
  )
}