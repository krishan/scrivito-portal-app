import { load, ContentTag, provideComponent } from 'scrivito'
import { Product } from '../../Objs/Product/ProductObjClass'
import { Homepage } from './HomepageObjClass'

import { CartItem } from '../../Data/CartItem/CartItem'

provideComponent(Homepage, ({ page }) => {
  // @ts-expect-error until out of private beta
  const cartItems = CartItem.all().take()

  return (
    <>
      <h3>Your Shopping Cart</h3>
      {cartItems.length === 0 ? (
        <div>No Products in Cart</div>
      ) : (
        <ul>
          {
            // @ts-expect-error until out of private beta
            cartItems.map((item: DataItem) => (
              <li key={item.id()}>
                {Product.get(item.get('productId'))?.get('title')}
                <div
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => item.destroy()}
                >
                  Remove
                </div>
              </li>
            ))
          }
        </ul>
      )}
      <ContentTag tag="div" content={page} attribute="body" />
    </>
  )
})
