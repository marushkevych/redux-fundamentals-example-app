import React from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import TodoListItem from './TodoListItem'
import {selectFilteredTodos, selectLoadingStatus, LoadingStatuses} from './todosSlice'
import {createSelector} from '@reduxjs/toolkit'


const selectTodoIds = createSelector(
    selectFilteredTodos,
    todos => todos.map(todo => todo.id)
)


const TodoList = () => {
  console.log('TodoList is rendered')
  // To avoid rerender - use shallowEqual to compare the contents of the array, instead of the array object identity.
  // (since selectTodoIds will return new array each time)
  const todoIds = useSelector(selectTodoIds, shallowEqual)
  const loadingStatus = useSelector(selectLoadingStatus)

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} todoId={todoId} />
  })

  if (loadingStatus === LoadingStatuses.loading) {
    return (
        <div className="todo-list">
          <div className="loader" />
        </div>
    )
  }

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
