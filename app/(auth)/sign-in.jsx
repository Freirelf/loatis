import { View, Text, ScrollView, Image } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from "../../components/CustomButton";
import { Link } from 'expo-router'


const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {

  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <View className="w-full justify-center min-h-[83vh] px-4 my-6">
        <Image 
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />

        <Text className="text-2xl text-white font-semibold mt-10 font-psemibold">
          Entrar no Loatis
        </Text>

        <FormField 
          tile="Email"
          placeholder="Digite seu email"
          value={form.email}
          handleChangeText={(value) => setForm({ ...form, email: value })}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField 
          tile="Password"
          placeholder="Digite sua senha"
          value={form.password}
          handleChangeText={(value) => setForm({ ...form, password: value })}
          otherStyles="mt-7"
        />

        <CustomButton 
          containerStyles="mt-7"
          title="Entrar"
          handlePress={submit}
          isLoading={isSubmitting}
        />

        <View className="flex-row justify-center pt-5 gap-2">
          <Text className="text-gray-100 font-pregular text-lg">
            Não possui uma conta? 
          </Text>
          <Link href="/sign-up" className="text-secondary font-psemibold text-lg">
              Cadastre-se
          </Link>
        </View>
      </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn