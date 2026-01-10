import React, {useState, useEffect, useContext} from 'react'

import { getBrowseCategories } from '../../services/musicApi'
import { MessageContext } from '../../utilities/context'

import BrowseCard from '../featured-components/BrowseCard'
import PageTitle from '../featured-components/PageTitle'

export default function BrowsePage() {
    const setMessage = useContext(MessageContext)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getBrowseCategories()
            .then((data) => {
                setCategories(data)
            })
            .catch((error) => {
                console.error('Browse error:', error)
                setMessage(`ERROR: ${error}`)
            })
    // eslint-disable-next-line
    }, [])

    return (
        <div className='page-content'>
            <div className='pageContent'>
                <PageTitle title='Browse All' />
                <div className='BrowseGrid'>
                    {categories.map((category) => (
                        <BrowseCard key={category.id} info={category} />
                    ))}
                </div>
            </div>
        </div>
    )
}
