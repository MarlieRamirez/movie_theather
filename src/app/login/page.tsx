'use client'
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { getUser, login, signIn } from '../../../network/lib/user';
import { redirect, RedirectType } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user_name, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");//700

  const [msg, setMSG] = useState("");

  const [page, setPage] = useState('Login');
  const [element, setElement] = useState(<></>);

  const [value, setValue, removeValue] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')

  const bLogin = () => {
    login(user_name, pwd).then(async response => {
      const token_tmp = response.data.accessToken;
      setMSG('')
      setToken(token_tmp)

      getUser(token_tmp).then((res) => {
        setValue(JSON.stringify(res.data))
      }).finally(() => {
        redirect('/', RedirectType.replace)
      })
    }).catch((error) => {
      if (error.status == 404) {
        setMSG('Los datos son incorrectos')
        console.log('ERROR: Not found')
      }
    })
  }

  const bRegistrate = () => {
    if (email == '' || pwd == '' || user_name == '') {
      setMSG('Todos los campos son requeridos')
    } else {
      setMSG('')
      signIn(user_name, email, pwd).then((response) => {
        if (response.status == 500) {
          setMSG('Este usuario esta siendo utilizado')
        }
        else{
          bLogin()
        }

      })
    }
  }

  //Handle Page
  const handleChangePage = () => {
    setMSG('')

    if (page == 'Login') {
      setPage('Crear Cuenta')
    } else {
      setPage('Login')
    }
  }

  useEffect(() => {
    if (page == 'Crear Cuenta') {
      setElement(
        <div className='w-100 p'>
          <TextField onChange={(e) => setEmail(e.target.value)} className='w-100' id="email" type='email' label="Email" variant="outlined" />
        </div>
      )
    } else {
      setElement(<></>);
    }
  }, [page])

  return (
    <>
      <Container maxWidth='xs' className='login my-5  bg-secondary-subtle rounded-4 container-sm '>
        <Typography className='text-center p' variant='h4'>{page}</Typography>


        <Box >
          <form className=''>
            <div className='w-100 p'>
              <TextField onChange={(e) => setUserName(e.target.value)} className='w-100' id="user" label="Usuario" variant="outlined" />
            </div>
            {element}
            <div className='w-100 p'>
              <TextField onChange={(e) => setPwd(e.target.value)} className='w-100' id="Contraseña" type='password' label="Contraseña" variant="outlined" />
            </div>

            <div className='w-100 p'>
              <Button className='w-100' variant='contained' color='secondary' onClick={page == 'Login' ? bLogin : bRegistrate}>{page}</Button>
            </div>

            <div className='w-100 p'>
              <Typography className='text-black text-center'>{page == 'Login' ? "No tienes una cuenta?" : "Ya tienes una cuenta?"}
                <Button className='text-capitalize' variant='text' onClick={handleChangePage}> <u>{page == 'Login' ? 'Registrate' : 'Inicia Sesion'}</u></Button>
              </Typography>
            </div>
            <div className='w-100'>
              <Typography className='text-danger'>{msg}</Typography>
            </div>
          </form>
        </Box>

      </Container>

    </>
  );
}
