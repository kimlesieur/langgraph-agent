import React, {
    ForwardedRef,
    LegacyRef,
    forwardRef,
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    TextInput,
    View,
    ViewProps,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

// Constraint type - all feed items must have an id
export type FeedListItem = {
  id: string | number;
  [key: string]: any;
};

// Generic props interface
export interface FeedListProps<T extends FeedListItem>
  extends Omit<ViewProps, 'children'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  layout?: 'list' | 'grid';
  orientation?: 'vertical' | 'horizontal';
  numColumns?: number;
  onItemSelect?: (item: T, index: number) => void;
  onMultiSelect?: (selectedItems: T[]) => void;
  multiSelect?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string, filteredData: T[]) => void;
  filterable?: boolean;
  onFilter?: (filter: any) => void;
  pullToRefresh?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  empty?: boolean;
  emptyComponent?: React.ReactElement;
  loadingComponent?: React.ReactElement;
  virtualized?: boolean;
  itemHeight?: number;
  windowSize?: number;
  testID?: string;
  accessibilityLabel?: string;
}

const FeedList = <T extends FeedListItem>(
  {
    data,
    renderItem,
    keyExtractor,
    layout = 'list',
    orientation = 'vertical',
    numColumns,
    onItemSelect,
    onMultiSelect,
    multiSelect = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    onSearch,
    filterable = false,
    onFilter,
    pullToRefresh = false,
    onRefresh,
    refreshing = false,
    loading = false,
    empty = false,
    emptyComponent,
    loadingComponent,
    virtualized = true,
    itemHeight,
    windowSize = 10,
    testID,
    accessibilityLabel,
    style,
    ...props
  }: FeedListProps<T>,
  ref: LegacyRef<View>,
) => {
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = data.filter((item) => {
      // Search through all string properties of the item
      return Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(query)
      );
    });

    // Call onSearch callback if provided
    onSearch?.(searchQuery, filtered);
    
    return filtered;
  }, [data, searchQuery, searchable, onSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle item selection
  const handleItemPress = useCallback((item: T, index: number) => {
    if (multiSelect) {
      const newSelectedItems = new Set(selectedItems);
      if (selectedItems.has(item.id)) {
        newSelectedItems.delete(item.id);
      } else {
        newSelectedItems.add(item.id);
      }
      setSelectedItems(newSelectedItems);
      
      // Convert set to array of items for callback
      const selectedItemsArray = data.filter(dataItem => newSelectedItems.has(dataItem.id));
      onMultiSelect?.(selectedItemsArray);
    }
    
    onItemSelect?.(item, index);
  }, [multiSelect, selectedItems, data, onMultiSelect, onItemSelect]);

  // Enhanced render item with selection handling
  const enhancedRenderItem: ListRenderItem<T> = useCallback(({ item, index }) => {
    const isSelected = selectedItems.has(item.id);
    
    return (
      <View style={[
        multiSelect && styles.selectableItem,
        isSelected && [styles.selectedItem, { borderColor: tintColor }]
      ]}>
        {renderItem({ item, index, separators: {} as any })}
      </View>
    );
  }, [renderItem, selectedItems, multiSelect, tintColor]);

  // Calculate number of columns for grid layout
  const calculatedNumColumns = useMemo(() => {
    if (orientation === 'horizontal') return 1;
    if (layout === 'grid') return numColumns || 2;
    return 1;
  }, [layout, orientation, numColumns]);

  // Show loading state
  if (loading) {
    if (loadingComponent) {
      return (
        <ThemedView ref={ref} style={[styles.container, style]} {...props}>
          {loadingComponent}
        </ThemedView>
      );
    }
    
    return (
      <ThemedView ref={ref} style={[styles.container, styles.centerContent, style]} {...props}>
        <ActivityIndicator size="large" color={tintColor} testID={`${testID}-loading`} />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Show empty state
  if (empty || filteredData.length === 0) {
    if (emptyComponent) {
      return (
        <ThemedView ref={ref} style={[styles.container, style]} {...props}>
          {searchable && (
            <TextInput
              style={[styles.searchInput, { color: textColor, borderColor: tintColor }]}
              placeholder={searchPlaceholder}
              placeholderTextColor={Colors.light.icon}
              value={searchQuery}
              onChangeText={handleSearchChange}
              testID={`${testID}-search`}
            />
          )}
          {emptyComponent}
        </ThemedView>
      );
    }
    
    return (
      <ThemedView ref={ref} style={[styles.container, styles.centerContent, style]} {...props}>
        {searchable && (
          <TextInput
            style={[styles.searchInput, { color: textColor, borderColor: tintColor }]}
            placeholder={searchPlaceholder}
            placeholderTextColor={Colors.light.icon}
            value={searchQuery}
            onChangeText={handleSearchChange}
            testID={`${testID}-search`}
          />
        )}
        <ThemedText style={styles.emptyText}>
          {searchQuery ? 'No results found' : 'No items found'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView ref={ref} style={[styles.container, style]} {...props}>
      {searchable && (
        <TextInput
          style={[styles.searchInput, { color: textColor, borderColor: tintColor }]}
          placeholder={searchPlaceholder}
          placeholderTextColor={Colors.light.icon}
          value={searchQuery}
          onChangeText={handleSearchChange}
          testID={`${testID}-search`}
        />
      )}
      
      <FlatList
        data={filteredData}
        renderItem={enhancedRenderItem}
        keyExtractor={keyExtractor || ((item, index) => `${item.id}-${index}`)}
        horizontal={orientation === 'horizontal'}
        numColumns={calculatedNumColumns}
        key={`${orientation}-${calculatedNumColumns}`} // Force re-render when layout changes
        refreshControl={
          pullToRefresh ? (
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={tintColor}
            />
          ) : undefined
        }
        windowSize={virtualized ? windowSize : undefined}
        getItemLayout={
          itemHeight && orientation === 'vertical'
            ? (data, index) => ({
                length: itemHeight,
                offset: itemHeight * index,
                index,
              })
            : undefined
        }
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={styles.list}
        showsVerticalScrollIndicator={orientation === 'vertical'}
        showsHorizontalScrollIndicator={orientation === 'horizontal'}
        contentContainerStyle={filteredData.length === 0 ? styles.emptyContainer : undefined}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.6,
  },
  selectableItem: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  selectedItem: {
    borderWidth: 2,
    borderRadius: 8,
  },
});

// ForwardRef wrapper with proper generic typing
const FeedListWithRef = forwardRef(FeedList) as <T extends FeedListItem>(
  props: FeedListProps<T> & { ref?: ForwardedRef<View> },
) => ReturnType<typeof FeedList>;

export default FeedListWithRef;


