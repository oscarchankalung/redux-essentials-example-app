import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'

import { postsApi } from '../posts/postsSlice'
import { usersSelectors } from './usersSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => usersSelectors.selectById(state, userId))

  const selectPostsForUser = useMemo(() => {
    const emptyArray = []

    return createSelector(
      (res) => res.data,
      (res, userId) => userId,
      (data, userId) =>
        data?.filter((post) => post.user === userId) ?? emptyArray
    )
  }, [])

  const { postsForUser } = postsApi.useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId),
    }),
  })

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
