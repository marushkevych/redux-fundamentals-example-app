import React from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import TodoListItem from './TodoListItem'

const selectTodoIds = state => state.todos.map(todo => todo.id)

const TodoList = () => {
  console.log('TodoList is rendered')
  const todoIds = useSelector(selectTodoIds, shallowEqual)

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} todoId={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
