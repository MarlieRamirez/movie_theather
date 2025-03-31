import Row from 'react-bootstrap/Row';
import { Button, Container, TextField, Typography } from '@mui/material';
import Link from 'next/link';

const user = {
  name: 'Marlie',
  role: 'admin'
}


export default function Home() {
  return (
    <>
      <Container  maxWidth='xs' className='my-5 pt-4 bg-secondary-subtle border-light rounded-4 container-sm '>
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
              <Button className='w-100' variant='contained' color='secondary'>Log in</Button>
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
