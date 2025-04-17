
'use client'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { deleteUser, getAllUsers } from '../../../network/lib/user';
import { IconButton,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useJwt } from "react-jwt";
import { Block } from '@mui/icons-material';
import DeleteModal from '@/components/DeleteModal';

export default function page() {
  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);
  const [users, setAllUsers] = useState([]);

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
      getAllUsers(token).then((response) => {
        setAllUsers(response.data)
      }).catch((error)=>{
        if(error.status == 401){
          setToken('');
          setUser('')
          redirect('/login');
        }
      })
    }

  }, []);


  const onDelete = ()=>{
    if(isExpired){
      setUser('');
      setToken('')
      redirect('/login')
    }else{
      deleteUser(token, id).then((res)=>{
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
              users.map((e:User)=>
                (
                <TableRow key={'row'+e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.user_name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>
                    <IconButton title='Eliminar' color='error' className='border border-danger mx-2' onClick={()=>handleClickOpen(e.id)}>
                      <Block className='rounded-circle' />
                    </IconButton>
                  </TableCell>
                </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteModal handleClose={handleClose} handleOpen={handleClickOpen} open={open} onDelete={onDelete}/>
    </div>
  )
}
