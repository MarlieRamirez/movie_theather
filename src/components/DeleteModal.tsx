import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

export default function DeleteModal(props: {onDelete: Function, handleOpen: Function, handleClose: Function, open:boolean}) {
  
  return (
    <>
      <Dialog
        open={props.open}
        onClose={()=> props.handleClose()}
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
          <Button onClick={()=> props.handleClose()}>Cerrar</Button>
          <Button color='error' onClick={() => props.onDelete()} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
