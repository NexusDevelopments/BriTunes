import React, {useEffect, useState, useContext} from 'react'

import PageBanner from '../featured-components/PageBanner'
import TrackList from '../featured-components/TrackList'
import Loading from '../featured-components/Loading'

import useId from '../../utilities/hooks/useId'
import {MessageContext} from '../../utilities/context'
import { getPlaylist } from '../../services/musicApi'

export default function PlayListPage() {
    const id = useId()
    const setMessage = useContext(MessageContext)
    const [loading, setLoading] = useState(true)

    const [bannerInfo, setbannerInfo] = useState({
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: '#262626',
        images: [],
        total: 0
    })

    const [tracks, setTracks] = useState([])

    useEffect(() => {
        setTracks([])
        setLoading(true)
        
        if(id){
            getPlaylist(id)
            .then((data) => {
                const name = data.title || data.name
                const trackData = data.tracks?.data || []
                const images = data.picture_medium ? [{ url: data.picture_medium }] : []
                
                setbannerInfo({
                    name,
                    description: `${trackData.length} songs`,
                    user: [],
                    followers: 0,
                    primary_color: '#1a1a2e',
                    images,
                    total: trackData.length
                })
                setTracks(trackData)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                setMessage(`ERROR: ${error}`)
            })
        }
    // eslint-disable-next-line
    }, [id])

    return (
        loading? 
        <Loading />
        :
        <div className='listPage'>
            <PageBanner pageTitle='Playlist' bannerInfo={bannerInfo}/>
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                <div className="page-content">
                    <TrackList tracks={tracks} />
                </div>
            </div>
        </div>
    )
}
