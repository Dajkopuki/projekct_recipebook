import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, CloseButton } from "react-bootstrap";

function Update(props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [],
    keywords: [],
    author: "",
    license: "",
    duration: 0,
    created: "",
    link: "",
    mutation: {
      dabing: [],
      subtitles: [],
    },
  });

  const [updateVideoCall, setupdateVideoCall] = useState({
    state: "pending",
    error: null,
  });

  const [updateVideoSubmit, setupdateVideoSubmit] = useState({
    state: "pending",
    error: null,
  });
  

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeDuration = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };
  let helpLink = formData.link.oldLink;
  const handleChangelink = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      link: {
        oldLink: prevData.link.oldLink,
        newLink: value,
      },
    }));
  };
  helpLink = formData.link.newLink;
  const handleShowGetData = (e) => {
    handleGetData(e);
    handleShow();
  };

  const handleGetData = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/video/search`, {
      method: "OPTIONS",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: props.link }),
    });

    const responseJson = await res.json();
    setFormData(responseJson[0]);
    setFormData((prevData) => ({
      ...prevData,
      link: {
        oldLink: prevData.link,
        newLink: prevData.link,
      },
    }));

    if (res.status >= 400) {
      setupdateVideoCall({ state: "error", error: responseJson });
    } else {
      setupdateVideoCall({ state: "success", data: responseJson });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/video/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseJson = await res.json();
    if (res.status >= 400) {
      setupdateVideoSubmit({ state: "error", error: responseJson });
    } else {
      setupdateVideoSubmit({ state: "success", data: responseJson });
    }
    handleClose();
    props.refreshVideo({ link: props.link });
  };

  

  const [category, setCategory] = useState("");
  const [match, setMatch] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleRatingChange = (e) => {
    setMatch(e.target.value);
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: category,
      match: parseFloat(match),
    };
    const found = formData.categories.find((cat) => cat.id === newCategory.id);
    if (!found) {
      setFormData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, newCategory],
      }));
      setCategory("");
      setMatch("");
    }
  };

  const handleChangeKeywords = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubtitlesChange = (e) => {
    const found = formData.mutation.subtitles.find(
      (sub) => sub === e.target.value
    );
    if (!found) {
      setFormData((prevData) => ({
        ...prevData,
        mutation: {
          ...prevData.mutation,
          subtitles: [...prevData.mutation.subtitles, e.target.value],
        },
      }));
    }
  };

  const handleDabingChange = (e) => {
    const found = formData.mutation.dabing.find(
      (dab) => dab === e.target.value
    );
    if (!found) {
      setFormData((prevData) => ({
        ...prevData,
        mutation: {
          ...prevData.mutation,
          dabing: [...prevData.mutation.dabing, e.target.value],
        },
      }));
    }
  };

  const removeCategory = (id) => {
    const newCategories = formData.categories.filter(
      (category) => category.id !== id
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: newCategories,
    }));
  };

  const removeDabing = (dab) => {
    const newDubings = formData.mutation.dabing.filter(
      (dabing) => dabing !== dab
    );
    setFormData((prevData) => ({
      ...prevData,
      mutation: {
        ...prevData.mutation,
        dabing: newDubings,
      },
    }));
  };

  const removeSubtitles = (sub) => {
    const newSubtitles = formData.mutation.subtitles.filter(
      (subtitles) => subtitles !== sub
    );
    setFormData((prevData) => ({
      ...prevData,
      mutation: {
        ...prevData.mutation,
        subtitles: newSubtitles,
      },
    }));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowGetData}>
        Edit
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col xs={4}>
                <Form.Group controlId="categorySelect">
                  <Form.Label>Select Category:</Form.Label>
                  <Form.Control
                    className="form-control-sm"
                    as="select"
                    onChange={handleCategoryChange}
                    value={category}
                  >
                    <option value="">Select a category</option>
                    {props.categories.map((category) => {
                      return (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="ratingInput">
                  <Form.Label>Enter Match:</Form.Label>
                  <Form.Control
                    className="form-control-sm"
                    type="number"
                    step=".1"
                    min="0.1"
                    max="1"
                    value={match}
                    onChange={handleRatingChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              style={{ marginTop: "5px" }}
              variant="primary"
              className="btn-sm"
              onClick={handleAddCategory}
              disabled={!category || !match}
            >
              Add Category
            </Button>

            {formData.categories.length > 0 && (
              <div>
                <h5>Added Categories:</h5>
                <ul>
                  {formData.categories.map((cat) => (
                    <li key={cat.id}>
                      Category: {cat.id} | Match: {cat.match.toFixed(1)}
                      <CloseButton onClick={() => removeCategory(cat.id)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Form.Group controlId="formKeywords">
              <Form.Label>Keywords</Form.Label>
              <Form.Control
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChangeKeywords}
              />
            </Form.Group>

            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formLicense">
              <Form.Label>License</Form.Label>
              <Form.Control
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formDurationSeconds">
              <Form.Label>Duration (seconds)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                min="0"
                onChange={handleChangeDuration}
              />
            </Form.Group>

            <Form.Group controlId="formCreated">
              <Form.Label>Created</Form.Label>
              <Form.Control
                type="date"
                name="created"
                value={formData.created}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formLink">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                pattern="^^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(.*)$"
                value={helpLink}
                onChange={handleChangelink}
              />
            </Form.Group>

            <Form.Group controlId="categorySelect">
              <Form.Label>Select Dabing:</Form.Label>
              <Form.Control
                className="form-control-sm"
                as="select"
                onChange={handleDabingChange}
                value={formData.mutation.dabing}
              >
                <option value="">Select dabing</option>
                <option value="DE">DE</option>
                <option value="CZ">CZ</option>
                <option value="SK">SK</option>
                <option value="EN">EN</option>
              </Form.Control>
            </Form.Group>

            {formData.mutation.dabing.length > 0 && (
              <div>
                <h5>Added dabing:</h5>
                <ul>
                  {formData.mutation.dabing.map((dab) => (
                    <li key={dab}>
                      Dabing: {dab}
                      <CloseButton onClick={() => removeDabing(dab)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Form.Group controlId="categorySelect">
              <Form.Label>Select Subtitles:</Form.Label>
              <Form.Control
                className="form-control-sm"
                as="select"
                onChange={handleSubtitlesChange}
                value={formData.mutation.subtitles}
              >
                <option value="">Select subtitles</option>
                <option value="DE">DE</option>
                <option value="CZ">CZ</option>
                <option value="SK">SK</option>
                <option value="EN">EN</option>
              </Form.Control>
            </Form.Group>

            {formData.mutation.subtitles.length > 0 && (
              <div>
                <h5>Added subtitles:</h5>
                <ul>
                  {formData.mutation.subtitles.map((sub) => (
                    <li key={sub}>
                      Subtitles: {sub}
                      <CloseButton onClick={() => removeSubtitles(sub)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {updateVideoSubmit.state === "error" && (
        <div>{updateVideoSubmit.error.errorMessage}</div>
      )}
      {updateVideoSubmit.state === "success" && <div>Video was updated</div>}
    </>
  );
}

export default Update;
