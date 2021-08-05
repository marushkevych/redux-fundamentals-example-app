import {createSelector, createSlice, createEntityAdapter} from '@reduxjs/toolkit'
import {StatusFilters} from '../filters/filtersSlice'

import { client } from '../../api/client'
import { includes, isEmpty, prop } from 'ramda';

export const LoadingStatuses = {
  idle: 'idle',
  loading: 'loading'
}

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: LoadingStatuses.idle
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: todosAdapter.addOne,
    todoUpdated: todosAdapter.updateOne,
    todoDeleted: todosAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
    completedCleared(state, action) {
      const completedIds = Object.values(state.entities)
          .filter(prop('completed'))
          .map(prop('id'))
      todosAdapter.removeMany(state, completedIds)
    },
    todosLoading(state, action) {
      state.status = 'loading'
    },
    todosLoaded(state, action) {
      state.status = 'idle'
      todosAdapter.addMany(state, action)
    },
  },
})

export const {
  allCompleted,
  completedCleared,
  todoAdded,
  colorSelected,
  todoDeleted,
  todoUpdated,
  todosLoaded,
  todosLoading,
} = todosSlice.actions

export default todosSlice.reducer


// Thunk function
export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, getState) {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}

// SELECTORS

export const { selectAll: selectTodos, selectById: selectTodoById } = todosAdapter.getSelectors(state => state.todos)

export const selectLoadingStatus = state => state.todos.status

const filterPredicate = (status, colors) => todo => {
  const matchesStatus = status === StatusFilters.All ? true :
                        status === StatusFilters.Active ? !todo.completed : todo.completed

  const matchesColor = isEmpty(colors) || includes(todo.color, colors)

  return matchesStatus && matchesColor;
}

export const selectFilteredTodos = createSelector(
    // First input selector: all todos
    selectTodos,
    // Second input selector: all filter values
    state => state.filters,
    // Output selector: receives both values
    (todos, filters) => {
      const { status, colors } = filters
      return todos.filter(filterPredicate(status, colors))
    }
)

export const selectUncompletedTodos = createSelector(
    selectTodos,
    todos => todos.filter(todo => !todo.completed)
)
