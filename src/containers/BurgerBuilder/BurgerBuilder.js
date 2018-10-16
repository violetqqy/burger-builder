import React, { Component } from 'react'

import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls' 
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  bacon: 0.7,
  meat: 1.3
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    console.log(this.props)
    axios.get('/ingredients.json')
      .then(res => {
        console.log(res)
        this.setState({ ingredients: res.data });
      })
      .catch( error => {
        this.setState({ error: true });
      })
  }

  updatePurchaseState (ingredients) {
    // const ingredients = {
    //   ...this.state.ingredients
    // }
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updateIngredicents = {
      ...this.state.ingredients
    }
    updateIngredicents[type] = updatedCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice + priceAddition
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredicents
    })
    this.updatePurchaseState(updateIngredicents)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount <= 0) {
      return
    }
    const updatedCount = oldCount - 1
    const updateIngredicents = {
      ...this.state.ingredients
    }
    updateIngredicents[type] = updatedCount
    const priceDeduction = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice - priceDeduction
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredicents
    })
    this.updatePurchaseState(updateIngredicents)
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    // alert('You Continue!')
    // this.setState({loading: true})
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Violetta Qiao',
    //     address: {
    //       street: 'Zhu Qiao',
    //       zipCode: '201323',
    //       country: 'China'
    //     },
    //     email: 'test@test.com'
    //   },
    //   deliveryMethod: 'fastest'
    // }
    // axios.post('/orders.json', order)
    //   .then(res =>{
    //     console.log(res)
    //     this.setState({loading: false, purchasing: false})
    //   })
    //   .catch(error => {
    //     this.setState({loading: false, purchasing: false})
    //     console.log(error)
    //   })
    const queryParams = []
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice)
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    })
  }

  render () {
    const disableInfo = {
      ...this.state.ingredients
    }
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    // { meat: false, cheese: true ... }

    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
    if (this.state.ingredients) {
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancel={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}/>
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
            <BuildControls 
              ingredientAdd={this.addIngredientHandler}
              ingredientRemove={this.removeIngredientHandler}
              disabled={disableInfo}
              price={this.state.totalPrice}
              purchasable={this.state.purchasable}
              ordered={this.purchaseHandler}
            />
        </Aux>
      )
    }
    if (this.state.loading) {
      orderSummary = <Spinner />
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)
 