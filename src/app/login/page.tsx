'use client'
import Row from 'react-bootstrap/Row';
import { Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { getUser, login } from '../../../network/lib/user';
import { redirect, RedirectType } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
import { useState } from 'react';

export default function Home() {
  const [user_name, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMSG] = useState("");

  const [value, setValue, removeValue] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')

  const bLogin = () => {
    login(user_name, pwd).then(async response => {
      const token_tmp = response.data.accessToken;
      setMSG('')
      setToken(token_tmp)

      getUser(token_tmp).then((res) => {
        setValue(JSON.stringify(res.data))
      }).finally(()=>{
        redirect('/',RedirectType.replace)
      })
    }).catch((error) => {
      if (error.status == 404) {
        setMSG('Los datos son incorrectos')
        console.log('ERROR: Not found')
      }
    })
  }


  return (
    <>
      <Container maxWidth='xs' className='my-5 pt-4 bg-secondary-subtle border-light rounded-4 container-sm '>
        <Typography className='text-center text-black ' variant='h4'>Login</Typography>


        <Row >
          <form className='w-100 pt-3 mx-auto '>
            <div className='w-100 mx-auto my-4'>
              <TextField onChange={(e) => setUserName(e.target.value)} className='w-100' id="user" label="Usuario" variant="outlined" />
            </div>

            <div className='w-100 mx-auto mb-4'>
              <TextField onChange={(e) => setPwd(e.target.value)} className='w-100' id="Contraseña" type='password' label="Contraseña" variant="outlined" />
            </div>

            <div className='w-100 mx-auto mb-4'>
              <Button className='w-100' variant='contained' color='secondary' onClick={bLogin}>Log in</Button>
            </div>
            <div className='w-100 mx-auto mb-4'>
              <Typography className='text-black'>No tienes una cuenta?
                <Link href='/sign-in' className='text-primary'> <u>Registrate</u></Link>
              </Typography>
            </div>
            <div className='w-100 mx-auto mb-4'>
              <Typography className='text-danger'>{msg}</Typography>
            </div>
          </form>
        </Row>

      </Container>

    </>
  );
}
