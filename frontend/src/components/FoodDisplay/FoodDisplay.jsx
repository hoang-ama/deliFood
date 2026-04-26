/* eslint-disable react/prop-types */
import { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);
  const visibleItems = food_list.filter((item) => (
    category === "All" || category === item.category || item.category === 'All'
  ));

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {visibleItems.length > 0
          ? visibleItems.map((item) => (
            <FoodItem key={item.id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item.id}/>
          ))
          : <div className='food-display-empty'>
            <h3>No dishes available yet</h3>
            <p>Try another category or load a tenant that already has menu items.</p>
          </div>
        }
      </div>
    </div>
  )
}

export default FoodDisplay
