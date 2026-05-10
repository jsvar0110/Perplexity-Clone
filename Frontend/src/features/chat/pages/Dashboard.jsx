import React from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {

    const {user} = useSelector(state => state.auth)

    console.log(user)

  return (
    <div>
      DashBoard
    </div>
  )
}

export default Dashboard
