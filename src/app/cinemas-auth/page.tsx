
'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,  IconButton,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useJwt } from "react-jwt";
import { Block, Edit, Grid3x3, MovieRounded } from '@mui/icons-material';
import { getFuture } from '../../../network/lib/cinema';
import dateFormat from "dateformat";

export default function page() {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);
  const [cinemas, setFutureCinema] = useState([]);

  //ELIMINAR
  const [id, setUserID] = useState(0);
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = (id:number) => {
    setUserID(id);
    setOpen(true);
  };

  const handleClose = () => {
    setUserID(0);
    setOpen(false);
  };

  useEffect(() => {
    if (isExpired || JSON.parse(user).role != 'admin') {
      redirect('/');
    } else {
      getFuture().then((response) => {
        setFutureCinema(response.data)
      }).catch((error)=>{
        if(error.status == 401){
          setToken('');
          setUser('')
          redirect('/login');
        }
      })
    }

  }, []);



  return (
    <div className='m-4 p-4 d-flex justify-content-center '>
      <TableContainer component={Paper} className='w-75'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Pelicula</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Fechas de disponibilidad</TableCell>
              <TableCell>Accion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              cinemas.map((e:Cinema)=>
                (
                <TableRow key={'row'+e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.movie}</TableCell>
                  <TableCell>{e.rows} x {e.columns}</TableCell>
                  <TableCell>Del {dateFormat(e.init_date, 'dd/mm/yyyy')} al {dateFormat(e.final_date, 'dd/mm/yyyy')}</TableCell>
                  <TableCell>
                    

                    <IconButton  title='Editar pelicula' color='warning' className='border border-warning mx-2' >
                      <MovieRounded className='rounded-circle' />
                    </IconButton>

                    <IconButton title='Editar capacidad' color='warning' className='border border-warning mx-2' >
                      <Grid3x3 className='rounded-circle' />
                    </IconButton>
                  </TableCell>
                </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar el registro?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta seguro que desea eliminar permanentemente el registro seleccionado?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button color='error'  autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
