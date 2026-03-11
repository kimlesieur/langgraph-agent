import React, { useEffect, useRef } from 'react';
import {
    Animated,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    View,
    ViewProps,
} from 'react-native';

import { Colors } from '@/constants/theme';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccordionItemProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  renderContent: () => React.ReactNode;
  containerStyle?: ViewProps['style'];
  headerStyle?: ViewProps['style'];
  contentStyle?: ViewProps['style'];
  titleStyle?: ViewProps['style'];
  animationDuration?: number;
  disabled?: boolean;
}

const AccordionItem = ({
  title,
  isExpanded,
  onToggle,
  renderContent,
  containerStyle,
  headerStyle,
  contentStyle,
  titleStyle,
  animationDuration = 300,
  disabled = false,
}: AccordionItemProps) => {
  const animatedValue = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const rotationValue = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    // Configure layout animation
    const animationConfig = {
      duration: animationDuration,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    };

    LayoutAnimation.configureNext(animationConfig);

    // Animate rotation and opacity
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: isExpanded ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(rotationValue, {
        toValue: isExpanded ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded, animationDuration, animatedValue, rotationValue]);

  const handlePress = () => {
    if (!disabled) {
      onToggle();
    }
  };

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header */}
      <Pressable
        style={({ pressed }) => [
          styles.header,
          headerStyle,
          disabled && styles.headerDisabled,
          pressed && !disabled && styles.headerPressed,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded, disabled }}
        accessibilityHint={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
      >
        <Text
          style={[styles.title, titleStyle, disabled && styles.titleDisabled]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <Animated.View
          style={[styles.chevron, { transform: [{ rotate: rotation }] }]}
        >
          <Text
            style={[styles.chevronText, disabled && styles.chevronDisabled]}
          >
            ▼
          </Text>
        </Animated.View>
      </Pressable>

      {/* Content */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.content,
            contentStyle,
            {
              opacity: animatedValue,
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  headerPressed: {
    backgroundColor: '#f5f5f5',
  },
  headerDisabled: {
    opacity: 0.5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginRight: 8,
  },
  titleDisabled: {
    color: Colors.light.icon,
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  chevronDisabled: {
    color: '#ccc',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default AccordionItem;
