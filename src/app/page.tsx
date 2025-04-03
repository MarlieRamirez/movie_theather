'use client'

import styles from "./page.module.css";
import { Box, Button, Card, CardContent, CardMedia, Divider, Grid2, ListItem, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFuture } from "../../network/lib/cinema";
import dateFormat from "dateformat";
import Link from "next/link";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    getFuture().then(response => {
      return setData(response.data);
    })

  }, []);

  

  return (
    <div className={styles.page}>
      <div>
        <Box>
          <Grid2 container spacing={5}>
            {data.map(e => (
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

                  <Link href={'/schedule?id='+ e.id}>
                    <Button className="w-100" variant="contained" color="secondary">Reservar</Button>
                  </Link>

                </CardContent>

              </Card>
            ))}
          </Grid2>
        </Box>

      </div>

    </div>
  );
}
