import React from 'react'
import { Bars, ThreeDots } from 'react-loader-spinner'

export default function Loading({type}) {
    return (
        <div className='loading'>
        {type === 'app'? 
        <Bars 
            color='#1db954'
            height={80}
            width={80}/>
        :
        <ThreeDots 
            color='#fff'
            height={80}
            width={80}/>}
        </div>
    )
}
