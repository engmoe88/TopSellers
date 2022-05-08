import styles from './Dashboard.module.css';
import { LoadingIcon } from './Icons';
// import { getOrders } from './dataService';
import useOrders from './hooks/useOrders'
import { useState, useEffect } from 'react';

// Overview:
// You are provided with an incomplete <Dashboard /> component.
// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1lH8ojlvb62I_9z3jGxhNEY_-8S4trNo7/view?usp=sharing 
// This demo video uses the same dataset, so your total and ranking calculations should match it
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Requirements:
// Once the <Dashboard /> component is mounted, load the order data using the getOrders function imported above
// Once all the data is successfully loaded, hide the loading icon
// Calculate and display the total revenue
// Display a ranking showing the sellers ordered by their total revenue using the <SellerRanking /> component. 
// The seller with the highest revenue should be shown at the top with position 1. 
// All the revenue values should only consider Confirmed orders. Canceled orders should be ignored.
// All dollar amounts should be displayed to 2 decimal places
// The getOrders function times out frequently. Display any errors returned while loading the data in the provided div. 
// The retry button should clear the error and reattempt the request


const SellerRanking = ({ position, sellerName, sellerRevenue }) => {
  return (
    <tr>
      <td>{position}</td>
      <td>{sellerName}</td>
      <td>${sellerRevenue}</td>
    </tr>    
  );
}

const Dashboard = () => {
  const [returnedOrders] = useOrders()
  const [orders, setOrders] = useState([])
  const [errors, setErrors] = useState('')
  const [rev, setRev] = useState(0)

  useEffect(() => {
    if (typeof returnedOrders !== 'string') {
      let sortedOrders = returnedOrders.filter(order => order.status === 'Confirmed')
      sortedOrders = sortedOrders.sort((a, b) => b.revenue-a.revenue)
      setOrders(sortedOrders)
    } else {
      setErrors(returnedOrders)
    }
  }, [returnedOrders])

  useEffect(() => {
    if (orders.length) {
      let totalRev = 0
      for (const order of orders) {
        totalRev+= order.revenue
      }
      totalRev = Math.round(totalRev)
      setRev(totalRev)
    }
  }, [orders])

  return (
    <div>
      <header className={styles.header}>        
        <h1>Top Sellers</h1>        
      </header>
      <main>
        {orders.length === 0 && <LoadingIcon />}  
        {/* Place any data fetching errors inside this div, only render the div if there are errors */}
        {errors&&<div className={styles.errorContainer}>
          <div className={styles.errorMessage}>{errors}</div>
          <button onClick={() => window.location.reload(false)}>Retry</button>
        </div>}
        <div>
          <p className={styles.summary}>
            <strong>Total revenue: </strong> 
            <span id="totalRevenue">${rev}</span>
            </p>       
        </div>
        <h2>Seller Rankings</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Seller Name</th>
              <th>Seller Revenue</th>
            </tr>
          </thead>
          <tbody>
          {orders.map((order, i) => 
              <SellerRanking key={order.orderDate} 
              position={i+1} 
              sellerName={order.sellerName} 
              sellerRevenue={order.revenue}
              />)
          }
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dashboard;