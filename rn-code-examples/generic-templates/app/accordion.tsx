import { StyleSheet } from 'react-native';

import AccordionExamples from '@/components/Accordion/examples/AccordionExamples';
import { ThemedView } from '@/components/themed-view';

export default function AccordionScreen() {
  return (
    <ThemedView style={styles.container}>
      <AccordionExamples />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
