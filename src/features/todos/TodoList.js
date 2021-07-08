import React from 'react'
import {includes, isEmpty} from 'ramda'
import {useSelector, shallowEqual} from 'react-redux'
import TodoListItem from './TodoListItem'
import {StatusFilters} from '../filters/filtersSlice'

const filterPredicate = (status, colors) => todo => {
  const matchesStatus = status === StatusFilters.All ? true :
                        status === StatusFilters.Active ? !todo.completed : todo.completed

  const matchesColor = isEmpty(colors) || includes(todo.color, colors)

  return matchesStatus && matchesColor;
}

const selectTodoIds = state => {
  return state.todos
      .filter(filterPredicate(state.filters.status, state.filters.colors))
      .map(todo => todo.id)
}

const TodoList = () => {
  console.log('TodoList is rendered')
  const todoIds = useSelector(selectTodoIds, shallowEqual)

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} todoId={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
