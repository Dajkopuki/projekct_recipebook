import React, { useEffect, useState } from "react";
import Add from './add';
import Update from './Update';
import { Modal, Button, Form, Row, Col, CloseButton } from "react-bootstrap";
import CategoryForm from "./CategoryForm";
import Del from './Del';
let searchOrShow = "search";
//let categories = [];

/**
 * Main site to list through videos.
 */
function Search() {
    const [videos, setVideos] = useState([]);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    let detail = false;

    const getVideos = async (data) => {
        const jsonData = JSON.stringify(data);
        try {
            const controller = new AbortController();
            const res = await fetch(`http://localhost:8000/video/search`, {
                method: "OPTIONS",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: jsonData,
                mode: "cors",
                signal: controller.signal
            }).then((res) => {
                return res.json();
            }).then((data) => {
                setVideos(data);
                //setFormData({});
            });
        } catch (e) {
            setVideos([]);
        }
        
    }
    const getCategories = async () => {
        try {
            const controller = new AbortController();
            const res = await fetch(`http://localhost:8000/category/list`, {
                method: "GET",
                headers: {},
                mode: "cors",
                signal: controller.signal
            }).then((res) => {
                return res.json();
            }).then((data) => {
                setCategories(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        try {
            getVideos({});
            getCategories([]);
        } catch (e) {
            console.log(e)
        }
    }, []);

    const handleSumbit = async (event) => {
        event.preventDefault();
        console.log(formData);
        getVideos(formData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleChangeKeywords = (event) => {
        const { name, value } = event.target;
        if (event.target.value.length === 0) {
            delete formData[event.target.name];
            setFormData((prevData) => ({...prevData}));
            return;
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: value.split(",").map((item) => item.trim())
        }));
    };
    
    const handleCategoryChange = (event) => {
        const { name, value } = event.target;
        if (event.target.value.length === 0) {
            delete formData[event.target.name];
            setFormData((prevData) => ({...prevData}));
            return;
        };
        console.log(value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: [value.trim()]
        }));
    }

    const displayMessage = (newMessage = "") => {
        console.log("Delete message came: " + newMessage);
        setMessage(newMessage);
    }

    const addX = () => {
        if (message.length > 0) {
            return(
                <a href="/videos/search" className="closeMessage" onClick={(event) => {
                    event.preventDefault();
                    displayMessage();
                }}> Close </a>
            )
        }
    }

    if (Array.isArray(videos)) {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].title.length > 20) {
                videos[i].title = videos[i].title.substring(0,19) + "...";
            }
        }
    }

    const printForm = () => {
        return(
            <div id="searchVideosForm" >
                <Form onSubmit={handleSumbit}>
                <Form.Group controlId="searchCategorySelect">
                  <Form.Label>Select Category:</Form.Label>
                  <Form.Control
                    className="form-control-sm"
                    as="select"
                    name="categories"
                    onChange={handleCategoryChange}
                    value={formData.categories}
                  >
                    <option value="">All</option>
                    {categories.map(category => (
                        <option value={category.name}>{category.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="searchFormTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
              />
              </Form.Group>
              <Form.Group controlId="searchFormAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
              />
              </Form.Group>
              <Form.Group controlId="searchFormLicense">
                    <Form.Label>License</Form.Label>
                    <Form.Control
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
              />
              </Form.Group>
              <Form.Group controlId="searchFormKeywords">
              <Form.Label>Keywords</Form.Label>
              <Form.Control
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChangeKeywords}
              />
              </Form.Group>
              <Form.Group controlId="searchFormCreatedStart">
              <Form.Label>Created from</Form.Label>
              <Form.Control
                type="date"
                name="createdStart"
                value={formData.created}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="searchFormCreatedStop">
              <Form.Label>Created to</Form.Label>
              <Form.Control
                type="date"
                name="createdStop"
                value={formData.created}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="searchFormLanguage">
              <Form.Label>Subtitles</Form.Label>
              <Form.Control
                type="text"
                name="languageSubtitles"
                value={formData.languageSubtitles}
                onChange={handleChangeKeywords}
              />
              </Form.Group>
              <Form.Group controlId="searchFormLanguage">
              <Form.Label>Dabing</Form.Label>
              <Form.Control
                type="text"
                name="languageDabing"
                value={formData.languageDabing}
                onChange={handleChangeKeywords}
              />
              </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }

    if (!Array.isArray(videos)) {
        return (
            <>
            {printForm()}
            <div className="box">
            <div>
                <p className="messageDisplay">{message}{addX()}</p>
            </div>
                <div className="messageBox">
                <CategoryForm fc={displayMessage} refresh={getCategories}/> <Add categories={categories} fc={displayMessage} refreshVideos={getVideos}/>
                </div>
            </div>
            <div>
                No videos found<br/>
            <a href="/video/show" className="linkToDetail" id="refresher" onClick={(event) => {
                event.preventDefault();
                searchOrShow = "search"
                getVideos({});
                getCategories();
            }}></a>
            </div>
            </>
        )
    } else if (searchOrShow === "search" || !Array.isArray(videos)) {
    return(
       <> 
       {printForm()}
        <div className="box">
            <div className="messageBox">
                {message && 
                    <div>
                        <p className="messageDisplay">{message}{addX()}</p>
                    </div>}
                <br/>
                <CategoryForm fc={displayMessage} refresh={getCategories}/> <Add categories={categories} fc={displayMessage} refreshVideos={getVideos}/>
            </div>
            <br/>
        
        </div>
        <div className="box">
            <div>
            <a href="/video/show" className="linkToDetail" id="refresher" onClick={(event) => {
                event.preventDefault();
                searchOrShow = "search"
                getVideos({});
                getCategories();
            }}></a>
            </div>
            {videos.map(video => (
                <div className="niceList" id={"linkToDetailDiv-" + video._id}>
                    <a href='/video/search' className="linkToDetail" onClick={(event) => {
                        event.preventDefault();
                        searchOrShow = "show";
                        getVideos({"link": video.link});
                    }}>{video.title}</a><br/>
                    Created on: {video.created}<br/>Author: {video.author}<br/>
                    Categories:<br/><div className="bumpLeft">{video.categories.map(category => (
                        <span>{category.id}:{category.match}<br/></span>
                    ))}</div>
                    Subtitles:<br/><div className="bumpLeft">{video.mutation.subtitles.map(
                        subtitle => (<span>{subtitle}<br/></span>)
                    )}</div>Dabing:<br/><div className="bumpLeft">{video.mutation.dabing.map(
                        dabing => (<span>{dabing}<br/></span>)
                    )}</div>
                    <div className="right">
                    <a href="/video/search" className="linkToDetail" onClick={(event) => {
                        event.preventDefault();
                        searchOrShow = "show";
                        getVideos({"link": video.link});
                    }}>Detail</a>
                    </div>
                    <div id={"detailDiv-" + video._id}></div>
                    </div>
            ))}
        </div>
        </>
    )
    } else {
    return (
        <div>
            {videos.map(video => (
                <div className="niceList" id={"linkToDetailDiv-" + video._id}>
                    <h1 className="niceh12">Title: {video.title}</h1><br/>
                    <iframe width="560" height="315" src={video.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><br/>
                    Description: <p>{video.description}</p>
                    Created on: {video.created}<br/>
                    Author: {video.author}<br/>
                    Categories:<br/><div className="bumpLeft">{video.categories.map(category => (
                        <span>{category.id}:{category.match}<br/></span>
                    ))}</div>
                    Subtitles:<br/><div className="bumpLeft">{video.mutation.subtitles.map(
                        subtitle => (<span>{subtitle}<br/></span>)
                    )}</div><br/>
                    Dabing:<br/><div className="bumpLeft">{video.mutation.dabing.map(
                        dabing => (<span>{dabing}<br/></span>)
                    )}</div>
                    Link: <a href={video.link} target="_blank">{video.link}</a>
                    <div className="right">
                    <Update categories={categories} link={video.link} fc={displayMessage} refreshVideo={getVideos}/><br/>
                    <Del id={video._id} fc={displayMessage}/>
                    <a href="/video/search" className="linkToDetail" id="refresherDetail" onClick={(event) => {
                        event.preventDefault();
                        searchOrShow = "show";
                        getVideos({"link": video.link});
                    }}></a><br/>
                    <a href="/video/search" id="backToList" className="linkToDetail" onClick={(event) => {
                        event.preventDefault();
                        searchOrShow = "search";
                        getVideos({});
                    }}>Back</a>
                    </div>
                    </div>
            ))}
        </div>
    )
    }
}

/*async function setCategories() {
    try {
        const controller = new AbortController();
        const res = await fetch(`http://localhost:8000/category/list`, {
            method: "GET",
            headers: {},
            mode: "cors",
            signal: controller.signal
        }).then((res) => {
            return res.json();
        }).then((data) => {
            categories = data;
        });
    } catch (e) {
        console.log(e);
    }
}*/

export default Search;