import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';
import { createCollection } from '@radix-ui/react-collection';
import { useId } from '@radix-ui/react-id';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import { FocusScope } from '@radix-ui/react-focus-scope';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Combobox
 * -----------------------------------------------------------------------------------------------*/

const COMBOBOX_NAME = 'Combobox';

type ItemData = { id: string; focusable: boolean; selected: boolean; textValue: string };
const [Collection, useCollection, createCollectionScope] = createCollection<
  HTMLDivElement,
  ItemData
>(COMBOBOX_NAME);
type ScopedProps<P> = P & { __scopeCombobox?: Scope };
const [createComboboxContext, createComboboxScope] = createContextScope(COMBOBOX_NAME, [
  createPopperScope,
  createCollectionScope,
]);
const usePopperScope = createPopperScope();

type ComboboxContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  value: string;
  onValueChange(value: string): void;
  currentTabStopId: string | null;
  onCurrentTabStopIdChange(tabStopId: string | null): void;
  hasCustomAnchor: boolean;
  onCustomAnchorAdd(): void;
  onCustomAnchorRemove(): void;
  hasTrigger: boolean;
  onTriggerAdd(): void;
  onTriggerRemove(): void;
};

const [ComboboxProvider, useComboboxContext] =
  createComboboxContext<ComboboxContextValue>(COMBOBOX_NAME);

interface ComboboxProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  value?: string;
  defaultValue?: string;
  onValueChange?(value: string): void;
}

const Combobox: React.FC<ComboboxProps> = (props: ScopedProps<ComboboxProps>) => {
  const {
    __scopeCombobox,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
  } = props;
  const popperScope = usePopperScope(__scopeCombobox);
  const [currentTabStopId, setCurrentTabStopId] = React.useState<string | null>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
  const [hasTrigger, setHasTrigger] = React.useState(false);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [value = '', setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <PopperPrimitive.Root {...popperScope}>
      <Collection.Provider scope={__scopeCombobox}>
        <ComboboxProvider
          scope={__scopeCombobox}
          open={open}
          onOpenChange={setOpen}
          value={value}
          onValueChange={setValue}
          currentTabStopId={currentTabStopId}
          onCurrentTabStopIdChange={setCurrentTabStopId}
          hasCustomAnchor={hasCustomAnchor}
          onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
          onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
          hasTrigger={hasTrigger}
          onTriggerAdd={React.useCallback(() => setHasTrigger(true), [])}
          onTriggerRemove={React.useCallback(() => setHasTrigger(false), [])}
        >
          {children}
        </ComboboxProvider>
      </Collection.Provider>
    </PopperPrimitive.Root>
  );
};

Combobox.displayName = COMBOBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'ComboboxInput';

type ComboboxInputElement = React.ElementRef<typeof Primitive.input>;
type PrimitiveInputProps = Radix.ComponentPropsWithoutRef<typeof Primitive.input>;
interface ComboboxInputProps extends PrimitiveInputProps {}

const ComboboxInput = React.forwardRef<ComboboxInputElement, ComboboxInputProps>(
  (props: ScopedProps<ComboboxInputProps>, forwardedRef) => {
    const { __scopeCombobox, ...inputProps } = props;
    const context = useComboboxContext(INPUT_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const getItems = useCollection(__scopeCombobox);

    const handleNextItem = (event: React.KeyboardEvent) => {
      const intent = getIntent(event);
      if (intent !== undefined) {
        event.preventDefault();
        const items = getItems().filter((item) => item.focusable);
        let candidateNodes = items.map((item) => ({
          id: item.id,
          selected: item.selected,
        }));

        if (intent === 'last') candidateNodes.reverse();
        else if (intent === 'prev' || intent === 'next') {
          if (intent === 'prev') candidateNodes.reverse();
          const currentIndex = candidateNodes.findIndex((item) => item.selected);
          candidateNodes = candidateNodes.slice(currentIndex + 1);
        }
        if (candidateNodes.length === 0) return;
        const [firstCandidate] = candidateNodes;
        context.onCurrentTabStopIdChange(firstCandidate.id);
      }
    };

    const [PopperAnchor, popperAnchorProps] =
      context.hasCustomAnchor || context.hasTrigger
        ? [React.Fragment, {}]
        : [PopperPrimitive.Anchor, { asChild: true, ...popperScope }];

    return (
      <PopperAnchor {...popperAnchorProps}>
        <Primitive.input
          {...inputProps}
          ref={forwardedRef}
          value={context.value}
          onChange={composeEventHandlers(props.onChange, (event) => {
            const value = event.currentTarget.value;
            if (value === '') context.onCurrentTabStopIdChange(null);
            // if (context.currentTabStopId === null) context.onOpenChange(value !== '');
            context.onValueChange(value);
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (event.key === 'ArrowDown' && !context.open) {
              context.onOpenChange(true);
              queueMicrotask(() => handleNextItem(event));
              return;
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              const selectedItem = getItems().find((item) => item.selected);
              if (!selectedItem) return;
              context.onValueChange(selectedItem.textValue);
              context.onOpenChange(false);
              return;
            }
            handleNextItem(event);
          })}
        />
      </PopperAnchor>
    );
  }
);

ComboboxInput.displayName = INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ComboboxContent';

type ComboboxContentElement = ComboboxContentImplElement;
interface ComboboxContentProps extends ComboboxContentImplProps {}

const ComboboxContent = React.forwardRef<ComboboxContentElement, ComboboxContentProps>(
  (props: ScopedProps<ComboboxContentProps>, forwardedRef) => {
    const context = useComboboxContext(CONTENT_NAME, props.__scopeCombobox);
    return (
      <Presence present={context.open}>
        <ComboboxContentImpl {...props} ref={forwardedRef} />
      </Presence>
    );
  }
);

ComboboxContent.displayName = CONTENT_NAME;

type ComboboxContentImplElement = React.ElementRef<typeof Primitive.div>;
type PopperContentProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface ComboboxContentImplProps extends PopperContentProps {}

const ComboboxContentImpl = React.forwardRef<ComboboxContentImplElement, ComboboxContentImplProps>(
  (props: ScopedProps<ComboboxContentImplProps>, forwardedRef) => {
    const { __scopeCombobox, ...contentProps } = props;
    const popperScope = usePopperScope(__scopeCombobox);
    const context = useComboboxContext(CONTENT_NAME, __scopeCombobox);

    return (
      <FocusScope
        asChild
        trapped
        onMountAutoFocus={(event) => {
          if (!context.hasTrigger) event.preventDefault();
        }}
      >
        <PopperPrimitive.Content
          {...popperScope}
          {...contentProps}
          ref={forwardedRef}
          style={{
            ...contentProps.style,
            ...{
              '--radix-combobox-content-transform-origin': 'var(--radix-popper-transform-origin)',
              '--radix-combobox-content-available-width': 'var(--radix-popper-available-width)',
              '--radix-combobox-content-available-height': 'var(--radix-popper-available-height)',
              '--radix-combobox-anchor-width': 'var(--radix-popper-anchor-width)',
              '--radix-combobox-anchor-height': 'var(--radix-popper-anchor-height)',
            },
          }}
        />
      </FocusScope>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ComboboxList
 * -----------------------------------------------------------------------------------------------*/

const LIST_NAME = 'ComboboxList';

type ComboboxListElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ComboboxListProps extends PrimitiveDivProps {}

const ComboboxList = React.forwardRef<ComboboxListElement, ComboboxListProps>(
  (props: ScopedProps<ComboboxListProps>, forwardedRef) => {
    const { __scopeCombobox, ...listProps } = props;
    return (
      <Collection.Slot scope={__scopeCombobox}>
        <Primitive.div {...listProps} ref={forwardedRef} />
      </Collection.Slot>
    );
  }
);

ComboboxList.displayName = LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ComboboxItem';

type ComboboxItemElement = React.ElementRef<typeof Primitive.div>;
interface ComboboxItemProps extends PrimitiveDivProps {
  disabled?: boolean;
  value?: string;
}
const ComboboxItem = React.forwardRef<ComboboxItemElement, ComboboxItemProps>(
  (props: ScopedProps<ComboboxItemProps>, forwardedRef) => {
    const { __scopeCombobox, disabled, value, ...itemProps } = props;
    const id = useId();
    const context = useComboboxContext(ITEM_NAME, __scopeCombobox);
    const ref = React.useRef<ComboboxItemElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const selected = context.currentTabStopId === id;

    const textValue = value ?? ref.current?.textContent ?? '';

    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(textValue);
        context.onOpenChange(false);
      }
    };

    const filtered = React.useMemo(() => {
      return textValue.includes(context.value);
    }, [context.value]);

    return filtered ? (
      <Collection.ItemSlot
        scope={props.__scopeCombobox}
        id={id}
        focusable={!disabled}
        selected={selected}
        textValue={textValue}
      >
        <Primitive.div
          id={id}
          data-highlighted={selected}
          {...itemProps}
          ref={composedRefs}
          onPointerUp={composeEventHandlers(props.onPointerUp, handleSelect)}
          onPointerMove={composeEventHandlers(props.onPointerMove, () =>
            context.onCurrentTabStopIdChange(id)
          )}
          style={{ backgroundColor: selected ? 'blue' : undefined }}
        />
      </Collection.ItemSlot>
    ) : null;
  }
);

ComboboxItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxTrigger
 * -----------------------------------------------------------------------------------------------*/

const OPEN_NAME = 'ComboboxOpen';

type ComboboxOpenElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ComboboxOpenProps extends PrimitiveButtonProps {}

const ComboboxOpen = React.forwardRef<ComboboxOpenElement, ComboboxOpenProps>(
  (props: ScopedProps<ComboboxOpenProps>, forwardedRef) => {
    const { __scopeCombobox, ...openProps } = props;
    const context = useComboboxContext(OPEN_NAME, __scopeCombobox);
    const getItems = useCollection(__scopeCombobox);

    const handleNextItem = (event: React.KeyboardEvent) => {
      const intent = getIntent(event);
      if (intent !== undefined) {
        event.preventDefault();
        const items = getItems().filter((item) => item.focusable);
        let candidateNodes = items.map((item) => ({
          id: item.id,
          selected: item.selected,
        }));

        if (intent === 'last') candidateNodes.reverse();
        else if (intent === 'prev' || intent === 'next') {
          if (intent === 'prev') candidateNodes.reverse();
          const currentIndex = candidateNodes.findIndex((item) => item.selected);
          candidateNodes = candidateNodes.slice(currentIndex + 1);
        }
        if (candidateNodes.length === 0) return;
        const [firstCandidate] = candidateNodes;
        context.onCurrentTabStopIdChange(firstCandidate.id);
      }
    };

    return (
      <Primitive.button
        {...openProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(true))}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          if (props.disabled) return;
          event.currentTarget.click();
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, handleNextItem)}
      />
    );
  }
);

ComboboxOpen.displayName = OPEN_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'ComboboxAnchor';

type ComboboxAnchorElement = React.ElementRef<typeof PopperPrimitive.Anchor>;
type PopperAnchorProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>;
interface ComboboxAnchorProps extends PopperAnchorProps {}

const ComboboxAnchor = React.forwardRef<ComboboxAnchorElement, ComboboxAnchorProps>(
  (props: ScopedProps<ComboboxAnchorProps>, forwardedRef) => {
    const { __scopeCombobox, ...anchorProps } = props;
    const context = useComboboxContext(ANCHOR_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

    React.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);

    return <PopperPrimitive.Anchor {...popperScope} {...anchorProps} ref={forwardedRef} />;
  }
);

ComboboxAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ComboboxTrigger';

type ComboboxTriggerElement = React.ElementRef<typeof Primitive.button>;
interface ComboboxTriggerProps extends PrimitiveButtonProps {}

const ComboboxTrigger = React.forwardRef<ComboboxTriggerElement, ComboboxTriggerProps>(
  (props: ScopedProps<ComboboxTriggerProps>, forwardedRef) => {
    const { __scopeCombobox, ...triggerProps } = props;
    const context = useComboboxContext(ANCHOR_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const { onTriggerAdd, onTriggerRemove } = context;

    React.useEffect(() => {
      onTriggerAdd();
      return () => onTriggerRemove();
    }, [onTriggerAdd, onTriggerRemove]);

    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.button
          {...triggerProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(props.onClick, () => {
            context.onOpenChange(true);
          })}
          onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
            event.currentTarget.click();
          })}
        />
      </PopperPrimitive.Anchor>
    );
  }
);

ComboboxTrigger.displayName = TRIGGER_NAME;

type Intent = 'first' | 'last' | 'prev' | 'next';
// prettier-ignore
const MAP_KEY_TO_FOCUS_INTENT: Record<string, Intent> = {
  ArrowLeft: 'prev', ArrowUp: 'prev',
  ArrowRight: 'next', ArrowDown: 'next',
  PageUp: 'first', Home: 'first',
  PageDown: 'last', End: 'last',
};

type Direction = 'ltr' | 'rtl';

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key;
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key;
}

function getIntent(event: React.KeyboardEvent) {
  const key = getDirectionAwareKey(event.key, 'ltr');
  if (['ArrowLeft', 'ArrowRight'].includes(key)) return undefined;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}

const Root = Combobox;
const Input = ComboboxInput;
const Content = ComboboxContent;
const List = ComboboxList;
const Item = ComboboxItem;
const Trigger = ComboboxTrigger;
const Anchor = ComboboxAnchor;
const Open = ComboboxOpen;

export {
  createComboboxScope,
  //
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxAnchor,
  ComboboxOpen,
  //
  Root,
  Input,
  Content,
  List,
  Item,
  Trigger,
  Anchor,
  Open,
};
