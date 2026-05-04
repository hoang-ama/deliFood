import { useContext, useEffect, useMemo, useState } from 'react'
import './Home.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../Context/StoreContext'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Home = () => {

  const [category,setCategory] = useState("All")
  const navigate = useNavigate()
  const { tenantSlug } = useParams()
  const {
    restaurant_list,
    food_list,
    tenantSubdomain,
    setTenantSubdomain,
    currency,
  } = useContext(StoreContext)
  const [tenantInput, setTenantInput] = useState(tenantSubdomain)

  useEffect(() => {
    const normalizedTenant = (tenantSlug ?? '').trim().toLowerCase()
    setTenantSubdomain(normalizedTenant)
    setTenantInput(normalizedTenant)
    setCategory("All")
  }, [tenantSlug, setTenantSubdomain])

  const restaurant = restaurant_list[0]
  const averagePrice = useMemo(() => {
    if (food_list.length === 0) {
      return 0
    }

    const total = food_list.reduce((sum, item) => sum + Number(item.price || 0), 0)
    return Math.round(total / food_list.length)
  }, [food_list])

  const applyTenant = (event) => {
    event.preventDefault()
    const normalizedTenant = tenantInput.trim().toLowerCase()

    if (!normalizedTenant) {
      navigate('/')
      return
    }

    navigate(`/${normalizedTenant}`)
  }

  return (
    <main className='restaurant-landing'>
      <section className='restaurant-hero'>
        <div className='restaurant-hero-content'>
          <p className='restaurant-eyebrow'>Public ordering page</p>
          <h1>{restaurant?.name ?? 'Your restaurant is almost ready'}</h1>
          <p className='restaurant-hero-text'>
            Browse the live menu, add favourites to your cart, and checkout from a
            tenant-scoped storefront built for local restaurant ordering.
          </p>
          <div className='restaurant-hero-actions'>
            <a href='#explore-menu'>Order now</a>
            <Link to='/cart'>View cart</Link>
          </div>
        </div>
        <div className='restaurant-hero-card'>
          <p>Ordering from</p>
          <h2>{tenantSubdomain || 'default'}</h2>
          <span>{restaurant ? 'Open for online orders' : 'No restaurant found yet'}</span>
          <form className='tenant-switcher' onSubmit={applyTenant}>
            <input
              type='text'
              value={tenantInput}
              onChange={(event) => setTenantInput(event.target.value)}
              placeholder='restaurant subdomain'
            />
            <button type='submit'>Load</button>
          </form>
        </div>
      </section>

      <section className='restaurant-stats' aria-label='Restaurant ordering details'>
        <div>
          <span>{food_list.length}</span>
          <p>Menu items</p>
        </div>
        <div>
          <span>{currency}{averagePrice}</span>
          <p>Average dish</p>
        </div>
        <div>
          <span>25-35</span>
          <p>Minute pickup window</p>
        </div>
      </section>

      <ExploreMenu setCategory={setCategory} category={category}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
    </main>
  )
}

export default Home
