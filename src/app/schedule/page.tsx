'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getSchedules } from '../../../network/lib/cinema';
import Head from 'next/head';

export default function page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [schedule, setSchedules] = useState([]);

    if(id){
        useEffect(() => {
            getSchedules(id).then((response)=>{
                return setSchedules(response.data);
            })
        
          }, []);
        
    }
    

    return (
        <>
        <Head>
            <title>Schedules</title>
        </Head>
        <div>page - {id}</div>
        <div>{schedule.map((e)=>e.id)}</div>
        </>
    )
}
