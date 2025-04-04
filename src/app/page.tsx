'use client'

import styles from "./page.module.css";
import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid2, ListItem, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFuture, getSchedules } from "../../network/lib/cinema";
import dateFormat from "dateformat";
import Link from "next/link";

export default function Home() {

  const [data, setData] = useState([{
    id: 0,
    img: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    name: '',
    init_date: '',
    final_date: '',
  }]);

  const [schedule, setSchedules] = useState([]);
  //MODAL
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //DATA
  useEffect(() => {
    getFuture().then(response => {
      return setData(response.data);
    })

  }, []);

  //SCHEDULE on click
  function retrieve(id: number) {
    getSchedules(id.toString()).then((response) => {
      return setSchedules(response.data);
    })

    handleClickOpen()
  }

  return (
    <div className='m-4 p-4 align-center'>
      <div>
        <Box>
          <Grid2 container spacing={5}>
            {data.map(e => (
              <>
                <Card sx={{ minWidth: 245, maxWidth: 300 }} key={e.id}>
                  <CardMedia
                    component='img'
                    height='300'
                    src={e.img}
                    title="green iguana" />
                  <CardContent>
                    <Typography variant="h5" component="div">
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

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Fechas disponibles</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Elija la fecha para su reservación para proceder a elegir su asiento
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            {
              schedule.map((element) => (
                <Link key={element.id} href={{pathname: '/reservation',query:{id: element.id, cinema:element.id_cinema}}} >
                  <Button className="w-100" variant="contained" color="secondary">{dateFormat(element.date, 'dd/mm/yyyy')}</Button>
                </Link>
              ))
            }
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}
