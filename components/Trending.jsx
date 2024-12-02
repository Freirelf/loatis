import { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { VideoView, useVideoPlayer } from "expo-video";

const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1,
  },
};
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};
const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  const videoSource = item.video;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  const handlePlayPause = () => {
    if (play) {
      player.pause();
      setPlay(false);
    } else {
      player.play();
      setPlay(true);
    }
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <VideoView
          player={player}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          onPlaybackEnd={() => setPlay(false)}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          onPress={handlePlayPause}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
