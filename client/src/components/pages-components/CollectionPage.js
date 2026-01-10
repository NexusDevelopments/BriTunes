import React from 'react'
import {Routes, Route} from 'react-router-dom'

export default function CollectionPage({playlists}) {
    return (
        <div className='page-content'>
            <div className='pageContent'>
                <Routes>
                    <Route path='/playlist' element={<div>Your Playlists</div>} />
                    <Route path='/tracks' element={<div>Your Tracks</div>} />
                    <Route path='/albums' element={<div>Your Albums</div>} />
                    <Route path='/artists' element={<div>Your Artists</div>} />
                </Routes>
            </div>
        </div>
    )
}
