
'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { deleteUser, getAllUsers } from '../../../network/lib/user';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useJwt } from "react-jwt";

export default function page() {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);
  const [users, setAllUsers] = useState([]);
  const [id, setUserID] = useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id:number) => {
    setUserID(id);
    setOpen(true);
  };

  const handleClose = () => {
    setUserID(0);
    setOpen(false);
  };

  useEffect(() => {
    if (JSON.parse(user).role != 'admin') {
      redirect('/');
    } else {
      getAllUsers(token).then((response) => {
        setAllUsers(response.data)
      })
    }

  }, []);


  const onDelete = ()=>{
    if(isExpired){
      setUser('');
      redirect('/login')
    }else{
      deleteUser(token, id).then((response)=>{
        getAllUsers(token).then((response) => {
          setAllUsers(response.data)
          handleClose();
        });
      })
    }
  }

  return (
    <div className='m-4 p-4 d-flex justify-content-center '>
      <TableContainer component={Paper} className='w-75'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Accion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users.map((e)=>
                (
                <TableRow key={'row'+e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.user_name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>
                    <Button variant='outlined' color='error' onClick={()=>handleClickOpen(e.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
                )//()=>{onDelete(e.id)}
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
          <Button onClick={handleClose}>Atras</Button>
          <Button color='error' onClick={onDelete} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
