import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoCreateSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import { AiFillEdit } from "react-icons/ai";
import { MdAutoDelete } from "react-icons/md";
import { FcLike } from "react-icons/fc";

const Home = () => {
  let [user, setUser] = useState([])
  let [name, setName] = useState()
  let [id, setId] = useState()
  let [company, setCompany] = useState()

  let [editId, setEditId] = useState(null)

  // ✅ Likes state
  let [likes, setLikes] = useState({})

  let fetchData = async () => {
    let data1 = await axios.get("http://localhost:9000/user")
    let { data } = data1;
    setUser(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // CREATE
  let create = async (e) => {
    e.preventDefault()
    let payload = { name, id, company }
    axios.post("http://localhost:9000/user", payload)
      .then(() => {
        toast.success("Data is created successfully");
        window.location.reload();
      })
      .catch(() => {
        toast.error("Error occurred");
      });
  }

  // DELETE
  let deleteData = async (id) => {
    if (window.confirm("Do you want to delete the data?")) {
      await axios.delete(`http://localhost:9000/user/${id}`)
        .then(() => {
          console.log("data is deleted");
          window.location.reload()
        })
        .catch(() => {
          console.log("error occurred");
        })
    }
  }

  // PREPARE EDIT
  let prepareEdit = (u) => {
    setEditId(u.id)
    setName(u.name)
    setId(u.id)
    setCompany(u.company)
  }

  // SAVE EDIT
  let saveEdit = async () => {
    let payload = { name, id, company }
    await axios.put(`http://localhost:9000/user/${editId}`, payload)
    toast.success("Data is updated")
    fetchData()
  }

  // ✅ TOGGLE LIKE
  let toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div>
      {/* CREATE BUTTON */}
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">
        <IoCreateSharp /> Create User
      </button>

      {/* CREATE MODAL */}
      <div className="modal fade" id="createModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Create User</h5></div>
            <div className="modal-body">
              <form>
                <input type="text" className="form-control mb-2" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input className="form-control mb-2" type="text" placeholder="ID" onChange={(e) => setId(e.target.value)} />
                <input className="form-control mb-2" type="text" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={create}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Edit User</h5></div>
            <div className="modal-body">
              <form>
                <input className="form-control mb-2" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="form-control mb-2" type="text" value={id} onChange={(e) => setId(e.target.value)} />
                <input className="form-control mb-2" type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={saveEdit}>Update</button>
            </div>
          </div>
        </div>
      </div>

      {/* USER CARDS */}
      <div className="mt-4 d-flex flex-wrap gap-3">
        {user.map((value) => (
          <div key={value.id} className="card" style={{ width: '18rem' }}>
            <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${value.name}`} className="card-img-top" alt="avatar" />
            <div className="card-body">
              <h5 className="card-title">{value.name}</h5>
              <p className="card-text"><strong>ID:</strong> {value.id}</p>
              <p className="card-text"><strong>Company:</strong> {value.company}</p>

              {/* ✅ LIKE BUTTON */}
              <button className="btn" onClick={() => toggleLike(value.id)}>
                <FcLike size={28} style={{ opacity: likes[value.id] ? 1 : 0.5 }} />
              </button>

              {/* EDIT + DELETE */}
              <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => prepareEdit(value)}><AiFillEdit /></button>
              <button className="btn btn-danger" onClick={() => deleteData(value.id)}><MdAutoDelete /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
