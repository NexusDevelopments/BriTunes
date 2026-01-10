import React, {useContext} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import HomePage from '../pages-components/HomePage'
import SearchPage from '../pages-components/SearchPage'
import GenrePage from '../pages-components/GenrePage'
import PlayListPage from '../pages-components/PlayListPage'
import AlbumPage from '../pages-components/AlbumPage'
import UserPage from '../pages-components/UserPage'
import ArtistPage from '../pages-components/ArtistPage'
import CollectionPage from '../pages-components/CollectionPage'
import LikePage from '../pages-components/LikePage'

import { Tooltip } from 'react-tooltip'
import {LoginContext} from '../../utilities/context'

export default function PageContent({query, playlists, refreshPlaylist, message, status}) {
    const loggedIn = useContext(LoginContext)

    return (
        <>
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/search' element={<SearchPage query={query}/>} />
            <Route path='/genre/:id' element={<GenrePage />} />
            <Route path='/playlist/:id' element={<PlayListPage playlists={playlists} refreshPlaylist={refreshPlaylist} />} />
            <Route path='/album/:id' element={<AlbumPage />} />
            <Route path='/user/:id' element={<UserPage />} />
            <Route path='/artist/:id' element={<ArtistPage />} />
            <Route path='/collection/*' element={loggedIn ? <CollectionPage playlists={playlists}/> : <Navigate to='/' replace />} />
            <Route path='/tracks' element={loggedIn ? <LikePage /> : <Navigate to='/' replace />} />
        </Routes>
        <div className={`status-bar-wrapper ${status? 'active':''}`}>
            <div className={`status-bar ${status? 'active':''}`}>{message}</div>
        </div>
        <Tooltip id='tooltipMain' place='bottom' style={{backgroundColor: '#2e77d0'}} />
        </>
    )
}
