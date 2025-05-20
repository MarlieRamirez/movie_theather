
'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Alert, Button, CardMedia, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useJwt } from "react-jwt";
import { Add, Block, Delete, Grid3x3, MovieRounded } from '@mui/icons-material';
import { deleteCinema, getAdminCinemas } from '../../../network/lib/cinema';
import dateFormat from "dateformat";
import DeleteModal from '@/components/DeleteModal';
import CreateCinemaModal from '@/components/CreateCinemaModal';
import UpdateCinemaModal from '@/components/UpdateCinemaModal';
import LoadingComponent from '@/components/LoadingComponent';

export default function page() {
  //Manage user
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);

  //state of modals
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

  //state of data recover
  const [isLoading, setIsLoading] = useState(true);


  //state delete alert
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState('');

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


  const handleDeleteModal = (id?: number) => {
    setId(id ? id : 0);
    setOpenDelete(!openDelete)
  }

  const handleCreate = () => {
    setOpenCreate(!openCreate);
  };

  const onDelete = () => {
    if (isExpired) {
      removeUser()
      removeToken()
      redirect('/login')
    } else {
      handleDeleteModal();

      deleteCinema(token, id).then((res) => {
        setAlert(res.data.message + '-')
        setOpenAlert(true)

        setTimeout(() => {
          setOpenAlert(false)
        }, 3000)

        getAdminCinemas(token).then((response) => {
          setFutureCinema(response.data)
        });
      })

    }
  }

  const reload = () => {
    if (!isExpired && JSON.parse(user).role == 'admin') {
      getAdminCinemas(token).then((response) => {
        setFutureCinema(response.data)
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
          <h2 className='text-center '>Administración de salas</h2>
        </div>

        <Button className='outline' color='info' variant='contained' onClick={handleCreate}> <Add className='m-1' /> Nueva Sala</Button>
      </div>
      <div className="divider"></div>
      
      <div className='d-flex justify-content-center '>
        {
          isLoading ?
            <LoadingComponent/>
            :
            <TableContainer component={Paper} className='w-75 table'>
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
                        <TableCell>Del {dateFormat(e.init_date, 'UTC:dd/mm/yyyy')} al {dateFormat(e.final_date, 'UTC:dd/mm/yyyy')}</TableCell>
                        <TableCell>

                          {
                            new Date(e.final_date) > new Date() ? 
                            
                              <>

                                <IconButton title='Editar pelicula' color='warning' className='border-warning h-warning' onClick={() => handleClickOpen('movie', e.movie, e.img, e.id)} >
                                  <MovieRounded className='' />
                                </IconButton>

                                <IconButton title='Editar capacidad' color='warning' className='border-warning h-warning' onClick={() => handleClickOpen('capacity', e.rows, e.columns, e.id)} >
                                  <Grid3x3 />
                                </IconButton>

                                <IconButton title='Eliminar Sala' color='error' className='border-danger h-danger' onClick={() => handleDeleteModal(e.id)} >
                                  <Delete />
                                </IconButton>

                              </> :
                              <div className='d-flex content-danger my'><Block color='error' /> <p className='text-danger'>Esta sala ya ha expirado</p></div>
                          }


                        </TableCell>
                      </TableRow>
                    )
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
        }




        <DeleteModal handleClose={handleDeleteModal} open={openDelete} onDelete={onDelete} />

        <div className={'position-in' + (openAlert ? ' front' : alert == '' ? ' none' : ' out')}>
          <Alert className='' severity="success" onClose={() => { setOpenAlert(false) }}>
            {alert}
          </Alert>
        </div>

        <CreateCinemaModal reload={reload} handleClose={handleCreate} open={openCreate} />

        <UpdateCinemaModal reload={reload} initValues={formValues} editable={editable} handleClose={handleClose} open={open} />

      </div>
    </>
  )
}
