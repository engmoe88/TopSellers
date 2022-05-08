import { useState, useEffect } from 'react'
import { getOrders } from '../dataService'


export default function useOrders() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        async function fetchOrders() {
           const result = await getOrders()
        //    if (typeof result === String) setError(result)
        setOrders(result)
        }
        fetchOrders()
    }, [])
  return [orders]
}
