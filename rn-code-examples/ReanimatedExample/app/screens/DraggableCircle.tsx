import { StyleSheet } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const DraggableCircle = () => {
  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? "#FFE04B" : "#B58DF1",
    transform: [
      { translateX: offset.value },
      { scale: withTiming(pressed.value ? 1.2 : 1) },
    ],
  }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.circle, animatedStyles]} />
    </GestureDetector>
  );
};

export default DraggableCircle;

const styles = StyleSheet.create({
  circle: {
    height: 120,
    width: 120,
    borderRadius: 500,
  },
});
