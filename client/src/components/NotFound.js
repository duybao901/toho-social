import React from 'react'

function NotFound() {
    return (
        <div
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "calc(100vh - 70px)", overflow: "hidden"
            }}>
            <h2 style={{ fontSize: "4rem", color: "#999" }}>404 | Page Not Found</h2>
        </div>
    )
}

export default NotFound