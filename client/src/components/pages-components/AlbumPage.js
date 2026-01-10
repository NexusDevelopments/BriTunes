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
        // Play the specific track
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
    const updatePlayer = useContext(PlayContext)
    const [loading, setLoading] = useState(true)

    const highlight = useHighlight()

    const [bannerInfo, setbannerInfo] = useState({
        album_type: '',
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: '#262626',
        images: [],
        release_date: ''
    })

    const [tracks, setTracks] = useState([])
    const [uri, setUri] = useState('')
    const [setNext, lastRef] = useInfiScroll(setTracks)
    const source = axios.CancelToken.source()

    useEffect(() => {
        setTracks([])
        setNext(null)
        setbannerInfo({
            album_type: '',
            name: '',
            description: '',
            user: [],
            followers: 0,
            primary_color: '#262626',
            images: [],
            release_date: ''
        })
        setUri('')
        setLoading(true)
        const [source, makeRequest] = makeAxiosRequest(`https://api.spotify.com/v1/albums/${id}`)
        if(id){
            makeRequest()
            .then((data) => {
                const {album_type, name, artists, primary_color, tracks, images, release_date, uri} = data
                setbannerInfo(bannerInfo => ({...bannerInfo, album_type, name, user:artists, primary_color, images, release_date}))
                setTracks(tracks.items)
                setNext(tracks.next)
                setUri(uri)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                setMessage(`ERROR: ${error}`)
            })
        }
        
        
        return () => source.cancel()
    // eslint-disable-next-line
    }, [id])

    const playContext = () => {
        const body = {
            context_uri: uri
        }
        const request = putWithToken(`https://api.spotify.com/v1/me/player/play`, token, source, body)
        request()
            .then(response => {
                if (response.status === 204){
                    setTimeout(() => updatePlayer(), 500)
                }else{
                    setMessage(`ERROR: Something went wrong! Server response: ${response.status}`)
                }
            })
            .catch(error => setMessage(`ERROR: ${error}`))
    }

    const playContextTrack = (trackUri) => {
        const body = {
            context_uri: uri,
            offset: {uri: trackUri}
        }
        const request = putWithToken(`https://api.spotify.com/v1/me/player/play`, token, source, body)
        request()
            .then(response => {
                if (response.status === 204){
                    setTimeout(() => updatePlayer(), 500)
                }else{
                    setMessage(`ERROR: Something went wrong! Server response: ${response.status}`)
                }
            })
            .catch(error => setMessage(`ERROR: ${error}`))
    }

    return (
        loading? 
        <Loading />
        :
        <div className='listPage' style={{display: `${tracks.length===0? 'none':'block'}`}}>
            <PageBanner pageTitle={bannerInfo.album_type} bannerInfo={bannerInfo}/>
            <div className="playListContent">
                <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                <PlayListFunctions onFollow={() => setMessage('Oops looks like the Spotify API does not support following albums')} setMessage={setMessage} playContext={playContext}/>
                <div className="page-content">
                    <TrackList ref={lastRef} tracks={tracks} highlight={highlight} playContextTrack={playContextTrack}/>
                </div>
            </div>
        </div>
    )
}


function useHighlight(){
    return new URLSearchParams(useLocation().search).get('highlight')
}