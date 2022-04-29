import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  {
    id: '1',
    user: '',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    title: 'First Post',
    content: 'Hello',
    reactions: { thumbsUp: 1, hooray: 1, heart: 1, rocket: 1, eyes: 1 },
  },
  {
    id: '2',
    user: '',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    title: 'Second Post',
    content: 'More',
    reactions: { thumbsUp: 2, hooray: 2, heart: 2, rocket: 2, eyes: 2 },
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded(state, action) {
      state.push({
        id: nanoid(),
        date: new Date().toISOString(),
        title: action.payload.title,
        content: action.payload.content,
        user: action.payload.userId,
        reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
      })
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)

      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)

      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
})

export const postsActions = postsSlice.actions

export default postsSlice.reducer
