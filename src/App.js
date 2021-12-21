import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from "react"
import { GET_PRODUCTS, GET_AVAILABLE_PRODUCTS } from "./graphql";


function App() {
  const [state, setState] = useState(null)
  const [list, setList] = useState([])
  const [availableProducts, setAvailableProds] = useState([])
  const [type, setType] = useState(null)
  const formRef = useRef()


  useEffect(() => {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: GET_AVAILABLE_PRODUCTS
      })
    })
      .then(r => r.json())
      .then(data => setAvailableProds(data.data.availableProducts));

  }, [])

  useEffect(() => {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PRODUCTS,
        variables: {
          filterProduct: type,
          showUser: true
        }
      })
    })
      .then(r => r.json())
      .then(data => setList(data.data.products));
  }, [type])

  useEffect(() => {
    if (state !== null) {
      const product = state.reduce((acc, feild) => ({ ...acc, [feild.name]: feild.value }), [])
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: "mutation CreateProduct($name:String,$id:String!,$date:String,$receivedBy:PersonInput){createProduct(name:$name,id:$id,date:$date,receivedBy:$receivedBy){name,id,date,receivedBy{name,id}}}",
          variables: {
            ...product,
            receivedBy: {
              name: "raghav10",
              id: "10"

            }
          }
        })
      })
        .then(r => r.json())
        .then(data => data);
    }
  }, [state])

  const onCreate = e => {
    setState(Array.from(formRef.current).filter(inp => inp.nodeName === "INPUT"))
    e.preventDefault()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <select onChange={(e) => {
          console.log(e);
          setType(e.target.value)
        }}>
          <option value="all">All</option>
          {
            availableProducts.map(prod => <option value={prod.id}>{prod.name}</option>)
          }
        </select>
        <table>
          <tbody>
            {
              list?.map(item => {
                return <tr>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        <form ref={formRef}>
          Name :<input type="text" name="name"></input>
        Id :<input type="text" name="id"></input>
        Date : <input type="text" name="date"></input>
          <br />
          <strong>RecievedBy</strong>
          <div >
            <input type="text" name="recievedBy"></input>
          </div>
          <div >
            <input type="email" name="email"></input>
          </div>
          <br />
          <button onClick={onCreate} >submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
