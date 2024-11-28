import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        // key={item => item.$id}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-7">
            <View className="justify-between flex-row items-start mb-6">
              <View > 
                <Text className="font-pmedium text-sm text-gray-100">
                  Bem-vindo de volta
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Lucas Freire
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Últimos Videos
              </Text>

              <Trending posts={[{ id: 1}, { id: 2}, { id: 3}] ?? []}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="Nenhum vídeo encontrado"
            subtitle="Tente pesquisar por outro termo"
          />
        )}

        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}  
          />
        }
      />
    </SafeAreaView>
  )
}

export default Home