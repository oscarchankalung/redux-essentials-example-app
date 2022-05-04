import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationsAdapter.getInitialState()

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      transformResponse: (notifications) => {
        const notificationsWithMetadata = notifications.map((notification) => ({
          ...notification,
          read: false,
          isNew: true,
        }))

        return notificationsAdapter.setAll(
          initialState,
          notificationsWithMetadata
        )
      },
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
                const notificationsWithMetadata = message.payload.map(
                  (notification) => ({
                    ...notification,
                    read: false,
                    isNew: true,
                  })
                )

                Object.values(draft.entities).forEach((notification) => {
                  notification.isNew = !notification.read
                })

                notificationsAdapter.upsertMany(
                  draft,
                  notificationsWithMetadata
                )
              })
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

const selectNotificationsData = createSelector(
  notificationsApi.endpoints.getNotifications.select(),
  (notificationsResult) => notificationsResult.data ?? initialState
)

export const notificationsSelectors = notificationsAdapter.getSelectors(
  (state) => selectNotificationsData(state)
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = notificationsSelectors.selectAll(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  forceGenerateNotifications(latestTimestamp)
}

export const readAllNotifications = notificationsApi.util.updateQueryData(
  'getNotifications',
  undefined,
  (draft) => {
    Object.values(draft.entities).forEach((notification) => {
      notification.read = true
    })
  }
)
