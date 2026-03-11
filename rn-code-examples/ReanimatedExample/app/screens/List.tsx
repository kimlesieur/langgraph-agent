import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Animated, { FadeIn, Layout, SlideOutLeft } from 'react-native-reanimated';

const List = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://randomuser.me/api?results=4')
      .then((response) => response.json())
      .then((json) => {
        const emails = json.results.map((item: any) => item.email);
        setItems([...emails]);
      });
  }, []);

  const addItem = () => {
    fetch('https://randomuser.me/api')
      .then((response) => response.json())
      .then((json) => {
        setItems([...items, json.results[0].email]);
      });
  };

  const onDelete = useCallback((email: string) => {
    setItems((currentItems) => {
      return currentItems.filter((item) => item !== email);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {items.map((item, index) => (
          <Animated.View
            key={item}
            style={styles.item}
            onTouchEnd={() => onDelete(item)}
            layout={Layout.delay(50)}
            entering={FadeIn.delay(50 * index)}
            exiting={SlideOutLeft}>
            <Text style={{ color: 'white' }}>{item}</Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={{ position: 'absolute', top: 20, right: 20 }}>
        <TouchableOpacity
          onPress={addItem}
          style={{
            backgroundColor: '#c4c9d7',
            borderRadius: 20,
            padding: 10,
          }}>
          <Text style={{ fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 60,
    backgroundColor: '#3155c1',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default List;
