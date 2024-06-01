"use client"
import React from "react"

type InitialValuesProps = {
  currentStep: number,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const initialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined
}

const authContext = React.createContext(initialValues)

const {Provider} = authContext

export const AuthContextProvider = ({children}:{children: React.ReactNode}) => {
  const [currentStep, setCurrentStep] = React.useState(initialValues.currentStep)
  
  const values = {
    currentStep, setCurrentStep
  }

  return <Provider value={values}>{children}</Provider>
}

export const useAuthContext = () => {
  const state = React.useContext(authContext)
  return state
}