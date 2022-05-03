import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { postsSelectors } from '../posts/postsSlice'
import { usersSelectors } from './usersSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => usersSelectors.selectById(state, userId))

  const postsForUser = useSelector((state) =>
    postsSelectors.selectByUser(state, userId)
  )

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
