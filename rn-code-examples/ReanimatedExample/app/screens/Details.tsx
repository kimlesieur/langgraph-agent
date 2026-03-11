import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { DetailsPageProps } from '../navigation/RootStack';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  LightSpeedInLeft,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { sharedElementTransition } from '../utils/SharedElementTransition';
import withSpring from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Details = ({ route, navigation }: DetailsPageProps) => {
  const { item } = route.params;
  const [isOpen, setIsOpen] = useState(false);
  const offset = useSharedValue(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: item.title,
      headerRight: () => (
        <Pressable onPress={onToggle}>
          <Text style={{ marginRight: 16 }}>Open</Text>
        </Pressable>
      ),
    });
  });

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        sharedTransitionTag={`image-${item.id}`}
        sharedTransitionStyle={sharedElementTransition}
        source={{ uri: item.image }}
        style={{ width: '100%', height: 300 }}
      />
      <Animated.Text
        entering={LightSpeedInLeft.delay(400).springify()}
        exiting={FadeInLeft.delay(400).springify()}
        style={{ fontWeight: 'bold', fontSize: 18, padding: 16 }}>
        {item.title}
      </Animated.Text>
      <Animated.Text
        entering={FadeInLeft.duration(300).delay(600)}
        style={{ fontSize: 18, padding: 16 }}>
        {item.description}
      </Animated.Text>

      {isOpen && (
        <>
          <AnimatedPressable
            onPress={onToggle}
            style={styles.backdrop}
            entering={FadeIn}
            exiting={FadeOut}
          />
          <Animated.View
            style={[styles.sheet, translateY]}
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown.duration(700)}>
            <Text>I am the bottom sheet</Text>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sheet: {
    backgroundColor: 'white',
    zIndex: 1,
    padding: 16,
    height: 300,
    width: '100%',
    position: 'absolute',
    bottom: -50 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

export default Details;
