import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState()

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (posts) => {
        return postsAdapter.setAll(initialState, posts)
      },
      providesTags: (result = initialState, error, arg) => [
        'Post',
        ...result.ids.map(({ id }) => ({ type: 'Post', id })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [
        { type: 'Post', id: arg },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.entities[postId]
            if (post) {
              post.reactions[reaction]++
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

const selectPostsData = createSelector(
  postsApi.endpoints.getPosts.select(),
  (postsResult) => postsResult.data ?? initialState
)

export const postsSelector = postsAdapter.getSelectors((state) =>
  selectPostsData(state)
)
