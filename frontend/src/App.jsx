import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });

  const [editId, setEditId] = useState(null);

  // READ
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/students/${editId}`,
          formData
        );

        alert("Student updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/students",
          formData
        );

        alert("Student added successfully!");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: ""
      });

      setEditId(null);

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // EDIT
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course
    });

    setEditId(student._id);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      alert("Student deleted successfully!");

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: ""
    });

    setEditId(null);
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div>
          <h1>Student Management System</h1>
          <p>React + Node.js + MongoDB CRUD Application</p>
        </div>
      </header>


      <div className="container">

        {/* FORM CARD */}

        <div className="card">

          <div className="card-header">
            <h2>
              {editId ? "✏️ Update Student" : "➕ Add New Student"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="input-group">
                <label>Student Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="input-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="input-group">
                <label>Course</label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="MCA">MCA</option>
                  <option value="BCA">BCA</option>
                  <option value="CSE">CSE</option>
                  <option value="MBA">MBA</option>
                  <option value="PhD">PhD</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>

            </div>


            <div className="form-buttons">

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editId ? "Update Student" : "Add Student"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>


        {/* TABLE CARD */}

        <div className="card">

          <div className="table-header">

            <div>
              <h2>📋 Student Records</h2>
              <p>
                Total Students: <strong>{students.length}</strong>
              </p>
            </div>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>S.No</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {students.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="no-data">
                      No student records found
                    </td>
                  </tr>

                ) : (

                  students.map((student, index) => (

                    <tr key={student._id}>

                      <td>
                        <span className="serial">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="student-name">
                          {student.name}
                        </div>
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>
                        <span className="course">
                          {student.course}
                        </span>
                      </td>

                      <td>

                        <div className="actions">

                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(student)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(student._id)
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;