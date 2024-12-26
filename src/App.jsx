import './App.css'
import { useContext, useEffect, useState } from 'react'
import StockDataContext from './contexts/StockdataContext.js'
import StockListsEmpty from './StockListsEmpty.jsx';
import StockLists from './StockLists.jsx';
import { useCallback } from 'react';


function App() {
  const [userStock, setUserStock] = useState("");
  const [userQuantity, setUserQuantity] = useState("");
  const [userPurchase, setUserPurchase] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stockData, setStockData] = useState([]);
  
  
  return (
    <>
    <div className="h-dvh w-full flex justify-center items-center">
      <div className='w-[60%] min-w-[18em] max-w-[50em] max-h-[85vh] rounded-[35px] bg-[#4a4e69] border-box shadow-lg'>
          <Header />
            <StockDataContext.Provider value={{ 
              userStock, setUserStock, 
              userQuantity, setUserQuantity, 
              userPurchase, setUserPurchase, 
              currentPrice, setCurrentPrice,
              formSubmitted, setFormSubmitted,
              stockData, setStockData
              }} >
             <Form/>
             <StockContainer />
            </StockDataContext.Provider>
      </div>
    </div>
 
    </>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-center">
      <h1 id="title" className='w-full text-[1.25rem] pt-6 pb-4 font-title font-bold text-white text-center'>Finance Dashboard</h1>
      <hr className="w-[90%]"></hr>
    </header>
  )
}

function Form() {
 
  const {
    userStock, setUserStock,
    userQuantity, setUserQuantity,
    userPurchase, setUserPurchase,
    currentPrice, setCurrentPrice, //current price for checking
    formSubmitted, setFormSubmitted,
    stockData
  } = useContext(StockDataContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true)
    // console.log(`handleSubmit called, fetching API data & checking Validitiy`)
  }

  useEffect(()=>{
    if(formSubmitted){
      checkStockValid();
    }
  }, [formSubmitted])


  const checkStockValid = useCallback(()=>[
    fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+ userStock +"&apikey=6DNFSUAJZ4VJJNWN")
    .then((res) => res.json())
     .then((data) => {

      if(Object.keys(data["Global Quote"]).length === 0 ) {    // invalid stock symbol returns empty object
       
        console.error("Invalid Stock Symbol : recieved empty object - resetting form");
        resetFormOnError();

      } else if(Object.keys(data["Global Quote"]).length > 0){
       
        // console.log(`Data received from API is Valid, calling updateCurentPrice`);
        updateCurrentPrice(data["Global Quote"]["05. price"]);      
         
      }
     })
  ]
  ,[userStock])



function updateCurrentPrice(price) {
  setCurrentPrice(price);
  // console.log(`updateCurrentPrice is called, setCurrent price to ${price}`)   

};

function resetFormOnError() {
  setUserStock("")
  setUserQuantity("")
  setUserPurchase("")
  setFormSubmitted(false);
  // console.log("Stock not found - Reset input fields and formSubmit to false!")
}



 return (
  <>
    <form onSubmit={handleSubmit} value={formSubmitted} className='h-full flex flex-col items-center font-title font-light'>

        <div className="h-[7.5em] mt-8 w-full flex flex-col justify-evenly items-center my-3" id="input-container">

          <input className="h-[1.7rem] w-[9em] min-w-0 mx-2 pl-3 placeholder:italic placeholder:text-[0.8em]"
          value={userStock}
          onChange={(event) => setUserStock(event.target.value.toLocaleUpperCase())} //Prevent cases of lower case Stock Symbols being submitted
          type="text"
          id="stock"
          name="stock"
          placeholder="Stock Symbol"
          required ></input>

          <input className=" h-[1.7rem] w-[9em] min-w-0 mx-2 pl-3 placeholder:italic placeholder:text-[0.8em]"
          value={userQuantity}
          onChange={(event) => setUserQuantity(event.target.value)}
          type="number"
          min="0"
          id="quantity"
          name="quantity"
          placeholder="Quantity"
          required  ></input>

          <input className="h-[1.7rem] w-[9em] min-w-0 mx-2 pl-3 placeholder:italic placeholder:text-[0.8em]"
          value={userPurchase}
          onChange={(event) => setUserPurchase(event.target.value)}
          type="number"
          min="0"
          id="price"
          name="price"
          placeholder="Purchase Price"
          required ></input>

        </div>

        <div className="size-full flex justify-center items-center">

          <input className="h-8 w-[8rem] text-[0.75rem] font-bold text-white rounded-[5em]"
          type="submit" value="Add Stock" id="submitBtn"/>


        </div>

    </form>
  </>
 )
}


function StockContainer() {

  const {currentPrice} = useContext(StockDataContext);
  const [isEmpty, setIsEmpty] = useState(true);


  useEffect(() => {
    if (currentPrice){
      setIsEmpty(false);
// console.log("Switching emptyStocklist out for Stocklist");
    }
  },[currentPrice])


  return (
    <>
      <section className="font-title h-[80%] bg-[#4a4e69] rounded-b-[35px] pt-3 "> 
        <h2 id="subheading" className="text-[1.1rem] w-full text-center text-white font-bold">Stock List</h2>
        <div className="h-full mb-10 flex justify-center">
          {isEmpty ?  <StockListsEmpty /> : <StockLists />}
        </div>  
      </section>
    </>
  )
  
}


export default App


