import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ containerStyles, handlePress, title, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
      onPress={handlePress}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton