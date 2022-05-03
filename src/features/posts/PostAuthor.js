import React from 'react'
import { useSelector } from 'react-redux'
import { usersSelectors } from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {
  const author = useSelector((state) =>
    usersSelectors.selectById(state, userId)
  )

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
