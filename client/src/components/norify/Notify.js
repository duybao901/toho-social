import React from 'react'
import Loading from './Loading'
import Alert from './Alert';
import { useSelector } from 'react-redux'
function Notify() {
    const { success, err, loading } = useSelector(state => state.notify);
    return (
        <div className="alert">
            {loading && <Loading />}

            {success ?
                <Alert msg={{ title: "Success", body: success, type: 'success' }} /> :
                ""}

            {err ? <Alert msg={{ title: "Error", body: err, type: 'error' }} /> : ""}

        </div>
    )
}

export default Notify
