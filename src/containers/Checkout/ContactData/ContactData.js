import React, { Component } from 'react'

import classes from './ContactData.css'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'

export class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault()
    console.log(this.props.ingredients)
    console.log(this.props.price)
    this.setState({loading: true})
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Violetta Qiao',
        address: {
          street: 'Zhu Qiao',
          zipCode: '201323',
          country: 'China'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(res =>{
        console.log(res)
        this.setState({ loading: false })
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  render() {
    let form = (
      <form>
        <input className={classes.Input} type='text' name='name' placeholder='Your Name' />
        <input className={classes.Input} type='text' name='email' placeholder='Your Email' />
        <input className={classes.Input} type='text' name='street' placeholder='Street' />
        <input className={classes.Input} type='text' name='postal' placeholder='Postal' />
        <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

export default ContactData
