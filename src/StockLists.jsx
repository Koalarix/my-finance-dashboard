import './App.css'
import { useContext, useEffect, useRef } from "react"
import StockContext from "./contexts/StockContext";



function StockLists() {

   const {
    userStock, setUserStock,
    userQuantity, setUserQuantity,
    userPurchase, setUserPurchase,
    currentPrice, setCurrentPrice,
    formSubmitted, setFormSubmitted,
    stockData, setStockData
  } = useContext(StockContext);


  const effectHasRun = useRef(false);


  const newStockData = () => {

    if (formSubmitted) {
    
      const addNewStock = { Symbol: userStock,
                            Quantity: userQuantity,
                            Purchase: userPurchase,
                            Current: currentPrice };

      setStockData(stockData => stockData.concat(addNewStock))
    }}


  useEffect(()=>{
    if(currentPrice && !effectHasRun.current) {  
      newStockData();
      effectHasRun.current = true;
      setFormSubmitted(false);
    }}, [currentPrice]);


  useEffect(() => {
    if(formSubmitted === false){
    resetFormInputs();
    // console.log(`Checking stock Data after render ${JSON.stringify(stockData)}`)
  }
  },[stockData])


  function resetFormInputs() {
    setUserStock("")
    setUserQuantity("")
    setUserPurchase("")
    setCurrentPrice("")
    effectHasRun.current = false;
    // console.log("Listed a Stock - Reset input fields and formSubmit to false!")
  }
 

  return (
    <div className="w-[25rem] flex flex-col items-center">
    {stockData.map((data) => {
      const profitLoss = (((data.Quantity)*(data.Current)) - ((data.Quantity)*(data.Purchase))).toFixed(2)
      return(
        <div key={`${data.Symbol} + ${profitLoss}`}id="listContainer"className="bg-[#5e6381] w-[200px] h-[8rem] mb-5 pt-0 text-center rounded-md border border-[#969ab6] flex justify-center items-center">
            <section id="stocklistblock" className="h-full w-100 flex flex-col justify-center items-center pb-[1.5em] text-[#afb2c4] text-[0.68rem]">
              <h3 className="text-[1.35em] text-white font-bold">Symbol: {data.Symbol} </h3>
              <p>Quantity: {data.Quantity}</p>
              <p>Purchase Price: {data.Purchase}</p>
              <p>Current Price: {data.Current}</p>
              <h3 key={profitLoss}
                  className={`profit-loss ${profitLoss > 0 ? `text-[#38FF92]` : (profitLoss == 0 ?  `text-[#a4acbd]` : `text-[#ff534e]`) } `}>
                    Profit/Loss: {`${profitLoss > 0 ? `+` : ``}${profitLoss}`}</h3>
            </section>
        </div>
      )}
    )}
   
    </div>
 
  )
}
export default StockLists





