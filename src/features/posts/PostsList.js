import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { postsApi, postsSelector } from './postsSlice'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

const PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => postsSelector.selectById(state, postId))

  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const { isLoading, isFetching, isSuccess, isError, error, refetch } =
    postsApi.useGetPostsQuery()
  const postIds = useSelector(postsSelector.selectIds)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = postIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))

    const containerClassname = classNames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
