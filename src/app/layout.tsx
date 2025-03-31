'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { MovieCreationTwoTone } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from 'next/link';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const user = null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  var button;

  if (user) {
    button = (<>
      <Button color="inherit" >Logout</Button>
    </>)
  } else {
    button = (<>
      <div>
        <Button color="inherit" onClick={() => router.push('/login')}>Login</Button>
      </div>
      <div>
        <Link href='/sign-in'>
          <Button color="inherit">Nueva Cuenta</Button>
        </Link>
      </div>

    </>)
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => router.push('/')}
            >
              <MovieCreationTwoTone />

            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cinemas
            </Typography>
            {button}
          </Toolbar>
        </AppBar>

        {children}
      </body>
    </html>
  );
}
