import React, { useEffect, useState } from 'react';

function App() {
  // Define a state variable to store the data from the API
  const [products, setProducts] = useState();

  useEffect(() => {
    // Define an async function to fetch the data
    async function fetchData() {
      try {
        const response = await fetch('https://bliss-express-server.vercel.app/api/product/');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setProducts(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Call the async function to fetch data when the component mounts
    fetchData();
  }, []);

  return (
    <div className="App">
      {products}
    </div>
  );
}

export default App;
