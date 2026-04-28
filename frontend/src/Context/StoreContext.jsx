/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { menu_list, food_images } from '../assets/assets';
export const StoreContext = createContext(null);

const decodeTokenPayload = (value) => {
    try {
        const payload = value?.split('.')[1];
        if (!payload) {
            return null;
        }

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join(''),
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

const StoreContextProvider = ({ children }) => {
    const url = import.meta.env.VITE_API_URL;
    const [food_list, setFoodList] = useState([]);
    const [restaurant_list, setRestaurantList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token') ?? '');
    const [tenantSubdomain, setTenantSubdomainState] = useState(
        localStorage.getItem('tenantSubdomain') ?? import.meta.env.VITE_DEFAULT_TENANT_ID ?? 'pho-houston',
    );
    const currency = '$';
    const deliveryCharge = 2.5;
    const currentUser = useMemo(() => decodeTokenPayload(token), [token]);
    const tenantHeaderValue = (currentUser?.tenantId ?? tenantSubdomain).trim();

    const requestHeaders = useMemo(
        () => ({
            ...(tenantHeaderValue
                ? { 'tenant-id': tenantHeaderValue }
                : {}),
            ...(tenantSubdomain
                ? { 'x-tenant-subdomain': tenantSubdomain.trim().toLowerCase() }
                : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }),
        [tenantHeaderValue, tenantSubdomain, token],
    );

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] ?? 1) - 1, 0) }));
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product.id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
            } catch (error) {
                // ignore invalid cart state
            }
        }
        return totalAmount;
    }

    const fetchRestaurantList = useCallback(async () => {
        const response = await axios.get(`${url}/api/restaurants`, { headers: requestHeaders });
        const restaurants = Array.isArray(response.data) ? response.data : [];
        setRestaurantList(restaurants);
    }, [requestHeaders, url]);

    const getCategoryFromName = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('pho') || lower.includes('soup') || lower.includes('broth')) return 'Pho';
        if (lower.includes('roll') || lower.includes('spring') || lower.includes('egg roll') || lower.includes('dumpling')) return 'Appetizers';
        if (lower.includes('coffee') || lower.includes('tea') || lower.includes('juice') || lower.includes('lemonade') || lower.includes('drink') || lower.includes('bubble')) return 'Beverages';
        if (lower.includes('noodle') || lower.includes('ramen') || lower.includes('udon')) return 'Noodles';
        if (lower.includes('pasta') || lower.includes('spaghetti')) return 'Pasta';
        if (lower.includes('salad')) return 'Salad';
        if (lower.includes('sandwich') || lower.includes('banh mi')) return 'Sandwich';
        return 'All';
    };

    const getDescriptionFromName = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('pho')) return 'Slow-simmered bone broth with rice noodles and fresh garnishes.';
        if (lower.includes('spring roll')) return 'Fresh shrimp, herbs & pork wrapped in soft rice paper with peanut sauce.';
        if (lower.includes('egg roll')) return 'Crispy golden rolls with savory pork and shrimp filling.';
        if (lower.includes('coffee')) return 'Rich Vietnamese drip coffee with sweet condensed milk over ice.';
        if (lower.includes('tea')) return 'Fragrant loose-leaf tea with fresh fruit and lemongrass.';
        return 'Made fresh daily with quality ingredients.';
    };

    const fetchFoodList = useCallback(async () => {
        const response = await axios.get(`${url}/api/menus`, { headers: requestHeaders });
        const menus = Array.isArray(response.data) ? response.data : [];
        setFoodList(
            menus.map((item, index) => ({
                _id: item.id,
                id: item.id,
                name: item.name,
                price: item.price,
                description: getDescriptionFromName(item.name),
                category: getCategoryFromName(item.name),
                image: food_images[index % food_images.length],
                restaurantId: item.restaurantId,
            })),
        );
    }, [requestHeaders, url]);

    const loadCartData = async () => {};

    const setTenantSubdomain = (value) => {
        const normalized = value.trim().toLowerCase();
        setTenantSubdomainState(normalized);
        localStorage.setItem('tenantSubdomain', normalized);
    };

    const demoOwnerEmail = (subdomain) => `owner.${subdomain}@example.com`;
    const demoOwnerPassword = 'demoowner12345';

    const runDemoOnboarding = async (subdomainInput) => {
        const subdomain = subdomainInput.trim().toLowerCase();
        setTenantSubdomain(subdomain);
        try {
            const onboarding = await axios.post(
                `${url}/api/onboarding`,
                {
                    tenant: {
                        name: `Demo ${subdomain}`,
                        subdomain,
                    },
                    owner: {
                        email: demoOwnerEmail(subdomain),
                        password: demoOwnerPassword,
                    },
                    restaurant: {
                        name: `Demo ${subdomain} Main`,
                    },
                    configuration: {
                        currency: 'USD',
                        timezone: 'America/Chicago',
                    },
                },
                { headers: { 'tenant-id': subdomain, 'x-tenant-subdomain': subdomain } },
            );
            const issuedToken = onboarding.data?.token;
            if (issuedToken) {
                setToken(issuedToken);
                localStorage.setItem('token', issuedToken);
            }
            return onboarding.data;
        } catch (error) {
            if (error?.response?.status !== 409) {
                throw error;
            }
            const login = await axios.post(
                `${url}/api/auth/login`,
                {
                    email: demoOwnerEmail(subdomain),
                    password: demoOwnerPassword,
                },
                { headers: { 'tenant-id': subdomain, 'x-tenant-subdomain': subdomain } },
            );
            const issuedToken = login.data?.token;
            if (issuedToken) {
                setToken(issuedToken);
                localStorage.setItem('token', issuedToken);
            }
            return login.data;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchRestaurantList(), fetchFoodList()]);
            } catch {
                setRestaurantList([]);
                setFoodList([]);
            }
        };
        loadData();
    }, [fetchFoodList, fetchRestaurantList]);

    const contextValue = {
        url,
        food_list,
        restaurant_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        currentUser,
        tenantSubdomain,
        setTenantSubdomain,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        authHeaders: requestHeaders,
        runDemoOnboarding,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;

const getTenantId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantFromUrl = urlParams.get('tenant');
    if (tenantFromUrl) return tenantFromUrl;
    
    // Logic cũ cho subdomain...
    return import.meta.env.VITE_DEFAULT_TENANT_ID || "pho-houston";
};
