import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Accordion from '@/components/Accordion';
import { Colors } from '@/constants/theme';

// Example 1: Simple FAQ Accordion
type FAQItem = {
  id: string;
  title: string;
  answer: string;
  category: string;
};

const faqData: FAQItem[] = [
  {
    id: '1',
    title: 'What is this app about?',
    answer:
      'This is a content management application that allows users to view articles, contributions, quizzes, and surveys.',
    category: 'General',
  },
  {
    id: '2',
    title: 'How do I contribute content?',
    answer:
      'You can contribute content by navigating to the contribution section and filling out the required forms.',
    category: 'Contribution',
  },
  {
    id: '3',
    title: 'Are quizzes timed?',
    answer:
      'Some quizzes have time limits while others allow unlimited time. Check the quiz description for details.',
    category: 'Quiz',
  },
];

// Example 2: Product Categories Accordion
type ProductCategory = {
  id: string;
  title: string;
  items: Product[];
  description: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

// Sample product data
const productCategories: ProductCategory[] = [
  {
    id: '1',
    title: 'Electronics',
    description: 'Latest tech gadgets and accessories',
    items: [
      {
        id: 'e1',
        name: 'Wireless Headphones',
        price: 199.99,
        description: 'Premium noise-canceling headphones',
      },
      {
        id: 'e2',
        name: 'Smart Watch',
        price: 299.99,
        description: 'Fitness tracking and notifications',
      },
    ],
  },
  {
    id: '2',
    title: 'Books',
    description: 'Fiction and non-fiction books',
    items: [
      {
        id: 'b1',
        name: 'React Native Guide',
        price: 29.99,
        description: 'Complete guide to React Native development',
      },
    ],
  },
];

// Example usage component
const AccordionExamples = () => {
  const faqRef = useRef<View>(null);
  const contentRef = useRef<View>(null);

  // Example 1: Simple FAQ Accordion
  const renderFAQContent = (item: FAQItem) => (
    <View style={styles.faqContent}>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
    </View>
  );

  // Example 2: Product Category Accordion
  const renderProductCategory = (category: ProductCategory) => (
    <View style={styles.contentCategory}>
      <Text style={styles.categoryDescription}>{category.description}</Text>
      <View style={styles.contentList}>
        {category.items.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Example 3: Configuration Items Accordion
  type ConfigItem = {
    id: number;
    title: string;
    enabled: boolean;
    description: string;
    options?: string[];
  };

  const configData: ConfigItem[] = [
    {
      id: 1,
      title: 'Push Notifications',
      enabled: true,
      description: 'Receive notifications for new content and updates',
      options: ['All notifications', 'Important only', 'Disabled'],
    },
    {
      id: 2,
      title: 'Theme Settings',
      enabled: true,
      description: 'Customize the app appearance',
      options: ['Light', 'Dark', 'Auto'],
    },
  ];

  const renderConfigContent = (item: ConfigItem) => (
    <View style={styles.configContent}>
      <Text style={styles.configDescription}>{item.description}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status: </Text>
        <Text
          style={[
            styles.statusValue,
            item.enabled ? styles.enabled : styles.disabled,
          ]}
        >
          {item.enabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
      {item.options && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>Options:</Text>
          {item.options.map((option, index) => (
            <Text key={index} style={styles.optionItem}>
              • {option}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Example 1: FAQ Accordion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQ Accordion</Text>
        <Text style={styles.sectionDescription}>
          Simple FAQ accordion with allowMultiple=false
        </Text>

        <Accordion<FAQItem>
          ref={faqRef}
          data={faqData}
          renderContent={renderFAQContent}
          allowMultiple={false}
          initialExpandedItems={['1']}
          onItemToggle={(itemId, isExpanded) => {
            console.log(
              `FAQ ${itemId} ${isExpanded ? 'expanded' : 'collapsed'}`,
            );
          }}
          accordionItemProps={{
            animationDuration: 250,
          }}
          style={styles.accordion}
        />
      </View>

      {/* Example 2: Product Categories Accordion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Categories</Text>
        <Text style={styles.sectionDescription}>
          Product categories with nested items (allowMultiple=true)
        </Text>

        <Accordion<ProductCategory>
          data={productCategories}
          renderContent={renderProductCategory}
          allowMultiple={true}
          initialExpandedItems={['1']}
          accordionItemProps={{
            animationDuration: 300,
            containerStyle: { marginBottom: 8 },
          }}
          style={styles.accordion}
        />
      </View>

      {/* Example 3: Configuration Accordion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings Accordion</Text>
        <Text style={styles.sectionDescription}>
          Configuration accordion with allowMultiple=true
        </Text>

        <Accordion<ConfigItem>
          ref={contentRef}
          data={configData}
          renderContent={renderConfigContent}
          allowMultiple={true}
          initialExpandedItems={[1, 2]}
          accordionItemProps={{
            animationDuration: 300,
            containerStyle: { marginBottom: 8 },
          }}
          style={styles.accordion}
        />
      </View>

      {/* Usage Guidelines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Guidelines</Text>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>✅ Generic Type Safety:</Text>
          <Text style={styles.guidelineText}>
            {`<Accordion<YourType> data={items} renderContent={fn} />`}
          </Text>

          <Text style={styles.guidelineTitle}>✅ Required Constraints:</Text>
          <Text style={styles.guidelineText}>
            All data items must have `id: string | number` and `title: string`
          </Text>

          <Text style={styles.guidelineTitle}>✅ Flexible Rendering:</Text>
          <Text style={styles.guidelineText}>
            renderContent function receives the full typed item for custom
            rendering
          </Text>

          <Text style={styles.guidelineTitle}>✅ Animation Control:</Text>
          <Text style={styles.guidelineText}>
            Configure animation duration and behavior via accordionItemProps
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  accordion: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // FAQ Content Styles
  faqContent: {
    paddingTop: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.icon,
    fontWeight: '500',
  },

  // Content Category Styles
  contentCategory: {
    paddingTop: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 16,
  },
  contentList: {
    gap: 8,
  },
  productItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: Colors.light.icon,
    lineHeight: 18,
  },

  // Config Content Styles
  configContent: {
    paddingTop: 8,
  },
  configDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  enabled: {
    color: '#28a745',
  },
  disabled: {
    color: '#dc3545',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  optionItem: {
    fontSize: 13,
    color: Colors.light.icon,
    marginBottom: 2,
    paddingLeft: 8,
  },

  // Guidelines Styles
  guidelineContainer: {
    gap: 16,
  },
  guidelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  guidelineText: {
    fontSize: 13,
    color: Colors.light.icon,
    marginLeft: 16,
    fontFamily: 'monospace',
  },
});

export default AccordionExamples;
