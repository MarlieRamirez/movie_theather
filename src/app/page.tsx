'use client'

import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid2, ListItem, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFuture, getSchedules } from "../../network/lib/cinema";
import dateFormat from "dateformat";
import Link from "next/link";
import LoadingComponent from "@/components/LoadingComponent";

export default function Home() {

  const [data, setData] = useState([]);
  const [schedule, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //MODAL
  const [open, setOpen] = useState(false);

  const handleModal = () =>{
    setOpen(!open)
  }
  
  //DATA
  useEffect(() => {
    getFuture().then(response => {
      return setData(response.data);
    })
    setIsLoading(false)
  }, []);

  //SCHEDULE on click
  function retrieve(id: number) {
    getSchedules(id.toString()).then((response) => {
      return setSchedules(response.data);
    })

    handleModal()
  }

  return (
    <div className='m-4 p-4 align-center'>
      <div>
        {
          isLoading ?
            <div className=" d-flex justify-content-center">
              <LoadingComponent />
            </div>
            :
            <>
              <Box>
                <Grid2 container spacing={5}>
                  {data.map((e: Cinema) => (
                    <>
                      <Card sx={{ minWidth: 245, maxWidth: 300 }} key={e.id}>
                        <CardMedia
                          component='img'
                          height='300'
                          src={e.img}
                          title="green iguana" />
                        <CardContent>
                          <Typography variant="h5" component="div">
                            {e.movie}
                          </Typography>
                          <Typography variant="h6" component="div">
                            {e.name}
                          </Typography>

                          <Divider></Divider>
                          <Typography variant="body1" >
                            Del {dateFormat(e.init_date, 'dd/mm/yyyy')} al {dateFormat(e.final_date, 'dd/mm/yyyy')}
                          </Typography>
                          <br />

                          <Button className="w-100" variant="contained" color="secondary" onClick={() => retrieve(e.id)}>Reservar</Button>

                        </CardContent>
                      </Card>
                    </>
                  ))}
                </Grid2>
              </Box>
            </>
        }


        <Dialog open={open} onClose={handleModal}>
          <DialogTitle>Fechas disponibles</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Elija la fecha para su reservación para proceder a elegir su asiento
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            <div>
              {
                schedule.map((element: Schedule) => (
                  <Link key={element.id} href={{ pathname: '/reservation', query: { id: element.id, cinema: element.id_cinema } }} >
                    <Button className="w-min mx-4 my-2 p-2" variant="contained" color="secondary">{dateFormat(element.date, 'dd/mm/yyyy')}</Button>
                  </Link>
                ))
              }
            </div>

          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}
