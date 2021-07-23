import {createSelector, createSlice} from '@reduxjs/toolkit'
import {StatusFilters} from '../filters/filtersSlice'

import { client } from '../../api/client'
import { includes, isEmpty } from 'ramda';

export const LoadingStatuses = {
  idle: 'idle',
  loading: 'loading'
}

const initialState = {
  status: LoadingStatuses.idle,
  entities: {}
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    colorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        }
      },
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload]
    },
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
    completedCleared(state, action) {
      Object.values(state.entities).forEach((todo) => {
        if (todo.completed) {
          delete state.entities[todo.id]
        }
      })
    },
    todosLoading(state, action) {
      state.status = 'loading'
    },
    todosLoaded(state, action) {
      const newEntities = {}
      action.payload.forEach((todo) => {
        newEntities[todo.id] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    },
  },
})

export const {
  allCompleted,
  completedCleared,
  todoAdded,
  colorSelected,
  todoDeleted,
  todoToggled,
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

const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(
    selectTodoEntities,
    entities => Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}

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
