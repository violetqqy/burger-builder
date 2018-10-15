import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://violetqqy-s-burger.firebaseio.com/'
})

export default instance
