
'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useJwt } from "react-jwt";
import { Add, Block, Delete, Edit, Grid3x3, MovieRounded, Update } from '@mui/icons-material';
import { deleteCinema, getAdminCinemas, getCinema, setCapacity, setMovieData } from '../../../network/lib/cinema';
import dateFormat from "dateformat";
import DeleteModal from '@/components/DeleteModal';
import CreateCinemaModal from '@/components/CreateCinemaModal';
import UpdateCinemaModal from '@/components/UpdateCinemaModal';

export default function page() {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);
  //state
  const [cinemas, setFutureCinema] = useState([]);
  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState('');

  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  //state forms
  const [formValues, setFormValues] = useState({
    id: 0,
    rows: 0,
    columns: 0,
    movie: '',
    img_url: ''
  });

  const [id, setId] = useState(0);

  const handleClickOpen = (edit: string, first_data: any, second_data: any, id: number) => {
    setEditable(edit);
    setId(id);

    if (edit == 'movie') {
      setFormValues({        
        id: id,
        rows: 0,
        columns: 0,
        movie: first_data,
        img_url: second_data,
        
      })
    }

    if (edit == 'capacity') {
      setFormValues({
        id: id,
        rows: +first_data,
        columns: +second_data,
        movie: '',
        img_url: '',
        
      })
    }
    setOpen(true);
  };


  //OPEN CREATE 
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  //HANDLE DELETE FUNCTIONS
  const hanldeOpenDelete = (id: number) => {
    setId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setId(0);
    setOpenDelete(false);
  };

  const onDelete = () => {
    if (isExpired) {
      removeUser()
      removeToken()
      redirect('/login')
    } else {
      handleClose();

      deleteCinema(token, id).then((res) => {
        getAdminCinemas(token).then((response) => {

          setFutureCinema(response.data)
        });
      })
    }
  }

  //HANDLE UPDATE FUNCTIONS
  const handleClose = () => {
    setId(0)
    setEditable('');
    setFormValues({
      id: 0,
      rows: 0,
      columns: 0,
      movie: '',
      img_url: ''
    })
    setOpen(false);
  };

  useEffect(() => {
    if (!isExpired && JSON.parse(user).role == 'admin') {
      getAdminCinemas(token).then((response) => {
        setFutureCinema(response.data)
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

  }, []);

  return (
    <>
      <div className='m-4 d-flex justify-content-between '>
        <div className='w-100 mt-3'>
          <h2 className='text-center '>Administración de salas</h2>
        </div>

        <Button className='' color='info' variant='contained' onClick={handleOpenCreate}> <Add className='m-1' /> Nueva Sala</Button>
      </div>
      <div className='divider mb-3'></div>
      <div className='d-flex justify-content-center '>

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
                cinemas.map((e: Cinema) =>
                (
                  <TableRow key={'row' + e.id}>
                    <TableCell>{e.id}</TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.movie}</TableCell>
                    <TableCell>{e.rows} x {e.columns}</TableCell>
                    <TableCell>Del {dateFormat(e.init_date, 'dd/mm/yyyy')} al {dateFormat(e.final_date, 'dd/mm/yyyy')}</TableCell>
                    <TableCell>

                      {
                        dateFormat(e.final_date, 'dd/mm/yyyy') > dateFormat(new Date(), 'dd/mm/yyyy') ?
                          <>

                            <IconButton title='Editar pelicula' color='warning' className='border border-warning mx-2' onClick={() => handleClickOpen('movie', e.movie, e.img, e.id)} >
                              <MovieRounded className='rounded-circle' />
                            </IconButton>

                            <IconButton title='Editar capacidad' color='warning' className='border border-warning mx-2' onClick={() => handleClickOpen('capacity', e.rows, e.columns, e.id)} >
                              <Grid3x3 className='rounded-circle' />
                            </IconButton>

                            <IconButton title='Eliminar Sala' color='error' className='border border-danger mx-2' onClick={() => hanldeOpenDelete(e.id)} >
                              <Delete className='rounded-circle' />
                            </IconButton>

                          </> :
                          <div className='text-danger'><Block color='error' /> Esta sala ya ha expirado</div>
                      }


                    </TableCell>
                  </TableRow>
                )
                )
              }
            </TableBody>
          </Table>
        </TableContainer>

        <DeleteModal handleClose={handleCloseDelete} open={openDelete} onDelete={onDelete} />

        <CreateCinemaModal handleClose={handleCloseCreate} open={openCreate} />

        <UpdateCinemaModal initValues={formValues} editable={editable} handleClose={handleClose} open={open} />

        {/* 1000 */}

      </div>
    </>
  )
}
