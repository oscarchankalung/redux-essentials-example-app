import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  notificationApi,
  fetchNotificationsWebsocket,
  notificationsSelectors,
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()

  notificationApi.useGetNotificationsQuery()

  const notifications = useSelector(notificationsSelectors.selectAll)
  const numUnreadNotifications = notifications.filter((n) => !n.read).length

  const fetchNewNotifications = () => {
    dispatch(fetchNotificationsWebsocket())
  }

  let unreadNotificationBadge

  if (numUnreadNotifications > 0) {
    unreadNotificationBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications {unreadNotificationBadge}
            </Link>
          </div>
          <button className='="button' onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
