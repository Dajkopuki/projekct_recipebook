import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

function CategoryForm(props) {
    const defaultForm = {
        name: "",
        description: ""
      };
  const [show, setShow] = useState(false);
  const [categoryCall, setCategoryCall] = useState({
    state: 'inactive'
  });
  const [formData, setFormData] = useState(defaultForm);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = async (e) => {
    const payload = {...formData};
    console.error(payload);
    setCategoryCall({ state: 'pending' });
    const res = await fetch(`/category/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
      mode: "cors"
    });
        const data = await res.json();
    if (res.status >= 400) {
      setCategoryCall({ state: "error", error: data });
      //props.fc(data.reason);
    } else {
      setCategoryCall({ state: "success", data });
      handleClose();
      props.refresh();
      props.fc('New category added successfully.');
    } 
    }
    
  const setField = (name, val) => {
        return setFormData((formData) => {
          const newData = { ...formData };
          newData[name] = val;
          return newData;
        });
      };

  return (
    <>
      <Button variant="primary" onClick={handleShow}> 
        Add category
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e)
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Video category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
                min={3}
                max={200}
                required
                />
                <Form.Control.Feedback type="invalid"> 
                Name needs to be between  
                </Form.Control.Feedback> 
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
                min={10}
                max={3000}
                />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex flex-row justify-content-between align-items-center w-100">
              <div>
                {categoryCall.state === 'error' &&
                  <div className="text-danger">Error: {categoryCall.error.reason}</div>
                }
              </div>
              <div className="d-flex flex-row gap-2">
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={categoryCall.state === 'pending'}>
                  {categoryCall.state === 'pending' ? 'Loading' : 'Submit'}
                </Button>
              </div>
            </div>
          </Modal.Footer>

        </Form>
      </Modal>
    </>
  );
}

export default CategoryForm;