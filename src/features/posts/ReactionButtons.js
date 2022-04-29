import React from 'react'
import { useDispatch } from 'react-redux'
import { postsActions } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()

  const onReactionButtonClicked = (reaction) => {
    dispatch(postsActions.reactionAdded({ postId: post.id, reaction }))
  }
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() => onReactionButtonClicked(name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
