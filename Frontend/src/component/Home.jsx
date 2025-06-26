import { useState } from 'react'

const Home = () => {

  const [url,seturl]=useState("");

  function handlechange(e){
    seturl(e.target.value)
  }

  function handlesubmit(e){
    e.preventdefault();
    console.log(url);
    
  }
  return (
    <div>

      <h1>Enter your Url Here</h1>
      <form onSubmit={handlesubmit}>
        <input type="text" onChange={handlechange} placeholder='Enter the Url'/>

        <button type='submit'>click Here</button>
      </form>
    </div>
  )
}

export default Home