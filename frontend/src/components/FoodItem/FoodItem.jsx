import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc , id }) => {

    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);
    const itemId = id ?? name;
    const imageSrc =
        image != null && image !== ''
            ? typeof image === 'string' && !image.startsWith('http') && !image.startsWith('/') && Boolean(url)
                ? `${url}/images/${image}`
                : image
            : assets.header_img;

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={imageSrc} alt={name} />
                {!cartItems[itemId]
                ?<img className='add' onClick={() => addToCart(itemId)} src={assets.add_icon_white} alt="" />
                :<div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={()=>removeFromCart(itemId)} alt="" />
                        <p>{cartItems[itemId]}</p>
                        <img src={assets.add_icon_green} onClick={()=>addToCart(itemId)} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

export default FoodItem
