'use client'
import Row from 'react-bootstrap/Row';
import { Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { getUser, login } from '../../../network/lib/user';
import { redirect, RedirectType } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';

export default function Home() {
  const [value, setValue, removeValue] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')

  const bLogin = () => {
    login('admin', '123').then(async response => {
      const token_tmp = response.data.accessToken;

      if (response.status == 404) {
        console.log('404')
      } else {
        setToken(token_tmp)

        getUser(token_tmp).then((res) => {
          setValue(JSON.stringify(res.data))
        })
        redirect('/')
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
              <TextField className='w-100' id="user" label="Usuario" variant="outlined" />
            </div>

            <div className='w-100 mx-auto mb-4'>
              <TextField className='w-100' id="Contraseña" type='password' label="Contraseña" variant="outlined" />
            </div>

            <div className='w-100 mx-auto mb-4'>
              <Button className='w-100' variant='contained' color='secondary' onClick={bLogin}>Log in</Button>
            </div>
            <div className='w-100 mx-auto mb-4'>
              <Typography className='text-black'>No tienes una cuenta?
                <Link href='/sign-in' className='text-primary'> <u>Registrate</u></Link>
              </Typography>
            </div>


          </form>
        </Row>

      </Container>

    </>
  );
}
