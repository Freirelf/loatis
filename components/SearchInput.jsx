import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'


const SearchInput = ({tile, placeholder, value, handleChangeText, otherStyles, ...props}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
        <TextInput
          className="text-base mt-0.5 text-white font-pregular flex-1"  
          placeholder="Pesquise por tópicos"
          placeholderTextColor="#7b7b8b"
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={tile === 'Password' && !showPassword}
          {...props}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image 
            source={icons.search}
            className="w-5 h-5"
            resizeMode='contain'
          />
        </TouchableOpacity>

      </View>
  )
}

export default SearchInput