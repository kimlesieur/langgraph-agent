import { Link } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import FeedListExamples from '@/components/FeedList/examples/FeedListExamples';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FeedListScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">FeedList Component</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore different FeedList configurations and layouts
        </ThemedText>
        <Link href="/" dismissTo style={styles.backLink}>
          <ThemedText type="link">← Back to Home</ThemedText>
        </Link>
      </ThemedView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FeedListExamples />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },
  backLink: {
    marginTop: 12,
  },
  content: {
    flex: 1,
  },
});

