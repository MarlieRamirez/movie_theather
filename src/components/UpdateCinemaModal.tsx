import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { setCapacity, setMovieData } from '../../network/lib/cinema';
import { useLocalStorage } from 'usehooks-ts';
import { redirect } from 'next/navigation';

export default function UpdateCinemaModal(props: {
  initValues: {
    id: number,
    rows: number,
    columns: number,
    movie: string,
    img_url: string
  },
  editable: string, handleClose: Function, open: boolean, reload: Function
}) {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')

  const [openAlert, setOpenAlert] = useState(false)
  const [alert, setAlert] = useState('');
  const [code, setCode] = useState('200');

  const [formValues, setFormValues] = useState({
    id: props.initValues.id,
    rows: props.initValues.rows,
    columns: props.initValues.columns,
    movie: props.initValues.movie,
    img_url: props.initValues.img_url
  });

  const handleChange = (value: any, id: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const handleSave = () => {
    console.log('save');

    if (props.editable == 'movie') {
      setMovieData(formValues.id, formValues.movie, formValues.img_url, token)?.then((response) => {
        props.handleClose()
        setAlert(response.data.message)
        setCode('200');

      }).catch((error) => {
        if (error.status == 401) {
          removeToken()
          removeUser()
          redirect('/login');
        }
      }).finally(() => {
        setOpenAlert(true)

        setTimeout(() => {
          setOpenAlert(false)
        }, 3000)

        props.reload()
      })
    }

    if (props.editable == 'capacity') {
      setCapacity(formValues.id, +formValues.rows, +formValues.columns, token)?.then((response) => {

        props.handleClose()
        setCode('200');
        setAlert(response.data.message)

      }).catch((error) => {
        setCode(error.status);
        setAlert(error.response.data.message)
        props.handleClose()

        if (error.status == 401) {
          removeToken()
          removeUser()
          redirect('/login');
        }
      }).finally(() => {
        setOpenAlert(true)

        setTimeout(() => {
          setOpenAlert(false)
        }, 3000)
        props.reload()
      })
    }

  }

  useEffect(() => {
    setFormValues(props.initValues)
  }, [props.initValues])

  return (
    <>
      <div className={'position-in' + (openAlert ? ' front' : alert == '' ? ' none' : ' out')}>
        <Alert className='' severity={code == '200' ? "success" : 'error'} onClose={() => { setOpenAlert(false) }}>
          {alert}
        </Alert>
      </div>


      <Dialog
        fullWidth
        open={props.open}
        onClose={() => props.handleClose()}
      >
        <DialogTitle id="alert-dialog-title">
          {props.editable == 'movie' ? "Modificar pelicula" : props.editable == 'capacity' ? 'Modificar capacidad' : ''}
        </DialogTitle>
        <DialogContent >
          <form action="">
            {props.editable == 'movie' ?
              <>
                <div className='text-field'>
                  <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="movie" label="Película" variant="outlined" value={formValues.movie} />
                </div>

                <div className='text-field'>
                  <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="img_url" label="Imagen url" variant="outlined" value={formValues.img_url} />
                </div>
              </> : props.editable == 'capacity' ?
                <>
                  <div className='text-field'>
                    <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="rows" label="Filas" variant="outlined" value={formValues.rows} />
                  </div>

                  <div className='text-field'>
                    <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="columns" label="Columnas" variant="outlined" value={formValues.columns} />
                  </div>
                </> : <></>}
          </form>
        </DialogContent>
        <DialogActions >
          <Button color='error' onClick={() => props.handleClose()}>Cerrar</Button>
          <Button color='info' variant='outlined' autoFocus onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>


    </>
  )
}
