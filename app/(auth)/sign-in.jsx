import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from "../../components/CustomButton";
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })


  const submit = async () => {
    if(!form.email || !form.password) {
      Alert.alert('Todos os campos são obrigatórios')
    }

    setIsSubmitting(true)

    try {
      await signIn(form.email, form.password)

      const result = await getCurrentUser()

      setUser(result)
      setIsLoggedIn(true)

      router.replace('/home')
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message)
    } finally {
      setIsSubmitting(false)
    }
 
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
          title="Email"
          placeholder="Digite seu email"
          value={form.email}
          handleChangeText={(value) => setForm({ ...form, email: value })}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField 
          title="Password"
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