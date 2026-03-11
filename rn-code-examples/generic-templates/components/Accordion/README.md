# Generic Accordion Component

A reusable, type-safe Accordion component built with TypeScript generics, similar to the FeedList pattern used in this project.

## Features

✅ **Generic Type Safety** - Works with any data type that has `id` and `title`  
✅ **Flexible Rendering** - Custom render function for any content type  
✅ **Smooth Animations** - Built-in expand/collapse animations  
✅ **Accessibility** - Full accessibility support with ARIA attributes  
✅ **Multiple Modes** - Single or multiple items can be expanded  
✅ **ForwardRef Support** - Ref forwarding for imperative access

## Basic Usage

```tsx
import Accordion from '@/ui/components/Accordion';

type FAQItem = {
  id: string;
  title: string;
  answer: string;
};

const faqData: FAQItem[] = [
  { id: '1', title: 'What is this?', answer: 'This is an accordion.' },
  { id: '2', title: 'How does it work?', answer: 'It expands and collapses.' },
];

<Accordion<FAQItem>
  data={faqData}
  renderContent={item => <Text>{item.answer}</Text>}
  allowMultiple={false}
  initialExpandedItems={['1']}
/>;
```

## Advanced Usage

```tsx
// With existing Content types
<Accordion<Content>
  data={contentItems}
  renderContent={item => {
    if (isType(item, 'article')) {
      return <FeedListArticle {...item} />;
    }
    // ... handle other types
  }}
  allowMultiple={true}
  accordionItemProps={{
    animationDuration: 300,
    containerStyle: { marginBottom: 8 },
  }}
  onItemToggle={(id, isExpanded) => {
    console.log(`Item ${id} ${isExpanded ? 'expanded' : 'collapsed'}`);
  }}
/>
```

## Props

### AccordionProps<T>

| Prop                   | Type                           | Default      | Description                         |
| ---------------------- | ------------------------------ | ------------ | ----------------------------------- |
| `data`                 | `T[]`                          | **required** | Array of items to display           |
| `renderContent`        | `(item: T) => React.ReactNode` | **required** | Function to render item content     |
| `allowMultiple`        | `boolean`                      | `false`      | Allow multiple items to be expanded |
| `initialExpandedItems` | `(string \| number)[]`         | `[]`         | Initially expanded item IDs         |
| `onItemToggle`         | `(id, isExpanded) => void`     | `undefined`  | Callback when item is toggled       |
| `accordionItemProps`   | `Partial<AccordionItemProps>`  | `undefined`  | Props for individual items          |

### AccordionItemProps

| Prop                | Type        | Default     | Description              |
| ------------------- | ----------- | ----------- | ------------------------ |
| `containerStyle`    | `ViewStyle` | `undefined` | Style for item container |
| `headerStyle`       | `ViewStyle` | `undefined` | Style for header area    |
| `contentStyle`      | `ViewStyle` | `undefined` | Style for content area   |
| `animationDuration` | `number`    | `300`       | Animation duration in ms |
| `disabled`          | `boolean`   | `false`     | Disable item interaction |

## Type Constraints

Your data type `T` must extend `AccordionItemData`:

```typescript
type AccordionItemData = {
  id: string | number;
  title: string;
};
```

This ensures all items have a unique identifier and display title.

## Examples

See `AccordionExamples.tsx` for comprehensive usage examples including:

- FAQ Accordion (single selection)
- Settings Accordion (multiple selection)
- Content Categories with existing Content types
- Custom styling and animations

## Comparison with FeedList

| Feature         | FeedList                        | Accordion                       |
| --------------- | ------------------------------- | ------------------------------- |
| **Purpose**     | Display scrollable content feed | Collapsible content sections    |
| **Generics**    | `<T extends CustomObject>`      | `<T extends AccordionItemData>` |
| **Rendering**   | Internal type checking          | External render function        |
| **Interaction** | Scroll, pull-to-refresh         | Expand/collapse                 |
| **Pagination**  | Built-in infinite scroll        | N/A                             |

Both components follow the same TypeScript generic patterns for maximum reusability and type safety.
