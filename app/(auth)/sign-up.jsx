import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from "../../components/CustomButton";
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })


  const submit = async () => {
    if(!form.username || !form.email || !form.password) {
      Alert.alert('Todos os campos são obrigatórios')
    }

    setIsSubmitting(true)

    try {
      const result = await createUser(form.email, form.password, form.username)

      setUser(result)
      setIsLoggedIn(true)

      router.replace('/home')

      // return result
    } catch (error) {
      Alert.alert('Erro ao cadastrar usuário', error.message)
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
          Cadastre-se no Loatis
        </Text>

        <FormField 
          title="Username"
          placeholder="Digite seu nome"
          value={form.username}
          handleChangeText={(value) => setForm({ ...form, username: value })}
          otherStyles="mt-10"
        />

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
          title="Cadastrar"
          handlePress={submit}
          isLoading={isSubmitting}
        />

        <View className="flex-row justify-center pt-5 gap-2">
          <Text className="text-gray-100 font-pregular text-lg">
            Já possui uma conta? 
          </Text>
          <Link href="/sign-in" className="text-secondary font-psemibold text-lg">
              Entrar
          </Link>
        </View>
      </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp