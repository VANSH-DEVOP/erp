import React, { useState } from "react";

const AddStudent = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roll: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", form);
    alert("Student added!");
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="roll" placeholder="Roll Number" onChange={handleChange} />
        <input name="semester" placeholder="Semester" onChange={handleChange} />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
