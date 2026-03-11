import React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SIZE = 120;

export default function DraggableSquare() {
  const offset = useSharedValue<number>(0);
  const width = useSharedValue<number>(0);

  //? This function is called when the layout of the view changes = to be sure the square stays visible on relase
  const onLayout = (event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeX;
    })
    .onFinalize((event) => {
      offset.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: true,
        clamp: [-(width.value / 2) + SIZE / 2, width.value / 2 - SIZE / 2],
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View onLayout={onLayout} style={styles.wrapper}>
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, animatedStyles]} />
    </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: SIZE,
    width: SIZE,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    cursor: "grab",
    alignItems: "center",
    justifyContent: "center",
  },
});
