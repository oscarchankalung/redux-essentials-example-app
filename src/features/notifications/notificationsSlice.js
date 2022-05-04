import {
  createAction,
  createEntityAdapter,
  createSlice,
  createSelector,
  isAnyOf,
} from '@reduxjs/toolkit'

import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'

const notificationReceived = createAction('notifications/notificationsReceived')

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket('ws://localhost')

        const listener = (event) => {
          const message = JSON.parse(event.data)
          switch (message.type) {
            case 'notifications': {
              updateCachedData((draft) => {
                draft.push(...message.payload)
                draft.sort((a, b) => b.date.localeCompare(a.date))
              })
              dispatch(notificationReceived(message.payload))
              break
            }
            default:
              break
          }
        }

        try {
          await cacheDataLoaded
          ws.addEventListener('message', listener)
        } catch {}

        await cacheEntryRemoved
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = extendedApi

const emptyNotifications = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationResult) => notificationResult.data ?? emptyNotifications
)

///
export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  forceGenerateNotifications(latestTimestamp)
}
///

const notificationsAdapter = createEntityAdapter()
// {sortComparer: (a, b) => b.date.localeCompare(a.date)}

const initialState = notificationsAdapter.getInitialState()

const matchNotificationsReceived = isAnyOf(
  notificationReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      const notificationMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((notification) => {
        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, notificationMetadata)
    })
  },
})

export const notificationsActions = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectNotificationsMetadataEntities,
} = notificationsAdapter.getSelectors((state) => state.notifications)
