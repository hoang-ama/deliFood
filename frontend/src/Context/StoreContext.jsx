/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { menu_list, food_images, food_list as fallbackFoodList } from '../assets/assets';
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
        localStorage.getItem('tenantSubdomain') ?? '',
    );
    const currency = '$';
    const deliveryCharge = 2.5;
    const currentUser = useMemo(() => decodeTokenPayload(token), [token]);
    const normalizedTenantSubdomain = tenantSubdomain.trim().toLowerCase();
    const tenantHeaderValue = (currentUser?.tenantId ?? normalizedTenantSubdomain).trim();

    const requestHeaders = useMemo(
        () => ({
            ...(tenantHeaderValue
                ? { 'tenant-id': tenantHeaderValue }
                : {}),
            ...(normalizedTenantSubdomain
                ? { 'x-tenant-subdomain': normalizedTenantSubdomain }
                : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }),
        [normalizedTenantSubdomain, tenantHeaderValue, token],
    );

    const publicRequestHeaders = useMemo(
        () => ({
            ...(normalizedTenantSubdomain
                ? { 'x-tenant-subdomain': normalizedTenantSubdomain }
                : {}),
        }),
        [normalizedTenantSubdomain],
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
        if (!normalizedTenantSubdomain) {
            setRestaurantList([]);
            return;
        }

        try {
            const response = await axios.get(`${url}/api/restaurants`, { headers: publicRequestHeaders });
            const restaurants = Array.isArray(response.data) ? response.data : [];
            setRestaurantList(restaurants);
        } catch (error) {
            console.error('Error fetching restaurant list:', error);
            setRestaurantList([]);
        }
    }, [normalizedTenantSubdomain, publicRequestHeaders, url]);

    const getCategoryFromName = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('pho') || lower.includes('soup') || lower.includes('broth')) return 'Pho';
        if (lower.includes('roll') || lower.includes('spring') || lower.includes('egg roll')) return 'Rolls';
        if (lower.includes('appetizer') || lower.includes('starter') || lower.includes('dumpling')) return 'Appetizers';
        if (lower.includes('coffee') || lower.includes('tea') || lower.includes('juice') || lower.includes('lemonade') || lower.includes('drink') || lower.includes('bubble')) return 'Beverages';
        if (lower.includes('noodle') || lower.includes('ramen') || lower.includes('udon')) return 'Noodles';
        if (lower.includes('pasta') || lower.includes('spaghetti')) return 'Pasta';
        if (lower.includes('salad')) return 'Salad';
        if (lower.includes('sandwich') || lower.includes('banh mi')) return 'Sandwich';
        return 'All';
    };

    const normalizeFallbackFoods = () =>
        fallbackFoodList.map((item, index) => ({
            ...item,
            id: item.id ?? item._id ?? `${index}`,
            _id: item._id ?? item.id ?? `${index}`,
            category: item.category ?? getCategoryFromName(item.name ?? ''),
            description: item.description ?? getDescriptionFromName(item.name ?? ''),
            image: item.image ?? food_images[index % food_images.length],
            price: Number(item.price ?? 0),
        }));

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
        if (!normalizedTenantSubdomain) {
            setFoodList(normalizeFallbackFoods());
            return;
        }

        try {
            const response = await axios.get(`${url}/api/menus`, { headers: publicRequestHeaders });
            const payload = Array.isArray(response.data) ? response.data : [];

            const allFoods = payload.some((entry) => Array.isArray(entry?.items))
                ? payload.flatMap((group, groupIndex) => {
                    const categoryName = getCategoryFromName(group?.name ?? '');
                    return (group?.items ?? []).map((item, itemIndex) => ({
                        id: item.id ?? item._id ?? `${groupIndex}-${itemIndex}`,
                        _id: item._id ?? item.id ?? `${groupIndex}-${itemIndex}`,
                        name: item.name ?? 'Unnamed item',
                        price: Number(item.price ?? 0),
                        image: item.image ?? item.imageUrl ?? food_images[(groupIndex + itemIndex) % food_images.length],
                        description: item.description ?? getDescriptionFromName(item.name ?? ''),
                        category: getCategoryFromName(item.category ?? categoryName),
                    }));
                })
                : payload.map((item, index) => ({
                    id: item.id ?? item._id ?? `${index}`,
                    _id: item._id ?? item.id ?? `${index}`,
                    name: item.name ?? 'Unnamed item',
                    price: Number(item.price ?? 0),
                    image: item.image ?? item.imageUrl ?? food_images[index % food_images.length],
                    description: item.description ?? getDescriptionFromName(item.name ?? ''),
                    category: getCategoryFromName(item.category ?? item.name ?? ''),
                }));

            setFoodList(allFoods);
        } catch (error) {
            console.error('Error fetching food list:', error);
            setFoodList([]);
        }
    }, [normalizedTenantSubdomain, publicRequestHeaders, url]);
    const loadCartData = async () => {};

    const setTenantSubdomain = useCallback((value = '') => {
        const normalized = value.trim().toLowerCase();
        setTenantSubdomainState(normalized);
        if (normalized) {
            localStorage.setItem('tenantSubdomain', normalized);
            return;
        }

        localStorage.removeItem('tenantSubdomain');
    }, []);

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
