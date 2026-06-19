import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks } from '../actions/taskActions'

const Tasks = () => {
  const dispatch = useDispatch()
  const { tasks, loading, error } = useSelector(
    (state) => state.tasks || { tasks: [], loading: false, error: null }
  )

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  if (loading) return <div>Chargement des tâches...</div>
  if (error) return <div>Erreur : {error}</div>

  return (
    <div>
      <h3>Mes Tâches</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}
export default Tasks
