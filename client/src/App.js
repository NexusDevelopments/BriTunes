import React, {useState, useEffect, useRef} from 'react';

import Sidebar from './components/sidebar-components/Sidebar.js'
import Logo from './components/sidebar-components/Logo.js'
import NavList from './components/sidebar-components/NavList.js'
import NavItem from './components/sidebar-components/NavItem.js'
import PlayLists from './components/sidebar-components/PlayLists.js'
import FeaturedPlaylist from './components/sidebar-components/FeaturedPlaylist.js'
import FeaturedItem from './components/sidebar-components/FeaturedItem.js'
import OtherPlaylist from './components/sidebar-components/OtherPlaylist.js'
import InstallCTA from './components/sidebar-components/InstallCTA.js'
import Footer from './components/footer-components/Footer.js'
import CTAbanner from './components/footer-components/CTAbanner'
import Player from './components/footer-components/Player'
import PageContent from './components/featured-components/PageContent'

import {UserContext, LoginContext, MessageContext, PlayContext} from './utilities/context'

function App() {
  const [loggedIn, setloggedIn] = useState(false)
  const [userInfo, setuserInfo] = useState({})
  const [playlists, setPlaylists] = useState([])

  const [status, setStatus] = useState(false) 
  const [message, setMessage] = useState('')

  const timerRef = useRef(null)

  useEffect(() => {
    // Check localStorage for user session
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        setuserInfo(parsedUser)
        setloggedIn(true)
        
        // Load user's playlists from localStorage
        const savedPlaylists = localStorage.getItem('playlists')
        if (savedPlaylists) {
          setPlaylists(JSON.parse(savedPlaylists))
        }
      } catch(e) {
        console.error('Error loading user:', e)
      }
    }

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  const refreshPlaylist = () => {
    const savedPlaylists = localStorage.getItem('playlists')
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists))
    }
  }

  const setStatusMessage = (message) => {
      clearTimeout(timerRef.current)
      setStatus(true)
      setMessage(message)
      timerRef.current = setTimeout(() => {
          setStatus(false)
      }, 3000)
  }

  const playerRef = useRef(null)
  const updatePlayer = () => {
    if (playerRef.current && playerRef.current.updateState) {
      playerRef.current.updateState()
    }
  }

  return (
    <div className="App">
      <MessageContext.Provider value={setStatusMessage}>
        <LoginContext.Provider value={loggedIn}>
            
            <Sidebar>
              <Logo />
              <NavList>
                <NavItem to='/' exact={true} name='Home' label='Home' />
                <NavItem to='/search' exact={true} name='Search' label='Search' />
                <NavItem to='/collection' exact={false} name='Library' label='Your Library' style={{ pointerEvents: loggedIn? 'auto':'none'}}/>
              </NavList>
              <PlayLists 
                top={<FeaturedPlaylist>
                        <FeaturedItem label='Liked Songs' loggedIn={loggedIn} />
                      </FeaturedPlaylist>}
                bottom={<OtherPlaylist playlists={playlists}/>}
              />
              {loggedIn? <InstallCTA /> : null}
            </Sidebar>
            
            <PlayContext.Provider value={updatePlayer}>
              <UserContext.Provider value={userInfo}>
                <PageContent playlists={playlists} refreshPlaylist={refreshPlaylist} message={message} status={status} />
              </UserContext.Provider>
            </PlayContext.Provider>

            <Footer>
              {loggedIn? <Player ref={playerRef}/>: <CTAbanner/>}
            </Footer>
                
        </LoginContext.Provider>
      </MessageContext.Provider>
    </div>
  );
}

export default App;
