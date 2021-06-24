const initialState = {
  status: 'All',
  colors: ['blue']
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        status: action.payload
      }
    }
    case 'filters/colorFilterChanged': {
      const colors = action.payload.changeType === 'added'
                     ? [...state.colors, action.payload.color]
                     : state.colors.filter(color => action.payload.color !== color)
      return {
        ...state,
        colors
      }
    }
    default:
      return state
  }
}
