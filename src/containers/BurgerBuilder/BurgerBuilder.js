import React, { Component } from 'react'
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls' 
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import * as actionTypes from '../../store/actions'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  bacon: 0.7,
  meat: 1.3
}

class BurgerBuilder extends Component {
  state = {
    // purchasable: false,
    purchasing: false,
    loading: false,
    error: true
  }

  componentDidMount() {
    // console.log(this.props)
    // axios.get('/ingredients.json')
    //   .then(res => {
    //     console.log(res)
    //     this.setState({ ingredients: res.data });
    //   })
    //   .catch( error => {
    //     this.setState({ error: true });
    //   })
  }

  updatePurchaseState (ingredients) {
    // const ingredients = {
    //   ...this.props.ings
    // }
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    return sum > 0
  }

  addIngredientHandler = (type) => {
    const oldCount = this.props.ings[type]
    const updatedCount = oldCount + 1
    const updateIngredicents = {
      ...this.props.ings
    }
    updateIngredicents[type] = updatedCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldPrice = this.props.totalPrice
    const newPrice = oldPrice + priceAddition
    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredicents
    })
    this.updatePurchaseState(updateIngredicents)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.props.ings[type]
    if (oldCount <= 0) {
      return
    }
    const updatedCount = oldCount - 1
    const updateIngredicents = {
      ...this.props.ings
    }
    updateIngredicents[type] = updatedCount
    const priceDeduction = INGREDIENT_PRICES[type]
    const oldPrice = this.props.totalPrice
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
    //   ingredients: this.props.ings,
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
    // const queryParams = []
    // for (let i in this.props.ings) {
      // queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]))
    // }
    // queryParams.push('price=' + this.props.totalPrice)
    // const queryString = queryParams.join('&')
    this.props.history.push({
      pathname: '/checkout',
      // search: '?' + queryString
    })
  }

  render () {
    const disableInfo = {
      ...this.props.ings
    }
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    // { meat: false, cheese: true ... }

    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
    if (this.props.ings) {
      orderSummary = <OrderSummary 
        ingredients={this.props.ings}
        price={this.props.totalPrice}
        purchaseCancel={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}/>
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
            <BuildControls 
              ingredientAdd={this.props.onIngredientAdded}
              ingredientRemove={this.props.onIngredientRemoved}
              disabled={disableInfo}
              price={this.props.totalPrice}
              purchasable={this.updatePurchaseState(this.props.ings)}
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({
      type: actionTypes.ADD_INGREDIENT,
      ingredientName: ingName
    }),
    onIngredientRemoved: (ingName) => dispatch({
      type: actionTypes.REMOVE_INGREDIENT,
      ingredientName: ingName
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))
 