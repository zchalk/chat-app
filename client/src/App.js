import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";


const GET_MESSAGES = gql `
query {
  messages {
    id
    user
    content
  }
}
`

function GetMessages() {
  const { loading, error, data } = useQuery(GET_MESSAGES);
  console.log(data)
return (
  <>
  {/* <p>{data.user}</p>
  <p>{data.content}</p> */}
  
  </>
)}


function App() {
  return (
    <div>
      <GetMessages/>
    </div>
  );
}

export default App;
