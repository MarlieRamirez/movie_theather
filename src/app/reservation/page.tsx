'use client'
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Step, StepLabel, Stepper, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';
import { useJwt } from 'react-jwt';
import CinemaCapacity from '@/components/CinemaCapacity';
import { getCinema, saveSeat } from '../../../network/lib/cinema';
import SeatsBill from '@/components/SeatsBill';
import ConfirmBill from '@/components/ConfirmBill';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

export default function page() {
  const steps = ['Seleccionar asientos a reservar', 'Ingresar datos para compra', 'Confirmar información'];

  const [user, setUser, removeUser] = useLocalStorage('user', '')
  const [token, setToken, removeToken] = useLocalStorage('token', '')
  const { decodedToken, isExpired } = useJwt(token);

  const searchParams = useSearchParams();
  const cinemaID = searchParams.get('cinema');
  const id = searchParams.get('id');

  const [msg, setMsg] = useState('');
  const [qr, setQR] = useState(<></>);
  const [qrMsg, setQRMsg] = useState('');
  const [dataUrl, setDataURL] = useState('');

  const [cinema, setCinema] = useState({
    id: 0,
    name: '',
    rows: 0,
    columns: 0,
    movie: '',
    img: '',
    init_date: '',
    final_date: ''
  });
  const [saved, setSaved] = useState([{
    full_name: '',
    rows: 0,
    column: 0,
    id_user: 0,
    id_schedule: id ? +id : 0
  }]);

  const qrRef = useRef(null)



  //SETUP

  if (cinemaID && !isExpired) {
    useEffect(() => {

      getCinema(cinemaID).then((response) => {
        setCinema(response.data)
      });


    }, []);
  } else {
    removeToken()
    removeUser()
    redirect('/login')
  }

  //FORM

  const [form, setForm] = useState({
    name: '',
    number: '',
    code: ''
  });

  const handleChange = (value: any, id: string) => {
    setForm((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };


  const handleSaved = (row: number, column: number) => {
    if (saved.length == 0 || saved[0].full_name == '') {
      setSaved([{
        full_name: String.fromCharCode(65 + row) + '' + column,
        rows: row,
        column: column,
        id_user: user ? JSON.parse(user).id : 0,
        id_schedule: id ? +id : 0
      }])
    } else {
      const prev = saved.findIndex((e) => e.full_name === String.fromCharCode(65 + row) + '' + column)

      if (prev != -1) { //if found
        setSaved(saved.filter((e) => e.full_name != String.fromCharCode(65 + row) + '' + column))
      } else {
        setSaved([...saved, {
          full_name: String.fromCharCode(65 + row) + '' + column,
          rows: row,
          column: column,
          id_user: user ? JSON.parse(user).id : 0,
          id_schedule: id ? +id : 0
        }])
      }

    }
  }

  // HANDLE STEPS
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === 0) {
      if (saved.length != 0 && saved[0].full_name != '') {
        setMsg('')
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setMsg('Seleccione al menos 1 butaca')
      }
    }

    if (activeStep === 1) {
      if (form.name != '' && form.number != '' && form.code != '') {
        setMsg('')
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setMsg('Ingrese los datos para la compra')
      }
    }

    if (activeStep === 2) {
      saved.forEach((e) => {
        saveSeat(token, e)
      })

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    if (qrRef.current) {
      toPng(qrRef.current, { cacheBust: true, skipFonts: true })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = 'qr-code.png'
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.log(err)
        })
    }
    setActiveStep(0);
  };



  //QRMSG

  useEffect(() => {
    if (activeStep == steps.length) {
      setQRMsg(' Nombre en tarjeta: ' + form.name + ' \n Numero en tarjeta: ' + form.number + '\n Asientos reservados: ' + saved.map((e) => e.full_name + '') + ' \n Fecha de pelicula:  \n Horario: 10 a.m \n ');
    }
  }, [activeStep])

  return (
    <>

      <Box className='w-75 light color-black'>
        <div className='title-light color-black'>
          <h2>Reservar asiento</h2>
        </div>

        <div className='stepper'>

          <Stepper activeStep={activeStep} className='d-flex justify-content-center'>

            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {};


              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>

        {activeStep === steps.length ? (
          <div className='text-center'>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Reservación realizada correctamente, escanee el codigo para más detalles
            </Typography>

            <div ref={qrRef}>
              <QRCode value={qrMsg} />
            </div>
            

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button onClick={handleReset} color="success" variant='outlined'>Descargar QR</Button>
            </Box>
          </div>
        ) : (
          <>

            {
              activeStep === 0 ?

                <CinemaCapacity cinema={cinema} saved={saved} handleSaved={handleSaved} /> :
                activeStep === 1 ?
                  <SeatsBill values={form} handleChange={handleChange} cinema={cinema} saved={saved} />
                  :
                  activeStep === 2 ?
                    <ConfirmBill card={form} cinema={cinema} saved={saved} /> :
                    <></>
            }

            <Typography color='error' className='text-center'>{msg}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="secondary"
                variant='outlined'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atras
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button onClick={handleNext} color="secondary" variant='outlined'>
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>

  )//16:00
}