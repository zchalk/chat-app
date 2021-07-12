import { useEffect, useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client';
const GET_USERS = gql`
query {
    allUsers {
      _id
      username
      email
  }
}`;
const ALL_MESSAGES = gql`
query {
  allMessages {
    postUser{
      username
    }
  }
}
`
const LISTEN_POSTS = gql`
  subscription {
    messageSent {
      content
    }
  }
`
const POST_MESSAGE = gql`
mutation postMessage($input: messageInput!){
  postMessage(input:$input){
    _id
  }
}
`
const Test = () => {
  //CRUD Apollo
  const { loading, error, data } = useQuery(GET_USERS);
  const { subscribeToMore, loading: postsLoad, error: postsErr, data: allMessages } = useQuery(ALL_MESSAGES);
  console.log(subscribeToMore)
  const [postMessage] = useMutation(POST_MESSAGE);
  //const { loading: subLoading, error: subErr, data: subData } = useSubscription(LISTEN_POSTS);
  //post state
  const [message, setMessage] = useState("")
  const handleSubmit = e => {
    e.preventDefault()
    postMessage({variables: {input: {content: message}}})
    setMessage("")
  }
  //https://www.apollographql.com/docs/react/data/subscriptions/
  useEffect(() => {
    subscribeListenMessage()
  }, [])
  function subscribeListenMessage () {
    subscribeToMore({
      document: LISTEN_POSTS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.messageSent
        const newObj = Object.assign({}, prev, {
          allMessages: [...prev.allMessages, newMessage]
        })
        return newObj
      }
    })
  }
  return (
    <div>
      <div className="users">
        {loading ? <h1>Loading...</h1>
          :
          data?.allUsers.map(user => (
            <div key={user._id}>
              <h1>{user.username}</h1>
              <h4>{user.email}</h4>
            </div>
          ))}
      </div>
      <div className="allposts">
        {postsLoad ? <h1>Loading Messages.....</h1>
          :
          <div>
            {allMessages?.allMessages.map((message, i) => (
              <div key={i} className="singlePost">
                {message.content}
              </div>
            ))}
          </div>
        }
      </div>
      <div className="enterPost">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter a message to post..." 
            value={message}
            onChange={e=>setMessage(e.target.value)}
            />
          <input type='submit' value="Submit" />
        </form>
      </div>
    </div>
  )
}
export default Test;