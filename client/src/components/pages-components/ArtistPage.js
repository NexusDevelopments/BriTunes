import React, {useState, useEffect, useContext} from 'react'

import { getArtist, getArtistTopTracks, getArtistAlbums } from '../../services/musicApi'
import useId from '../../utilities/hooks/useId'
import {MessageContext, PlayContext} from '../../utilities/context'

import PageBanner from '../featured-components/PageBanner'
import PlayListFunctions from '../featured-components/PlayListFunctions'
import CollectionRow from '../featured-components/CollectionRow'
import Loading from '../featured-components/Loading'

export default function ArtistPage() {
    const id = useId('artist')
    const setMessage = useContext(MessageContext)
    const [loading, setLoading] = useState(true)
    const setPlay = useContext(PlayContext)

    const [bannerInfo, setbannerInfo] = useState({
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: 'rgb(83, 83, 83)',
        images: [],
        total: 0
    })

    const [tracks, setTracks] = useState([])
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        setTracks([])
        setAlbums([])
        setLoading(true)
        
        if (id) {
            Promise.all([
                getArtist(id),
                getArtistTopTracks(id),
                getArtistAlbums(id)
            ])
            .then(([artistData, tracksData, albumsData]) => {
                setbannerInfo({
                    name: artistData.name,
                    description: 'Artist',
                    user: [],
                    followers: artistData.followers || 0,
                    primary_color: '#1a1a2e',
                    images: artistData.picture_medium ? [{url: artistData.picture_medium}] : [],
                    total: tracksData.data?.length || 0
                })
                setTracks(tracksData.data || [])
                setAlbums(albumsData.data || [])
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
            setTimeout(() => setPlay(), 100)
        }
    }

    return (
        loading? 
        <Loading />
        :
        <div className='listPage'>
            <PageBanner pageTitle='Artist' bannerInfo={bannerInfo}/>
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                <PlayListFunctions onFollow={() => setMessage('Artist followed!')} setMessage={setMessage} playContext={playContext}/>
                <div className="page-content">
                    <CollectionRow name='Popular Tracks' id='tracks' playlists={tracks}/>
                    <CollectionRow name='Albums' id='albums' playlists={albums}/>
                </div>
            </div>
        </div>
    )
}


