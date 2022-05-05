import React, { Fragment, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { postsApi } from './postsSlice'

import { Spinner } from '../../components/Spinner'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const {
    data: post,
    isSuccess,
    isLoading,
    isError,
    error,
  } = postsApi.useGetPostQuery(postId)
  const [updatePost, { isLoading: isSaving }] = postsApi.useEditPostMutation()

  const [postTitle, setPostTitle] = useState(post?.title)
  const [postContent, setPostContent] = useState(post?.content)

  const history = useHistory()

  const onPostTitleChanged = (e) => setPostTitle(e.target.value)
  const onPostContentChanged = (e) => setPostContent(e.target.value)

  const onSavePostClicked = async () => {
    if (postTitle && postContent) {
      await updatePost({ id: postId, title: postTitle, content: postContent })
      history.push(`/posts/${postId}`)
    }
  }

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <Fragment>
        <h2>Edit Posts</h2>
        <form>
          <label htmlFor="postTitle">Title:</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={postTitle}
            placeholder="What's on your mind"
            onChange={onPostTitleChanged}
          ></input>
          <label htmlFor="postContent">Content:</label>
          <textarea
            id="postContent"
            name="postContent"
            value={postContent}
            onChange={onPostContentChanged}
          ></textarea>
          <button type="button" onClick={onSavePostClicked} disabled={isSaving}>
            Save Post
          </button>
          {isSaving && <Spinner text="Saving..." />}
        </form>
      </Fragment>
    )
  } else if (isError) {
    content = (
      <h2>
        {error.data.errorType}: {error.data.message}
      </h2>
    )
  }

  return <section>{content}</section>
}
