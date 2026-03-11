import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '' }} />
    </Stack>
  );
};

export default Layout;
