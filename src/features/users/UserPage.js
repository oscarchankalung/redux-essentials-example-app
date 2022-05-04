import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'

import { postsSelector } from '../posts/postsSlice'
import { usersSelectors } from './usersSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => usersSelectors.selectById(state, userId))

  const selectPostsForUser = useMemo(() => {
    const emptyArray = []

    return createSelector(
      (state) => postsSelector.selectAll(state),
      (state, userId) => userId,
      (data, userId) => {
        return data?.filter((post) => post.user === userId) ?? emptyArray
      }
    )
  }, [])

  const postsForUser = useSelector((state) => selectPostsForUser(state, userId))

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
