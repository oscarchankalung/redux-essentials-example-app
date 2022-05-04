import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { postsApi } from './postsSlice'

import { Spinner } from '../../components/Spinner'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const { data: post } = postsApi.useGetPostQuery(postId)
  const [updatePost, { isLoading }] = postsApi.useEditPostMutation()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const history = useHistory()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content })
      history.push(`/posts/${postId}`)
    }
  }
  return (
    <section>
      <h2>Edit Posts</h2>
      <form>
        <label htmlFor="postTitle">Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          placeholder="What's on your mind"
          onChange={onTitleChanged}
        ></input>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        ></textarea>
        <button type="button" onClick={onSavePostClicked} disabled={isLoading}>
          Save Post
        </button>
        {isLoading && <Spinner text="Saving..." />}
      </form>
    </section>
  )
}
