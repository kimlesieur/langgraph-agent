import { NavigationContainer } from "@react-navigation/native";
import RootStackNavigation from "./app/navigation/RootStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStackNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
