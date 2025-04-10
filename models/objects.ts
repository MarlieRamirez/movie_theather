type User = {
  id: number;
  user_name:string;
  email:string
}

type Cinema = {
  id: number
  name:string
  rows:number
  columns:number
  movie:string
  img:string
  init_date:string
  final_date:string
}

type Schedule ={
  id: number
  date:string
  time:string
  id_cinema:number
}