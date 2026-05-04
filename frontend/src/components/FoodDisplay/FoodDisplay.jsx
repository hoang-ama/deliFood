import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {food_list.map((item,index)=>{
          if (category==="All" || category===item.category) {
            return <FoodItem key={item.id || item._id || index} id={item.id || item._id} image={item.image} name={item.name} desc={item.description} price={item.price}/>
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default FoodDisplay

