import React from 'react';
import Nav from "./components/Nav.js";
import SideBar from "./components/SideBar.js";

function Wrapper(props) {
    return (
        <>
            <Nav />
            <div>
                <SideBar />
                <div className='wrraper'>
                    <div className='left-content'>
                        <SideBar />
                    </div>
                    <div className='right-content'>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wrapper
