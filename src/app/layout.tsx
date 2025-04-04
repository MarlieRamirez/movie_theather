'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { MovieCreationTwoTone } from "@mui/icons-material";

import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [menu, setMenu] = useState(<></>)
  const [user, setUser] = useState({})
  
  const [value, setValue, removeValue] = useLocalStorage('user', '')
  const [token, settoken, removeToken] = useLocalStorage('token', '')

  useEffect(() => {
    console.log('cambio')

    if (value !== '') {
      setMenu(
        <>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </>
      )
    } else {
      setMenu(
        <>
          <div>
            <Link href='/login'>
              <Button color="inherit">Login</Button>
            </Link>
          </div>
          <div>
            <Link href='/sign-in'>
              <Button color="inherit">Nueva Cuenta</Button>
            </Link>
          </div>

        </>
      )
    }
  }, [value])

  const logout = () => {
    removeValue();
    removeToken()
  }

  return (
    <html lang="en">
      <Head>
        <title>My page title</title>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppBar position="static">
          <Toolbar>
            <Link href='/'>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MovieCreationTwoTone />

              </IconButton>
            </Link>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cinemas
            </Typography>
            {menu}
          </Toolbar>
        </AppBar>

        {children}
      </body>
    </html>
  );
}
