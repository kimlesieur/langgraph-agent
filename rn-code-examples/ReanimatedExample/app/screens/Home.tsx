import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { HomePageProps } from "../navigation/RootStack";
import { Product, data } from "../../assets/fake";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { sharedElementTransition } from "../utils/SharedElementTransition";
import DraggableCircle from "./DraggableCircle";
import TappableCircle from "./TappableCircle";
import DraggableSquare from "./DraggableSquare";

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

const Home = ({ navigation }: HomePageProps) => {
  const width = useSharedValue(100);
  const height = useSharedValue(100);
  const backgroundColor = useSharedValue("red");
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const startAnimation = () => {
    const randomWidth = Math.floor(Math.random() * 300) + 50;
    const randomHeight = Math.floor(Math.random() * 300) + 50;
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    width.value = withSpring(randomWidth);
    height.value = withSpring(randomHeight);
    backgroundColor.value = withDelay(200, withTiming(randomColor));
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      backgroundColor: backgroundColor.value,
    };
  });

  const animatedInputStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  const testFunction = () => {
    console.log("I AM REACT");
  };

  useAnimatedReaction(
    () => {
      console.log("EXECUTED");
      runOnJS(testFunction)();
      return height.value;
    },
    (currentValue, previousValue) => {}
  );

  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    console.log(scrollHandler.value);

    return {
      opacity: scrollHandler.value > 1000 ? withTiming(1) : withTiming(0),
    };
  });

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <>
      <Animated.ScrollView ref={scrollRef}>
        <Button
          title="Go to List"
          onPress={() => navigation.navigate("List")}
        />
        <AnimatedInput
          style={[animatedInputStyles, { height: 50, margin: 10 }]}
        />
        <Animated.View style={animatedStyles} />
        <Button title="Start Animation" onPress={startAnimation} />

        <TappableCircle />
        <DraggableCircle />
        <DraggableSquare  />

        {data.map((product: Product) => (
          <View key={product.id} style={{ padding: 10 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              onPress={() => navigation.navigate("Details", { item: product })}
            >
              <Animated.Image
                sharedTransitionTag={`image-${product.id}`}
                sharedTransitionStyle={sharedElementTransition}
                source={{ uri: product.image }}
                style={{ width: 50, height: 50 }}
                
              />
              <View style={{ flex: 1 }}>
                <Animated.Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {product.title}
                </Animated.Text>
                <Text style={{ fontSize: 18 }}>${product.price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>
      <Animated.View
        style={[buttonStyle, { position: "absolute", bottom: 20, right: 20 }]}
      >
        <TouchableOpacity
          onPress={scrollTop}
          style={{
            backgroundColor: "#c4c9d7",
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default Home;
