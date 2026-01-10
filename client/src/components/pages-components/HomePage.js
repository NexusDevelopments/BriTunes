import React, {useState, useEffect, useContext} from 'react'

import CollectionRow from '../featured-components/CollectionRow'

import { getChart } from '../../services/musicApi'
import { MessageContext } from '../../utilities/context'


export default function HomePage() {
    const setMessage = useContext(MessageContext)
    const [tracks, setTracks] = useState([])
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        getChart()
            .then((data) => {
                const trackData = data.tracks?.data || []
                const albumData = data.albums?.data || []
                setTracks(trackData.slice(0, 12))
                setAlbums(albumData.slice(0, 12))
            })
            .catch((error) => {
                console.error('Chart error:', error)
                setMessage(`ERROR: ${error}`)
            })
    // eslint-disable-next-line
    }, [])

    const likedSongs = [{id:'', to:'/tracks', description:'', name:'Liked Songs', images:[{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}]}]

    return (
        <div className="page-content">
            <div className='pageContent'>
                <CollectionRow name='Uniquely Yours' id={null} playlists={likedSongs}/>
                <CollectionRow name='Popular Tracks' id='popular' playlists={tracks}/>
                {albums.length > 0 && <CollectionRow name='Popular Albums' id='albums' playlists={albums}/>}
            </div>
        </div>
    )
}


