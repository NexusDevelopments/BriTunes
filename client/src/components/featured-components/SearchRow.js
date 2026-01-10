import React, {useEffect, useState} from 'react'

import { searchMusic } from '../../services/musicApi'

import SearchRowTitle from './SearchRowTitle'
import SearchRowGrid from './SearchRowGrid'

export default function SearchRow({title, type, query}) {
    const [result, setResult] = useState([])

    useEffect(() => {
        if (query.length > 0){
            searchMusic(query, type)
                .then((data) => {
                    const results = data.data || []
                    setResult(results)
                })
                .catch((error) => {
                    console.log(error)
                    setResult([])
                })
        } else {
            setResult([])
        }
    }, [query, type])


    return (
        <div className='CollectionRow' style={{display: result.length===0? 'none':'grid'}}>
            <SearchRowTitle title={title}/>
            <SearchRowGrid type={type} info={result}/>
        </div>
    )
}
