import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './OwnerDashboard.css'
import { StoreContext } from '../../Context/StoreContext'

const statusOptions = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']

const OwnerDashboard = () => {
  const {
    url,
    token,
    currency,
    authHeaders,
    currentUser,
    restaurant_list,
    tenantSubdomain,
  } = useContext(StoreContext)
  const [summary, setSummary] = useState(null)
  const [statusBreakdown, setStatusBreakdown] = useState([])
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState('')

  const restaurantMap = useMemo(() => {
    return restaurant_list.reduce((acc, restaurant) => {
      acc[restaurant.id] = restaurant.name
      return acc
    }, {})
  }, [restaurant_list])

  const isOwner = currentUser?.role === 'owner'

  const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleString()
  }

  const fetchDashboard = useCallback(async () => {
    if (!token || !isOwner) {
      return
    }

    setLoading(true)
    try {
      const orderParams = {
        limit: 50,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      }
      const [summaryResponse, statusResponse, ordersResponse] = await Promise.all([
        axios.get(`${url}/api/admin/dashboard/summary`, { headers: authHeaders }),
        axios.get(`${url}/api/admin/dashboard/orders/status`, { headers: authHeaders }),
        axios.get(`${url}/api/orders`, { headers: authHeaders, params: orderParams }),
      ])

      setSummary(summaryResponse.data)
      setStatusBreakdown(Array.isArray(statusResponse.data) ? statusResponse.data : [])
      setOrders(Array.isArray(ordersResponse.data?.data) ? ordersResponse.data.data : [])
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Unable to load owner dashboard'
      toast.error(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setLoading(false)
    }
  }, [authHeaders, isOwner, statusFilter, token, url])

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId)
    try {
      await axios.patch(
        `${url}/api/orders/${orderId}/status`,
        { status },
        { headers: authHeaders },
      )
      toast.success('Order status updated')
      await fetchDashboard()
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Unable to update order status'
      toast.error(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setUpdatingOrderId('')
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (!token) {
    return (
      <main className='owner-dashboard owner-dashboard-empty'>
        <h1>Owner dashboard</h1>
        <p>Sign in as a restaurant owner to manage orders.</p>
      </main>
    )
  }

  if (!isOwner) {
    return (
      <main className='owner-dashboard owner-dashboard-empty'>
        <h1>Owner dashboard</h1>
        <p>This area is available to owner accounts only.</p>
      </main>
    )
  }

  return (
    <main className='owner-dashboard'>
      <section className='owner-dashboard-header'>
        <div>
          <p className='owner-dashboard-eyebrow'>Tenant: {tenantSubdomain}</p>
          <h1>Order management</h1>
          <p>Monitor revenue, review incoming orders, and update fulfilment status.</p>
        </div>
        <button onClick={fetchDashboard} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </section>

      <section className='owner-dashboard-summary'>
        <div>
          <span>{summary?.orders ?? 0}</span>
          <p>Total orders</p>
        </div>
        <div>
          <span>{summary?.pendingOrders ?? 0}</span>
          <p>Pending orders</p>
        </div>
        <div>
          <span>{summary?.menus ?? 0}</span>
          <p>Menu items</p>
        </div>
        <div>
          <span>{currency}{summary?.totalRevenue ?? 0}</span>
          <p>Total revenue</p>
        </div>
      </section>

      <section className='owner-dashboard-toolbar'>
        <div className='owner-status-tabs'>
          <button
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              className={statusFilter === status ? 'active' : ''}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className='owner-status-counts'>
          {statusBreakdown.map((item) => (
            <span key={item.status}>{item.status}: {item.count}</span>
          ))}
        </div>
      </section>

      <section className='owner-orders-card'>
        <div className='owner-orders-head'>
          <p>Order</p>
          <p>Restaurant</p>
          <p>Total</p>
          <p>Created</p>
          <p>Status</p>
          <p>Manage</p>
        </div>

        {orders.length === 0 && (
          <div className='owner-orders-empty'>
            {loading ? 'Loading orders...' : 'No orders match this filter.'}
          </div>
        )}

        {orders.map((order) => (
          <div className='owner-orders-row' key={order.id}>
            <p>#{String(order.id).slice(0, 8).toUpperCase()}</p>
            <p>{restaurantMap[order.restaurantId] || order.restaurantId}</p>
            <p>{currency}{order.total}</p>
            <p>{formatDateTime(order.createdAt)}</p>
            <p><span className={`owner-status-badge ${order.status}`}>{order.status}</span></p>
            <select
              value={order.status}
              disabled={updatingOrderId === order.id}
              onChange={(event) => updateOrderStatus(order.id, event.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        ))}
      </section>
    </main>
  )
}

export default OwnerDashboard
