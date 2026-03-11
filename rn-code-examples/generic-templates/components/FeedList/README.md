# FeedList Component

A highly configurable and performant React Native list component designed for displaying feeds, products, or any collection of data. Built with TypeScript and supports both list and grid layouts.

## Features

- **Multiple Layouts**: Support for list and grid layouts with customizable columns
- **Search Functionality**: Built-in search with customizable placeholder and callback
- **Multi-Selection**: Optional multi-selection mode with visual feedback
- **Pull-to-Refresh**: Integrated refresh control with customizable behavior
- **Virtualization**: Optimized for large datasets with configurable window size
- **Loading States**: Built-in loading and empty state handling
- **Theming**: Integrates with the app's theme system for consistent styling
- **Accessibility**: Full accessibility support with customizable labels
- **Horizontal Scrolling**: Support for horizontal orientation
- **TypeScript**: Fully typed with generic support for type-safe data handling

## Basic Usage

```tsx
import FeedList from '@/components/FeedList';

interface MyItem {
  id: string;
  title: string;
  description: string;
}

const data: MyItem[] = [
  { id: '1', title: 'Item 1', description: 'Description 1' },
  { id: '2', title: 'Item 2', description: 'Description 2' },
];

const renderItem = ({ item }: { item: MyItem }) => (
  <View style={{ padding: 16 }}>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </View>
);

export default function MyScreen() {
  return (
    <FeedList
      data={data}
      renderItem={renderItem}
      searchable
      pullToRefresh
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data items to display |
| `renderItem` | `ListRenderItem<T>` | Function to render each item |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyExtractor` | `(item: T, index: number) => string` | `item.id-index` | Function to extract unique keys |
| `layout` | `'list' \| 'grid'` | `'list'` | Layout type |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Scroll orientation |
| `numColumns` | `number` | `2` (for grid) | Number of columns in grid layout |
| `searchable` | `boolean` | `false` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `multiSelect` | `boolean` | `false` | Enable multi-selection mode |
| `pullToRefresh` | `boolean` | `false` | Enable pull-to-refresh |
| `refreshing` | `boolean` | `false` | Refresh state indicator |
| `loading` | `boolean` | `false` | Loading state indicator |
| `empty` | `boolean` | `false` | Empty state indicator |
| `virtualized` | `boolean` | `true` | Enable virtualization for performance |
| `windowSize` | `number` | `10` | Virtualization window size |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onItemSelect` | `(item: T, index: number) => void` | Called when an item is selected |
| `onMultiSelect` | `(selectedItems: T[]) => void` | Called when selection changes in multi-select mode |
| `onSearch` | `(query: string, filteredData: T[]) => void` | Called when search query changes |
| `onRefresh` | `() => void` | Called when pull-to-refresh is triggered |

### Custom Component Props

| Prop | Type | Description |
|------|------|-------------|
| `emptyComponent` | `React.ReactElement` | Custom component for empty state |
| `loadingComponent` | `React.ReactElement` | Custom component for loading state |

## Examples

### Grid Layout with Search

```tsx
<FeedList
  data={products}
  renderItem={renderProduct}
  layout="grid"
  numColumns={2}
  searchable
  searchPlaceholder="Search products..."
  onItemSelect={(product) => console.log('Selected:', product.name)}
/>
```

### Multi-Selection Mode

```tsx
<FeedList
  data={posts}
  renderItem={renderPost}
  multiSelect
  onMultiSelect={(selectedPosts) => {
    console.log(`${selectedPosts.length} posts selected`);
  }}
/>
```

### Horizontal Scrolling

```tsx
<FeedList
  data={categories}
  renderItem={renderCategory}
  orientation="horizontal"
  style={{ height: 120 }}
/>
```

### Custom Empty State

```tsx
const EmptyState = () => (
  <View style={{ padding: 40, alignItems: 'center' }}>
    <Text style={{ fontSize: 18, opacity: 0.6 }}>No items found</Text>
    <Button title="Refresh" onPress={handleRefresh} />
  </View>
);

<FeedList
  data={data}
  renderItem={renderItem}
  empty={data.length === 0}
  emptyComponent={<EmptyState />}
/>
```

### Pull-to-Refresh

```tsx
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await fetchNewData();
  setRefreshing(false);
};

<FeedList
  data={data}
  renderItem={renderItem}
  pullToRefresh
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>
```

## Performance Tips

1. **Use keyExtractor**: Provide a unique key extractor for optimal rendering performance
2. **Virtualization**: Keep virtualization enabled for large datasets
3. **Item Height**: Provide `itemHeight` for better scroll performance when possible
4. **Memoization**: Use `React.memo` for your `renderItem` component when dealing with complex items
5. **Window Size**: Adjust `windowSize` based on your item complexity and device performance

## Accessibility

The component includes built-in accessibility features:
- Proper accessibility roles and labels
- Search input accessibility
- Screen reader support
- Customizable `accessibilityLabel` prop

## TypeScript Support

The component is fully typed with generic support:

```tsx
interface MyCustomItem {
  id: string;
  customField: string;
}

// TypeScript will infer the correct types
<FeedList<MyCustomItem>
  data={myCustomData}
  renderItem={({ item }) => {
    // item is properly typed as MyCustomItem
    return <Text>{item.customField}</Text>;
  }}
/>
```


