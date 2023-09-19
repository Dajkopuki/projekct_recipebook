import React, { useEffect, useState } from "react";
import {  Button } from "react-bootstrap";

function Del(props) {
    const [deleteCall, setDeleteCall] = useState({
        state: "idle",
    });

    const handleDelete = () => {
        setDeleteCall({ state: "pending" });

        const controller = new AbortController();

        fetch(`/video/delete?ids=${encodeURIComponent(JSON.stringify({ ids: [props.id] }))}`, {
            method: "GET",
            signal: controller.signal
        })
            .then(async (response) => {
                const responseJson = await response.json();
                if (response.status >= 400) {
                    setDeleteCall({ state: "error", error: responseJson });
                } else {
                    props.fc(responseJson) ;
                    //setDeleteCall({ state: "success", data: responseJson });
                    let back = document.getElementById('backToList');back.click();
                }
            })
            .catch((error) => {
                setDeleteCall({ state: "error", error: error.message });

            });
    };

    useEffect(() => {
        if (deleteCall.state === "success") {
            props.fc("Video deleted successfully.");
        }
    }, [deleteCall.state, props]);

    if (deleteCall.state === "idle") {
        return (
            <div>

                <Button variant="secondary" onClick={handleDelete}>Delete Video</Button>
            </div>
        );
    }

    if (deleteCall.state === "pending") {
        return <div>Loading...</div>;
    }

    if (deleteCall.state === "error") {
        return <div>Error: {deleteCall.error}</div>;
    }

    if (deleteCall.state === "success") {
        return <div>Video deleted successfully. {deleteCall.data}</div>;
    }
}

export default Del;
