import React, { useEffect, useState } from 'react';
import Input from './Input';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const FormComp = () => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            handleEdit(id);
        }
    }, [id]);

    const [input, setInput] = useState({});
    const [data, setData] = useState([]);
    const [hobby, setHobby] = useState([]);

    const fields = [
        { name: 'first_name', type: 'text', label: 'First Name' },
        { name: 'last_name', type: 'text', label: 'Last Name' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'mobile', type: 'number', label: 'Mobile Number' }
    ];

    const genders = [
        { name: 'gender', type: 'radio', label: 'Male', value: 'male' },
        { name: 'gender', type: 'radio', label: 'Female', value: 'female' }
    ];

    const hobbies = [
        { name: 'hobby', type: 'checkbox', label: 'Cricket', value: 'Cricket' },
        { name: 'hobby', type: 'checkbox', label: 'Football', value: 'Football' },
        { name: 'hobby', type: 'checkbox', label: 'Swimming', value: 'Swimming' }
    ];

    const handleInput = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'hobby') {
            setHobby(checked ? [...hobby, value] : hobby.filter(h => h !== value));
        } else {
            setInput({ ...input, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalHobby = hobby.toString();
        const finalData = { ...input, finalHobby };

        setData((data) => [...data, finalData]);

        addData(finalData);
    };

    const addData = async (data) => {
        try {
            if (id) {
                await axios.put(`http://localhost:3000/data/${id}`, data);
            } else {
                await axios.post('http://localhost:3000/data', data);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleEdit = async (id) => {
        const editData = await axios.get(`http://localhost:3000/data/${id}`);
        setInput({ ...editData.data, finalHobby: editData.data.finalHobby });
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-4">
                <Col md={6} className="mx-auto">
                    <Card className="p-3 border shadow-sm rounded">
                        <Card.Body>
                            <Card.Title className="text-center mb-3">{id ? 'Edit User' : 'Add User'}</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-2">
                                    {fields.map((field, idx) => (
                                        <Col md={12} className="mb-2" key={idx}>
                                            <Form.Group controlId={field.name}>
                                                <Form.Label>{field.label}</Form.Label>
                                                <Form.Control
                                                    type={field.type}
                                                    name={field.name}
                                                    placeholder={`Enter ${field.label}`}
                                                    value={input[field.name] || ''}
                                                    onChange={handleInput}
                                                />
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Gender</Form.Label>
                                            {genders.map((gender, idx) => (
                                                <Form.Check
                                                    key={idx}
                                                    type="radio"
                                                    name={gender.name}
                                                    label={gender.label}
                                                    value={gender.value}
                                                    checked={input.gender === gender.value}
                                                    onChange={handleInput}
                                                    className="ms-2"
                                                />
                                            ))}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Hobbies</Form.Label>
                                            {hobbies.map((hobbyItem, idx) => (
                                                <Form.Check
                                                    key={idx}
                                                    type="checkbox"
                                                    name={hobbyItem.name}
                                                    label={hobbyItem.label}
                                                    value={hobbyItem.value}
                                                    checked={hobby.includes(hobbyItem.value)}
                                                    onChange={handleInput}
                                                    className="ms-2"
                                                />
                                            ))}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button type="submit" variant="primary" size="sm">
                                        {id ? 'Update' : 'Submit'}
                                    </Button>
                                    <Link to="/table">
                                        <Button variant="secondary" size="sm">Show Data</Button>
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
        </div>
    );
};

export default FormComp;
