import React, {useContext} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import CardInfo from './CardInfo'
import CardDisplay from './CardDisplay'
import Icon from '../icons'

import {LoginContext, PlayContext, MessageContext} from '../../utilities/context'

const PlayCard = React.forwardRef(({info, type}, ref) => {
    const navigate = useNavigate()
    const description = returnDescription(type, info)
    const name = info.name || info.title
    const id = info.id
    const setMessage = useContext(MessageContext)

    const loggedIn = useContext(LoginContext)
    const updatePlayer = useContext(PlayContext)

    let image_url
    if (type === 'track' || type === 'tracks') {
        image_url = info.album?.cover_medium || info.album?.image || info.cover_medium || info.image
    } else if (type === 'artist') {
        image_url = info.picture_medium || info.image
    } else if (type === 'album') {
        image_url = info.cover_medium || info.image
    } else if (type === 'playlist') {
        image_url = info.picture_medium || info.image
    } else {
        try{
            image_url = info.images?.[0]?.url
        }catch{
            image_url = null 
        }
    }
    
    const playContext = () => {
        const audioUrl = info.audio || info.audiodownload || info.preview
        if (audioUrl) {
            const audio = new Audio(audioUrl)
            audio.play().catch(err => {
                console.error('Playback error:', err)
                setMessage('Playback error: ' + err.message)
            })
            setTimeout(() => updatePlayer(), 100)
        } else if (info.to) {
            navigate(info.to)
        } else {
            navigate(`/${type}/${id}`)
        }
    }

    const linkTo = info.to? info.to : type === 'track'? `/album/${info.album?.id || id}?highlight=${id}`:`/${type}/${id}`

    return (
        <div className='pcWrapper'>
            <Link to={linkTo} style={{textDecoration:'none', color:'var(--main-text)', zIndex:'3'}}>
                <div ref={ref} className="PlayCard">
                    <CardDisplay url={image_url} type={type}/>
                    <CardInfo title={name} description={description}/>
                </div>
            </Link>
            {loggedIn? 
            <button className="smallButton no-outline" title="Play" onClick={() => {
                playContext()
                updatePlayer()
            }}>
                <Icon name="Play" height='17' width='17'/>
            </button>
            :
            <button className="smallButton no-outline" title="Play" data-tip='play' data-for='tooltipMain' data-event='click'>
                <Icon name="Play" height='17' width='17'/>
            </button>
            }
            
        </div>
    )
})


function returnDescription(type, info){
    switch (type){
        case 'playlist':
           return info.description || `By ${info.user?.name || info.creator?.name || 'Jamendo'}`
        case 'album':
            return info.artist?.name || 'Various Artists'
        case 'artist':
            return 'Artist'
        case 'track':
        case 'tracks':
            return info.artist?.name || 'Unknown Artist'
        default:
            return null
    }
}


export default PlayCard
