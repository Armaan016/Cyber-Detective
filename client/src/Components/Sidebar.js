import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div><nav className="navbar navbar-expand-lg navbar-light" style={{ border: '2px solid tomato', borderRadius: '8px', padding: '10px', width: '200px', position: 'absolute', right: '10px', top: '10px' }}>
            <div className="container-fluid">
                {/* <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', color: '#4a4a4a' }}>
            KMIT
        </Link> */}

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav" style={{ textAlign: 'center' }}>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to='/home' style={{ borderBottom: '1px solid tomato' }}>
                                Home
                            </Link>
                            <Link className="nav-link" to='/kmit' style={{ borderBottom: '1px solid tomato' }}>
                                KMIT Queries
                            </Link>
                            <Link className="nav-link" to='/scrape' style={{ borderBottom: '1px solid tomato' }}>
                                Scrape any Website
                            </Link>
                            <Link className="nav-link" to='/tokens' style={{ borderBottom: '1px solid tomato' }}>
                                Annotate Text from Website
                            </Link>
                            <Link className="nav-link" to='/'>
                                LOG OUT
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav></div>
    )
}

export default Sidebar