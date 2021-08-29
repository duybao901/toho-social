import React, { useState, useEffect } from 'react'

function CallTime({ times }) {

    const [mins, setMins] = useState(0)
    const [second, setSecond] = useState(0)
    const [hour, setHour] = useState(0)


    useEffect(() => {
        setMins(times % 60);
        setSecond(parseInt(times / 60));
        setHour(parseInt(times / 3600));

    }, [times])

    return <>
        <span>
            {hour.toString().length < 2 ? '0' + hour : hour}
        </span>:
        <span>
            {second.toString().length < 2 ? '0' + second : second}
        </span>:
        <span>
            {mins.toString().length < 2 ? '0' + mins : mins}s
        </span>
    </>
}

export default CallTime
