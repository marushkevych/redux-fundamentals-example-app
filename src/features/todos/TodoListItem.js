import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { availableColors, capitalize } from '../filters/colors'
import {selectTodoById, colorSelected, todoUpdated, todoDeleted} from './todosSlice'


const TodoListItem = ({ todoId }) => {
  console.log('TodoListItem is rendered', todoId)
  const todo = useSelector((state) => selectTodoById(state, todoId))
  const dispatch = useDispatch()
  const { text, completed, color } = todo

  const handleCompletedChanged = () => {
    dispatch(todoUpdated({id: todoId, changes: {completed: !completed}}))
  }

  const handleColorChanged = (e) => {
    dispatch(todoUpdated({id: todoId, changes: {color: e.target.value}}))
  }

  const onDelete = () => {
    dispatch(todoDeleted(todoId))
  }

  const colorOptions = availableColors.map((c) => (
      <option key={c} value={c}>
        {capitalize(c)}
      </option>
  ))

  return (
      <li>
        <div className="view">
          <div className="segment label">
            <input
                className="toggle"
                type="checkbox"
                checked={completed}
                onChange={handleCompletedChanged}
            />
            <div className="todo-text">{text}</div>
          </div>
          <div className="segment buttons">
            <select
                className="colorPicker"
                value={color}
                style={{ color }}
                onChange={handleColorChanged}
            >
              <option value=""></option>
              {colorOptions}
            </select>
            <button className="destroy" onClick={onDelete}>
              <TimesSolid />
            </button>
          </div>
        </div>
      </li>
  )
}

export default TodoListItem
