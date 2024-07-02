import React, { useEffect, useState } from 'react'
import './Products.css'
import axios from 'axios'

function Menu() {
    const [values, setValues] = useState([])

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        const menu = await axios.get('http://192.168.1.105:3004/getallproducts')
        setValues(menu?.data?.data)
    }
    return (
        <div className="menu">
            <h1>Products</h1>
            <div className="menu-container">
                {
                    values?.map((pro) => (
                        <div key={pro?._id} className="card">
                            <div className="image-container">
                                <img src={`http://192.168.1.105:3004/uploads/${pro?.image}`} alt='' />
                            </div>
                            <div className='label'>
                            <h3>{pro?.name}</h3>
                            <h3>₱ {pro?.price}</h3>
                        </div>
                        <div className='description'>
                            <p>{pro?.description}</p>
                        </div>
                        </div>
                    ))
                }
            </div>
        </div >
    )
}

export default Menu
