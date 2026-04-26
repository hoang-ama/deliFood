import React, { useContext, useEffect, useMemo, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  const {url,token,currency,authHeaders} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.get(url+"/api/orders",{headers: authHeaders});
    const orders = Array.isArray(response.data?.data) ? response.data.data : [];
    setData(orders);
  }

  const fetchRestaurants = async () => {
    const response = await axios.get(url + '/api/restaurants', { headers: authHeaders });
    const restaurants = Array.isArray(response.data) ? response.data : [];
    const map = restaurants.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
    setRestaurantMap(map);
  }

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  };

  const getStatusClassName = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'paid' || normalized === 'delivered') {
      return 'status-badge success';
    }
    if (normalized === 'cancelled' || normalized === 'failed') {
      return 'status-badge danger';
    }
    return 'status-badge pending';
  };

  const hasOrders = useMemo(() => data.length > 0, [data]);

  useEffect(()=>{
    if (token) {
      fetchOrders();
      fetchRestaurants();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {!hasOrders && <p className='empty-state'>No orders yet.</p>}
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>Order ID: {order.id}</p>
                <p>{currency}{order.total}</p>
                <p>Restaurant: {restaurantMap[order.restaurantId] || order.restaurantId}</p>
                <p>Created: {formatDateTime(order.createdAt)}</p>
                <p><span className={getStatusClassName(order.status)}>{order.status}</span></p>
                <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
