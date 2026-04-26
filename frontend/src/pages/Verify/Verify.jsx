import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import './Verify.css'

const Verify = () => {
  const { token } = useContext(StoreContext)

  const navigate = useNavigate();

  useEffect(() => {
    navigate(token ? '/myorders' : '/');
  }, [navigate, token])

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
