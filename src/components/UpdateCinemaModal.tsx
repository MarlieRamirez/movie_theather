import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

export default function UpdateCinemaModal(props: {
  initValues: {
    id: number,
    rows: number,
    columns: number,
    movie: string,
    img_url: string
  },
  editable: string, handleSave: Function, handleClose: Function, open: boolean
}) {

  const [formValues, setFormValues] = useState({
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

  useEffect(() => {
    setFormValues(props.initValues)
  }, [props.initValues])

  return (
    <>
      <Dialog
        fullWidth
        open={props.open}
        onClose={() => props.handleClose()}
      >
        <DialogTitle id="alert-dialog-title">
          {props.editable == 'movie' ? "Modificar pelicula" : props.editable == 'capacity' ? 'Modificar capacidad' : ''}
        </DialogTitle>
        <DialogContent>
          <form action="">
            {props.editable == 'movie' ?
              <>
                <div className='w-100 mx-auto my-4'>
                  <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="movie" label="Película" variant="outlined" value={formValues.movie} />
                </div>

                <div className='w-100 mx-auto my-4'>
                  <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' id="img_url" label="Imagen url" variant="outlined" value={formValues.img_url} />
                </div>
              </> : props.editable == 'capacity' ?
                <>
                  <div className='w-100 mx-auto my-4'>
                    <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="rows" label="Filas" variant="outlined" value={formValues.rows} />
                  </div>

                  <div className='w-100 mx-auto my-4'>
                    <TextField onChange={(e) => handleChange(e.target.value, e.target.id)} className='w-100' type='number' id="columns" label="Columnas" variant="outlined" value={formValues.columns} />
                  </div>
                </> : <></>}
          </form>
        </DialogContent>
        <DialogActions >
          <Button color='error' onClick={() => props.handleClose()}>Cerrar</Button>
          <Button color='info' variant='outlined' autoFocus onClick={() => props.handleSave()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
