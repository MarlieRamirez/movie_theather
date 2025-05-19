type User = {
  id: number;
  user_name: string;
  email: string
}

type Cinema = {
  id: number
  name: string
  rows: number
  columns: number
  movie: string
  img: string
  init_date: string
  final_date: string
}

type Schedule = {
  id: number
  date: string
  time: string
  id_cinema: number
}

type Seat = {
  full_name: string,
  column: number,
  rows: number,
  id_user: number,
  id_schedule: number
}

type Card = { 
  name: string, 
  number: string
}