import React from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import TodoListItem from './TodoListItem'
import {selectFilteredTodos} from './todosSlice'
import {createSelector} from 'reselect'


const selectTodoIds = createSelector(
    selectFilteredTodos,
    todos => todos.map(todo => todo.id)
)


const TodoList = () => {
  console.log('TodoList is rendered')
  // To avoid rerender - use shallowEqual to compare the contents of the array, instead of the array object identity.
  // (since selectTodoIds will return new array each time)
  const todoIds = useSelector(selectTodoIds, shallowEqual)

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} todoId={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
