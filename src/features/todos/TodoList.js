import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import TodoListItem from './TodoListItem'

const selectTodos = state => state.todos

const TodoList = () => {
  console.log('TodoList is rendered')
  const todos = useSelector(selectTodos)
  const dispatch = useDispatch()


  const renderedListItems = todos.map((todo) => {
    const updateTodoColor = (color) => {
      dispatch({type: 'todos/colorSelected', payload: {color, todoId: todo.id}})
    }
    return <TodoListItem key={todo.id} todo={todo} onColorChange={updateTodoColor}/>
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
