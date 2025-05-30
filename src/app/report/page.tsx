'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useJwt } from "react-jwt";
import { Add } from '@mui/icons-material';
import { deleteCinema, getAdminCinemas, getReportSeats } from '../../../network/lib/cinema';
import dateFormat from "dateformat";
import LoadingComponent from '@/components/LoadingComponent';

export default function page() {
  //Manage user
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);

  //state of modals
  const [cinemas, setFutureCinema] = useState([]);
  const [money, setMoney] = useState(0);
  const [quantity, setQuantity] = useState(0);

  //state of data recover
  const [isLoading, setIsLoading] = useState(true);

  const reload = () => {
    if (!isExpired && JSON.parse(user).role == 'admin') {
      getReportSeats(token).then((response) => {
        setFutureCinema(response.data.seats)
        setMoney(response.data.ingresos)
        setQuantity(response.data.quantity)

        setIsLoading(false)
      }).catch((error) => {
        if (error.status == 401) {
          removeToken()
          removeUser()
          redirect('/login');
        }
      })
    } else {
      redirect('/');
    }
  }

  useEffect(() => {
    reload()
  }, []);

  return (
    <>
      <div className=' d-flex title-action title justify-content-between '>
        <div className='w-100'>
          <h2 className='text-center '>Reporte de ventas siguiente 8 días</h2>
        </div>
      </div>
      
      <div className="divider"></div>
      <div className='d-flex justify-content-center '>
        {
          isLoading ?
            <LoadingComponent />
            :
            <TableContainer component={Paper} className='w-75 table'>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre de Asiento</TableCell>
                    <TableCell>Columna</TableCell>
                    <TableCell>Fila</TableCell>
                    <TableCell>Fecha</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    cinemas.map((e: Seat) =>
                    (
                      <TableRow key={e.full_name + '-' + e.id_schedule}>
                        <TableCell>{e.full_name}</TableCell>
                        <TableCell>{e.column}</TableCell>
                        <TableCell>{e.row}</TableCell>
                        <TableCell>Del {dateFormat(e.date, 'UTC:dd/mm/yyyy')}</TableCell>
                      </TableRow>
                    )
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
        }

      </div>

      <div className="footer">
        <div className=' d-flex title-action justify-content-between report'>
          <h2 className='normal'>Cantidad vendida: {quantity}</h2>
          <div className='grow'></div>
          <h2 className='normal '>Ingresos: ${money}</h2>

        </div>
        
        <div className=' d-flex title-action justify-content-between perdida'>
          <h2 className='normal'>Ventas esperadas por mes: {100}</h2>
          <div className='grow'></div>
          <h2 className='normal'>Perdidas hipoteticas: ${(100 - quantity) * 5}</h2>
        </div>
        
      </div>
    </>
  )
}