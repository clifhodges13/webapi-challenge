import React, { useState } from 'react'
import axios from 'axios';

export default function GetTheProjects() {

  const [projects, setProjects] = useState(null)
  const [error, setError] = useState(null)


  const getProjects = () => {
    axios.get(`http://localhost:8787/projects`)
      .then(res => {
        setProjects(res.data)
      })
      .catch(err => setError(err))
  }

  return (
    <div>
      {!projects && <button onClick={getProjects}>Get The Projects!</button>}
      {error ? <h3>{error}</h3> : projects && projects.map((proj, index) => (
        <div key={index}>
          <h3>{proj.name}</h3>
          <p>{proj.description}</p>
          <p>{proj.completed ? '✅' : ' ⃞'}</p>
        </div>
      ))}
    </div>
  )
}
