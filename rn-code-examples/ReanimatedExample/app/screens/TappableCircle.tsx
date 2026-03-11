import { StyleSheet } from "react-native";
import React from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const TappableCircle = () => {
    const pressed = useSharedValue(false);
    
    const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: pressed.value ? "#FFE04B" : "#B58DF1",
        transform: [{ scale: withTiming(pressed.value ? 1.2 : 1) }],
    }));
    return (
        <GestureDetector gesture={tap}>
        <Animated.View style={[styles.circle, animatedStyles]} />
        </GestureDetector>
    );
};

export default TappableCircle;

const styles = StyleSheet.create({
  circle: {
    height: 120,
    width: 120,
    borderRadius: 500,
  },
});
