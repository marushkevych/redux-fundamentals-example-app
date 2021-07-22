import {createSelector} from 'reselect'
import {StatusFilters} from '../filters/filtersSlice'

import { client } from '../../api/client'
import { includes, isEmpty } from 'ramda';

export const LoadingStatuses = {
  idle: 'idle',
  loading: 'loading'
}

const initialState = {
  status: LoadingStatuses.idle,
  entities: []
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoading': {
      return {
        ...state,
        status: LoadingStatuses.loading
      }
    }
    case 'todos/todoAdded': {
      // Return a new todos state array with the new todo item at the end
      return {
        ...state,
        entities: [...state.entities, action.payload]
      }
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed
          }
        })
      }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== todoId) {
            return todo
          }

          return {
            ...todo,
            color,
          }
        })
      }
    }
    case 'todos/todoDeleted': {
      return {
        ...state,
        entities: state.entities.filter((todo) => todo.id !== action.payload)
      }
    }
    case 'todos/allCompleted': {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          return { ...todo, completed: true }
        })
      }
    }
    case 'todos/completedCleared': {
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed)
      }
    }
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return {
        ...state,
        status: LoadingStatuses.idle,
        entities: action.payload
      }
    }
    default:
      return state
  }
}

export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}

export const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}

export const todosLoading = () => ({type: 'todos/todosLoading'})

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

export const selectTodos = state => state.todos.entities

export const selectLoadingStatus = state => state.todos.status

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}

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
