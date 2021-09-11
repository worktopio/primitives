import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { composeEventHandlers } from '@radix-ui/primitive';
import { Slottable } from '@radix-ui/react-slot';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type DialogProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
interface AlertDialogProps extends Omit<DialogProps, 'modal'> {}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  const { __scope = ROOT_NAME, __part = ROOT_NAME, ...alertDialogProps } = props;
  return (
    <DialogPrimitive.Root {...alertDialogProps} __scope={__scope} __part={__part} modal={true} />
  );
};

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/
const TRIGGER_NAME = 'AlertDialogTrigger';

type AlertDialogTriggerElement = React.ElementRef<typeof DialogPrimitive.Trigger>;
type DialogTriggerProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
interface AlertDialogTriggerProps extends DialogTriggerProps {}

const AlertDialogTrigger = React.forwardRef<AlertDialogTriggerElement, AlertDialogTriggerProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = TRIGGER_NAME, ...triggerProps } = props;
    return (
      <DialogPrimitive.Trigger
        {...triggerProps}
        __scope={__scope}
        __part={__part}
        ref={forwardedRef}
      />
    );
  }
);

AlertDialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'AlertDialogOverlay';

type AlertDialogOverlayElement = React.ElementRef<typeof DialogPrimitive.Overlay>;
type DialogOverlayProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;
interface AlertDialogOverlayProps extends DialogOverlayProps {}

const AlertDialogOverlay = React.forwardRef<AlertDialogOverlayElement, AlertDialogOverlayProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = OVERLAY_NAME, ...overlayProps } = props;
    return (
      <DialogPrimitive.Overlay
        {...overlayProps}
        __scope={__scope}
        __part={__part}
        ref={forwardedRef}
      />
    );
  }
);

AlertDialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<AlertDialogCancelElement | null>;
};

const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createContext<AlertDialogContentContextValue>();

type AlertDialogContentElement = React.ElementRef<typeof DialogPrimitive.Content>;
type DialogContentProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;
interface AlertDialogContentProps
  extends Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'> {}

const AlertDialogContent = React.forwardRef<AlertDialogContentElement, AlertDialogContentProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = CONTENT_NAME, children, ...contentProps } = props;
    const contentRef = React.useRef<AlertDialogContentElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = React.useRef<AlertDialogCancelElement | null>(null);

    return (
      <DialogPrimitive.LabelWarningProvider
        contentName={CONTENT_NAME}
        titleName={TITLE_NAME}
        docsSlug="alert-dialog"
      >
        <AlertDialogContentProvider scope={__scope} cancelRef={cancelRef}>
          <DialogPrimitive.Content
            role="alertdialog"
            {...contentProps}
            __scope={__scope}
            __part={__part}
            ref={composedRefs}
            onOpenAutoFocus={composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              event.preventDefault();
              cancelRef.current?.focus({ preventScroll: true });
            })}
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
          >
            {/**
             * We have to use `Slottable` here as we cannot wrap the `AlertDialogContentProvider`
             * around everything, otherwise the `DescriptionWarning` would be rendered straight away.
             * This is because we want the accessibility checks to run only once the content is actually
             * open and that behaviour is already encapsulated in `DialogContent`.
             */}
            <Slottable>{children}</Slottable>
            {process.env.NODE_ENV === 'development' && (
              <DescriptionWarning contentRef={contentRef} />
            )}
          </DialogPrimitive.Content>
        </AlertDialogContentProvider>
      </DialogPrimitive.LabelWarningProvider>
    );
  }
);

AlertDialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'AlertDialogTitle';

type AlertDialogTitleElement = React.ElementRef<typeof DialogPrimitive.Title>;
type DialogTitleProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
interface AlertDialogTitleProps extends DialogTitleProps {}

const AlertDialogTitle = React.forwardRef<AlertDialogTitleElement, AlertDialogTitleProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = TITLE_NAME, ...titleProps } = props;
    return (
      <DialogPrimitive.Title {...titleProps} __scope={__scope} __part={__part} ref={forwardedRef} />
    );
  }
);

AlertDialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription';

type AlertDialogDescriptionElement = React.ElementRef<typeof DialogPrimitive.Description>;
type DialogDescriptionProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;
interface AlertDialogDescriptionProps extends DialogDescriptionProps {}

const AlertDialogDescription = React.forwardRef<
  AlertDialogDescriptionElement,
  AlertDialogDescriptionProps
>((props, forwardedRef) => {
  const { __scope = ROOT_NAME, __part = DESCRIPTION_NAME, ...descriptionProps } = props;
  return (
    <DialogPrimitive.Description
      {...descriptionProps}
      __scope={__scope}
      __part={__part}
      ref={forwardedRef}
    />
  );
});

AlertDialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'AlertDialogAction';

type AlertDialogActionElement = React.ElementRef<typeof DialogPrimitive.Close>;
type DialogCloseProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
interface AlertDialogActionProps extends DialogCloseProps {}

const AlertDialogAction = React.forwardRef<AlertDialogActionElement, AlertDialogActionProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = ACTION_NAME, ...actionProps } = props;
    return (
      <DialogPrimitive.Close
        {...actionProps}
        __scope={__scope}
        __part={__part}
        ref={forwardedRef}
      />
    );
  }
);

AlertDialogAction.displayName = ACTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

type AlertDialogCancelElement = React.ElementRef<typeof DialogPrimitive.Close>;
interface AlertDialogCancelProps extends DialogCloseProps {}

const AlertDialogCancel = React.forwardRef<AlertDialogCancelElement, AlertDialogCancelProps>(
  (props, forwardedRef) => {
    const { __scope = ROOT_NAME, __part = CANCEL_NAME, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(__part, __scope);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return <DialogPrimitive.Close {...cancelProps} __scope={__scope} __part={__part} ref={ref} />;
  }
);

AlertDialogCancel.displayName = CANCEL_NAME;

/* ---------------------------------------------------------------------------------------------- */

type DescriptionWarningProps = {
  contentRef: React.RefObject<AlertDialogContentElement>;
};

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;

  React.useEffect(() => {
    const hasDescription = document.getElementById(
      contentRef.current?.getAttribute('aria-describedby')!
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);

  return null;
};

const Root = AlertDialog;
const Trigger = AlertDialogTrigger;
const Overlay = AlertDialogOverlay;
const Content = AlertDialogContent;
const Action = AlertDialogAction;
const Cancel = AlertDialogCancel;
const Title = AlertDialogTitle;
const Description = AlertDialogDescription;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  //
  Root,
  Trigger,
  Overlay,
  Content,
  Action,
  Cancel,
  Title,
  Description,
};
export type {
  AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};
