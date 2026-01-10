import React, {useState, useEffect} from 'react'

import PageBanner from '../featured-components/PageBanner'
import TrackList from '../featured-components/TrackList'

export default function LikePage() {
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        // Load liked tracks from localStorage
        const likedTracks = localStorage.getItem('likedTracks')
        if (likedTracks) {
            setTracks(JSON.parse(likedTracks))
        }
    }, [])

    const bannerInfo = {
        name: 'Liked Songs',
        description: `${tracks.length} songs`,
        user: [],
        followers: 0,
        primary_color: '#1a1a2e',
        images: [{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}],
        total: tracks.length
    }

    return (
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
