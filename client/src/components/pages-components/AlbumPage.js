import React, {useEffect, useState, useContext} from 'react'
import {useLocation} from 'react-router-dom'

import PageBanner from '../featured-components/PageBanner'
import PlayListFunctions from '../featured-components/PlayListFunctions'
import TrackList from '../featured-components/TrackList'
import Loading from '../featured-components/Loading'

import useId from '../../utilities/hooks/useId'
import {MessageContext, PlayContext} from '../../utilities/context'
import { getAlbum } from '../../services/musicApi'

export default function AlbumPage() {
    const id = useId()
    const setMessage = useContext(MessageContext)
    const updatePlayer = useContext(PlayContext)
    const [loading, setLoading] = useState(true)

    const highlight = useHighlight()

    const [bannerInfo, setbannerInfo] = useState({
        album_type: 'album',
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: '#262626',
        images: [],
        release_date: ''
    })

    const [tracks, setTracks] = useState([])

    useEffect(() => {
        setTracks([])
        setbannerInfo({
            album_type: 'album',
            name: '',
            description: '',
            user: [],
            followers: 0,
            primary_color: '#262626',
            images: [],
            release_date: ''
        })
        setLoading(true)
        
        if(id){
            getAlbum(id)
            .then((data) => {
                const album_type = data.record_type || 'album'
                const name = data.title || data.name
                const artists = data.artist ? [{ name: data.artist.name, id: data.artist.id }] : []
                const primary_color = '#1a1a2e'
                const trackData = data.tracks?.data || []
                const images = data.cover_medium || data.image ? [{ url: data.cover_medium || data.image }] : []
                const release_date = data.release_date || data.releasedate || ''
                
                setbannerInfo({
                    album_type,
                    name,
                    user: artists,
                    primary_color,
                    images,
                    release_date,
                    followers: data.fans || 0,
                    description: `${trackData.length} songs`
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

    const playContext = () => {
        if (tracks.length > 0 && tracks[0].audio) {
            const audio = new Audio(tracks[0].audio)
            audio.play()
            setTimeout(() => updatePlayer(), 100)
        }
    }

    const playContextTrack = (trackUri) => {
        const track = tracks.find(t => t.audio === trackUri || t.id.toString() === trackUri)
        if (track && track.audio) {
            const audio = new Audio(track.audio)
            audio.play()
            setTimeout(() => updatePlayer(), 100)
        }
    }

    return (
        loading? 
        <Loading />
        :
        <div className='listPage' style={{display: `${tracks.length===0? 'none':'block'}`}}>
            <PageBanner pageTitle={bannerInfo.album_type} bannerInfo={bannerInfo}/>
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                <PlayListFunctions onFollow={() => setMessage('Album followed!')} setMessage={setMessage} playContext={playContext}/>
                <div className="page-content">
                    <TrackList tracks={tracks} highlight={highlight} playContextTrack={playContextTrack}/>
                </div>
            </div>
        </div>
    )
}

function useHighlight(){
    return new URLSearchParams(useLocation().search).get('highlight')
}
