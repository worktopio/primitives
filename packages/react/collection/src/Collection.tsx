import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Slot } from '@radix-ui/react-slot';

import type * as Radix from '@radix-ui/react-primitive';

type SlotProps = Radix.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps, Radix.PrimitivePrivateProps {}

// We have resorted to returning slots directly rather than exposing primitives that can then
// be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
// This is because we encountered issues with generic types that cannot be statically analysed
// due to creating them dynamically via createCollection.

function createCollection<ItemElement extends HTMLElement, ItemData>() {
  /* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/
  const ROOT_NAME = 'CollectionProvider';

  type CollectionElement = HTMLElement;

  type ContextValue = {
    collectionRef: React.RefObject<CollectionElement>;
    itemMap: Map<React.RefObject<ItemElement>, { ref: React.RefObject<ItemElement> } & ItemData>;
  };

  const [CollectionProviderImpl, useCollectionContext] = createContext<ContextValue>({
    collectionRef: { current: null },
    itemMap: new Map(),
  });

  const CollectionProvider: React.FC<
    Pick<Radix.ComponentPropsWithoutRef<typeof CollectionProviderImpl>, 'scope'>
  > = (props) => {
    const { scope = ROOT_NAME, children } = props;
    const ref = React.useRef<CollectionElement>(null);
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;
    return (
      <CollectionProviderImpl scope={scope} itemMap={itemMap} collectionRef={ref}>
        {children}
      </CollectionProviderImpl>
    );
  };

  CollectionProvider.displayName = ROOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionSlot
   * ---------------------------------------------------------------------------------------------*/
  const SLOT_NAME = 'CollectionSlot';

  const CollectionSlot = React.forwardRef<CollectionElement, CollectionProps>(
    (props, forwardedRef) => {
      const { __scope = ROOT_NAME, __part = SLOT_NAME, children } = props;
      const context = useCollectionContext(__scope, __part);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return <Slot ref={composedRefs}>{children}</Slot>;
    }
  );

  CollectionSlot.displayName = SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = 'CollectionItemSlot';
  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  type CollectionItemSlotProps = ItemData &
    Radix.PrimitivePrivateProps & {
      children: React.ReactNode;
    };

  const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const { __scope = ROOT_NAME, __part = ITEM_SLOT_NAME, children, ...itemData } = props;
      const ref = React.useRef<ItemElement>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(__scope, __part);

      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...(itemData as unknown as ItemData) });
        return () => void context.itemMap.delete(ref);
      });

      return (
        <Slot {...{ [ITEM_DATA_ATTR]: '' }} ref={composedRefs}>
          {children}
        </Slot>
      );
    }
  );

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/

  function useCollection(scope: string, part: string) {
    const context = useCollectionContext(scope, part);
    return {
      getItems() {
        const collection = context.collectionRef.current;
        if (!collection) return [];
        const orderedNodes = Array.from(collection.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
        const items = Array.from(context.itemMap.values());
        const orderedItems = items.sort(
          (a, b) => orderedNodes.indexOf(a.ref.current!) - orderedNodes.indexOf(b.ref.current!)
        );
        return orderedItems;
      },
    };
  }

  return [CollectionProvider, CollectionSlot, CollectionItemSlot, useCollection] as const;
}

export { createCollection };
export type { CollectionProps };
