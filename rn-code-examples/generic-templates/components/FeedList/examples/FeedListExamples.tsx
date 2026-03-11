import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import FeedList from '@/components/FeedList';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

// Sample data types
interface PostItem {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

// Sample data
const samplePosts: PostItem[] = [
  {
    id: '1',
    title: 'Getting Started with React Native',
    content: 'React Native is a fantastic framework for building mobile apps...',
    author: 'John Doe',
    timestamp: '2 hours ago',
    likes: 45,
    comments: 12,
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    content: 'Exploring advanced patterns in TypeScript for better type safety...',
    author: 'Jane Smith',
    timestamp: '4 hours ago',
    likes: 78,
    comments: 23,
  },
  {
    id: '3',
    title: 'Building Scalable Apps',
    content: 'How to architect your React Native apps for scalability...',
    author: 'Mike Johnson',
    timestamp: '1 day ago',
    likes: 156,
    comments: 45,
  },
];

const sampleProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://via.placeholder.com/100x100',
    category: 'Electronics',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Coffee Maker',
    price: 89.99,
    image: 'https://via.placeholder.com/100x100',
    category: 'Appliances',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 129.99,
    image: 'https://via.placeholder.com/100x100',
    category: 'Sports',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Book - React Mastery',
    price: 29.99,
    image: 'https://via.placeholder.com/100x100',
    category: 'Books',
    rating: 4.7,
  },
];

export default function FeedListExamples() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<PostItem[]>([]);
  
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handlePostSelect = (post: PostItem, index: number) => {
    console.log('Post selected:', post.title);
  };

  const handleMultiSelect = (posts: PostItem[]) => {
    setSelectedPosts(posts);
    console.log('Selected posts:', posts.length);
  };

  const handleProductSelect = (product: ProductItem, index: number) => {
    console.log('Product selected:', product.name);
  };

  // Render function for post items
  const renderPostItem = ({ item }: { item: PostItem }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.postHeader}>
        <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
        <ThemedText style={[styles.postTimestamp, { color: iconColor }]}>
          {item.timestamp}
        </ThemedText>
      </View>
      <ThemedText style={[styles.postAuthor, { color: iconColor }]}>
        by {item.author}
      </ThemedText>
      <ThemedText style={styles.postContent} numberOfLines={2}>
        {item.content}
      </ThemedText>
      <View style={styles.postFooter}>
        <ThemedText style={[styles.postStats, { color: iconColor }]}>
          ❤️ {item.likes} • 💬 {item.comments}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  // Render function for product items (grid layout)
  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.productCategory, { color: iconColor }]}>
          {item.category}
        </ThemedText>
        <View style={styles.productFooter}>
          <ThemedText style={[styles.productPrice, { color: tintColor }]}>
            ${item.price}
          </ThemedText>
          <ThemedText style={[styles.productRating, { color: iconColor }]}>
            ⭐ {item.rating}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Basic Post List</ThemedText>
      <FeedList
        data={samplePosts}
        renderItem={renderPostItem}
        searchable
        searchPlaceholder="Search posts..."
        pullToRefresh
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onItemSelect={handlePostSelect}
        testID="basic-post-list"
        style={styles.listContainer}
      />

      <ThemedText style={styles.sectionTitle}>Multi-Select Post List</ThemedText>
      <FeedList
        data={samplePosts}
        renderItem={renderPostItem}
        multiSelect
        onMultiSelect={handleMultiSelect}
        searchable
        testID="multi-select-post-list"
        style={styles.listContainer}
      />
      {selectedPosts.length > 0 && (
        <ThemedText style={[styles.selectionInfo, { color: tintColor }]}>
          Selected: {selectedPosts.length} posts
        </ThemedText>
      )}

      <ThemedText style={styles.sectionTitle}>Product Grid</ThemedText>
      <FeedList
        data={sampleProducts}
        renderItem={renderProductItem}
        layout="grid"
        numColumns={2}
        searchable
        searchPlaceholder="Search products..."
        onItemSelect={handleProductSelect}
        testID="product-grid"
        style={styles.listContainer}
      />

      <ThemedText style={styles.sectionTitle}>Horizontal Product List</ThemedText>
      <FeedList
        data={sampleProducts}
        renderItem={renderProductItem}
        orientation="horizontal"
        onItemSelect={handleProductSelect}
        testID="horizontal-product-list"
        style={styles.horizontalListContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  listContainer: {
    height: 200,
    marginBottom: 16,
  },
  horizontalListContainer: {
    height: 150,
    marginBottom: 16,
  },
  selectionInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  // Post item styles
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  postTimestamp: {
    fontSize: 12,
  },
  postAuthor: {
    fontSize: 14,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postStats: {
    fontSize: 12,
  },
  
  // Product item styles
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productRating: {
    fontSize: 12,
  },
});


