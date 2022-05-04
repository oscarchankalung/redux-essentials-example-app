import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (users) => {
        return usersAdapter.setAll(initialState, users)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

const selectUsersData = createSelector(
  extendedApiSlice.endpoints.getUsers.select(),
  (usersResult) => usersResult.data ?? initialState
)

export const usersSelectors = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
)
