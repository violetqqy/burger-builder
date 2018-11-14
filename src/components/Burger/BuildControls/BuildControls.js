import React from 'react'

import classes from  './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
  { labal: 'Salad', type: 'salad'},
  { labal: 'Bacon', type: 'bacon'},
  { labal: 'Cheese', type: 'cheese'},
  { labal: 'Meat', type: 'meat'},
]

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>Current Price: <strong>${props.price.toFixed(2)}</strong></p>
    {controls.map(ctrl => (
      <BuildControl
        key={ctrl.labal}
        label={ctrl.labal}
        type={ctrl.type}
        added={() => props.ingredientAdd(ctrl.type)}
        removed={() => props.ingredientRemove(ctrl.type)}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button 
      className={classes.OrderButton} 
      disabled={!props.purchasable}
      onClick={props.ordered}
    >ORDER NOW</button>
  </div>
)

export default buildControls
