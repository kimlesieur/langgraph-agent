import React, {
    ForwardedRef,
    LegacyRef,
    forwardRef,
    useCallback,
    useState,
} from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import AccordionItem from '@/components/Accordion/AccordionItem';

// Constraint type - all accordion items must have an id and title
type AccordionItemData = {
  id: string | number;
  title: string;
};

// Generic props interface
export interface AccordionProps<T extends AccordionItemData>
  extends Omit<ViewProps, 'children'> {
  data: T[];
  renderContent: (item: T) => React.ReactNode;
  allowMultiple?: boolean;
  initialExpandedItems?: (string | number)[];
  onItemToggle?: (itemId: string | number, isExpanded: boolean) => void;
  accordionItemProps?: Partial<AccordionItemProps>;
}

export interface AccordionItemProps {
  containerStyle?: ViewProps['style'];
  headerStyle?: ViewProps['style'];
  contentStyle?: ViewProps['style'];
  animationDuration?: number;
  disabled?: boolean;
}

const Accordion = <T extends AccordionItemData>(
  {
    data,
    renderContent,
    allowMultiple = false,
    initialExpandedItems = [],
    onItemToggle,
    accordionItemProps,
    style,
    ...props
  }: AccordionProps<T>,
  ref: LegacyRef<View>,
) => {
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(
    new Set(initialExpandedItems),
  );

  const handleToggle = useCallback(
    (itemId: string | number) => {
      const isCurrentlyExpanded = expandedItems.has(itemId);
      let newExpandedItems: Set<string | number>;

      if (allowMultiple) {
        // Multiple items can be expanded
        newExpandedItems = new Set(expandedItems);
        if (isCurrentlyExpanded) {
          newExpandedItems.delete(itemId);
        } else {
          newExpandedItems.add(itemId);
        }
      } else {
        // Only one item can be expanded at a time
        if (isCurrentlyExpanded) {
          newExpandedItems = new Set();
        } else {
          newExpandedItems = new Set([itemId]);
        }
      }

      setExpandedItems(newExpandedItems);

      // Callback for external state management
      onItemToggle?.(itemId, !isCurrentlyExpanded);
    },
    [expandedItems, allowMultiple, onItemToggle],
  );

  const renderAccordionItem = useCallback(
    (item: T) => {
      const isExpanded = expandedItems.has(item.id);

      return (
        <AccordionItem
          key={item.id}
          title={item.title}
          isExpanded={isExpanded}
          onToggle={() => handleToggle(item.id)}
          renderContent={() => renderContent(item)}
          {...accordionItemProps}
        />
      );
    },
    [expandedItems, handleToggle, renderContent, accordionItemProps],
  );

  return (
    <View ref={ref} style={[styles.container, style]} {...props}>
      {data.map(renderAccordionItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

// ForwardRef wrapper with proper generic typing
const AccordionWithRef = forwardRef(Accordion) as <T extends AccordionItemData>(
  props: AccordionProps<T> & { ref?: ForwardedRef<View> },
) => ReturnType<typeof Accordion>;

export default AccordionWithRef;
