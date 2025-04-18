import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from '@mui/material';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import { useJwt } from 'react-jwt';
import { useLocalStorage } from 'usehooks-ts';
import { newCinema } from '../../network/lib/cinema';

export default function CreateCinemaModal(props: { handleClose: Function, open: boolean, reload: Function }) {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);

  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState('');

  const [formValues, setFormValues] = useState({
    name: '',
    rows: 0,
    columns: 0,
    movie: '',
    img_url: ''
  });

  const handleChange = (value: any, id: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const onCreate = () => {
    if (isExpired) {
      removeUser()
      removeToken()
      redirect('/login')
    } else {
      newCinema(formValues, token)?.then((res) => {
        props.handleClose()
        setOpenAlert(true)
        setAlert(res.data.message);
        setTimeout(() => {
          setOpenAlert(false)
        }, 3000)
        

      })
    }



    props.reload()
  }

  return (
    <>
      <div className={'position-in' + (openAlert ? ' front' : alert == '' ? ' none' : ' out')}>
        <Alert className='' severity="success" onClose={() => { setOpenAlert(false) }}>
          {alert}
        </Alert>
      </div>

      <Dialog
        fullWidth
        open={props.open}
        onClose={() => props.handleClose()}
      >
        <DialogTitle id="alert-dialog-title">
          Crear nueva sala y funciones
        </DialogTitle>
        <DialogContent>
          <form action="">
            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="name" label="Nombre de la Sala" variant="outlined" value={formValues.name} />
            </div>

            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="movie" label="Película" variant="outlined" value={formValues.movie} />
            </div>

            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="img_url" label="Imagen url" variant="outlined" value={formValues.img_url} />
            </div>
            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="rows" label="Filas" variant="outlined" value={formValues.rows} />
            </div>

            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="columns" label="Columnas" variant="outlined" value={formValues.columns} />
            </div>

          </form>
        </DialogContent>
        <DialogActions >
          <Button color='error' onClick={() => props.handleClose()}>Cerrar</Button>
          <Button color='info' variant='outlined' autoFocus onClick={onCreate}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
