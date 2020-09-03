import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import CartItem from '../../models/cart-items';
import { ADD_ORDER } from '../actions/order';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;

            let updatedOrNweCartItem;

            if (state.items[addedProduct.id]) {
                // alreadt have the item in the cart
                updatedOrNweCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                );
            } else {
                updatedOrNweCartItem = new CartItem(1, productPrice, productTitle, productPrice);
            }

            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNweCartItem },
                totalAmount: state.totalAmount + productPrice
            };

        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                //need to reduce it, not erase it
                updatedCartItems = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );

                updatedCartItems = { ...state.items, [action.pid]: updatedCartItems };

            } else {
                //erase
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.pid];
            }
            const totalAmount = state.totalAmount - selectedCartItem.productPrice;
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: totalAmount
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if ( !state.items[action.pid]) {
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
        default:
            return state;
    }
}