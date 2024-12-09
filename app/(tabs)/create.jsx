import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { icons } from '../../constants'
import { VideoView } from 'expo-video'
import { ResizeMode } from 'expo-av'
import CustomButton from '../../components/CustomButton'

import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {
  const { user } = useGlobalContext()
  const [ uploading, setUploading ] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/png', 'image/jpeg', 'image/jpg'] : ['video/mp4', 'video/gif', 'video/mov'],
    })

    if(!result.canceled) {
      if(selectType === 'image') {
        setForm({...form, thumbnail: result.assets[0]})
      }

      if(selectType === 'video') {
        setForm({...form, video: result.assets[0]})
      }
    } 
  }
  const submit = async () => {
    if(!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert('Todos os campos são obrigatórios')
    }

    setUploading(true)

    try {
      await createVideo({
        ...form,
        userId: user.$id
      })

      Alert.alert('Success', 'Vídeo carregado com sucesso')
      
    } catch (error) {
      Alert.alert('Erro ao carregar vídeo', error.message)
      router.push('/home')
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      })

      setUploading(false)
    }
  } 


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl font-psemibold text-white">
          Carregar Vídeo
        </Text>

        <FormField 
          title="Título do vídeo"
          value={form.title}
          placeholder="Insira um título para o seu vídeo"
          handleChangeText={(e)=> setForm({...form, title: e})}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base font-pmedium text-gray-100">
            Carregar vídeo
          </Text>

          <TouchableOpacity 
            onPress={() => openPicker('video')}
          >
            {form.video ? (
              <VideoView 
                player={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.CONTAIN}
              />
            ): (
              <View className="w-full h-40 px-4 bg-black-100 justify-center items-center rounded-2xl">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image 
                    source={icons.upload}
                    resizeMode='contain'
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2 ">
          <Text className="text-base font-pmedium text-gray-100">
            Imagem em miniatura
          </Text>
          
          <TouchableOpacity 
            onPress={() => openPicker('image')}
          >
            {form.thumbnail ? (
              <Image 
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ): (
              <View className="w-full h-16 px-4 bg-black-100 justify-center items-center rounded-2xl border-2 border-black-200 flex-row space-x-2">
                <Image 
                  source={icons.upload}
                  resizeMode='contain'
                  className="w-5 h-5"
                />
                <Text className="text-sm font-pmedium text-gray-100">
                  Adicionar imagem
                </Text>
              </View>
            )}
          </TouchableOpacity>

        </View>

        <FormField 
          title="IA Prompt"
          value={form.title}
          placeholder="O prompt que você usou para criar este vídeo"
          handleChangeText={(e)=> setForm({...form, prompt: e})}
          otherStyles="mt-7"
        />

        <CustomButton 
          title="Enviar & Compartilhar"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create