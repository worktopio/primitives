import * as React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, green } from '@radix-ui/colors';
import * as ToastPrimitive from './Toast';

export default { title: 'Components/ToastDemo' };

const VIEWPORT_PADDING = 10;

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: 'translateX(0)' },
});

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: VIEWPORT_PADDING,
  gap: VIEWPORT_PADDING,
  width: 390,
  maxWidth: '90vw',
});

const StyledToast = styled(ToastPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  padding: 15,
  display: 'grid',
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: 'auto 100px',
  columnGap: 15,
  alignItems: 'center',

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in forwards`,
    },
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    '&[data-swipe="cancel"]': {
      transform: 'translate(0, 0)',
      transition: 'transform 200ms ease-out',
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-in forwards`,
    },
  },
});

const StyledTitle = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  marginBottom: 5,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
});

const StyledDescription = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  margin: 0,
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.3,
});

const StyledAction = styled(ToastPrimitive.Action, {
  gridArea: 'action',
});

// Exports
const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = StyledViewport;
const Toast = StyledToast;
const ToastTitle = StyledTitle;
const ToastDescription = StyledDescription;
const ToastAction = StyledAction;
const ToastClose = ToastPrimitive.Close;

// Your app...
const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: 'white',
        color: violet.violet11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        '&:hover': { backgroundColor: mauve.mauve3 },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green4,
        color: green.green11,
        '&:hover': { backgroundColor: green.green5 },
        '&:focus': { boxShadow: `0 0 0 2px ${green.green7}` },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});

export const ToastDemo = () => {
  const [hasError, setHasError] = React.useState(false);
  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setHasError(true)}>Add to calendar</Button>
      <Toast open={hasError} onOpenChange={setHasError}>
        <ToastTitle>Scheduled: Catch up</ToastTitle>
        <ToastDescription asChild>
          <time dateTime="2022-02-22">3pm, 22nd February 2022</time>
        </ToastDescription>
        <ToastAction asChild altText="Goto schedule to undo">
          <Button variant="green">Undo</Button>
        </ToastAction>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};
