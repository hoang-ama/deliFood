import { useLocation, Link } from 'react-router-dom'
import './OrderConfirmation.css'
import { assets } from '../../assets/assets'

const OrderConfirmation = () => {
  const { state } = useLocation()
  const order = state?.order
  const summary = state?.summary
  const delivery = state?.delivery
  const currency = summary?.currency ?? '$'
  const total = order?.total ?? summary?.total ?? 0
  const orderId = order?.id ? `#${String(order.id).slice(0, 8).toUpperCase()}` : 'Pending'
  const status = order?.status ?? 'pending'

  return (
    <main className='order-confirmation'>
      <section className='order-confirmation-card'>
        <div className='order-confirmation-icon'>
          <img src={assets.parcel_icon} alt='' />
        </div>
        <p className='order-confirmation-eyebrow'>Order confirmed</p>
        <h1>Thanks, {delivery?.firstName || 'your order is in'}!</h1>
        <p className='order-confirmation-message'>
          We received your order and the restaurant will start preparing it soon.
          You can track the latest status from your order history.
        </p>

        <div className='order-confirmation-details'>
          <div>
            <span>Order</span>
            <strong>{orderId}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{status}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{currency}{total}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{summary?.paymentMethod ?? 'COD'}</strong>
          </div>
        </div>

        {delivery?.street && (
          <div className='order-confirmation-address'>
            <span>Delivery address</span>
            <p>
              {delivery.street}, {delivery.city}, {delivery.state} {delivery.zipcode}
            </p>
          </div>
        )}

        <div className='order-confirmation-actions'>
          <Link to='/myorders'>Track order</Link>
          <Link to='/'>Back to menu</Link>
        </div>
      </section>
    </main>
  )
}

export default OrderConfirmation
