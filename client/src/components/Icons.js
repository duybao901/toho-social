import React from 'react'

function Icons({ setContent, content, className }) {
    const reactions = [
        '👍', '👎', '✌️', '🤞', '👌', '🤙', '🤘', '🖕',
        '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
        '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
        '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵',
    ]

    function addIcon(icon) {
        setContent(content + icon)
    }

    return (
        <div className="dropdown">
            <i className={`bx bx-smile ${className}`} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" ></i>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <div className="reactions_list">
                    {
                        reactions.map((icon, index) => {
                            return <div key={index} className="reactions_icon reactions_list-item" onClick={() => addIcon(icon)}>
                                {icon}
                            </div>
                        })
                    }
                </div>
            </div>
        </div>

    )
}

export default Icons
