import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const initialState = usersAdapter.getInitialState()

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (users) => {
        return usersAdapter.setAll(initialState, users)
      },
    }),
  }),
})

const selectUsersData = createSelector(
  usersApi.endpoints.getUsers.select(),
  (usersResult) => usersResult.data ?? initialState
)

export const usersSelectors = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
)
