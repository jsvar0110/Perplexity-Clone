import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import VeltrixLoader from './VeltrixLoader.jsx'

const Protected = ({ children }) => {

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const [minTimePassed, setMinTimePassed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 2200)
    return () => clearTimeout(t)
  }, [])

  if (loading || (user && !minTimePassed)) {
    return <VeltrixLoader />
  }

  if (!user) {
    return <Navigate to={'/login'} replace />
  }



  return children



}

export default Protected
