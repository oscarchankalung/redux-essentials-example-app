import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { usersApi, usersSelectors } from './usersSlice'

import { Spinner } from '../../components/Spinner'

export const UsersList = () => {
  const { users, isFetching, isSuccess, isError, error } = {
    users: useSelector(usersSelectors.selectAll),
    ...usersApi.endpoints.getUsers.useQueryState(),
  }

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = <ul>{renderedUsers}</ul>
  } else if (isError) {
    content = (
      <h2>
        {error.data.errorType}: {error.data.message}
      </h2>
    )
  }

  return (
    <section>
      <h2>Users</h2>
      {content}
    </section>
  )
}
