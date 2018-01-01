

const style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': { color: '#aab7c4' }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}


export default (pk) => {
  const stripe = Stripe(pk)
  const elements = stripe.elements()
  const card = elements.create('card', { style })

  card.mount('#card-element')
  card.addEventListener('change', ({error}) => errorHandler(error))

  return { stripe, card }
}



export const errorHandler = err => err
  ? $('#card-error').html(err.message).show()
  : $('#card-error').html('').hide()



