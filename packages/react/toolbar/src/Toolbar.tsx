import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'Toolbar';

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type ToolbarContextValue = { orientation: RovingFocusGroupProps['orientation'] };
const [ToolbarProvider, useToolbarContext] = createContext<ToolbarContextValue>();

type ToolbarElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToolbarProps extends PrimitiveDivProps {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Toolbar = React.forwardRef<ToolbarElement, ToolbarProps>((props, forwardedRef) => {
  const {
    __scope = ROOT_NAME,
    __part = ROOT_NAME,
    orientation = 'horizontal',
    dir = 'ltr',
    loop = true,
    ...toolbarProps
  } = props;
  return (
    <ToolbarProvider scope={__scope} orientation={orientation}>
      <RovingFocusGroup
        asChild
        __scope={__scope}
        __part={__part}
        orientation={orientation}
        dir={dir}
        loop={loop}
      >
        <Primitive.div role="toolbar" dir={dir} {...toolbarProps} ref={forwardedRef} />
      </RovingFocusGroup>
    </ToolbarProvider>
  );
});

Toolbar.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorElement = React.ElementRef<typeof SeparatorPrimitive.Root>;
type SeparatorProps = Radix.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
interface ToolbarSeparatorProps extends SeparatorProps {}

const ToolbarSeparator = React.forwardRef<ToolbarSeparatorElement, ToolbarSeparatorProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = SEPARATOR_NAME, ...separatorProps } = props;
    const context = useToolbarContext(__scope, __part);
    return (
      <SeparatorPrimitive.Root
        orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        {...separatorProps}
        __scope={__scope}
        __part={__part}
        ref={forwardedRef}
      />
    );
  }
);

ToolbarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'ToolbarButton';

type ToolbarButtonElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToolbarButtonProps extends PrimitiveButtonProps {}

const ToolbarButton = React.forwardRef<ToolbarButtonElement, ToolbarButtonProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = BUTTON_NAME, ...buttonProps } = props;
    return (
      <RovingFocusItem asChild __scope={__scope} __part={__part} focusable={!props.disabled}>
        <Primitive.button role="toolbaritem" {...buttonProps} ref={forwardedRef} />
      </RovingFocusItem>
    );
  }
);

ToolbarButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarLink
 * -----------------------------------------------------------------------------------------------*/

const LINK_NAME = 'ToolbarLink';

type ToolbarLinkElement = React.ElementRef<typeof Primitive.a>;
type PrimitiveLinkProps = Radix.ComponentPropsWithoutRef<typeof Primitive.a>;
interface ToolbarLinkProps extends PrimitiveLinkProps {}

const ToolbarLink = React.forwardRef<ToolbarLinkElement, ToolbarLinkProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = LINK_NAME, ...linkProps } = props;
    return (
      <RovingFocusItem asChild __scope={__scope} __part={__part} focusable>
        <Primitive.a
          role="toolbaritem"
          {...linkProps}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (event.key === ' ') event.currentTarget.click();
          })}
        />
      </RovingFocusItem>
    );
  }
);

ToolbarLink.displayName = LINK_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToolbarToggleGroup';

type ToolbarToggleGroupElement = React.ElementRef<typeof ToggleGroupPrimitive.Root>;
type ToggleGroupProps = Radix.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
interface ToolbarToggleGroupSingleProps extends Extract<ToggleGroupProps, { type: 'single' }> {}
interface ToolbarToggleGroupMultipleProps extends Extract<ToggleGroupProps, { type: 'multiple' }> {}

const ToolbarToggleGroup = React.forwardRef<
  ToolbarToggleGroupElement,
  ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps
>((props, forwardedRef) => {
  const { __scope = ROOT_NAME, __part = GROUP_NAME, ...groupProps } = props;
  const context = useToolbarContext(__scope, __part);
  return (
    <ToggleGroupPrimitive.Root
      data-orientation={context.orientation}
      {...groupProps}
      __scope={__scope}
      __part={__part}
      ref={forwardedRef}
      rovingFocus={false}
    />
  );
});

ToolbarToggleGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToolbarToggleItem';

type ToolbarToggleItemElement = React.ElementRef<typeof ToggleGroupPrimitive.Item>;
type ToggleGroupItemProps = Radix.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
interface ToolbarToggleItemProps extends ToggleGroupItemProps {}

const ToolbarToggleItem = React.forwardRef<ToolbarToggleItemElement, ToolbarToggleItemProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = ITEM_NAME, ...itemProps } = props;
    return (
      <ToolbarButton asChild __scope={__scope} __part={__part} disabled={props.disabled}>
        <ToggleGroupPrimitive.Item {...itemProps} ref={forwardedRef} />
      </ToolbarButton>
    );
  }
);

ToolbarToggleItem.displayName = ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toolbar;
const Separator = ToolbarSeparator;
const Button = ToolbarButton;
const Link = ToolbarLink;
const ToggleGroup = ToolbarToggleGroup;
const ToggleItem = ToolbarToggleItem;

export {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  //
  Root,
  Separator,
  Button,
  Link,
  ToggleGroup,
  ToggleItem,
};
export type {
  ToolbarProps,
  ToolbarSeparatorProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarToggleGroupSingleProps,
  ToolbarToggleGroupMultipleProps,
  ToolbarToggleItemProps,
};
