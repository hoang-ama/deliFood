import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    const {
        setToken,
        url,
        loadCartData,
        authHeaders,
        tenantSubdomain,
        setTenantSubdomain,
        runDemoOnboarding,
    } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const [demoSubdomain, setDemoSubdomain] = useState(tenantSubdomain || 'default')

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        try {
            const endpoint =
                currState === 'Login' ? '/api/auth/login' : '/api/auth/register';
            const payload =
                currState === 'Login'
                    ? { email: data.email, password: data.password }
                    : { email: data.email, password: data.password, role: 'customer' };

            const response = await axios.post(`${url}${endpoint}`, payload, {
                headers: authHeaders,
            });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            await loadCartData();
            setShowLogin(false);
            toast.success(currState === 'Login' ? 'Logged in' : 'Account created');
        } catch (error) {
            const message =
                error?.response?.data?.message ??
                'Authentication failed. Please try again.';
            toast.error(Array.isArray(message) ? message.join(', ') : message);
        }
    }

    const applyTenantContext = () => {
        if (!demoSubdomain.trim()) {
            toast.error('Please enter a tenant subdomain');
            return;
        }
        setTenantSubdomain(demoSubdomain);
        toast.success(`Tenant switched to "${demoSubdomain.trim().toLowerCase()}"`);
    };

    const handleDemoOnboarding = async () => {
        try {
            await runDemoOnboarding(demoSubdomain);
            await loadCartData();
            setShowLogin(false);
            toast.success(`Demo tenant "${demoSubdomain}" ready`);
        } catch (error) {
            const message =
                error?.response?.data?.message ?? 'Unable to bootstrap demo tenant';
            toast.error(Array.isArray(message) ? message.join(', ') : message);
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className='login-popup-demo'>
                    <p>Local demo helpers</p>
                    <input
                        type="text"
                        placeholder="tenant subdomain (e.g. phohouston)"
                        value={demoSubdomain}
                        onChange={(e) => setDemoSubdomain(e.target.value)}
                    />
                    <div className='login-popup-demo-actions'>
                        <button type='button' onClick={applyTenantContext}>Use Tenant</button>
                        <button type='button' onClick={handleDemoOnboarding}>Demo Onboard + Login</button>
                    </div>
                </div>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
